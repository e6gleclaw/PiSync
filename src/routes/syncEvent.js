import express from 'express';
import Joi from 'joi';
import SyncEvent from '../models/syncEventModel.js';
import { checkConsecutiveFailures } from './device.js';

const router = express.Router();

// Validation schema
const syncEventSchema = Joi.object({
  device_id: Joi.string().required(),
  timestamp: Joi.date().iso().required(),
  total_files_synced: Joi.number().integer().min(0).required(),
  total_errors: Joi.number().integer().min(0).required(),
  internet_speed: Joi.number().min(0).required(),
});

/**
 * @swagger
 * /sync-event:
 *   post:
 *     summary: Receive a sync event from a device
 *     tags: [SyncEvent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               device_id:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               total_files_synced:
 *                 type: integer
 *               total_errors:
 *                 type: integer
 *               internet_speed:
 *                 type: number
 *     responses:
 *       201:
 *         description: Event stored
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  const { error, value } = syncEventSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const event = new SyncEvent(value);
    await event.save();
    // Bonus: check for 3 consecutive failures
    checkConsecutiveFailures(value.device_id);
    res.status(201).json({ message: 'Sync event stored' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to store sync event' });
  }
});

export default router;
