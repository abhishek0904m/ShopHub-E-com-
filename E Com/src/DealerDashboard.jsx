// ─────────────────────────────────────────
//  src/DealerDashboard.jsx
// ─────────────────────────────────────────
import { useState, useEffect } from "react";
import { SHARED_CSS } from "./shared";
import { API_BASE_URL } from "./config";
import { fetchProducts, createProduct, deleteProduct } from "./api";
import AddProduct from "./AddProduct";
import Chatbot from "./Chatbot";

const CANCEL_REASONS = [
  "Item out of stock",
  "Unable to deliver to your location",
  "Pricing error on the product",
  "Suspicious / fraudulent order detected",
  "Customer requested cancellation",
  "Other",
];

const STATUS_OPTIONS = ["Open", "In Progress", "Resolved"];

export default function DealerDashboard({ onNavigate, userName, dealerId }) {
  const me = userName || "Dealer";
  
  // Get dealer info from localStorage
  const dealerInfo = JSON.parse(localStorage.getItem("dealer_info") || "{}");
  const myDealerId = dealerId || dealerInfo.dealerId;
  const myDealerCode = dealerInfo.dealerCode;
  
  const [page, setPage]         = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [toast, setToast]       = useState(null);
  const [toastKey, setToastKey] = useState(0);

  // ── Cancel modal state
  const [cancelModal, setCancelModal]   = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [cancelling, setCancelling]     = useState(false);
  const [updatingId, setUpdatingId]     = useState(null);

  // ── Contact message state
  const [contactNotifs, setContactNotifs] = useState([]);
  const [queries, setQueries]             = useState([]);
  const [updatingQueryId, setUpdatingQueryId] = useState(null);

  useEffect(() => {
    loadProducts();
    loadAllOrders();
    loadContactMessages();
  }, []);

  const loadProducts = async () => {
    try {
      // ✅ Filter products by dealer code
      const url = myDealerCode 
        ? `${API_BASE_URL}/api/products?dealerCode=${myDealerCode}`
        : "${API_BASE_URL}/api/products";
      const res = await fetch(url);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) { console.warn(e.message); }
  };

  const loadAllOrders = async () => {
    try {
      // ✅ Get all orders, then filter on frontend to show only items from this dealer
      const res = await fetch("${API_BASE_URL}/api/orders/all");
      const data = await res.json();
      const allOrders = Array.isArray(data) ? data : [];
      
      // Filter orders to only show those containing this dealer's products
      const myOrders = allOrders
        .map(order => {
          // Filter items to only this dealer's items
          const myItems = order.items?.filter(item => 
            item.dealerCode === myDealerCode || item.dealerId === myDealerId
          ) || [];
          
          // Only include order if it has items from this dealer
          if (myItems.length === 0) return null;
          
          // Calculate total for this dealer's items only
          const myTotal = myItems.reduce((sum, item) => sum + (item.rawPrice * item.qty), 0);
          
          // Create order summary for this dealer's items
          const itemSummary = myItems.length === 1 
            ? myItems[0].name 
            : `${myItems[0].name} + ${myItems.length - 1} more`;
          
          return {
            ...order,
            items: myItems,
            item: itemSummary,
            amt: `₹${myTotal.toLocaleString("en-IN")}`,
            dealerItemCount: myItems.length,
          };
        })
        .filter(order => order !== null);
      
      setOrders(myOrders);
    } catch (e) { 
      console.warn("Orders fetch error:", e.message); 
    }
  };

  const loadContactMessages = async () => {
    try {
      const res  = await fetch("${API_BASE_URL}/api/contact");
      const data = await res.json();
      const all  = Array.isArray(data) ? data : [];
      setQueries(all);
      // Only show unnotified ones as popup
      const unnotified = all.filter(m => !m.notified);
      if (unnotified.length > 0) setContactNotifs(unnotified);
    } catch (e) { console.warn("Contact fetch error:", e.message); }
  };

  const showToast = (msg) => {
    setToast(msg); setToastKey(k => k + 1);
    setTimeout(() => setToast(null), 2500);
  };

  // ── Dismiss single contact notif
  const dismissContactNotif = async (msg) => {
    try {
      await fetch(`${API_BASE_URL}/api/contact/${msg._id}/notified`, { method: "PATCH", headers: { "Content-Type": "application/json" } });
    } catch (e) { console.warn(e.message); }
    setContactNotifs(prev => prev.filter(m => m._id !== msg._id));
  };

  const dismissAllContactNotifs = async () => {
    await Promise.all(contactNotifs.map(dismissContactNotif));
    setContactNotifs([]);
  };

  // ── Update query status (dealer)
  const handleQueryStatus = async (queryId, newStatus) => {
    setUpdatingQueryId(queryId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact/${queryId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      setQueries(prev => prev.map(q => q._id === queryId ? { ...q, status: newStatus } : q));
      showToast(`✅ Query marked as ${newStatus}`);
    } catch { showToast("❌ Failed to update query status"); }
    setUpdatingQueryId(null);
  };

  // ── Hide resolved query from dealer view (stays in DB) ──
  const handleDeleteQuery = async (queryId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact/${queryId}/dealerHidden`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed");
      setQueries(prev => prev.filter(q => q._id !== queryId));
      showToast("✓ Query hidden from list");
    } catch { showToast("❌ Failed to hide query"); }
  };

  const handleAddProduct = async (formData) => {
    // ✅ Add dealer info to product
    const productData = {
      ...formData,
      dealerId: myDealerId,
      dealerCode: myDealerCode,
    };
    const saved = await createProduct(productData);
    setProducts(prev => [...prev, saved]);
    showToast("✅ Product added successfully!");
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
    showToast("🗑 Product deleted");
  };

  const handleStatusChange = async (order, newStatus) => {
    const orderId = order._id || order.id;
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      setOrders(prev => prev.map(o => (o._id || o.id) === orderId ? { ...o, status: newStatus } : o));
      showToast(`✅ Order marked as ${newStatus}`);
    } catch { showToast("❌ Failed to update status"); }
    setUpdatingId(null);
  };

  const openCancelModal = (order) => { setCancelModal(order); setCancelReason(""); setCustomReason(""); };

  const confirmCancel = async () => {
    const reason = cancelReason === "Other" ? customReason.trim() : cancelReason;
    if (!reason) { showToast("Please select or enter a reason"); return; }
    const orderId = cancelModal._id || cancelModal.id;
    setCancelling(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled", cancelReason: reason, cancelledBy: "dealer" }),
      });
      if (!res.ok) throw new Error("Failed");
      setOrders(prev => prev.map(o => (o._id || o.id) === orderId ? { ...o, status: "Cancelled", cancelReason: reason, cancelledBy: "dealer" } : o));
      showToast("🚫 Order cancelled — customer will be notified on next login");
      setCancelModal(null);
    } catch { showToast("❌ Failed to cancel order"); }
    setCancelling(false);
  };

  const NAV = [
    { id: "overview",   icon: "📊", label: "Overview"       },
    { id: "products",   icon: "📦", label: "Products"       },
    { id: "addproduct", icon: "➕", label: "Add Product"    },
    { id: "orders",     icon: "🧾", label: "All Orders"     },
    { id: "queries",    icon: "🎧", label: "Customer Queries" },
  ];

  const totalRevenue = orders.reduce((s, o) => {
    const n = parseInt((o.amt || "").replace(/[^0-9]/g, "")) || 0;
    return s + n;
  }, 0);

  const statusColor = (s) =>
    s === "Resolved"    ? { bg: "#dcfce7", color: "#16a34a" } :
    s === "In Progress" ? { bg: "#dbeafe", color: "#2563eb" } :
                          { bg: "#fef9c3", color: "#b45309" };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#e8ecf1", margin: 0, padding: 0 }}>
      <style>{SHARED_CSS}{`
        .cancel-overlay { position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px; }
        .cancel-modal { background:#fff;border-radius:16px;padding:28px 28px 24px;width:100%;max-width:460px;box-shadow:0 20px 60px rgba(0,0,0,.2); }
        .reason-option { display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:9px;border:1.5px solid #e5e7eb;margin-bottom:8px;cursor:pointer;font-size:13px;font-weight:600;color:#374151;transition:all .15s; }
        .reason-option:hover { border-color:#f87171;background:#fff8f8; }
        .reason-option.selected { border-color:#dc2626;background:#fef2f2;color:#dc2626; }
        .dealer-status-btn { border:1.5px solid #e5e7eb;border-radius:7px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:Poppins,sans-serif;background:#fff;transition:all .15s; }
        .dealer-cancel-btn { border:1.5px solid #fca5a5;border-radius:7px;padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer;color:#dc2626;font-family:Poppins,sans-serif;background:#fff;transition:all .15s;white-space:nowrap; }
        .dealer-cancel-btn:hover { background:#fee2e2; }
        .notif-overlay { position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px; }
        .notif-modal { background:#fff;border-radius:12px;width:100%;max-width:500px;box-shadow:0 24px 64px rgba(0,0,0,.25);overflow:hidden; }
        .notif-header { background:linear-gradient(135deg,#1d4ed8,#1e40af);padding:22px 24px 18px;color:#fff; }
        .notif-body { padding:20px 24px;max-height:360px;overflow-y:auto; }
        .notif-card { background:#f0f9ff;border:1.5px solid #bae6fd;border-radius:8px;padding:14px 16px;margin-bottom:12px; }
        .notif-footer { padding:16px 24px;border-top:1px solid #f3f4f6; }
      `}</style>

      {/* ── CONTACT MESSAGE NOTIFICATION POPUP */}
      {contactNotifs.length > 0 && (
        <div className="notif-overlay">
          <div className="notif-modal">
            <div className="notif-header">
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎧</div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>New Customer Queries</div>
              <div style={{ fontSize: 13, opacity: .85, marginTop: 4 }}>
                {contactNotifs.length === 1 ? "1 new support message from a customer." : `${contactNotifs.length} new support messages from customers.`}
              </div>
            </div>
            <div className="notif-body">
              {contactNotifs.map((m, i) => (
                <div key={m._id || i} className="notif-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{m.email}{m.phone ? ` · 📞 ${m.phone}` : ""}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, background: "#dbeafe", color: "#1d4ed8", padding: "2px 8px", borderRadius: 12, whiteSpace: "nowrap", marginLeft: 8 }}>New</span>
                  </div>
                  <div style={{ background: "#e0f2fe", borderRadius: 6, padding: "8px 12px", marginTop: 4 }}>
                    <div style={{ fontSize: 12, color: "#0c4a6e", lineHeight: 1.5 }}>{m.message}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
                    {new Date(m.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
            <div className="notif-footer">
              <button
                onClick={dismissAllContactNotifs}
                style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "#1d4ed8", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}
              >
                Got it — View Queries
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOPBAR — matched to user dashboard */}
      <nav className="tb">
        <div className="tb-logo">
          <div className="tb-logo-box">🏪</div>
          <div>
            <div className="tb-logo-text">Shop<span>Hub</span></div>
            <div className="tb-logo-sub" style={{ color: "#fbbf24", fontWeight: 800 }}>DEALER PORTAL</div>
          </div>
        </div>
        <div className="tb-search">
          <input type="text" placeholder="Search orders, products…" />
          <button className="tb-search-btn">🔍</button>
        </div>
        <div className="tb-actions">
          <button className="tb-btn login-btn">👤 {me}</button>
          <div className="tb-divider" />
          <button className="tb-btn" style={{ color: "#ef4444" }} onClick={() => onNavigate("login")}>🚪 Sign Out</button>
        </div>
      </nav>

      {/* ── BODY */}
      <div className="lay">
        {/* ── SIDEBAR */}
        <aside className="sb">
          <div className="sb-card">
            <div className="sb-head">
              <div className="sb-av" style={{ background: "#fbbf24", color: "#111" }}>{me[0]?.toUpperCase()}</div>
              <div>
                <div className="sb-uname">{me}</div>
                <div className="sb-uemail" style={{ color: "#fbbf24", fontSize: 10, fontWeight: 700 }}>DEALER ACCOUNT</div>
              </div>
            </div>
            {NAV.map(n => (
              <button key={n.id} className={`sb-link ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                <span className="sb-icon">{n.icon}</span>{n.label}
                {n.id === "queries" && queries.filter(q => !q.notified).length > 0 && (
                  <span style={{ marginLeft: "auto", background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 10 }}>
                    {queries.filter(q => !q.notified).length}
                  </span>
                )}
              </button>
            ))}
            <button className="sb-logout" onClick={() => onNavigate("login")}>🚪 Sign Out</button>
          </div>
        </aside>

        {/* ── MAIN */}
        <main className="main">

          {/* OVERVIEW */}
          {page === "overview" && (
            <>
              <div className="sec">
                <div className="sec-hd">
                  <span className="sec-title">📊 Dealer Overview</span>
                  <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, background: "#dcfce7", padding: "3px 10px", borderRadius: 20 }}>● Live</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                  {[
                    { icon: "📦", label: "Total Products", value: products.length,                              color: "#6366f1" },
                    { icon: "🧾", label: "Total Orders",   value: orders.length,                               color: "#f59e0b" },
                    { icon: "💰", label: "Total Revenue",  value: `₹${totalRevenue.toLocaleString("en-IN")}`,  color: "#16a34a" },
                    { icon: "🎧", label: "Open Queries",   value: queries.filter(q => q.status === "Open").length, color: "#dc2626" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "#f9fafb", borderRadius: 12, padding: "16px", border: "1.5px solid #f3f4f6", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, background: `${s.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sec">
                <div className="sec-hd">
                  <span className="sec-title">🆕 Recently Added Products</span>
                  <button className="sec-link" onClick={() => setPage("products")}>View All →</button>
                </div>
                {products.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 24, color: "#9ca3af" }}>No products yet. <button className="sec-link" onClick={() => setPage("addproduct")}>Add one →</button></div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {products.slice(0, 5).map(p => (
                      <div key={p._id || p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6" }}>
                        {p.img && (p.img.startsWith("http") || p.img.startsWith("data:")) ? (
                          <img src={p.img} alt={p.name} style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 8 }} />
                        ) : <span style={{ fontSize: 26 }}>{p.img || "📦"}</span>}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>{p.category}</div>
                        </div>
                        <div style={{ fontWeight: 800, color: "#111827" }}>{p.price}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* PRODUCTS LIST */}
          {page === "products" && (
            <div className="sec">
              <div className="sec-hd">
                <span className="sec-title">📦 All Products ({products.length})</span>
                <button className="sec-link" onClick={() => setPage("addproduct")}>+ Add New →</button>
              </div>
              {products.length === 0 ? (
                <div style={{ textAlign: "center", padding: 30, color: "#9ca3af" }}>No products yet.</div>
              ) : (
                <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "70px minmax(0,1fr) 110px 90px 70px", background: "#f9fafb", padding: "10px 14px", fontSize: 10.5, fontWeight: 700, color: "#6b7280", letterSpacing: .4, textTransform: "uppercase", borderBottom: "1px solid #e5e7eb" }}>
                    <span>Image</span><span>Name</span><span>Category</span><span>Price</span><span>Delete</span>
                  </div>
                  {products.map(p => (
                    <div key={p._id || p.id} style={{ display: "grid", gridTemplateColumns: "70px minmax(0,1fr) 110px 90px 70px", padding: "10px 14px", borderBottom: "1px solid #f9fafb", alignItems: "center", fontSize: 13 }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fffbf0"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      {p.img && (p.img.startsWith("http") || p.img.startsWith("data:"))
                        ? <img src={p.img} alt={p.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }} />
                        : <span style={{ fontSize: 28 }}>{p.img || "📦"}</span>
                      }
                      <span style={{ color: "#111827", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 8 }}>{p.name}</span>
                      <span style={{ color: "#6b7280", fontSize: 12 }}>{p.category}</span>
                      <span style={{ color: "#111827", fontWeight: 700 }}>{p.price || `₹${p.rawPrice}`}</span>
                      <button onClick={() => handleDeleteProduct(p._id || p.id)} style={{ background: "#fee2e2", border: "none", color: "#dc2626", borderRadius: 6, padding: "5px 9px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🗑</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADD PRODUCT */}
          {page === "addproduct" && <AddProduct onAdd={handleAddProduct} products={products} onDelete={handleDeleteProduct} dealerId={myDealerId} dealerCode={myDealerCode} />}

          {/* ALL ORDERS */}
          {page === "orders" && (
            <div className="sec">
              <div className="sec-hd">
                <span className="sec-title">🧾 All Customer Orders ({orders.length})</span>
              </div>
              {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: 30, color: "#9ca3af" }}>No orders yet.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {orders.map((o, i) => {
                    const isCancelled  = o.status === "Cancelled";
                    const isDelivered  = o.status === "Delivered";
                    const thisUpdating = updatingId === (o._id || o.id);
                    return (
                      <div key={o._id || o.id || i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${isCancelled ? "#fecaca" : "#f3f4f6"}`, background: isCancelled ? "#fff8f8" : "#f9fafb", opacity: thisUpdating ? 0.6 : 1, transition: "opacity .2s" }}>
                        <div style={{ fontSize: 22 }}>🛍️</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{o.item}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>{o.userName} · {o.date}</div>
                          {isCancelled && o.cancelReason && <div style={{ fontSize: 11, color: "#dc2626", marginTop: 3, fontWeight: 600 }}>🚫 Reason: {o.cancelReason}</div>}
                        </div>
                        <div style={{ fontWeight: 800, color: "#111827", marginRight: 8, whiteSpace: "nowrap" }}>{o.amt}</div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", background: isDelivered ? "#dcfce7" : isCancelled ? "#fee2e2" : "#fef3c7", color: isDelivered ? "#16a34a" : isCancelled ? "#dc2626" : "#d97706" }}>
                          {o.status}
                        </span>
                        {!isCancelled && (
                          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                            <button className="dealer-status-btn" disabled={thisUpdating} onClick={() => handleStatusChange(o, isDelivered ? "In Transit" : "Delivered")} style={{ background: isDelivered ? "#fef3c7" : "#f0fdf4", color: isDelivered ? "#d97706" : "#16a34a", borderColor: isDelivered ? "#fde68a" : "#bbf7d0" }}>
                              {thisUpdating ? "⏳" : isDelivered ? "↩ Mark In Transit" : "✅ Mark Delivered"}
                            </button>
                            <button className="dealer-cancel-btn" onClick={() => openCancelModal(o)}>🚫 Cancel</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* CUSTOMER QUERIES */}
          {page === "queries" && (
            <div className="sec">
              <div className="sec-hd">
                <span className="sec-title">🎧 Customer Queries ({queries.length})</span>
                <div style={{ display: "flex", gap: 8 }}>
                  {["All", "Open", "In Progress", "Resolved"].map(f => (
                    <span key={f} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, cursor: "pointer", background: "#f3f4f6", color: "#374151" }}
                      onClick={() => {}} // filter UI only for now
                    >{f}</span>
                  ))}
                </div>
              </div>
              {queries.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#6b7280" }}>No customer queries yet</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {queries.map((q, i) => {
                    const sc = statusColor(q.status);
                    const isUpdating = updatingQueryId === q._id;
                    return (
                      <div key={q._id || i} style={{ background: "#f9fafb", borderRadius: 10, border: "1.5px solid #f3f4f6", padding: "16px 18px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>{q.name}</div>
                            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                              📧 {q.email}{q.phone ? ` · 📞 ${q.phone}` : ""}
                            </div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                              {new Date(q.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                            <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>{q.status}</span>
                            {q.status === "Resolved" && (
                              <button
                                onClick={() => handleDeleteQuery(q._id)}
                                title="Remove this resolved query"
                                style={{ width: 26, height: 26, borderRadius: "50%", border: "1.5px solid #e5e7eb", background: "#fff", color: "#9ca3af", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, lineHeight: 1, transition: "all .15s", flexShrink: 0 }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.borderColor = "#fca5a5"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                              >✕</button>
                            )}
                          </div>
                        </div>

                        {/* Message */}
                        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", padding: "10px 14px", fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 12 }}>
                          {q.message}
                        </div>

                        {/* Status change buttons */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", alignSelf: "center" }}>Change status:</span>
                          {STATUS_OPTIONS.map(s => (
                            <button
                              key={s}
                              disabled={q.status === s || isUpdating}
                              onClick={() => handleQueryStatus(q._id, s)}
                              style={{
                                padding: "5px 12px", borderRadius: 20, border: "1.5px solid",
                                fontSize: 11, fontWeight: 700, cursor: q.status === s || isUpdating ? "not-allowed" : "pointer",
                                fontFamily: "Poppins,sans-serif", transition: "all .15s",
                                background: q.status === s ? statusColor(s).bg : "#fff",
                                color: q.status === s ? statusColor(s).color : "#6b7280",
                                borderColor: q.status === s ? statusColor(s).color : "#e5e7eb",
                                opacity: q.status === s ? 1 : 0.8,
                              }}
                            >
                              {isUpdating ? "⏳" : s}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ── FOOTER — matched to user dashboard */}
      <footer className="sh-footer">
        <div className="sh-footer-top">
          <div className="sh-footer-col">
            <h4>About</h4>
            <a href="#">Contact Us</a><a href="#">About Us</a><a href="#">Careers</a>
            <a href="#">ShopHub Stories</a><a href="#">Press</a><a href="#">Corporate Information</a>
          </div>
          <div className="sh-footer-col">
            <h4>Group Companies</h4>
            <a href="#">ShopHub Plus</a><a href="#">ShopHub Wholesale</a><a href="#">Clearance</a>
          </div>
          <div className="sh-footer-col">
            <h4>Help</h4>
            <a href="#">Payments</a><a href="#">Shipping</a><a href="#">Cancellation & Returns</a><a href="#">FAQ</a>
          </div>
          <div className="sh-footer-col">
            <h4>Consumer Policy</h4>
            <a href="#">Cancellation & Returns</a><a href="#">Terms of Use</a><a href="#">Security</a>
            <a href="#">Privacy</a><a href="#">Sitemap</a><a href="#">Grievance Redressal</a>
          </div>
          <div className="sh-footer-col">
            <h4>Mail Us</h4>
            <div className="sh-footer-contact">
              <p>ShopHub Internet Private Limited,</p><p>Prestige Tech Park,</p>
              <p>Outer Ring Road,</p><p>Bengaluru, 560103,</p><p>Karnataka, India</p>
            </div>
            <div style={{ marginTop: 14 }}>
              <h4 style={{ marginBottom: 10 }}>Social</h4>
              <div className="sh-footer-social">
                <a href="#" title="Facebook">📘</a><a href="#" title="Twitter">✖</a>
                <a href="#" title="YouTube">▶</a><a href="#" title="Instagram">📸</a>
              </div>
            </div>
          </div>
          <div className="sh-footer-col">
            <h4>Registered Office Address</h4>
            <div className="sh-footer-contact">
              <p>ShopHub Internet Private Limited,</p><p>Prestige Tech Park,</p>
              <p>Outer Ring Road,</p><p>Bengaluru, 560103,</p><p>Karnataka, India</p>
              <p style={{ marginTop: 8 }}>CIN: U51109KA2012PTC123456</p>
              <p>Telephone: <a className="sh-footer-phone" href="tel:18001234567">1800-123-4567</a></p>
            </div>
          </div>
        </div>
        <div className="sh-footer-bottom">
          <div className="sh-footer-bottom-left">
            <a href="#"><span className="bb-icon">⭐</span> Advertise</a>
            <a href="#"><span className="bb-icon">🎁</span> Gift Cards</a>
            <a href="#"><span className="bb-icon">❓</span> Help Center</a>
          </div>
          <span className="sh-footer-copy">© 2026 ShopHub.in. All rights reserved.</span>
          <div className="sh-footer-pay">
            {["VISA", "MC", "UPI", "COD", "EMI", "NetBanking"].map(p => (<span key={p} className="pay-chip">{p}</span>))}
          </div>
        </div>
      </footer>

      {/* ── CANCEL REASON MODAL */}
      {cancelModal && (
        <div className="cancel-overlay" onClick={() => !cancelling && setCancelModal(null)}>
          <div className="cancel-modal" onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>🚫 Cancel Order</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>{cancelModal.item}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{cancelModal.userName} · {cancelModal.amt}</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: .5 }}>Select cancellation reason</div>
            {CANCEL_REASONS.map(r => (
              <div key={r} className={`reason-option ${cancelReason === r ? "selected" : ""}`} onClick={() => { setCancelReason(r); if (r !== "Other") setCustomReason(""); }}>
                <span style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", border: `2px solid ${cancelReason === r ? "#dc2626" : "#d1d5db"}` }}>
                  {cancelReason === r && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626", display: "block" }} />}
                </span>
                {r}
              </div>
            ))}
            {cancelReason === "Other" && (
              <textarea value={customReason} onChange={e => setCustomReason(e.target.value)} placeholder="Describe the reason…" rows={2}
                style={{ width: "100%", marginTop: 4, padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: "Poppins,sans-serif", resize: "vertical", boxSizing: "border-box", outline: "none" }}
              />
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={() => setCancelModal(null)} disabled={cancelling} style={{ flex: 1, padding: "11px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}>Keep Order</button>
              <button onClick={confirmCancel} disabled={cancelling || !cancelReason || (cancelReason === "Other" && !customReason.trim())}
                style={{ flex: 1, padding: "11px", borderRadius: 9, border: "none", background: cancelling || !cancelReason ? "#f3f4f6" : "#dc2626", color: cancelling || !cancelReason ? "#9ca3af" : "#fff", fontSize: 13, fontWeight: 700, cursor: cancelling || !cancelReason ? "not-allowed" : "pointer", fontFamily: "Poppins,sans-serif", transition: "all .15s" }}
              >{cancelling ? "⏳ Cancelling…" : "🚫 Confirm Cancel"}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast" key={toastKey}>{toast}</div>}
      
      {/* Chatbot */}
      <Chatbot userType="dealer" />
    </div>
  );
}