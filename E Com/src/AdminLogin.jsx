import { useState } from "react";
import { API_BASE_URL } from "./config";

export default function AdminLogin({ onNavigate }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [shake, setShake] = useState(false);

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
    if (Object.keys(errs).length) {
      setErrors(errs);
      triggerShake();
      return;
    }

    setLoading(true);
    setServerError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      
      onNavigate("admin-dashboard", data.name, data.adminId);
    } catch (err) {
      setServerError(err.message);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-bg">
        <div className={`login-card ${shake ? "shake" : ""}`} style={{ maxWidth: 680 }}>
          <div className="brand-panel">
            <div className="brand-logo">
              <div className="brand-icon" style={{ background: "#dc2626" }}>⚡</div>
              <div className="brand-name">Shop<span>Hub</span></div>
            </div>
            <div className="brand-hero">
              <h2>Admin<br /><span className="highlight" style={{ color: "#dc2626" }}>Control Panel</span></h2>
              <p>Manage all users, dealers, products, and orders from one central dashboard.</p>
            </div>
            <div className="brand-perks">
              <div className="perk"><span className="perk-icon">👥</span><span className="perk-text">Manage all users</span></div>
              <div className="perk"><span className="perk-icon">🏪</span><span className="perk-text">Approve dealers</span></div>
              <div className="perk"><span className="perk-icon">📦</span><span className="perk-text">Monitor products</span></div>
              <div className="perk"><span className="perk-icon">📊</span><span className="perk-text">View all analytics</span></div>
            </div>
          </div>

          <div className="form-panel">
            <div className="form-header">
              <h1>Admin Sign In</h1>
              <p>Authorized administrators only</p>
            </div>

            {serverError && <div className="server-error">⚠ {serverError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field-wrap">
                <label>Admin Email</label>
                <span className="field-icon">✉</span>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@shophub.in"
                  value={formData.email}
                  onChange={handleChange}
                  style={errors.email ? errorStyle : {}}
                />
                {errors.email && <div className="field-error">⚠ {errors.email}</div>}
              </div>

              <div className="field-wrap">
                <label>Password</label>
                <span className="field-icon">🔑</span>
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  placeholder="Enter admin password"
                  value={formData.password}
                  onChange={handleChange}
                  style={errors.password ? errorStyle : {}}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? "🙈" : "👁"}
                </button>
                {errors.password && <div className="field-error">⚠ {errors.password}</div>}
              </div>

              <button type="submit" className="submit-btn" disabled={loading} style={{
                background: "linear-gradient(90deg, #7f1d1d 0%, #991b1b 40%, #dc2626 50%, #991b1b 60%, #7f1d1d 100%)",
                backgroundSize: "200% auto",
              }}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                      style={{ animation: "spin 0.7s linear infinite" }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round" />
                    </svg>
                    Verifying…
                  </span>
                ) : "⚡ Enter Admin Panel →"}
              </button>

              <div className="signin-link">
                Not an admin?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("login"); }}>
                  Go to User Login
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const errorStyle = {
  borderColor: "#EF4444",
  boxShadow: "0 0 0 3px rgba(239,68,68,.12)",
};

const styles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    15% { transform: translateX(-8px); }
    30% { transform: translateX(8px); }
    45% { transform: translateX(-6px); }
    60% { transform: translateX(6px); }
    75% { transform: translateX(-3px); }
    90% { transform: translateX(3px); }
  }
  @keyframes perkIn {
    from { opacity: 0; transform: translateX(-18px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes floatDot {
    0%,100% { transform: translateY(0px); opacity: 0.10; }
    50% { transform: translateY(-12px); opacity: 0.18; }
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { min-height: 100%; background: #e3eaee; }

  .login-bg {
    min-height: 100vh; width: 100%; display: flex; align-items: center;
    justify-content: center; background: #e3eaee; padding: 24px;
  }

  .login-card {
    display: flex; width: 100%; max-width: 680px; min-height: 480px;
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.08);
    animation: fadeSlideUp 0.55s cubic-bezier(.22,.68,0,1.2) forwards;
  }

  .login-card.shake {
    animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
  }

  .brand-panel {
    width: 240px; flex-shrink: 0;
    background: linear-gradient(160deg, #7f1d1d 0%, #991b1b 60%, #7f1d1d 100%);
    padding: 32px 24px; display: flex; flex-direction: column; gap: 24px;
    position: relative; overflow: hidden;
  }

  .brand-panel::before, .brand-panel::after {
    content: ""; position: absolute; border-radius: 50%;
    background: #dc2626; pointer-events: none;
  }
  .brand-panel::before {
    width: 80px; height: 80px; top: 10px; right: 10px; opacity: 0.15;
    animation: floatDot 5s ease-in-out infinite;
  }
  .brand-panel::after {
    width: 44px; height: 44px; bottom: 70px; left: 10px; opacity: 0.10;
    animation: floatDot 7s ease-in-out infinite reverse;
  }

  .brand-logo { display: flex; align-items: center; gap: 9px; }
  .brand-icon {
    width: 36px; height: 36px; background: #dc2626; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
    box-shadow: 0 0 0 3px rgba(220,38,38,.25);
  }
  .brand-name {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 18px; font-weight: 800; color: #fff;
  }
  .brand-name span { color: #dc2626; }

  .brand-hero h2 {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 26px; font-weight: 900; color: #fff;
    line-height: 1.2; margin: 0 0 10px;
  }
  .brand-hero .highlight { color: #dc2626; font-style: italic; }
  .brand-hero p {
    font-size: 12.5px; color: #9ca3af; line-height: 1.6; margin: 0;
  }

  .brand-perks { display: flex; flex-direction: column; gap: 8px; }
  .perk {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.07);
    border-radius: 9px; padding: 9px 12px; opacity: 0;
    animation: perkIn 0.4s ease forwards;
  }
  .perk:nth-child(1) { animation-delay: 0.2s; }
  .perk:nth-child(2) { animation-delay: 0.35s; }
  .perk:nth-child(3) { animation-delay: 0.5s; }
  .perk:nth-child(4) { animation-delay: 0.65s; }
  .perk:hover {
    background: rgba(220,38,38,.08); border-color: rgba(220,38,38,.2);
    transform: translateX(3px); transition: all .2s ease;
  }
  .perk-icon { font-size: 16px; }
  .perk-text { font-size: 12.5px; color: #d1d5db; font-weight: 500; }

  .form-panel {
    flex: 1; background: #fff; padding: 36px 36px 32px;
    display: flex; flex-direction: column; justify-content: center;
  }

  .form-header { margin-bottom: 22px; }
  .form-header h1 {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 26px; font-weight: 800; color: #111; margin: 0 0 4px;
  }
  .form-header p { font-size: 13px; color: #6b7280; margin: 0; }

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
    transition: border-color .2s, box-shadow .2s; background: #fafafa;
  }
  .field-wrap input:focus {
    border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,.18);
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

  .submit-btn {
    width: 100%; padding: 12px;
    background: linear-gradient(90deg, #7f1d1d 0%, #991b1b 40%, #dc2626 50%, #991b1b 60%, #7f1d1d 100%);
    background-size: 200% auto; color: #fff; border: none; border-radius: 9px;
    font-size: 14px; font-weight: 800; cursor: pointer;
    font-family: 'Instrument Sans', sans-serif;
    transition: background-position .4s ease, box-shadow .2s, transform .15s;
    margin-top: 6px;
  }
  .submit-btn:hover:not(:disabled) {
    background-position: right center;
    box-shadow: 0 4px 18px rgba(220,38,38,.3);
    transform: translateY(-1px);
  }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }
  .submit-btn:disabled { opacity: .7; cursor: not-allowed; }

  .signin-link {
    text-align: center; font-size: 13px; color: #6b7280; margin-top: 14px;
  }
  .signin-link a {
    color: #111; font-weight: 800; text-decoration: none;
    border-bottom: 1.5px solid #dc2626; padding-bottom: 1px;
    transition: color .15s;
  }
  .signin-link a:hover { color: #dc2626; }

  .server-error {
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: 8px; padding: 10px 14px; margin-bottom: 16px;
    color: #dc2626; font-size: 13px; animation: fadeSlideUp .3s ease;
  }
`;
