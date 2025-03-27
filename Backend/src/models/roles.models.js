import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  permissions: [{ type: String, required: true }]
});

module.exports = mongoose.model('Role', roleSchema);