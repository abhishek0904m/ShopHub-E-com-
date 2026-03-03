import { useState } from "react";

export default function DealerRegistration({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    phone: "",
    address: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (serverError) setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) e.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!formData.businessName.trim()) e.businessName = "Business name is required";
    if (!formData.phone.trim()) e.phone = "Phone number is required";
    if (!formData.address.trim()) e.address = "Address is required";
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
      const res = await fetch("http://localhost:5000/api/dealers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          businessName: formData.businessName,
          phone: formData.phone,
          address: formData.address,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      
      setSuccess({
        dealerCode: data.dealerCode,
        message: data.message,
      });
    } catch (err) {
      setServerError(err.message);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <style>{styles}</style>
        <div className="login-bg">
          <div className="login-card" style={{ maxWidth: 520 }}>
            <div className="form-panel" style={{ padding: "48px 40px" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: "#111", marginBottom: 8 }}>
                  Registration Successful!
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
                  Your dealer account has been created and is pending approval.
                </p>
              </div>

              <div style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                border: "2px solid #f59e0b",
                borderRadius: 12,
                padding: "20px 24px",
                marginBottom: 24,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  🔐 Your Dealer Code
                </div>
                <div style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#111",
                  fontFamily: "monospace",
                  letterSpacing: 2,
                  marginBottom: 8,
                }}>
                  {success.dealerCode}
                </div>
                <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>
                  Save this code! You'll need it to login once your account is approved by the admin.
                </div>
              </div>

              <div style={{
                background: "#dbeafe",
                border: "1px solid #93c5fd",
                borderRadius: 10,
                padding: "14px 16px",
                marginBottom: 24,
                fontSize: 13,
                color: "#1e40af",
                lineHeight: 1.6,
              }}>
                <strong>📋 Next Steps:</strong><br />
                1. Admin will review your application<br />
                2. You'll receive approval notification<br />
                3. Login with your email and dealer code
              </div>

              <button
                onClick={() => onNavigate("dealer-login")}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(90deg, #111827 0%, #1f2937 40%, #fbbf24 50%, #1f2937 60%, #111827 100%)",
                  backgroundSize: "200% auto",
                  color: "#fff",
                  border: "none",
                  borderRadius: 9,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "'Instrument Sans', sans-serif",
                  transition: "all .3s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = "right center"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = "left center"}
              >
                Go to Dealer Login →
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="login-bg">
        <div className={`login-card ${shake ? "shake" : ""}`}>
          <div className="brand-panel">
            <div className="brand-logo">
              <div className="brand-icon">🏪</div>
              <div className="brand-name">Shop<span>Hub</span></div>
            </div>
            <div className="brand-hero">
              <h2>Become a<br /><span className="highlight">Dealer</span></h2>
              <p>Join our marketplace and start selling your products to thousands of customers.</p>
            </div>
            <div className="brand-perks">
              <div className="perk"><span className="perk-icon">🚀</span><span className="perk-text">Quick approval process</span></div>
              <div className="perk"><span className="perk-icon">📦</span><span className="perk-text">Manage your inventory</span></div>
              <div className="perk"><span className="perk-icon">💰</span><span className="perk-text">Track your earnings</span></div>
              <div className="perk"><span className="perk-icon">🎯</span><span className="perk-text">Reach more customers</span></div>
            </div>
          </div>

          <div className="form-panel">
            <div className="form-header">
              <h1>Dealer Registration</h1>
              <p>Fill in your details to create a dealer account</p>
            </div>

            {serverError && <div className="server-error">⚠ {serverError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field-wrap">
                <label>Full Name</label>
                <span className="field-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  style={errors.name ? errorStyle : {}}
                />
                {errors.name && <div className="field-error">⚠ {errors.name}</div>}
              </div>

              <div className="field-wrap">
                <label>Email Address</label>
                <span className="field-icon">✉</span>
                <input
                  type="email"
                  name="email"
                  placeholder="dealer@example.com"
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  style={errors.password ? errorStyle : {}}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? "🙈" : "👁"}
                </button>
                {errors.password && <div className="field-error">⚠ {errors.password}</div>}
              </div>

              <div className="field-wrap">
                <label>Confirm Password</label>
                <span className="field-icon">🔑</span>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={errors.confirmPassword ? errorStyle : {}}
                />
                <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? "🙈" : "👁"}
                </button>
                {errors.confirmPassword && <div className="field-error">⚠ {errors.confirmPassword}</div>}
              </div>

              <div className="field-wrap">
                <label>Business Name</label>
                <span className="field-icon">🏢</span>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Your business name"
                  value={formData.businessName}
                  onChange={handleChange}
                  style={errors.businessName ? errorStyle : {}}
                />
                {errors.businessName && <div className="field-error">⚠ {errors.businessName}</div>}
              </div>

              <div className="field-wrap">
                <label>Phone Number</label>
                <span className="field-icon">📞</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your contact number"
                  value={formData.phone}
                  onChange={handleChange}
                  style={errors.phone ? errorStyle : {}}
                />
                {errors.phone && <div className="field-error">⚠ {errors.phone}</div>}
              </div>

              <div className="field-wrap">
                <label>Business Address</label>
                <span className="field-icon">📍</span>
                <textarea
                  name="address"
                  placeholder="Your business address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 34px",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 13.5,
                    fontFamily: "'Instrument Sans', sans-serif",
                    outline: "none",
                    background: "#fafafa",
                    resize: "vertical",
                    ...(errors.address ? errorStyle : {}),
                  }}
                />
                {errors.address && <div className="field-error">⚠ {errors.address}</div>}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                      style={{ animation: "spin 0.7s linear infinite" }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round" />
                    </svg>
                    Creating Account…
                  </span>
                ) : "🚀 Register as Dealer"}
              </button>

              <div className="signin-link">
                Already have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("dealer-login"); }}>
                  Sign In
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
    display: flex; width: 100%; max-width: 900px; min-height: 480px;
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.08);
    animation: fadeSlideUp 0.55s cubic-bezier(.22,.68,0,1.2) forwards;
  }

  .login-card.shake {
    animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
  }

  .brand-panel {
    width: 240px; flex-shrink: 0;
    background: linear-gradient(160deg, #1a1f2e 0%, #252b3b 60%, #1e2330 100%);
    padding: 32px 24px; display: flex; flex-direction: column; gap: 24px;
    position: relative; overflow: hidden;
  }

  .brand-panel::before, .brand-panel::after {
    content: ""; position: absolute; border-radius: 50%;
    background: #fbbf24; pointer-events: none;
  }
  .brand-panel::before {
    width: 80px; height: 80px; top: 10px; right: 10px; opacity: 0.08;
    animation: floatDot 5s ease-in-out infinite;
  }
  .brand-panel::after {
    width: 44px; height: 44px; bottom: 70px; left: 10px; opacity: 0.06;
    animation: floatDot 7s ease-in-out infinite reverse;
  }

  .brand-logo { display: flex; align-items: center; gap: 9px; }
  .brand-icon {
    width: 36px; height: 36px; background: #fbbf24; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
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
  .brand-hero .highlight { color: #fbbf24; font-style: italic; }
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
    background: rgba(251,191,36,.08); border-color: rgba(251,191,36,.2);
    transform: translateX(3px); transition: all .2s ease;
  }
  .perk-icon { font-size: 16px; }
  .perk-text { font-size: 12.5px; color: #d1d5db; font-weight: 500; }

  .form-panel {
    flex: 1; background: #fff; padding: 36px 36px 32px;
    display: flex; flex-direction: column; justify-content: center;
    overflow-y: auto; max-height: 90vh;
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
  .field-wrap input, .field-wrap textarea {
    width: 100%; padding: 10px 12px 10px 34px;
    border: 1.5px solid #e5e7eb; border-radius: 8px;
    font-size: 13.5px; font-family: 'Instrument Sans', sans-serif;
    outline: none; box-sizing: border-box; color: #111;
    transition: border-color .2s, box-shadow .2s; background: #fafafa;
  }
  .field-wrap input:focus, .field-wrap textarea:focus {
    border-color: #fbbf24; box-shadow: 0 0 0 3px rgba(251,191,36,.18);
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
    background: linear-gradient(90deg, #111827 0%, #1f2937 40%, #fbbf24 50%, #1f2937 60%, #111827 100%);
    background-size: 200% auto; color: #fff; border: none; border-radius: 9px;
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
    border-bottom: 1.5px solid #fbbf24; padding-bottom: 1px;
    transition: color .15s;
  }
  .signin-link a:hover { color: #fbbf24; }

  .server-error {
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: 8px; padding: 10px 14px; margin-bottom: 16px;
    color: #dc2626; font-size: 13px; animation: fadeSlideUp .3s ease;
  }
`;
