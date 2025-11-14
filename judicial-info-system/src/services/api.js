const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

async function http(path, opts = {}) {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  const authHeader = auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader, ...(opts.headers || {}) },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    if (contentType.includes('application/json')) {
      try {
        const data = await res.json();
        throw new Error(data.error || 'Request failed');
      } catch (e) {
        throw new Error(e.message || 'Request failed');
      }
    } else {
      const text = await res.text();
      throw new Error(text || `Request failed (${res.status})`);
    }
  }
  if (contentType.includes('application/json')) {
    return res.json();
  } else {
    // Return raw text for non-JSON (avoid Unexpected token '<')
    const raw = await res.text();
    throw new Error(`Unexpected non-JSON response: ${contentType || 'unknown'}`);
  }
}

// Cases
export const CasesAPI = {
  list: () => http('/cases'),
  get: (id) => http(`/cases/${id}`),
  create: (payload) => http('/cases', { method: 'POST', body: payload }),
  update: (id, payload) => http(`/cases/${id}`, { method: 'PATCH', body: payload }),
  assignLawyer: (id, lawyer) => http(`/cases/${id}/assign-lawyer`, { method: 'POST', body: { lawyer } }),
  assignLawyerById: (id, lawyerId, lawyerName) => http(`/cases/${id}/assign-lawyer-by-id`, { method: 'POST', body: { lawyerId, lawyerName } }),
  assignJudge: (id, judge, judgeId) => http(`/cases/${id}/assign-judge`, { method: 'POST', body: { judge, judgeId } }),
  addHearing: (id, date) => http(`/cases/${id}/hearings`, { method: 'POST', body: { date } }),
  addEvidence: (id, name) => http(`/cases/${id}/evidence`, { method: 'POST', body: { name } }),
  deliverJudgement: (id, text) => http(`/cases/${id}/judgement`, { method: 'POST', body: { text } }),
  addReport: (id, report) => http(`/cases/${id}/reports`, { method: 'POST', body: { report } }),
  addDocuments: (id, documents) => http(`/cases/${id}/documents`, { method: 'POST', body: { documents } }),
  addMessage: (id, message) => http(`/cases/${id}/messages`, { method: 'POST', body: message }),
  addUserRequest: (id, payload) => http(`/cases/${id}/requests`, { method: 'POST', body: payload }),
  listRequests: () => http('/cases/requests'),
  decideRequest: (caseId, idx, decision, note) => http(`/cases/${caseId}/requests/${idx}/decision`, { method: 'POST', body: { decision, note } }),
  myRequests: (decision = '') => http(`/cases/requests/mine${decision?`?decision=${decision}`:''}`),
  downloadSummary: async (id) => {
    const url = `${API_BASE}/cases/${id}/download`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to download case summary');
    return res.blob();
  },
  downloadLatestReport: async (id) => {
    const auth = JSON.parse(localStorage.getItem('auth') || 'null');
    const authHeader = auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
    const res = await fetch(`${API_BASE}/cases/${id}/reports/download`, {
      headers: { ...authHeader },
    });
    if (!res.ok) throw new Error('Failed to download report');
    const blob = await res.blob();
    return blob;
  },
};

// Users
export const UsersAPI = {
  signup: (payload) => http('/users/signup', { method: 'POST', body: payload }),
  login: (payload) => http('/users/login', { method: 'POST', body: payload }),
  me: () => http('/users/me'),
  profile: (id) => http(`/users/profile/${id}`),
  updateBio: (id, bio) => http(`/users/profile/${id}`, { method: 'PATCH', body: { bio } }),
  list: () => http('/users'),
  adminCreate: (payload) => http('/users', { method: 'POST', body: payload }),
  remove: (id) => http(`/users/${id}`, { method: 'DELETE' }),
};

// Payments
export const PaymentsAPI = {
  createCheckout: async ({ caseId, lawyer, amount, currency = 'usd', customerEmail }) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId, lawyer, amount, currency, customerEmail }),
    });
    if (!res.ok) {
      let message = 'Failed to create checkout session';
      try { const j = await res.json(); message = j.error || message; } catch {}
      throw new Error(message);
    }
    return res.json();
  },
};
