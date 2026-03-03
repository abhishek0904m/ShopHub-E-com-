import { useState } from "react";
import { API_BASE_URL } from "./config";

const API = `${API_BASE_URL}/api`;


function Registration({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", agree: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (serverError) setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Full name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 8) e.password = "At least 8 characters";
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!formData.agree) e.agree = "Please accept the terms";
    return e;
  };

  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/\d/.test(pwd)) s++;
    if (/[^a-zA-Z\d]/.test(pwd)) s++;
    return s;
  };

  const strengthLevel = getStrength(formData.password);
  const strengthText = ["", "Weak", "Fair", "Good", "Strong"][strengthLevel] || "";
  const strengthClass = ["", "weak", "medium", "medium", "strong"][strengthLevel] || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Registration failed. Please try again.");
      } else {
        setDone(true);
      }
    } catch (err) {
      setServerError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="register-wrapper" style={{ justifyContent: "center", alignItems: "center", animation: "fadeIn 0.5s ease" }}>
        <div style={{ 
          textAlign: "center", 
          padding: "64px 48px", 
          background: "#fff", 
          width: "100%",
          animation: "scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
        }}>
          <div style={{ 
            fontSize: 72, 
            marginBottom: 20,
            animation: "bounce 0.8s ease-in-out"
          }}>✓</div>
          <h2 style={{ 
            fontFamily: "'Instrument Serif', serif", 
            fontStyle: "italic", 
            fontSize: 32, 
            color: "#111", 
            marginBottom: 12,
            animation: "fadeInUp 0.6s ease 0.2s both"
          }}>
            You're in!
          </h2>
          <p style={{ 
            color: "#6B7280", 
            fontSize: 15, 
            marginBottom: 32,
            animation: "fadeInUp 0.6s ease 0.3s both"
          }}>
            Account created. Welcome to ShopHub.
          </p>
          <button 
            onClick={() => onNavigate("login")} 
            className="submit-btn" 
            style={{ 
              width: "auto", 
              padding: "14px 40px",
              fontSize: 15,
              animation: "fadeInUp 0.6s ease 0.4s both"
            }}
          >
            Sign In Now →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-wrapper">
      {/* ── LEFT ── */}
      <div className="brand-panel">
        <div className="brand-logo">
          <div className="brand-icon">🛍</div>
          <div className="brand-name">Shop<span>Hub</span></div>
        </div>
        <div className="brand-hero">
          <h2>
            Quality you<br />
            <span className="highlight">can trust,</span><br />
            prices you'll love.
          </h2>
          <p>Delivered across India. Free returns. Genuine products from verified sellers.</p>
        </div>
        <div className="brand-perks">
          <div className="perk"><span className="perk-icon">⚡</span><span className="perk-text">Same-day dispatch</span></div>
          <div className="perk"><span className="perk-icon">🔒</span><span className="perk-text">SSL secure checkout</span></div>
          <div className="perk"><span className="perk-icon">↩</span><span className="perk-text">7-day free returns</span></div>
          <div className="perk"><span className="perk-icon">💬</span><span className="perk-text">24/7 WhatsApp support</span></div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="form-panel">
        <div className="form-header">
          <h1>Create your account</h1>
          <p>Takes less than a minute. No spam, ever.</p>
        </div>

        <div className="social-row">
          <button type="button" className="social-btn">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <button type="button" className="social-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div className="divider"><hr /><span>or with email</span><hr /></div>

        {/* Server Error Banner */}
        {serverError && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8,
            padding: "10px 14px", marginBottom: 16, color: "#DC2626", fontSize: 13
          }}>
            ⚠ {serverError}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="field-wrap">
            <label>Full Name</label>
            <span className="field-icon">👤</span>
            <input type="text" name="name" placeholder="John Doe"
              value={formData.name} onChange={handleChange}
              style={errors.name ? { borderColor: "#EF4444" } : {}} />
            {errors.name && <div className="field-error">⚠ {errors.name}</div>}
          </div>

          <div className="field-wrap">
            <label>Email Address</label>
            <span className="field-icon">✉</span>
            <input type="email" name="email" placeholder="john@example.com"
              value={formData.email} onChange={handleChange}
              style={errors.email ? { borderColor: "#EF4444" } : {}} />
            {errors.email && <div className="field-error">⚠ {errors.email}</div>}
          </div>

          <div className="field-wrap">
            <label>Password</label>
            <span className="field-icon">🔑</span>
            <input type={showPwd ? "text" : "password"} name="password"
              placeholder="Min. 8 characters" value={formData.password} onChange={handleChange}
              style={errors.password ? { borderColor: "#EF4444" } : {}} />
            <button type="button" className="eye-btn" onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? "🙈" : "👁"}
            </button>
            {formData.password && (
              <>
                <div className="strength-bar">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`strength-seg ${i <= strengthLevel ? strengthClass : ""}`} />
                  ))}
                </div>
                <div className="strength-label">{strengthText}</div>
              </>
            )}
            {errors.password && <div className="field-error">⚠ {errors.password}</div>}
          </div>

          <div className="field-wrap">
            <label>Confirm Password</label>
            <span className="field-icon">🔐</span>
            <input type={showConfirm ? "text" : "password"} name="confirmPassword"
              placeholder="Repeat your password" value={formData.confirmPassword} onChange={handleChange}
              style={errors.confirmPassword ? { borderColor: "#EF4444" } : {}} />
            <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? "🙈" : "👁"}
            </button>
            {errors.confirmPassword && <div className="field-error">⚠ {errors.confirmPassword}</div>}
          </div>

          <div className="terms-row">
            <input type="checkbox" name="agree" id="agree" checked={formData.agree} onChange={handleChange} />
            <label htmlFor="agree">
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>
          {errors.agree && <div className="field-error">⚠ {errors.agree}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                  style={{ animation: "spin 0.7s linear infinite" }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round"/>
                </svg>
                Creating account…
              </span>
            ) : "Create Account →"}
          </button>

          <div className="signin-link">
            Already have an account?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("login"); }}>Sign In</a>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Registration;