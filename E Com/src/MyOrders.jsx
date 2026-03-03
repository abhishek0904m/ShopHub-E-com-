// ─────────────────────────────────────────
//  src/MyOrders.jsx
// ─────────────────────────────────────────
import { useState } from "react";
import { updateOrderStatus } from "./api";

export default function MyOrders({ orders, loading, onOrdersChange }) {
  const [cancelling, setCancelling] = useState(null);
  const [expanded, setExpanded]     = useState(null); // tracks which order is expanded

  const safeAmt = (amt) => {
    if (!amt && amt !== 0) return "₹0";
    const str = String(amt);
    if (str.includes("NaN")) return "₹0";
    if (str.startsWith("₹")) return str;
    const num = Number(str.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? "₹0" : `₹${num.toLocaleString("en-IN")}`;
  };

  const handleCancel = async (order) => {
    const orderId = order._id || order.id;
    if (!window.confirm(`Cancel order ${order.id}? This cannot be undone.`)) return;
    setCancelling(orderId);
    try {
      await updateOrderStatus(orderId, "Cancelled");
      onOrdersChange?.(prev => prev.filter(o => (o._id || o.id) !== orderId));
    } catch (e) {
      alert("Failed to cancel order. Please try again.");
      console.error("Cancel error:", e);
    }
    setCancelling(null);
  };

  const toggleExpand = (orderId) => setExpanded(prev => prev === orderId ? null : orderId);

  const statusStyle = (status) => {
    const base = {
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "4px 11px", borderRadius: 20, fontSize: 11.5, fontWeight: 700,
    };
    if (status === "Delivered") return { ...base, background: "#dcfce7", color: "#16a34a" };
    if (status === "Cancelled") return { ...base, background: "#fee2e2", color: "#dc2626" };
    return { ...base, background: "#fef9c3", color: "#b45309" };
  };

  const statusIcon = (s) =>
    s === "Delivered" ? "✅ " : s === "Cancelled" ? "❌ " : "🔄 ";

  if (loading) return (
    <div style={{ 
      textAlign: "center", 
      padding: "80px 20px",
      animation: "fadeIn 0.5s ease"
    }}>
      <div style={{ 
        fontSize: 48, 
        marginBottom: 16,
        animation: "pulse 1.5s ease-in-out infinite"
      }}>⏳</div>
      <div style={{ 
        fontSize: 15, 
        color: "#6b7280", 
        fontWeight: 600 
      }}>
        Loading your orders…
      </div>
    </div>
  );

  if (!orders || orders.length === 0) return (
    <div style={{ 
      textAlign: "center", 
      padding: "80px 20px",
      animation: "fadeInUp 0.5s ease"
    }}>
      <div style={{ 
        fontSize: 80, 
        marginBottom: 20,
        animation: "bounce 2s ease-in-out infinite"
      }}>📦</div>
      <div style={{ 
        fontSize: 18, 
        fontWeight: 700, 
        color: "#111827",
        marginBottom: 8
      }}>
        No orders yet!
      </div>
      <div style={{ 
        fontSize: 14, 
        marginTop: 8, 
        color: "#9ca3af" 
      }}>
        Place your first order to see it here.
      </div>
    </div>
  );

  return (
    <div style={{ marginBottom: 32, animation: "fadeInUp 0.5s ease" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span style={{ fontSize: 24 }}>📦</span>
          <span style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#111827",
            letterSpacing: -0.5,
          }}>
            My Orders ({orders.length})
          </span>
        </div>
      </div>

      <div style={{ 
        borderRadius: 12, 
        overflow: "hidden", 
        border: "1px solid #f3f4f6",
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
      }}>

        {/* ── Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "110px minmax(0,1fr) 120px 90px 130px 180px",
          background: "#f9fafb",
          padding: "10px 14px",
          fontSize: 10.5, fontWeight: 700, color: "#6b7280",
          letterSpacing: 0.4, textTransform: "uppercase",
          borderBottom: "1px solid #f3f4f6",
        }}>
          <span>Order ID</span>
          <span>Item</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {/* ── Rows */}
        {orders.map((o, idx) => {
          const orderId      = o._id || o.id;
          const isCancelling = cancelling === orderId;
          const canCancel    = o.status === "In Transit";
          const isExpanded   = expanded === orderId;
          const hasItems     = o.items && o.items.length > 0;

          return (
            <div key={orderId || idx}>
              {/* ── Main row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "110px minmax(0,1fr) 120px 90px 130px 180px",
                  padding: "13px 14px",
                  borderBottom: "1px solid #f9fafb",
                  alignItems: "center",
                  fontSize: 13,
                  background: o.status === "Cancelled" ? "#fff8f8" : isExpanded ? "#fffbf0" : "transparent",
                  transition: "background .12s",
                  cursor: hasItems ? "pointer" : "default",
                }}
                onClick={() => hasItems && toggleExpand(orderId)}
                onMouseEnter={e => { if (o.status !== "Cancelled" && !isExpanded) e.currentTarget.style.background = "#fffbf0"; }}
                onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = o.status === "Cancelled" ? "#fff8f8" : "transparent"; }}
              >
                {/* Order ID */}
                <span style={{ color: "#6366f1", fontWeight: 700, fontSize: 11.5 }}>
                  {o.id} {hasItems && <span style={{ fontSize: 10, color: "#9ca3af" }}>{isExpanded ? "▲" : "▼"}</span>}
                </span>

                {/* Item summary */}
                <span style={{ color: "#111827", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {o.icon} {o.item}
                </span>

                {/* Date */}
                <span style={{ color: "#9ca3af", fontSize: 12 }}>{o.date}</span>

                {/* Amount */}
                <span style={{ color: "#111827", fontWeight: 700 }}>{safeAmt(o.amt)}</span>

                {/* Status badge */}
                <span style={statusStyle(o.status)}>
                  {statusIcon(o.status)}{o.status || "In Transit"}
                </span>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, alignItems: "center" }} onClick={e => e.stopPropagation()}>
                  {o.status !== "Cancelled" && (
                    <button
                      style={{
                        background: "transparent", border: "1.5px solid #e5e7eb",
                        color: "#374151", borderRadius: 6, padding: "5px 11px",
                        fontSize: 11, fontWeight: 600, cursor: "pointer",
                        fontFamily: "Poppins,sans-serif", transition: "all .15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#111827"; e.currentTarget.style.color = "#fbbf24"; e.currentTarget.style.borderColor = "#111827"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                    >
                      📍 Track
                    </button>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => handleCancel(o)}
                      disabled={isCancelling}
                      style={{
                        background: isCancelling ? "#f3f4f6" : "#fff",
                        border: "1.5px solid #fca5a5",
                        color: isCancelling ? "#9ca3af" : "#dc2626",
                        borderRadius: 6, padding: "5px 11px",
                        fontSize: 11, fontWeight: 600,
                        cursor: isCancelling ? "not-allowed" : "pointer",
                        fontFamily: "Poppins,sans-serif", transition: "all .15s",
                      }}
                      onMouseEnter={e => { if (!isCancelling) e.currentTarget.style.background = "#fee2e2"; }}
                      onMouseLeave={e => { if (!isCancelling) e.currentTarget.style.background = "#fff"; }}
                    >
                      {isCancelling ? "⏳ Cancelling…" : "✕ Cancel"}
                    </button>
                  )}
                  {o.status === "Cancelled" && (
                    <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 700 }}>Order Cancelled</span>
                  )}
                  {o.status === "Delivered" && (
                    <button style={{
                      background: "#f0fdf4", border: "1.5px solid #bbf7d0",
                      color: "#16a34a", borderRadius: 6, padding: "5px 11px",
                      fontSize: 11, fontWeight: 600, cursor: "pointer",
                      fontFamily: "Poppins,sans-serif",
                    }}>
                      🔁 Reorder
                    </button>
                  )}
                </div>
              </div>

              {/* ── Expanded item breakdown */}
              {isExpanded && hasItems && (
                <div style={{
                  background: "#fafafa",
                  borderBottom: "1px solid #f3f4f6",
                  padding: "14px 20px 18px",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Order Items
                  </div>

                  {/* Items list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {o.items.map((item, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        background: "#fff", borderRadius: 8,
                        border: "1px solid #f3f4f6", padding: "10px 14px",
                      }}>
                        {/* Image */}
                        <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 6, overflow: "hidden", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {item.img && (item.img.startsWith("http") || item.img.startsWith("data:"))
                            ? <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <span style={{ fontSize: 22 }}>📦</span>
                          }
                        </div>

                        {/* Name + off */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                          {item.off && <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 600, marginTop: 2 }}>{item.off}</div>}
                        </div>

                        {/* Price × qty */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>₹{item.rawPrice?.toLocaleString("en-IN")} × {item.qty}</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#111827", marginTop: 2 }}>₹{(item.rawPrice * item.qty)?.toLocaleString("en-IN")}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address if saved */}
                  {o.shipping && o.shipping.fullName && (
                    <div style={{ marginTop: 14, background: "#fff", borderRadius: 8, border: "1px solid #f3f4f6", padding: "10px 14px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>📍 Delivered To</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{o.shipping.fullName} · +91 {o.shipping.mobile}</div>
                      <div style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>{o.shipping.address}</div>
                      <div style={{ fontSize: 12, color: "#374151" }}>{o.shipping.city} {o.shipping.state} – {o.shipping.pincode}</div>
                    </div>
                  )}

                  {/* Total */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, paddingTop: 10, borderTop: "1px dashed #e5e7eb" }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#111827" }}>
                      Total: {safeAmt(o.amt)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}