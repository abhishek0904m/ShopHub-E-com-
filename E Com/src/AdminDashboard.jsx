import { useState, useEffect } from "react";
import { SHARED_CSS } from "./shared";

export default function AdminDashboard({ onNavigate, userName, adminId }) {
  const [page, setPage] = useState("overview");
  const [stats, setStats] = useState({ users: 0, dealers: 0, products: 0, orders: 0, revenue: 0 });
  const [users, setUsers] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [toastKey, setToastKey] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
    if (page === "users") loadUsers();
    if (page === "dealers") loadDealers();
    if (page === "products") loadProducts();
    if (page === "orders") loadOrders();
  }, [page]);

  const loadStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.warn("Stats error:", e.message);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast("❌ Failed to load users");
    }
    setLoading(false);
  };

  const loadDealers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/dealers");
      const data = await res.json();
      setDealers(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast("❌ Failed to load dealers");
    }
    setLoading(false);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast("❌ Failed to load products");
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast("❌ Failed to load orders");
    }
    setLoading(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setToastKey((k) => k + 1);
    setTimeout(() => setToast(null), 2500);
  };

  const handleApproveDealer = async (dealerId, approved) => {
    try {
      const res = await fetch(`http://localhost:5000/api/dealers/${dealerId}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (!res.ok) throw new Error("Failed");
      setDealers((prev) =>
        prev.map((d) => (d._id === dealerId ? { ...d, approved } : d))
      );
      showToast(approved ? "✅ Dealer approved" : "🚫 Dealer rejected");
    } catch {
      showToast("❌ Failed to update dealer");
    }
  };

  const handleToggleDealerStatus = async (dealerId, active) => {
    try {
      const res = await fetch(`http://localhost:5000/api/dealers/${dealerId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error("Failed");
      setDealers((prev) =>
        prev.map((d) => (d._id === dealerId ? { ...d, active } : d))
      );
      showToast(active ? "✅ Dealer activated" : "⏸ Dealer deactivated");
    } catch {
      showToast("❌ Failed to update dealer status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      showToast("🗑 User deleted");
      loadStats();
    } catch {
      showToast("❌ Failed to delete user");
    }
  };

  const handleDeleteDealer = async (dealerId) => {
    if (!window.confirm("Delete this dealer? This will also remove their products.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/dealers/${dealerId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      setDealers((prev) => prev.filter((d) => d._id !== dealerId));
      showToast("🗑 Dealer deleted");
      loadStats();
    } catch {
      showToast("❌ Failed to delete dealer");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      showToast("🗑 Product deleted");
      loadStats();
    } catch {
      showToast("❌ Failed to delete product");
    }
  };

  const NAV = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "dealers", icon: "🏪", label: "Dealers" },
    { id: "products", icon: "📦", label: "Products" },
    { id: "orders", icon: "🧾", label: "Orders" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#e8ecf1", margin: 0, padding: 0 }}>
      <style>{SHARED_CSS}</style>

      {/* TOPBAR */}
      <nav className="tb" style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #dc2626 100%)" }}>
        <div className="tb-logo">
          <div className="tb-logo-box" style={{ background: "#dc2626" }}>⚡</div>
          <div>
            <div className="tb-logo-text">Shop<span style={{ color: "#dc2626" }}>Hub</span></div>
            <div className="tb-logo-sub" style={{ color: "#fca5a5", fontWeight: 800 }}>ADMIN PANEL</div>
          </div>
        </div>
        <div className="tb-search">
          <input type="text" placeholder="Search users, dealers, products…" />
          <button className="tb-search-btn">🔍</button>
        </div>
        <div className="tb-actions">
          <button className="tb-btn login-btn">⚡ {userName || "Admin"}</button>
          <div className="tb-divider" />
          <button className="tb-btn" style={{ color: "#ef4444" }} onClick={() => onNavigate("login")}>
            🚪 Sign Out
          </button>
        </div>
      </nav>

      {/* BODY */}
      <div className="lay">
        {/* SIDEBAR */}
        <aside className="sb">
          <div className="sb-card">
            <div className="sb-head">
              <div className="sb-av" style={{ background: "#dc2626", color: "#fff" }}>⚡</div>
              <div>
                <div className="sb-uname">{userName || "Admin"}</div>
                <div className="sb-uemail" style={{ color: "#dc2626", fontSize: 10, fontWeight: 700 }}>
                  ADMINISTRATOR
                </div>
              </div>
            </div>
            {NAV.map((n) => (
              <button
                key={n.id}
                className={`sb-link ${page === n.id ? "active" : ""}`}
                onClick={() => setPage(n.id)}
              >
                <span className="sb-icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
            <button className="sb-logout" onClick={() => onNavigate("login")}>
              🚪 Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* OVERVIEW */}
          {page === "overview" && (
            <>
              <div className="sec">
                <div className="sec-hd">
                  <span className="sec-title">📊 Admin Overview</span>
                  <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, background: "#dcfce7", padding: "3px 10px", borderRadius: 20 }}>
                    ● Live
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
                  {[
                    { icon: "👥", label: "Total Users", value: stats.users, color: "#6366f1" },
                    { icon: "🏪", label: "Total Dealers", value: stats.dealers, color: "#f59e0b" },
                    { icon: "📦", label: "Total Products", value: stats.products, color: "#8b5cf6" },
                    { icon: "🧾", label: "Total Orders", value: stats.orders, color: "#ec4899" },
                    { icon: "💰", label: "Total Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, color: "#16a34a" },
                  ].map((s, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#f9fafb",
                        borderRadius: 12,
                        padding: "16px",
                        border: "1.5px solid #f3f4f6",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div style={{ fontSize: 28 }}>{s.icon}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="sec">
                  <div className="sec-hd">
                    <span className="sec-title">🏪 Recent Dealers</span>
                    <button className="sec-link" onClick={() => setPage("dealers")}>
                      View All →
                    </button>
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280", textAlign: "center", padding: 20 }}>
                    Click "View All" to see dealer list
                  </div>
                </div>

                <div className="sec">
                  <div className="sec-hd">
                    <span className="sec-title">👥 Recent Users</span>
                    <button className="sec-link" onClick={() => setPage("users")}>
                      View All →
                    </button>
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280", textAlign: "center", padding: 20 }}>
                    Click "View All" to see user list
                  </div>
                </div>
              </div>
            </>
          )}

          {/* USERS */}
          {page === "users" && (
            <div className="sec">
              <div className="sec-hd">
                <span className="sec-title">👥 All Users ({users.length})</span>
              </div>
              {loading ? (
                <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Loading...</div>
              ) : users.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No users found</div>
              ) : (
                <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #f3f4f6" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) 120px 80px",
                      background: "#f9fafb",
                      padding: "10px 14px",
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "#6b7280",
                      letterSpacing: 0.4,
                      textTransform: "uppercase",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <span>Name</span>
                    <span>Email</span>
                    <span>Joined</span>
                    <span>Delete</span>
                  </div>
                  {users.map((u) => (
                    <div
                      key={u._id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) 120px 80px",
                        padding: "10px 14px",
                        borderBottom: "1px solid #f9fafb",
                        alignItems: "center",
                        fontSize: 13,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fffbf0")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ color: "#111827", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {u.name}
                      </span>
                      <span style={{ color: "#6b7280", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {u.email}
                      </span>
                      <span style={{ color: "#9ca3af", fontSize: 11 }}>
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        style={{
                          background: "#fee2e2",
                          border: "none",
                          color: "#dc2626",
                          borderRadius: 6,
                          padding: "5px 9px",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DEALERS */}
          {page === "dealers" && (
            <div className="sec">
              <div className="sec-hd">
                <span className="sec-title">🏪 All Dealers ({dealers.length})</span>
              </div>
              {loading ? (
                <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Loading...</div>
              ) : dealers.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No dealers found</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {dealers.map((d) => (
                    <div
                      key={d._id}
                      style={{
                        background: "#f9fafb",
                        borderRadius: 10,
                        border: "1.5px solid #f3f4f6",
                        padding: "16px 18px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>{d.name}</div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                            📧 {d.email} · 📞 {d.phone}
                          </div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                            🏢 {d.businessName} · 🔐 {d.dealerCode}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {!d.approved ? (
                            <>
                              <span style={{ background: "#fef3c7", color: "#d97706", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                                Pending
                              </span>
                              <button
                                onClick={() => handleApproveDealer(d._id, true)}
                                style={{
                                  background: "#dcfce7",
                                  border: "1.5px solid #86efac",
                                  color: "#16a34a",
                                  borderRadius: 7,
                                  padding: "5px 12px",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                ✅ Approve
                              </button>
                              <button
                                onClick={() => handleApproveDealer(d._id, false)}
                                style={{
                                  background: "#fee2e2",
                                  border: "1.5px solid #fca5a5",
                                  color: "#dc2626",
                                  borderRadius: 7,
                                  padding: "5px 12px",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                🚫 Reject
                              </button>
                            </>
                          ) : (
                            <>
                              <span
                                style={{
                                  background: d.active ? "#dcfce7" : "#fee2e2",
                                  color: d.active ? "#16a34a" : "#dc2626",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: "4px 12px",
                                  borderRadius: 20,
                                }}
                              >
                                {d.active ? "Active" : "Inactive"}
                              </span>
                              <button
                                onClick={() => handleToggleDealerStatus(d._id, !d.active)}
                                style={{
                                  background: d.active ? "#fef3c7" : "#dcfce7",
                                  border: `1.5px solid ${d.active ? "#fde68a" : "#86efac"}`,
                                  color: d.active ? "#d97706" : "#16a34a",
                                  borderRadius: 7,
                                  padding: "5px 12px",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                {d.active ? "⏸ Deactivate" : "▶ Activate"}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteDealer(d._id)}
                            style={{
                              background: "#fee2e2",
                              border: "1.5px solid #fca5a5",
                              color: "#dc2626",
                              borderRadius: 7,
                              padding: "5px 12px",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        📍 {d.address}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PRODUCTS */}
          {page === "products" && (
            <div className="sec">
              <div className="sec-hd">
                <span className="sec-title">📦 All Products ({products.length})</span>
              </div>
              {loading ? (
                <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Loading...</div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No products found</div>
              ) : (
                <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #f3f4f6" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "70px minmax(0,1fr) 110px 90px 120px 70px",
                      background: "#f9fafb",
                      padding: "10px 14px",
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "#6b7280",
                      letterSpacing: 0.4,
                      textTransform: "uppercase",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <span>Image</span>
                    <span>Name</span>
                    <span>Category</span>
                    <span>Price</span>
                    <span>Dealer</span>
                    <span>Delete</span>
                  </div>
                  {products.map((p) => (
                    <div
                      key={p._id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "70px minmax(0,1fr) 110px 90px 120px 70px",
                        padding: "10px 14px",
                        borderBottom: "1px solid #f9fafb",
                        alignItems: "center",
                        fontSize: 13,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fffbf0")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {p.img && (p.img.startsWith("http") || p.img.startsWith("data:")) ? (
                        <img
                          src={p.img}
                          alt={p.name}
                          style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }}
                        />
                      ) : (
                        <span style={{ fontSize: 28 }}>{p.img || "📦"}</span>
                      )}
                      <span style={{ color: "#111827", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>
                        {p.name}
                      </span>
                      <span style={{ color: "#6b7280", fontSize: 12 }}>{p.category}</span>
                      <span style={{ color: "#111827", fontWeight: 700 }}>{p.price || `₹${p.rawPrice}`}</span>
                      <span style={{ color: "#9ca3af", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.dealerCode || "N/A"}
                      </span>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        style={{
                          background: "#fee2e2",
                          border: "none",
                          color: "#dc2626",
                          borderRadius: 6,
                          padding: "5px 9px",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS */}
          {page === "orders" && (
            <div className="sec">
              <div className="sec-hd">
                <span className="sec-title">🧾 All Orders ({orders.length})</span>
              </div>
              {loading ? (
                <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Loading...</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No orders found</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {orders.map((o, i) => {
                    const isCancelled = o.status === "Cancelled";
                    const isDelivered = o.status === "Delivered";
                    return (
                      <div
                        key={o._id || i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 14px",
                          borderRadius: 10,
                          border: `1.5px solid ${isCancelled ? "#fecaca" : "#f3f4f6"}`,
                          background: isCancelled ? "#fff8f8" : "#f9fafb",
                        }}
                      >
                        <div style={{ fontSize: 22 }}>🛍️</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{o.item}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>
                            {o.userName} · {o.date} · {o.dealerCode || "N/A"}
                          </div>
                          {isCancelled && o.cancelReason && (
                            <div style={{ fontSize: 11, color: "#dc2626", marginTop: 3, fontWeight: 600 }}>
                              🚫 Reason: {o.cancelReason}
                            </div>
                          )}
                        </div>
                        <div style={{ fontWeight: 800, color: "#111827", marginRight: 8, whiteSpace: "nowrap" }}>
                          {o.amt}
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: 20,
                            whiteSpace: "nowrap",
                            background: isDelivered ? "#dcfce7" : isCancelled ? "#fee2e2" : "#fef3c7",
                            color: isDelivered ? "#16a34a" : isCancelled ? "#dc2626" : "#d97706",
                          }}
                        >
                          {o.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="sh-footer">
        <div className="sh-footer-bottom">
          <span className="sh-footer-copy">© 2026 ShopHub Admin Panel. All rights reserved.</span>
        </div>
      </footer>

      {toast && (
        <div className="toast" key={toastKey}>
          {toast}
        </div>
      )}
    </div>
  );
}
