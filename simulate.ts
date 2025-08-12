import express from 'express';
import { runSimulation } from '../services/simulationService';

const router = express.Router();

router.post('/simulate', async (req, res) => {
  try {
    const { available_drivers, max_hours_per_driver, route_start_time } = req.body;
    if (!available_drivers || available_drivers < 1) return res.status(400).json({ error: 'available_drivers must be >= 1' });
    if (!max_hours_per_driver || max_hours_per_driver <= 0) return res.status(400).json({ error: 'max_hours_per_driver must be > 0' });
    const result = await runSimulation({ availableDrivers: available_drivers, maxHoursPerDriver: max_hours_per_driver, routeStartTime: route_start_time });
    res.json({ ok: true, result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'simulation failed', details: String(e) });
  }
} );

export default router;
