import mongoose from 'mongoose';

const EvidenceSchema = new mongoose.Schema({
  id: String,
  name: String,
  uploadedAt: String,
}, { _id: false });

const MessageSchema = new mongoose.Schema({
  from: String,
  text: String,
  at: String,
}, { _id: false });

const ScheduleSchema = new mongoose.Schema({
  date: String,
  details: String,
}, { _id: false });

const RequestSchema = new mongoose.Schema({
  userId: String,
  request: String,
  at: String,
}, { _id: false });

const RequestDecisionSchema = new mongoose.Schema({
  userId: String, // requester
  caseId: String,
  request: String,
  submittedAt: String,
  decision: { type: String, enum: ['approved','declined','pending'], default: 'pending' },
  decidedAt: String,
  decidedBy: String, // registrar id
  note: String,
}, { _id: false });

const CaseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  type: String,
  court: String,
  // Judge fields
  judge: String, // legacy display name
  judgeId: { type: String }, // new explicit judge ID for filtering
  lawyer: String,
  lawyerId: { type: String }, // explicit lawyer ID for filtering like judgeId
  status: String,
  judgement: { type: String, default: '' },
  description: { type: String, default: '' },
  registeredBy: { type: String },
  accused: { type: [String], default: [] },
  evidence: { type: [EvidenceSchema], default: [] },
  hearingDates: { type: [String], default: [] },
  reports: { type: [String], default: [] },
  documents: { type: [Object], default: [] },
  requests: { type: [RequestSchema], default: [] },
  requestApprovals: { type: [RequestDecisionSchema], default: [] },
  messages: { type: [MessageSchema], default: [] },
  schedules: { type: [ScheduleSchema], default: [] },
});

export default mongoose.model('Case', CaseSchema);
