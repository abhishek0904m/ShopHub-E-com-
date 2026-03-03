// ─────────────────────────────────────────
//  src/App.jsx
// ─────────────────────────────────────────
import { useState } from "react";
import Registration       from "./Registration";
import Login              from "./Login";
import Dashboard          from "./Dashboard";
import DealerLogin        from "./DealerLogin";
import DealerRegistration from "./DealerRegistration";
import DealerDashboard    from "./DealerDashboard";
import AdminLogin         from "./AdminLogin";
import AdminDashboard     from "./AdminDashboard";
import MobileMenu         from "./MobileMenu";
import "./App.css";
import "./global-styles.css";
import "./responsive-dashboard.css";
import "./enhanced-dashboard.css";
import "./premium-animations.css";
import "./mobile-responsive.css";

// ✅ Read session from localStorage on first load
// So page refresh restores the user's session instead of going to register
const savedSession = JSON.parse(localStorage.getItem("shophub_session") || "null");

function App() {
  const [page, setPage]           = useState(savedSession?.page      || "register");
  const [userName, setUserName]   = useState(savedSession?.userName  || "");
  const [userEmail, setUserEmail] = useState(savedSession?.userEmail || "");
  const [userId, setUserId]       = useState(savedSession?.userId    || "");

  const handleNavigate = (target, name = "", emailOrId = "") => {
    if (target === "login" || target === "register") {
      // ✅ Clear session on sign out / going to login
      setUserName("");
      setUserEmail("");
      setUserId("");
      localStorage.removeItem("shophub_session");
    }

    if (name) setUserName(name);
    
    // For user dashboard, emailOrId is email
    if (target === "dashboard" && emailOrId) {
      setUserEmail(emailOrId);
    }
    
    // For dealer/admin dashboard, emailOrId is ID
    if ((target === "dealer-dashboard" || target === "admin-dashboard") && emailOrId) {
      setUserId(emailOrId);
    }
    
    setPage(target);

    // ✅ Save session to localStorage
    if (target === "dashboard" && name && emailOrId) {
      localStorage.setItem("shophub_session", JSON.stringify({
        page: "dashboard",
        userName: name,
        userEmail: emailOrId,
      }));
    }

    if (target === "dealer-dashboard") {
      localStorage.setItem("shophub_session", JSON.stringify({
        page: "dealer-dashboard",
        userName: name || savedSession?.userName || "",
        userId: emailOrId || savedSession?.userId || "",
      }));
    }

    if (target === "admin-dashboard") {
      localStorage.setItem("shophub_session", JSON.stringify({
        page: "admin-dashboard",
        userName: name || savedSession?.userName || "",
        userId: emailOrId || savedSession?.userId || "",
      }));
    }
  };

  if (page === "admin-dashboard")     return <AdminDashboard     onNavigate={handleNavigate} userName={userName} adminId={userId} />;
  if (page === "admin-login")         return <AdminLogin         onNavigate={handleNavigate} />;
  if (page === "dealer-dashboard")    return <DealerDashboard    onNavigate={handleNavigate} userName={userName} dealerId={userId} />;
  if (page === "dealer-registration") return <DealerRegistration onNavigate={handleNavigate} />;
  if (page === "dealer-login")        return <DealerLogin        onNavigate={handleNavigate} />;
  if (page === "dashboard")           return <MobileMenu><Dashboard onNavigate={handleNavigate} userName={userName} userEmail={userEmail} /></MobileMenu>;
  if (page === "login")               return <Login              onNavigate={handleNavigate} />;
  return <Registration onNavigate={handleNavigate} />;
}

export default App;