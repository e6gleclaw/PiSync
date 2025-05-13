import mongoose from 'mongoose';

const syncEventSchema = new mongoose.Schema({
  device_id: { type: String, required: true, index: true },
  timestamp: { type: Date, required: true, default: Date.now },
  total_files_synced: { type: Number, required: true },
  total_errors: { type: Number, required: true },
  internet_speed: { type: Number, required: true },
});

const SyncEvent = mongoose.model('SyncEvent', syncEventSchema);

export default SyncEvent;
