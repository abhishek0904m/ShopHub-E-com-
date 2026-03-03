// ─────────────────────────────────────────
//  src/Profile.jsx
// ─────────────────────────────────────────
import { useState, useEffect } from "react";

const BASE = "http://localhost:5000/api";

export default function Profile({ me, userEmail, onNavigate }) {
  const [firstName, setFirstName] = useState(me || "");
  const [lastName,  setLastName]  = useState("");
  const [mobile,    setMobile]    = useState("");
  const [gender,    setGender]    = useState("");
  const [dob,       setDob]       = useState("");
  const [address,   setAddress]   = useState("");

  const [saving,  setSaving]  = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  // ── Password change state
  const [currentPwd,  setCurrentPwd]  = useState("");
  const [newPwd,      setNewPwd]      = useState("");
  const [confirmPwd,  setConfirmPwd]  = useState("");
  const [pwdSaving,   setPwdSaving]   = useState(false);
  const [pwdMsg,      setPwdMsg]      = useState(null);
  const [showPwdForm, setShowPwdForm] = useState(false);

  // ── Load saved profile from MongoDB on mount ──
  useEffect(() => {
    if (!userEmail) return;
    fetch(`${BASE}/profile/${encodeURIComponent(userEmail)}`)
      .then(r => r.json())
      .then(data => {
        if (data.firstName) setFirstName(data.firstName);
        if (data.lastName)  setLastName(data.lastName);
        if (data.mobile)    setMobile(data.mobile);
        if (data.gender)    setGender(data.gender);
        if (data.dob)       setDob(data.dob);
        if (data.address)   setAddress(data.address);
      })
      .catch(() => {});
  }, [userEmail]);

  // ── Save profile
  const handleSave = async () => {
    setSaving(true); setSaveMsg(null);
    try {
      const res = await fetch(`${BASE}/profile/${encodeURIComponent(userEmail)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, mobile, gender, dob, address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save");
      setSaveMsg({ type: "success", text: "✓ Profile saved!" });
    } catch (e) {
      setSaveMsg({ type: "error", text: `❌ ${e.message}` });
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(null), 3000);
  };

  // ── Change password
  const handlePasswordChange = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) { setPwdMsg({ type: "error", text: "Fill all password fields" }); return; }
    if (newPwd !== confirmPwd) { setPwdMsg({ type: "error", text: "New passwords don't match" }); return; }
    if (newPwd.length < 6) { setPwdMsg({ type: "error", text: "Password must be at least 6 characters" }); return; }
    setPwdSaving(true); setPwdMsg(null);
    try {
      const res = await fetch(`${BASE}/profile/${encodeURIComponent(userEmail)}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      setPwdMsg({ type: "success", text: "✓ Password changed successfully!" });
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
      setTimeout(() => { setPwdMsg(null); setShowPwdForm(false); }, 2500);
    } catch (e) {
      setPwdMsg({ type: "error", text: `❌ ${e.message}` });
    }
    setPwdSaving(false);
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb",
    borderRadius: 6, fontSize: 13, fontFamily: "Poppins,sans-serif",
    outline: "none", boxSizing: "border-box", color: "#111827",
  };
  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 5,
    display: "block", textTransform: "uppercase", letterSpacing: 0.4,
  };

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", width: "100%" }}>

      {/* ── LEFT PANEL */}
      <div style={{ width: 210, flexShrink: 0, background: "#1e2330", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.3)" }}>
        <div style={{ background: "linear-gradient(135deg,#252b3b,#1a1f2e)", padding: "20px 16px", textAlign: "center", borderBottom: "1px solid #2a3145" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#1e2330", margin: "0 auto 10px", border: "3px solid #353d55", boxShadow: "0 0 0 3px rgba(251,191,36,.25)" }}>
            {me[0]?.toUpperCase()}
          </div>
          <div style={{ color: "#f9fafb", fontWeight: 700, fontSize: 14 }}>{me}</div>
          <div style={{ color: "#6b7280", fontSize: 10.5, marginTop: 3 }}>{userEmail || "member@shophub.in"}</div>
        </div>

        {/* ── Sidebar — Wishlist, Payment Methods, Coupons, Reviews REMOVED */}
        {["📦 My Orders", "📍 Saved Addresses"].map((item, i) => (
          <div key={i}
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 15px", color: "#9ca3af", fontSize: 12, cursor: "pointer", borderBottom: "1px solid #252b3b", transition: "all .12s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#252b3b"; e.currentTarget.style.color = "#fbbf24"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
          >{item}</div>
        ))}

        {/* Change Password toggle */}
        <div
          onClick={() => setShowPwdForm(p => !p)}
          style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 15px", color: showPwdForm ? "#fbbf24" : "#9ca3af", fontSize: 12, cursor: "pointer", borderBottom: "1px solid #252b3b", transition: "all .12s", background: showPwdForm ? "#252b3b" : "transparent" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#252b3b"; e.currentTarget.style.color = "#fbbf24"; }}
          onMouseLeave={e => { if (!showPwdForm) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; } }}
        >🔒 Change Password</div>

        <button
          onClick={() => onNavigate?.("login")}
          style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "12px 15px", border: "none", background: "transparent", cursor: "pointer", color: "#ef4444", fontFamily: "Poppins,sans-serif", fontSize: 12, fontWeight: 700, borderTop: "1px solid #2a3145", textAlign: "left", transition: "background .12s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#2d1515"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >🚪 Logout</button>
      </div>

      {/* ── RIGHT PANEL */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── PROFILE FORM */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,.07)" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            Personal Information
            {saveMsg && (
              <span style={{ background: saveMsg.type === "success" ? "#dcfce7" : "#fee2e2", color: saveMsg.type === "success" ? "#16a34a" : "#dc2626", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                {saveMsg.text}
              </span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input style={inputStyle} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input style={inputStyle} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input style={{ ...inputStyle, background: "#f9fafb", color: "#6b7280" }} value={userEmail || ""} readOnly />
            </div>
            <div>
              <label style={labelStyle}>Mobile Number</label>
              <input style={inputStyle} value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="+91 99999 99999" type="tel" />
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <select style={inputStyle} value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date of Birth</label>
              <input style={inputStyle} type="date" value={dob} onChange={e => setDob(e.target.value)} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Delivery Address</label>
              <input style={inputStyle} value={address} onChange={e => setAddress(e.target.value)} placeholder="House No., Street, Area, City, Pincode" />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ marginTop: 18, background: saving ? "#6b7280" : "#111827", color: "#fbbf24", border: "none", borderRadius: 8, padding: "11px 28px", fontSize: 13, fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", fontFamily: "Poppins,sans-serif", transition: "background .15s" }}
          >
            {saving ? "⏳ Saving…" : "Save Changes"}
          </button>
        </div>

        {/* ── PASSWORD CHANGE FORM */}
        {showPwdForm && (
          <div style={{ background: "#fff", borderRadius: 14, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,.07)" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              🔒 Change Password
              {pwdMsg && (
                <span style={{ background: pwdMsg.type === "success" ? "#dcfce7" : "#fee2e2", color: pwdMsg.type === "success" ? "#16a34a" : "#dc2626", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                  {pwdMsg.text}
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
              <div>
                <label style={labelStyle}>Current Password</label>
                <input style={inputStyle} type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="Enter current password" />
              </div>
              <div>
                <label style={labelStyle}>New Password</label>
                <input style={inputStyle} type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Min 6 characters" />
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input style={inputStyle} type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Re-enter new password" />
              </div>
            </div>
            <button
              onClick={handlePasswordChange}
              disabled={pwdSaving}
              style={{ marginTop: 16, background: pwdSaving ? "#6b7280" : "#dc2626", color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontSize: 13, fontWeight: 800, cursor: pwdSaving ? "not-allowed" : "pointer", fontFamily: "Poppins,sans-serif" }}
            >
              {pwdSaving ? "⏳ Updating…" : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}