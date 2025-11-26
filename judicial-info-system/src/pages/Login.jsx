import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import GoogleAuth from '../components/GoogleAuth.jsx';
import "./Login.css";

export default function Login() {
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!emailOrId || !password) return setError("All fields required.");
    try {
      setLoading(true);
  const user = await login(emailOrId, password);
  // Clear fields after success
  setEmailOrId("");
  setPassword("");
      const r = user.role?.toLowerCase();
      navigate(`/${r === 'user' ? 'user' : r}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const backBtnStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#b30000', color: '#fff', padding: '8px 12px',
    borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 12
  };

  return (
    <div className="login-container">
      <button type="button" onClick={() => navigate(-1)} style={backBtnStyle} aria-label="Go back">
        <ArrowLeft size={18} /> Back
      </button>
  <form className="login-box" onSubmit={handleLogin} autoComplete="off">
        <h2>Login to Judiciary Information System</h2>

  <label>Email or Generated ID</label>
        <input
          type="text"
          value={emailOrId}
          onChange={(e) => setEmailOrId(e.target.value)}
          placeholder="Enter your Email or Generated ID"
          autoComplete="off"
          required
        />

        <label>Password</label>
        <div style={{ position:'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            autoComplete="new-password"
            required
            style={{ width:'100%', paddingRight:42 }}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(v => !v)}
            style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', padding:6, cursor:'pointer', color:'#374151', zIndex:2 }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

  {/* Role selection removed; role is determined server-side at login */}

  {error && <div style={{ color: 'red', marginBottom: '8px' }}>{error}</div>}
  <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <div className="separator">OR</div>
      <GoogleAuth />
      <div style={{ marginTop: '12px', fontSize: '14px', textAlign: 'center' }}>
        Don't have an account? <Link to="/signup" style={{ color: '#0077cc', textDecoration: 'underline' }}>Sign Up</Link>
      </div>
    </div>
  );
}
