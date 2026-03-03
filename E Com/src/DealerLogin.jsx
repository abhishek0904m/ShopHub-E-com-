import { useState } from "react";
import { API_BASE_URL } from "./config";

const DEALER_SECRET = "SHOPHUB@DEALER2024";

export default function DealerLogin({ onNavigate }) {
  const [formData, setFormData] = useState({ email: "", password: "", code: "" });
  const [showPwd, setShowPwd]   = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [serverError, setServerError] = useState("");
  const [shake, setShake]       = useState(false);

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
    if (!formData.code) e.code = "Dealer code is required";
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
      const res = await fetch(`${API_BASE_URL}/api/dealers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password,
          dealerCode: formData.code 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      
      // Store dealer info in localStorage for session persistence
      localStorage.setItem("dealer_info", JSON.stringify({
        dealerId: data.dealerId,
        dealerCode: data.dealerCode,
        name: data.name,
      }));
      
      onNavigate("dealer-dashboard", data.name, data.dealerId);
    } catch (err) {
      setServerError(err.message);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

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
        @keyframes floatDot {
          0%,100% { transform: translateY(0px); opacity: 0.10; }
          50%      { transform: translateY(-12px); opacity: 0.18; }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        html, body, #root {
          min-height: 100%;
          background: #e3eaee;
        }

        .login-bg {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e3eaee;
          padding: 24px;
        }

        .login-card {
          display: flex;
          width: 100%;
          max-width: 680px;
          min-height: 480px;
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
          width: 240px;
          flex-shrink: 0;
          background: linear-gradient(160deg, #1a1f2e 0%, #252b3b 60%, #1e2330 100%);
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: relative;
          overflow: hidden;
        }

        .brand-panel::before,
        .brand-panel::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          background: #fbbf24;
          pointer-events: none;
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

        /* Submit button */
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

        /* Server error */
        .server-error {
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 8px; padding: 10px 14px; margin-bottom: 16px;
          color: #dc2626; font-size: 13px;
          animation: fadeSlideUp .3s ease;
        }

        /* Dealer code field highlight */
        .dealer-code-label {
          color: #EAB308 !important;
        }
        .dealer-code-hint {
          font-size: 11.5px; color: #9CA3AF; margin-top: -6px; margin-bottom: 8px;
        }
      `}</style>

      <div className="login-bg">
        <div className={`login-card ${shake ? "shake" : ""}`}>

          {/* ── LEFT BRAND PANEL */}
          <div className="brand-panel">
            <div className="brand-logo">
              <div className="brand-icon">🏪</div>
              <div className="brand-name">Shop<span>Hub</span></div>
            </div>
            <div className="brand-hero">
              <h2>Dealer<br /><span className="highlight">Portal</span><br />Access.</h2>
              <p>Manage your products, track all orders, and grow your business with ShopHub.</p>
            </div>
            <div className="brand-perks">
              <div className="perk"><span className="perk-icon">📦</span><span className="perk-text">Add & manage products</span></div>
              <div className="perk"><span className="perk-icon">🧾</span><span className="perk-text">View all customer orders</span></div>
              <div className="perk"><span className="perk-icon">📊</span><span className="perk-text">Sales overview & stats</span></div>
              <div className="perk"><span className="perk-icon">🔐</span><span className="perk-text">Secured dealer access</span></div>
            </div>
          </div>

          {/* ── RIGHT FORM PANEL */}
          <div className="form-panel">
            <div className="form-header">
              <h1>Dealer Sign in</h1>
              <p>Authorized dealers only. Enter your credentials and secret code.</p>
            </div>

            {serverError && (
              <div className="server-error">⚠ {serverError}</div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="field-wrap">
                <label>Email Address</label>
                <span className="field-icon">✉</span>
                <input type="email" name="email" placeholder="dealer@shophub.in"
                  value={formData.email} onChange={handleChange}
                  style={errors.email ? { borderColor: "#EF4444", boxShadow: "0 0 0 3px rgba(239,68,68,.12)" } : {}} />
                {errors.email && <div className="field-error">⚠ {errors.email}</div>}
              </div>

              {/* Password */}
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

              {/* Dealer Secret Code */}
              <div className="field-wrap">
                <label className="dealer-code-label">🔐 Dealer Secret Code</label>
                <span className="field-icon">🛡</span>
                <input type={showCode ? "text" : "password"} name="code"
                  placeholder="Enter dealer access code" value={formData.code} onChange={handleChange}
                  style={errors.code
                    ? { borderColor: "#EF4444", boxShadow: "0 0 0 3px rgba(239,68,68,.12)" }
                    : { borderColor: "#EAB30855" }} />
                <button type="button" className="eye-btn" onClick={() => setShowCode(!showCode)}>
                  {showCode ? "🙈" : "👁"}
                </button>
                {errors.code && <div className="field-error">⚠ {errors.code}</div>}
              </div>

              <div className="dealer-code-hint">
                Contact your ShopHub administrator for the access code.
              </div>

              {/* Submit */}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                      style={{ animation: "spin 0.7s linear infinite" }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round" />
                    </svg>
                    Verifying…
                  </span>
                ) : "🏪 Enter Dealer Dashboard →"}
              </button>

              <div className="signin-link">
                Not a dealer?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("login"); }}>Go to User Login</a>
                {" · "}
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("dealer-registration"); }}>Register as Dealer</a>
              </div>

            </form>
          </div>

        </div>
      </div>
    </>
  );
}