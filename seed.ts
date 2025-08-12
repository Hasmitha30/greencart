import prisma from '../src/prismaClient';
import bcrypt from 'bcrypt';

async function main(){
  // create manager user
  const hashed = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: { email: 'manager@example.com', password: hashed, role: 'MANAGER' }
  });

  await prisma.driver.createMany({
    data: [
      { name: 'Alice', currentShiftHours: 4, past7DayHours: JSON.stringify([7,6,5,8,4,6,5]) },
      { name: 'Bob', currentShiftHours: 2, past7DayHours: JSON.stringify([6,6,6,6,6,6,6]) },
      { name: 'Charlie', currentShiftHours: 9, past7DayHours: JSON.stringify([9,9,8,9,7,9,8]) }
    ],
    skipDuplicates: true
  });

  await prisma.route.createMany({
    data: [
      { routeId: 'R1', distanceKm: 10, trafficLevel: 'HIGH', baseTimeMinutes: 30 },
      { routeId: 'R2', distanceKm: 5, trafficLevel: 'LOW', baseTimeMinutes: 15 }
    ],
    skipDuplicates: true
  });

  await prisma.order.createMany({
    data: [
      { orderId: 'O1', valueRs: 1200, assignedRouteId: 1 },
      { orderId: 'O2', valueRs: 800, assignedRouteId: 2 },
      { orderId: 'O3', valueRs: 1500, assignedRouteId: 1 }
    ],
    skipDuplicates: true
  });

  console.log('Seed completed');
}

main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=> prisma.$disconnect());
