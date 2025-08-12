import prisma from '../prismaClient';

/**
 * Business rules implemented exactly as described:
 * - Fuel: base = distance_km * 5 ; high traffic surcharge = distance_km * 2
 * - Late penalty: if actual_delivery_time > base_time + 10 => ₹50 penalty
 * - Fatigue rule: if driver worked > 8 hours in a day (we approximate via past7DayHours avg > 8), next day deliveries take +30% time
 * - High value bonus: if order.value_rs > 1000 and on-time => 10% bonus of order value
 */

type SimulateParams = {
  availableDrivers: number;
  maxHoursPerDriver: number;
  routeStartTime?: string;
};

export async function runSimulation(params: SimulateParams) {
  const { availableDrivers, maxHoursPerDriver } = params;

  // load drivers, routes, orders
  const drivers = await prisma.driver.findMany({ take: availableDrivers });
  const routes = await prisma.route.findMany();
  const orders = await prisma.order.findMany({ where: { status: 'PENDING' }, orderBy: { id: 'asc' } });

  // prepare driver pool
  const driverPool = drivers.map(d => ({
    id: d.id,
    name: d.name,
    availableHours: Math.max(0, maxHoursPerDriver - d.currentShiftHours),
    past7DayHours: Array.isArray(d.past7DayHours) ? d.past7DayHours : JSON.parse(String(d.past7DayHours || '[]')),
    assignedOrders: [] as number[],
    minutesAssigned: 0
  }));

  let totalFuel = 0, totalPenalty = 0, totalBonus = 0, totalProfit = 0, onTimeCount = 0;
  const details = [];

  for (const ord of orders) {
    const route = routes.find(r => r.id === ord.assignedRouteId);
    if (!route) {
      details.push({ orderId: ord.orderId, error: 'No route' });
      continue;
    }

    // select driver with most availableHours who can accept the order
    driverPool.sort((a, b) => b.availableHours - a.availableHours || a.minutesAssigned - b.minutesAssigned);
    const drv = driverPool.find(d => d.availableHours > 0);
    if (!drv) {
      details.push({ orderId: ord.orderId, assigned: null, reason: 'no available driver' });
      continue;
    }

    // compute base and fatigue multiplier
    const baseMinutes = route.baseTimeMinutes;
    const weekHours = (drv.past7DayHours || []).reduce((s: number, x: number) => s + (Number(x) || 0), 0);
    const avg = weekHours / 7.0;
    const fatigueMultiplier = avg > 8 ? 1.3 : 1.0;
    const actualMinutes = Math.ceil(baseMinutes * fatigueMultiplier);

    // fuel cost
    const baseFuel = route.distanceKm * 5;
    const surcharge = route.trafficLevel === 'HIGH' ? route.distanceKm * 2 : 0;
    const fuelCost = baseFuel + surcharge;

    // penalty
    const penalty = actualMinutes > (baseMinutes + 10) ? 50 : 0;

    // bonus
    const bonus = (penalty === 0 && ord.valueRs > 1000) ? Math.round(ord.valueRs * 0.10) : 0;

    const profit = ord.valueRs + bonus - penalty - fuelCost;

    // update aggregates
    totalFuel += fuelCost;
    totalPenalty += penalty;
    totalBonus += bonus;
    totalProfit += profit;
    if (penalty === 0) onTimeCount += 1;

    // assign
    const hoursNeeded = actualMinutes / 60.0;
    drv.availableHours = Math.max(0, drv.availableHours - hoursNeeded);
    drv.assignedOrders.push(ord.id);
    drv.minutesAssigned += actualMinutes;

    details.push({
      orderId: ord.orderId,
      assignedDriver: drv.name,
      route: route.routeId,
      baseMinutes,
      actualMinutes,
      fuelCost,
      penalty,
      bonus,
      profit
    });
  }

  const totalDeliveries = details.filter((d: any) => d.assignedDriver).length;
  const efficiency = totalDeliveries === 0 ? 0 : Math.round((onTimeCount / totalDeliveries) * 100);

  const result = {
    totalDeliveries,
    totalFuel,
    totalPenalty,
    totalBonus,
    totalProfit,
    onTimeCount,
    efficiency,
    details
  };

  // save simulation
  await prisma.simulation.create({ data: { params: JSON.stringify(params), results: JSON.stringify(result) } });

  return result;
}
