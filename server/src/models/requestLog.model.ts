import mongoose from 'mongoose';
const {Schema} = mongoose;

const RequestLogSchema = new Schema({
  deckId: { type: Schema.Types.ObjectId, ref: 'Deck', required: true },
  timestamp: { type: Date, default: Date.now },
  method: { type: String, required: true },
  status: { type: Number, required: true },
  latency: { type: String, required: true },
  ipAddress: { type: String, required: true },
  path: {
    type: String,
    required: true,
  }
});

export const RequestLog = mongoose.model('RequestLog', RequestLogSchema);