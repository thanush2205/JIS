import express from 'express';
import Case from '../models/Case.js';
import Activity from '../models/Activity.js';
import { verifyToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// List all cases
router.get('/', async (_req, res) => {
  const cases = await Case.find();
  res.json(cases);
});

// IMPORTANT: define specific 'requests' routes BEFORE the param ':id' matcher
// Registrar: list all request proposals (flatten across cases)
router.get('/requests', async (_req, res) => {
  const cases = await Case.find({}, { id: 1, requestApprovals: 1, title: 1 });
  const items = [];
  for (const c of cases) {
    (c.requestApprovals || []).forEach((r, idx) => items.push({
      caseId: c.id,
      title: c.title,
      index: idx,
      ...r.toObject?.() || r,
    }));
  }
  // latest first
  items.sort((a,b) => String(b.submittedAt||'').localeCompare(String(a.submittedAt||'')));
  res.json(items);
});

// User: list my request proposals (filter by decision)
router.get('/requests/mine', verifyToken, requireAuth, async (req, res) => {
  try {
    console.log('[debug] /api/cases/requests/mine hit');
    const userId = req.auth?.sub;
    const decision = (req.query.decision || '').toLowerCase();
    const valid = new Set(['pending','approved','declined','']);
    if (!valid.has(decision)) return res.status(400).json({ error: 'Invalid decision filter' });
    const cases = await Case.find({}, { id: 1, title: 1, type: 1, court: 1, judge: 1, lawyer: 1, status: 1, description: 1, accused: 1, hearingDates: 1, evidence: 1, reports: 1, judgement: 1, requestApprovals: 1 });
    const items = [];
    for (const c of cases) {
      (c.requestApprovals || []).forEach((r, idx) => {
        const R = r.toObject?.() || r;
        if (R.userId === userId && (!decision || R.decision === decision)) {
          items.push({
            caseId: c.id,
            title: c.title,
            type: c.type,
            court: c.court,
            judge: c.judge,
            lawyer: c.lawyer,
            status: c.status,
            description: c.description,
            accused: c.accused,
            hearingDates: c.hearingDates,
            evidenceCount: (c.evidence||[]).length,
            reportsCount: (c.reports||[]).length,
            hasJudgement: Boolean(c.judgement),
            request: R.request,
            decision: R.decision,
            submittedAt: R.submittedAt,
            decidedAt: R.decidedAt,
            decidedBy: R.decidedBy || null,
            index: idx,
          });
        }
      });
    }
    items.sort((a,b) => String(b.submittedAt||'').localeCompare(String(a.submittedAt||'')));
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to load' });
  }
});

// Get single case by id
router.get('/:id', async (req, res) => {
  const c = await Case.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  res.json(c);
});

// Register new case (Registrar or Police)
router.post('/', verifyToken, requireAuth, async (req, res) => {
  const { title, type, court, judge, lawyer, accused, description, registeredBy } = req.body;
  const nextIndex = await Case.countDocuments();
  const newId = `C${String(nextIndex + 1).padStart(3, '0')}`;
  const c = await Case.create({ id: newId, title, type, court, judge, lawyer, status: 'Pending', accused, description, registeredBy });
  await Activity.create({ actorId: registeredBy || 'Unknown', actorRole: 'Registrar', action: 'CASE_REGISTER', targetType: 'Case', targetId: c.id, details: { title, type, court } });
  res.status(201).json(c);
});

// Update case
router.patch('/:id', verifyToken, requireAuth, async (req, res) => {
  const update = { ...req.body };
  const c = await Case.findOneAndUpdate({ id: req.params.id }, update, { new: true });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  const action = (update.judge || update.judgeId) ? 'JUDGE_ASSIGNED' : 'CASE_UPDATE';
  await Activity.create({ actorId: update.updatedBy || 'Unknown', actorRole: update.updatedByRole || 'Registrar', action, targetType: 'Case', targetId: c.id, details: update });
  res.json(c);
});

// Assign lawyer
router.post('/:id/assign-lawyer', verifyToken, requireAuth, async (req, res) => {
  const { lawyer } = req.body;
  const c = await Case.findOneAndUpdate({ id: req.params.id }, { lawyer }, { new: true });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  await Activity.create({ actorId: 'Judge', actorRole: 'Judge', action: 'LAWYER_ASSIGNED', targetType: 'Case', targetId: c.id, details: { lawyer } });
  res.json(c);
});

// Assign lawyer with ID
router.post('/:id/assign-lawyer-by-id', verifyToken, requireAuth, async (req, res) => {
  const { lawyerId, lawyerName } = req.body || {};
  if (!lawyerId && !lawyerName) return res.status(400).json({ error: 'lawyerId or lawyerName required' });
  const c = await Case.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  if (lawyerName) c.lawyer = lawyerName;
  if (lawyerId) c.lawyerId = lawyerId;
  await c.save();
  await Activity.create({ actorId: 'Judge', actorRole: 'Judge', action: 'LAWYER_ASSIGNED', targetType: 'Case', targetId: c.id, details: { lawyer: c.lawyer, lawyerId: c.lawyerId } });
  res.json(c);
});

// Assign judge
router.post('/:id/assign-judge', verifyToken, requireAuth, async (req, res) => {
  const { judge, judgeId } = req.body || {};
  if (!judge && !judgeId) return res.status(400).json({ error: 'judge or judgeId required' });
  const c = await Case.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  if (judge) c.judge = judge;
  if (judgeId) c.judgeId = judgeId;
  await c.save();
  await Activity.create({ actorId: 'Registrar', actorRole: 'Registrar', action: 'JUDGE_ASSIGNED', targetType: 'Case', targetId: c.id, details: { judge: c.judge, judgeId: c.judgeId } });
  res.json(c);
});

// Schedule hearing
router.post('/:id/hearings', verifyToken, requireAuth, async (req, res) => {
  const { date } = req.body;
  const c = await Case.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  c.hearingDates.push(date);
  await c.save();
  await Activity.create({ actorId: 'Judge', actorRole: 'Judge', action: 'HEARING_ADDED', targetType: 'Case', targetId: c.id, details: { date } });
  res.json(c);
});

// Upload / add evidence
router.post('/:id/evidence', verifyToken, requireAuth, async (req, res) => {
  const { name } = req.body;
  const c = await Case.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  const evidenceItem = { id: `E${Date.now()}`, name, uploadedAt: new Date().toISOString().slice(0,10) };
  c.evidence.push(evidenceItem);
  await c.save();
  await Activity.create({ actorId: 'Police', actorRole: 'Police', action: 'EVIDENCE_ADDED', targetType: 'Case', targetId: c.id, details: evidenceItem });
  res.json(evidenceItem);
});

// Deliver judgement
router.post('/:id/judgement', verifyToken, requireAuth, async (req, res) => {
  const { text } = req.body;
  const c = await Case.findOneAndUpdate({ id: req.params.id }, { judgement: text, status: 'Resolved' }, { new: true });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  await Activity.create({ actorId: 'Judge', actorRole: 'Judge', action: 'JUDGEMENT_DELIVERED', targetType: 'Case', targetId: c.id, details: { status: c.status } });
  res.json(c);
});

// Submit case report
router.post('/:id/reports', verifyToken, requireAuth, async (req, res) => {
  const { report } = req.body;
  const c = await Case.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  c.reports.push(report);
  await c.save();
  await Activity.create({ actorId: 'Lawyer', actorRole: 'Lawyer', action: 'REPORT_SUBMITTED', targetType: 'Case', targetId: c.id, details: { size: (report||'').length } });
  res.json(c.reports);
});

// Download latest report (simple JSON -> prompts browser download)
router.get('/:id/reports/download', async (req, res) => {
  const c = await Case.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  if (!c.reports || c.reports.length === 0) {
    return res.status(404).json({ error: 'No reports available for this case' });
  }
  const latest = c.reports[c.reports.length - 1];
  const payload = {
    caseId: c.id,
    title: c.title,
    status: c.status,
    judge: c.judge,
    lawyer: c.lawyer,
    latestReport: latest,
    generatedAt: new Date().toISOString(),
  };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=${c.id}-report.json`);
  res.send(JSON.stringify(payload, null, 2));
});

// Download full case summary (details for user dashboard)
router.get('/:id/download', async (req, res) => {
  const c = await Case.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  const summary = {
    caseId: c.id,
    title: c.title,
    type: c.type,
    court: c.court,
    judge: c.judge,
    lawyer: c.lawyer,
    status: c.status,
    description: c.description,
    accused: c.accused,
    hearingDates: c.hearingDates,
    evidenceCount: c.evidence.length,
    reportsCount: c.reports.length,
    hasJudgement: Boolean(c.judgement),
    registeredBy: c.registeredBy || null,
    generatedAt: new Date().toISOString(),
  };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=${c.id}-summary.json`);
  res.send(JSON.stringify(summary, null, 2));
});

// Upload documents (bulk simulated)
router.post('/:id/documents', verifyToken, requireAuth, async (req, res) => {
  const { documents } = req.body; // expect array
  const c = await Case.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  c.documents.push(...documents);
  await c.save();
  await Activity.create({ actorId: 'Lawyer', actorRole: 'Lawyer', action: 'DOCUMENTS_UPLOADED', targetType: 'Case', targetId: c.id, details: { count: (documents||[]).length } });
  res.json(c.documents);
});

// Messages (communication)
router.post('/:id/messages', verifyToken, requireAuth, async (req, res) => {
  const { from, text } = req.body;
  const c = await Case.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  const message = { from, text, at: new Date().toISOString() };
  c.messages.push(message);
  await c.save();
  await Activity.create({ actorId: from || 'User', actorRole: 'User', action: 'MESSAGE_SENT', targetType: 'Case', targetId: c.id, details: { from } });
  res.json(message);
});

// User request
router.post('/:id/requests', verifyToken, requireAuth, async (req, res) => {
  const { userId, request } = req.body;
  const c = await Case.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  const item = { userId, request, at: new Date().toISOString() };
  c.requests.push(item);
  // mirror into approvals list as pending proposal
  c.requestApprovals.push({ userId, caseId: c.id, request, submittedAt: item.at, decision: 'pending' });
  await c.save();
  await Activity.create({ actorId: userId || 'User', actorRole: 'User', action: 'REQUEST_SUBMITTED', targetType: 'Case', targetId: c.id, details: { request } });
  res.json(item);
});

// Registrar: list all request proposals (flatten across cases)


// Registrar: decide on a specific request
router.post('/:id/requests/:index/decision', verifyToken, requireAuth, async (req, res) => {
  const { decision, note } = req.body;
  if (!['approved','declined'].includes(decision)) return res.status(400).json({ error: 'Invalid decision' });
  const c = await Case.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  const idx = Number(req.params.index);
  if (Number.isNaN(idx) || idx < 0 || idx >= (c.requestApprovals||[]).length) return res.status(404).json({ error: 'Request not found' });
  const entry = c.requestApprovals[idx];
  entry.decision = decision;
  entry.decidedAt = new Date().toISOString();
  entry.decidedBy = req.auth?.sub || 'REG';
  entry.note = note || '';
  await c.save();
  await Activity.create({ actorId: entry.decidedBy, actorRole: 'Registrar', action: decision === 'approved' ? 'REQUEST_APPROVED' : 'REQUEST_DECLINED', targetType: 'Case', targetId: c.id, details: { index: idx, note } });
  res.json({ ok: true, decision: entry.decision, decidedAt: entry.decidedAt });
});

// Registrar schedule
router.post('/:id/schedules', verifyToken, requireAuth, async (req, res) => {
  const { date, details } = req.body;
  const c = await Case.findOne({ id: req.params.id });
  if (!c) return res.status(404).json({ error: 'Case not found' });
  const sched = { date, details };
  c.schedules.push(sched);
  await c.save();
  await Activity.create({ actorId: 'Registrar', actorRole: 'Registrar', action: 'SCHEDULE_ADDED', targetType: 'Case', targetId: c.id, details: sched });
  res.json(sched);
});

export default router;
