import express from 'express';
import SyncEvent from '../models/syncEventModel.js';

const router = express.Router();

/**
 * @swagger
 * /device/{id}/sync-history:
 *   get:
 *     summary: Get sync history for a device
 *     tags: [Device]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Sync history
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
router.get('/:id/sync-history', async (req, res) => {
  try {
    const events = await SyncEvent.find({ device_id: req.params.id }).sort({ timestamp: -1 });
    if (!events.length) {
      return res.status(404).json({ error: 'No sync history for this device' });
    }
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sync history' });
  }
});

/**
 * @swagger
 * /devices/repeated-failures:
 *   get:
 *     summary: Get devices with more than 3 failed syncs
 *     tags: [Device]
 *     responses:
 *       200:
 *         description: List of devices
 *       500:
 *         description: Server error
 */
router.get('/devices/repeated-failures', async (req, res) => {
  try {
    // Group by device_id and count events with total_errors > 0
    // let results="hello"
    const results = await SyncEvent.aggregate([
      { $match: { total_errors: { $gt: 0 } } },
      { $group: { _id: '$device_id', failureCount: { $sum: 1 } } },
      { $match: { failureCount: { $gt: 3 } } },
      { $project: { device_id: '$_id', failureCount: 1, _id: 0 } }
    ]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch devices with repeated failures' });
  }
});

// BONUS: Notification if a device fails 3 times in a row
// (console log, not an API)
async function checkConsecutiveFailures(deviceId) {
  const lastThree = await SyncEvent.find({ device_id: deviceId }).sort({ timestamp: -1 }).limit(3);
  if (lastThree.length === 3 && lastThree.every(ev => ev.total_errors > 0)) {
    console.log(`ALERT: Device ${deviceId} has failed to sync 3 times in a row!`);
  }
}

export { checkConsecutiveFailures };
export default router;
