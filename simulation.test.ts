import { runSimulation } from '../services/simulationService';
import prisma from '../prismaClient';

jest.setTimeout(20000);

describe('simulation service', ()=>{
  test('runSimulation returns result shape', async ()=>{
    const res = await runSimulation({ availableDrivers: 3, maxHoursPerDriver: 10 });
    expect(res).toHaveProperty('totalDeliveries');
    expect(res).toHaveProperty('details');
  });
});
