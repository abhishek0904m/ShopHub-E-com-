import { useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { API_BASE_URL } from "./config";

const API = `${API_BASE_URL}/api`;

function Login({ onNavigate }) {
  const [formData, setFormData]     = useState({ email: "", password: "" });
  const [showPwd, setShowPwd]       = useState(false);
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [done, setDone]             = useState(false);
  const [loggedName, setLoggedName] = useState("");
  const [loggedEmail, setLoggedEmail] = useState("");
  const [serverError, setServerError] = useState("");
  const [shake, setShake]           = useState(false);

  // Google OAuth Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setServerError("");
      
      try {
        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoResponse.json();

        // Send to backend
        const response = await fetch(`${API}/oauth-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            provider: 'google',
            providerId: userInfo.sub,
            photoURL: userInfo.picture,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'OAuth login failed');
        }

        // Set logged in state
        setLoggedName(data.name);
        setLoggedEmail(userInfo.email);
        setDone(true);
      } catch (error) {
        setServerError(error.message || "Google sign-in failed");
        triggerShake();
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setServerError("Google sign-in was cancelled or failed");
      triggerShake();
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (serverError) setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.password) e.password = "Password is required";
    return e;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); triggerShake(); return; }
    setLoading(true); setServerError("");
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || "Login failed. Please try again.");
        triggerShake();
      } else {
        setLoggedName(data.name);
        setLoggedEmail(formData.email);
        setDone(true);
      }
    } catch (err) {
      setServerError("Cannot connect to server. Make sure the backend is running.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="register-wrapper" style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", padding: "64px 48px", background: "#fff", width: "100%", animation: "fadeSlideUp 0.5s ease forwards" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
          <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 24, fontWeight: 700, color: "#111", marginBottom: 8 }}>
            Welcome back, {loggedName}!
          </h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 28 }}>You're now signed in to ShopHub.</p>
          <button onClick={() => onNavigate("dashboard", loggedName, loggedEmail)} className="submit-btn" style={{ width: "auto", padding: "11px 32px" }}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15%      { transform: translateX(-8px); }
          30%      { transform: translateX(8px); }
          45%      { transform: translateX(-6px); }
          60%      { transform: translateX(6px); }
          75%      { transform: translateX(-3px); }
          90%      { transform: translateX(3px); }
        }
        @keyframes perkIn {
          from { opacity: 0; transform: translateX(-18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes bgPulse {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes floatDot {
          0%,100% { transform: translateY(0px); opacity: 0.10; }
          50%      { transform: translateY(-12px); opacity: 0.18; }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        html, body, #root {
          min-height: 100%;
          background: #dce4f0;
        }

        .login-bg {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #dce4f0;
          padding: 24px;
        }

        .login-card {
          display: flex;
          width: 100%;
          max-width: 820px;
          min-height: 520px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.08);
          animation: fadeSlideUp 0.55s cubic-bezier(.22,.68,0,1.2) forwards;
        }

        .login-card.shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }

        /* ── LEFT PANEL */
        .brand-panel {
          width: 260px;
          flex-shrink: 0;
          background: linear-gradient(160deg, #1a1f2e 0%, #252b3b 60%, #1e2330 100%);
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: relative;
          overflow: hidden;
        }

        /* Floating dots — kept well inside the panel so they never bleed out */
        .brand-panel::before,
        .brand-panel::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          background: #fbbf24;
          pointer-events: none;
          /* NO scale transform — only translateY so overflow:hidden stays effective */
        }
        .brand-panel::before {
          width: 80px; height: 80px;
          top: 10px; right: 10px;
          opacity: 0.08;
          animation: floatDot 5s ease-in-out infinite;
        }
        .brand-panel::after {
          width: 44px; height: 44px;
          bottom: 70px; left: 10px;
          opacity: 0.06;
          animation: floatDot 7s ease-in-out infinite reverse;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .brand-icon {
          width: 36px; height: 36px;
          background: #fbbf24;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 0 3px rgba(251,191,36,.25);
        }
        .brand-name {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 18px; font-weight: 800; color: #fff;
        }
        .brand-name span { color: #fbbf24; }

        .brand-hero h2 {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 26px; font-weight: 900; color: #fff;
          line-height: 1.2; margin: 0 0 10px;
        }
        .brand-hero .highlight {
          color: #fbbf24;
          font-style: italic;
        }
        .brand-hero p {
          font-size: 12.5px; color: #9ca3af; line-height: 1.6; margin: 0;
        }

        .brand-perks { display: flex; flex-direction: column; gap: 8px; }

        .perk {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 9px;
          padding: 9px 12px;
          opacity: 0;
          animation: perkIn 0.4s ease forwards;
        }
        .perk:nth-child(1) { animation-delay: 0.2s; }
        .perk:nth-child(2) { animation-delay: 0.35s; }
        .perk:nth-child(3) { animation-delay: 0.5s; }
        .perk:nth-child(4) { animation-delay: 0.65s; }

        .perk:hover {
          background: rgba(251,191,36,.08);
          border-color: rgba(251,191,36,.2);
          transform: translateX(3px);
          transition: all .2s ease;
        }
        .perk-icon { font-size: 16px; }
        .perk-text { font-size: 12.5px; color: #d1d5db; font-weight: 500; }

        /* ── RIGHT PANEL */
        .form-panel {
          flex: 1;
          background: #fff;
          padding: 36px 36px 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .form-header { margin-bottom: 22px; }
        .form-header h1 {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 26px; font-weight: 800; color: #111; margin: 0 0 4px;
        }
        .form-header p { font-size: 13px; color: #6b7280; margin: 0; }

        /* Field */
        .field-wrap { position: relative; margin-bottom: 14px; }
        .field-wrap label {
          display: block; font-size: 11px; font-weight: 700;
          color: #374151; margin-bottom: 5px;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .field-icon {
          position: absolute; left: 11px; bottom: 11px;
          font-size: 14px; pointer-events: none; opacity: .5;
        }
        .field-wrap input {
          width: 100%; padding: 10px 12px 10px 34px;
          border: 1.5px solid #e5e7eb; border-radius: 8px;
          font-size: 13.5px; font-family: 'Instrument Sans', sans-serif;
          outline: none; box-sizing: border-box; color: #111;
          transition: border-color .2s, box-shadow .2s;
          background: #fafafa;
        }
        .field-wrap input:focus {
          border-color: #fbbf24;
          box-shadow: 0 0 0 3px rgba(251,191,36,.18);
          background: #fff;
        }
        .field-error {
          font-size: 11.5px; color: #dc2626; margin-top: 4px; font-weight: 600;
        }
        .eye-btn {
          position: absolute; right: 10px; bottom: 9px;
          background: none; border: none; cursor: pointer; font-size: 16px;
          opacity: .5; transition: opacity .15s;
        }
        .eye-btn:hover { opacity: 1; }

        /* Submit button with shimmer */
        .submit-btn {
          width: 100%; padding: 12px;
          background: linear-gradient(90deg, #111827 0%, #1f2937 40%, #fbbf24 50%, #1f2937 60%, #111827 100%);
          background-size: 200% auto;
          color: #fff; border: none; border-radius: 9px;
          font-size: 14px; font-weight: 800; cursor: pointer;
          font-family: 'Instrument Sans', sans-serif;
          transition: background-position .4s ease, box-shadow .2s, transform .15s;
          margin-top: 6px;
        }
        .submit-btn:hover:not(:disabled) {
          background-position: right center;
          box-shadow: 0 4px 18px rgba(0,0,0,.18);
          transform: translateY(-1px);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: .7; cursor: not-allowed; }

        .signin-link {
          text-align: center; font-size: 13px; color: #6b7280; margin-top: 14px;
        }
        .signin-link a {
          color: #111; font-weight: 800; text-decoration: none;
          border-bottom: 1.5px solid #fbbf24;
          padding-bottom: 1px;
          transition: color .15s;
        }
        .signin-link a:hover { color: #fbbf24; }

        /* Dealer bar */
        .dealer-bar {
          margin-top: 10px; padding: 11px 16px;
          background: #1e2330; border: 1.5px solid #2a3145;
          border-radius: 10px; display: flex; align-items: center; justify-content: space-between;
          transition: border-color .2s;
        }
        .dealer-bar:hover { border-color: #fbbf24; }
        .dealer-bar span { font-size: 12.5px; color: #9ca3af; font-weight: 500; }
        .dealer-bar button {
          background: #111827; border: none; color: #fbbf24;
          font-weight: 700; cursor: pointer;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 12.5px; padding: 6px 14px; border-radius: 7px;
          transition: background .15s, transform .15s;
        }
        .dealer-bar button:hover { background: #fbbf24; color: #111; transform: scale(1.04); }

        /* Server error */
        .server-error {
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 8px; padding: 10px 14px; margin-bottom: 16px;
          color: #dc2626; font-size: 13px;
          animation: fadeSlideUp .3s ease;
        }
      `}</style>

      <div className="login-bg">
        <div className={`login-card ${shake ? "shake" : ""}`}>

          {/* ── LEFT BRAND PANEL */}
          <div className="brand-panel">
            <div className="brand-logo">
              <div className="brand-icon">🛍</div>
              <div className="brand-name">Shop<span>Hub</span></div>
            </div>
            <div className="brand-hero">
              <h2>Welcome<br /><span className="highlight">back</span><br />to ShopHub.</h2>
              <p>Sign in to access your orders, wishlist, and exclusive member deals.</p>
            </div>
            <div className="brand-perks">
              <div className="perk"><span className="perk-icon">📦</span><span className="perk-text">Track your orders</span></div>
              <div className="perk"><span className="perk-icon">❤️</span><span className="perk-text">View your wishlist</span></div>
              <div className="perk"><span className="perk-icon">🎁</span><span className="perk-text">Member-only deals</span></div>
              <div className="perk"><span className="perk-icon">💬</span><span className="perk-text">24/7 WhatsApp support</span></div>
            </div>
          </div>

          {/* ── RIGHT FORM PANEL */}
          <div className="form-panel">
            <div className="form-header">
              <h1>Sign in</h1>
              <p>Good to see you again. Enter your details below.</p>
            </div>

            {/* Google Sign In Button */}
            <button 
              type="button"
              onClick={() => googleLogin()}
              disabled={googleLoading}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                background: '#fff',
                border: '1.5px solid #e5e7eb',
                borderRadius: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: googleLoading ? 'not-allowed' : 'pointer',
                fontSize: '13.5px',
                fontWeight: '600',
                fontFamily: "'Instrument Sans', sans-serif",
                transition: 'all 0.2s',
                opacity: googleLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !googleLoading && (e.currentTarget.style.borderColor = '#fbbf24')}
              onMouseLeave={(e) => !googleLoading && (e.currentTarget.style.borderColor = '#e5e7eb')}
            >
              {googleLoading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ animation: "spin 0.7s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round"/>
                  </svg>
                  Signing in with Google...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              margin: '0 0 20px 0',
              color: '#9ca3af',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <span>OR</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
            </div>

            {serverError && (
              <div className="server-error">⚠ {serverError}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field-wrap">
                <label>Email Address</label>
                <span className="field-icon">✉</span>
                <input type="email" name="email" placeholder="john@example.com"
                  value={formData.email} onChange={handleChange}
                  style={errors.email ? { borderColor: "#EF4444", boxShadow: "0 0 0 3px rgba(239,68,68,.12)" } : {}} />
                {errors.email && <div className="field-error">⚠ {errors.email}</div>}
              </div>

              <div className="field-wrap">
                <label>Password</label>
                <span className="field-icon">🔑</span>
                <input type={showPwd ? "text" : "password"} name="password"
                  placeholder="Enter your password" value={formData.password} onChange={handleChange}
                  style={errors.password ? { borderColor: "#EF4444", boxShadow: "0 0 0 3px rgba(239,68,68,.12)" } : {}} />
                <button type="button" className="eye-btn" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? "🙈" : "👁"}
                </button>
                {errors.password && <div className="field-error">⚠ {errors.password}</div>}
              </div>

              <div style={{ textAlign: "right", marginTop: "-4px", marginBottom: "14px" }}>
                <a href="#" style={{ fontSize: "12px", color: "#6B7280", textDecoration: "none", fontWeight: 600 }}
                  onMouseOver={e => e.target.style.color = "#111"}
                  onMouseOut={e => e.target.style.color = "#6B7280"}>
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                      style={{ animation: "spin 0.7s linear infinite" }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round" />
                    </svg>
                    Signing in…
                  </span>
                ) : "Sign In →"}
              </button>

              <div className="signin-link">
                Don't have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("register"); }}>Create one</a>
              </div>

              <div className="dealer-bar">
                <span>Are you a dealer?</span>
                <button type="button" onClick={() => onNavigate("dealer-login")}>🏪 Dealer Portal →</button>
              </div>

              <div className="dealer-bar" style={{ marginTop: 8 }}>
                <span>Administrator?</span>
                <button type="button" onClick={() => onNavigate("admin-login")} style={{ background: "linear-gradient(135deg, #7f1d1d, #dc2626)", color: "#fff" }}>⚡ Admin Panel →</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;