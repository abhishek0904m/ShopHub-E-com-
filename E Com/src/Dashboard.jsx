// src/Dashboard.jsx
import { useState, useEffect } from "react";
import { RAZORPAY_KEY_ID, CATS, NAV_ITEMS, SHARED_CSS } from "./shared";
import { API_BASE_URL } from "./config";
import { fetchOrders, createOrder, fetchProducts, createProduct, deleteProduct, updateOrderStatus, fetchCart, saveCart, clearCartDB } from "./api";
import Home       from "./Home";
import MyOrders   from "./MyOrders";
import Wishlist   from "./Wishlist";
import Deals      from "./Deals";
import AddProduct from "./AddProduct";
import Profile    from "./Profile";
import ProductDetailModal from "./ProductDetailModal";
import Chatbot    from "./Chatbot";

// ── Inline MyQueries component ──
function MyQueries({ userEmail }) {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;
    fetch(`${API_BASE_URL}/api/contact/user/${encodeURIComponent(userEmail)}`)
      .then(r => r.json())
      .then(data => { setQueries(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userEmail]);

  const statusColor = (s) => s === "Resolved" ? { bg: "#dcfce7", color: "#16a34a" } : s === "In Progress" ? { bg: "#dbeafe", color: "#2563eb" } : { bg: "#fef9c3", color: "#b45309" };

  if (loading) return <div className="sec" style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 32 }}>⏳</div></div>;

  return (
    <div className="sec">
      <div className="sec-hd"><span className="sec-title">🎧 My Support Queries ({queries.length})</span></div>
      {queries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#6b7280" }}>No queries yet</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>Contact support using the More menu in the topbar.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {queries.map((q, i) => {
            const sc = statusColor(q.status);
            return (
              <div key={q._id || i} style={{ background: "#f9fafb", borderRadius: 10, border: "1.5px solid #f3f4f6", padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", flex: 1, marginRight: 12 }}>{q.message}</div>
                  <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0 }}>{q.status}</span>
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>
                  Submitted on {new Date(q.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  {q.phone && ` · 📞 ${q.phone}`}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ onNavigate, userName, userEmail }) {
  const me = userName || "Shopper";
  const [page, setPage]                           = useState("home");
  const [search, setSearch]                       = useState(""); // search state
  const [cart, setCart]                           = useState([]);
  const [cartOpen, setCartOpen]                   = useState(false);
  const [toast, setToast]                         = useState(null);
  const [toastKey, setToastKey]                   = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [shipping, setShipping]           = useState({ fullName: me, mobile: "", pincode: "", city: "", state: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [invoiceData, setInvoiceData]     = useState(null);
  const [orders, setOrders]               = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [products, setProducts]           = useState([]);
  const [wishlist, setWishlist]           = useState([]); // wishlist state
  const [cancelNotifs, setCancelNotifs]   = useState([]);
  const [moreOpen, setMoreOpen]           = useState(false);
  const [contactOpen, setContactOpen]     = useState(false);
  const [contactForm, setContactForm]     = useState({ name: me, email: userEmail || "", phone: "", message: "" });
  const [contactSent, setContactSent]     = useState(false);
  const [queryNotifs, setQueryNotifs]     = useState([]); // status updates from dealer
  const [selectedProduct, setSelectedProduct] = useState(null); // for product detail modal

  // ── (c) load cart from DB on login ──
  useEffect(() => {
    if (!userEmail) return;
    setOrders([]); setCart([]); setCancelNotifs([]); setQueryNotifs([]); setPage("home");
    loadOrders(userEmail); loadProducts(); loadCart(userEmail); loadQueryNotifs(userEmail);
  }, [userEmail]);

  const loadOrders = async (email) => {
    setOrdersLoading(true);
    try {
      const data = await fetchOrders(email);
      const dealerCancelled = data.filter(o => o.status === "Cancelled" && o.cancelledBy === "dealer" && o.notified === false);
      if (dealerCancelled.length > 0) setCancelNotifs(dealerCancelled);
      setOrders(data.filter(o => o.status !== "Cancelled"));
    } catch (e) { console.warn("Could not load orders:", e.message); setOrders([]); }
    setOrdersLoading(false);
  };

  // ── Load query status updates from dealer ──
  const loadQueryNotifs = async (email) => {
    if (!email) return;
    try {
      const res  = await fetch(`${API_BASE_URL}/api/contact/user/${encodeURIComponent(email)}`);
      const data = await res.json();
      const updated = (Array.isArray(data) ? data : []).filter(q => q.userNotified === false || q.userNotified === undefined && q.status !== "Open");
      if (updated.length > 0) setQueryNotifs(updated);
    } catch (e) { console.warn("Could not load query notifs:", e.message); }
  };

  const dismissQueryNotif = async (q) => {
    try { await fetch(`${API_BASE_URL}/api/contact/${q._id}/userNotified`, { method: "PATCH", headers: { "Content-Type": "application/json" } }); }
    catch (e) { console.warn("Could not mark userNotified:", e.message); }
    setQueryNotifs(prev => prev.filter(m => m._id !== q._id));
  };

  const dismissAllQueryNotifs = async () => { await Promise.all(queryNotifs.map(dismissQueryNotif)); setQueryNotifs([]); };

  const dismissCancelNotif = async (order) => {
    const orderId = order._id || order.id;
    try { await fetch(`${API_BASE_URL}/api/orders/${orderId}/notified`, { method: "PATCH", headers: { "Content-Type": "application/json" } }); }
    catch (e) { console.warn("Could not mark notified:", e.message); }
    setCancelNotifs(prev => prev.filter(o => (o._id || o.id) !== orderId));
  };

  const dismissAllNotifs = async () => { await Promise.all(cancelNotifs.map(dismissCancelNotif)); setCancelNotifs([]); };

  const loadProducts = async () => {
    try { setProducts(await fetchProducts()); }
    catch (e) { console.warn("Could not load products:", e.message); }
  };

  // ── (d) load cart from MongoDB ──
  const loadCart = async (email) => {
    try {
      const items = await fetchCart(email);
      setCart(items.map(i => ({ ...i, _id: i.productId, rawPrice: i.rawPrice })));
    } catch (e) { console.warn("Could not load cart:", e.message); }
  };

  // ── (h) sign out clears cart in DB too ──
  const handleSignOut = () => {
    if (userEmail) clearCartDB(userEmail).catch(() => {});
    setCart([]); setOrders([]); setInvoiceData(null); setCancelNotifs([]); setPage("home");
    onNavigate?.("login");
  };

  const getKey     = (p) => p._id || p.id;
  const parsePrice = (price) => { if (typeof price === "number") return price; return Number(String(price).replace(/[^0-9.]/g, "")) || 0; };

  const showToast = (msg) => { setToast(msg); setToastKey(k => k + 1); setTimeout(() => setToast(null), 2000); };

  // ── (b) syncCart helper — saves entire cart to MongoDB ──
  const syncCart = async (newCart) => {
    if (!userEmail) return;
    try { await saveCart(userEmail, newCart.map(i => ({ productId: String(getKey(i)), name: i.name, price: i.price, rawPrice: i.rawPrice, img: i.img || "", off: i.off || "", qty: i.qty }))); }
    catch (e) { console.warn("Cart sync failed:", e.message); }
  };

  // ── (e) addToCart syncs to DB ──
  const addToCart = (product) => {
    const key = getKey(product); const rawPrice = parsePrice(product.rawPrice ?? product.price);
    setCart(prev => {
      const existing = prev.find(i => getKey(i) === key);
      const newCart = existing
        ? prev.map(i => getKey(i) === key ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, rawPrice, qty: 1 }];
      syncCart(newCart);
      return newCart;
    });
    showToast(`🛒 ${product.name} added to cart!`);
  };

  // ── (f) removeFromCart syncs to DB ──
  const removeFromCart = (key) => setCart(prev => {
    const newCart = prev.filter(i => getKey(i) !== key);
    syncCart(newCart);
    return newCart;
  });

  // ── (g) changeQty syncs to DB ──
  const changeQty = (key, delta) => setCart(prev => {
    const newCart = prev.map(i => getKey(i) === key ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0);
    syncCart(newCart);
    return newCart;
  });

  const cartTotal = cart.reduce((s, i) => s + i.rawPrice * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const isInCart  = (key) => cart.some(i => getKey(i) === key);

  // ── WISHLIST FUNCTIONS ──
  const toggleWishlist = (product) => {
    const key = getKey(product);
    setWishlist(prev => {
      const isInWishlist = prev.some(i => getKey(i) === key);
      if (isInWishlist) {
        showToast(`💔 ${product.name} removed from wishlist`);
        return prev.filter(i => getKey(i) !== key);
      } else {
        showToast(`❤️ ${product.name} added to wishlist!`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (key) => wishlist.some(i => getKey(i) === key);

  const shippingValid = shipping.fullName.trim().length >= 2 && /^\d{10}$/.test(shipping.mobile) && /^\d{6}$/.test(shipping.pincode) && shipping.address.trim().length >= 10;

  const openCheckout = () => { if (!cart.length) { showToast("Cart is empty"); return; } setCartOpen(false); setPage("checkout"); };
  const goPayment = () => { if (!shippingValid) { showToast("Fill all shipping fields correctly."); return; } setPage("payment"); };

  const saveOrder = async (paymentId, method) => {
    const orderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderDate = new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
    const orderPayload = {
      id: orderId,
      item: cart.length === 1 ? cart[0].name : `${cart[0].name} + ${cart.length - 1} more`,
      date: orderDate, status: "In Transit",
      amt: `₹${cartTotal.toLocaleString("en-IN")}`,
      icon: "🛍️", paymentId: paymentId || "", userName: userEmail,
      // ✅ Save full item breakdown with dealer info
      items: cart.map(i => ({
        productId: String(getKey(i)),
        name: i.name,
        price: i.price,
        rawPrice: i.rawPrice,
        img: i.img || "",
        off: i.off || "",
        qty: i.qty,
        dealerId: i.dealerId || null,      // ✅ Include dealer ID
        dealerCode: i.dealerCode || null,  // ✅ Include dealer code
      })),
      // ✅ Save shipping address
      shipping: { ...shipping },
    };
    try { const saved = await createOrder(orderPayload); setOrders(prev => [saved, ...prev]); }
    catch { setOrders(prev => [orderPayload, ...prev]); }
    setInvoiceData({ orderId, orderDate, paymentId: paymentId || "COD", paymentMethod: method, items: [...cart], total: cartTotal, shipping: { ...shipping } });
    // ── clear cart in DB after order placed ──
    if (userEmail) clearCartDB(userEmail).catch(() => {});
    setCart([]); setPage("success");
  };

  const placeOrderCOD = () => saveOrder("COD", "Cash on Delivery");

  const handleRazorpay = () => {
    setPaymentProcessing(true);
    if (!window.Razorpay) { setPaymentProcessing(false); showToast("⚠️ Payment gateway not loaded. Refresh the page."); return; }
    const options = {
      key: RAZORPAY_KEY_ID, amount: cartTotal * 100, currency: "INR", name: "ShopHub",
      description: cart.length === 1 ? cart[0].name : `${cart.length} items`,
      handler: (response) => { setPaymentProcessing(false); saveOrder(response.razorpay_payment_id, "Online Payment (Razorpay)"); },
      prefill: { name: shipping.fullName, contact: shipping.mobile, email: userEmail },
      notes: { address: shipping.address, city: shipping.city, pincode: shipping.pincode },
      theme: { color: "#111827" },
      modal: { ondismiss: () => { setPaymentProcessing(false); showToast("Payment cancelled."); } },
    };
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (r) => { setPaymentProcessing(false); showToast(`❌ Payment failed: ${r.error.description}`); });
    rzp.open();
  };

  const generateInvoice = () => {
    if (!window.jspdf || !invoiceData) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
    const W = 210, margin = 16;
    doc.setFillColor(30,35,48); doc.rect(0,0,W,42,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(22); doc.setTextColor(251,191,36); doc.text("ShopHub", margin, 18);
    doc.setFontSize(9); doc.setTextColor(156,163,175); doc.text("Your one-stop online shopping destination", margin, 25);
    doc.setFontSize(14); doc.setTextColor(251,191,36); doc.text("TAX INVOICE", W-margin, 18, {align:"right"});
    doc.setFontSize(8); doc.setTextColor(156,163,175);
    doc.text(`Order: ${invoiceData.orderId}`, W-margin, 25, {align:"right"});
    doc.text(`Date: ${invoiceData.orderDate}`, W-margin, 30, {align:"right"});
    doc.setDrawColor(251,191,36); doc.setLineWidth(0.5); doc.line(margin,45,W-margin,45);
    let y=52;
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(107,114,128); doc.text("BILL TO / SHIP TO", margin, y);
    y+=6; doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(17,24,39); doc.text(invoiceData.shipping.fullName||"Customer", margin, y);
    y+=5; doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(55,65,81); doc.text(`Mobile: +91 ${invoiceData.shipping.mobile}`, margin, y); y+=5;
    const addrLines = doc.splitTextToSize(invoiceData.shipping.address||"", 90);
    addrLines.forEach(l => { doc.text(l, margin, y); y+=4.5; });
    doc.text(`${invoiceData.shipping.city} ${invoiceData.shipping.state} - ${invoiceData.shipping.pincode}`, margin, y);
    let py=52;
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(107,114,128); doc.text("PAYMENT INFO", W-margin, py, {align:"right"});
    py+=6; doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(55,65,81);
    doc.text(`Method: ${invoiceData.paymentMethod}`, W-margin, py, {align:"right"}); py+=5;
    if (invoiceData.paymentId !== "COD") { doc.text("Payment ID:", W-margin, py, {align:"right"}); py+=5; doc.setFontSize(8); doc.text(invoiceData.paymentId, W-margin, py, {align:"right"}); py+=5; }
    doc.setFontSize(9); doc.setFont("helvetica","bold"); doc.setTextColor(22,163,74); doc.text("Status: PAID ✓", W-margin, py, {align:"right"});
    y=Math.max(y,py)+12;
    doc.setFillColor(17,24,39); doc.rect(margin,y-5,W-margin*2,9,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(251,191,36);
    doc.text("#",margin+3,y); doc.text("Item",margin+12,y); doc.text("Price",margin+110,y); doc.text("Qty",margin+130,y); doc.text("Total",W-margin-2,y,{align:"right"}); y+=5;
    invoiceData.items.forEach((item,idx) => {
      if(idx%2===0){doc.setFillColor(249,250,251);doc.rect(margin,y-4,W-margin*2,8,"F");}
      doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(99,102,241); doc.text(`${idx+1}`,margin+3,y);
      doc.setFont("helvetica","normal"); doc.setTextColor(17,24,39);
      doc.text(doc.splitTextToSize(item.name,85)[0],margin+12,y);
      doc.text(`Rs.${item.rawPrice.toLocaleString("en-IN")}`,margin+110,y);
      doc.text(`${item.qty}`,margin+132,y);
      doc.setFont("helvetica","bold"); doc.text(`Rs.${(item.rawPrice*item.qty).toLocaleString("en-IN")}`,W-margin-2,y,{align:"right"});
      doc.setDrawColor(243,244,246); doc.line(margin,y+4,W-margin,y+4); y+=10;
    });
    y+=4; const boxX=W/2, boxW=W/2-margin;
    doc.setFillColor(249,250,251); doc.roundedRect(boxX,y,boxW,32,2,2,"F");
    doc.setDrawColor(229,231,235); doc.roundedRect(boxX,y,boxW,32,2,2,"S");
    y+=7; doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(107,114,128);
    doc.text("Subtotal:",boxX+4,y); doc.setTextColor(17,24,39); doc.text(`Rs.${invoiceData.total.toLocaleString("en-IN")}`,W-margin-2,y,{align:"right"});
    y+=7; doc.setTextColor(107,114,128); doc.text("Delivery:",boxX+4,y);
    doc.setFont("helvetica","bold"); doc.setTextColor(22,163,74); doc.text("FREE",W-margin-2,y,{align:"right"});
    y+=2; doc.setDrawColor(229,231,235); doc.line(boxX+4,y,W-margin-2,y); y+=6;
    doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(17,24,39);
    doc.text("TOTAL:",boxX+4,y); doc.text(`Rs.${invoiceData.total.toLocaleString("en-IN")}`,W-margin-2,y,{align:"right"});
    const fy=275; doc.setFillColor(30,35,48); doc.rect(0,fy,W,22,"F");
    doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(156,163,175);
    doc.text("Thank you for shopping with ShopHub!",W/2,fy+7,{align:"center"});
    doc.text("support@shophub.in  |  www.shophub.in",W/2,fy+13,{align:"center"});
    doc.setFontSize(7); doc.setTextColor(107,114,128); doc.text("This is a computer-generated invoice.",W/2,fy+19,{align:"center"});
    doc.save(`ShopHub_Invoice_${invoiceData.orderId.replace("#","")}.pdf`);
  };

  const handleAddProduct = async (formData) => { const saved = await createProduct(formData); setProducts(prev => [...prev, saved]); };
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id); setProducts(prev => prev.filter(p => (p._id||p.id) !== id)); showToast("🗑 Product deleted");
  };

  const StepBar = () => {
    const step = page==="checkout"?1:page==="payment"?2:page==="success"?3:0;
    if (!step) return null;
    return (
      <div className="flow-steps">
        {[["1. Shipping",1],["2. Payment",2],["3. Placed",3]].map(([label,n]) => (
          <div key={n} className={`step ${step===n?"active":step>n?"done":""}`}>
            <span>{label}</span><span className="dot">{step>n?"✓":n}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", background:"#e8ecf1", margin:0, padding:0 }}>
      <style>{SHARED_CSS}{`
        .notif-overlay { position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px; }
        .notif-modal { background:#fff;border-radius:12px;width:100%;max-width:480px;box-shadow:0 24px 64px rgba(0,0,0,.25);overflow:hidden; }
        .notif-header { background:linear-gradient(135deg,#dc2626,#b91c1c);padding:22px 24px 18px;color:#fff; }
        .notif-body { padding:20px 24px;max-height:340px;overflow-y:auto; }
        .notif-card { background:#fff8f8;border:1.5px solid #fecaca;border-radius:8px;padding:14px 16px;margin-bottom:12px; }
        .notif-footer { padding:16px 24px;border-top:1px solid #f3f4f6; }
      `}</style>

      {/* ── QUERY STATUS UPDATE POPUP */}
      {queryNotifs.length > 0 && cancelNotifs.length === 0 && (
        <div className="notif-overlay">
          <div className="notif-modal">
            <div className="notif-header" style={{ background: "linear-gradient(135deg,#1d4ed8,#1e40af)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎧</div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>Support Query Update</div>
              <div style={{ fontSize: 13, opacity: .85, marginTop: 4 }}>
                {queryNotifs.length === 1 ? "Your support query has been updated." : `${queryNotifs.length} of your support queries have been updated.`}
              </div>
            </div>
            <div className="notif-body">
              {queryNotifs.map((q, i) => {
                const sc = q.status === "Resolved" ? { bg: "#dcfce7", color: "#16a34a" } : q.status === "In Progress" ? { bg: "#dbeafe", color: "#2563eb" } : { bg: "#fef9c3", color: "#b45309" };
                return (
                  <div key={q._id || i} className="notif-card" style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5, flex: 1, marginRight: 10 }}>{q.message}</div>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 12, whiteSpace: "nowrap", flexShrink: 0 }}>{q.status}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                      Status updated · {new Date(q.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                  </div>
                );
              })}
              <div style={{ fontSize: 12, color: "#6b7280", textAlign: "center", marginTop: 4, lineHeight: 1.6 }}>
                Go to "My Queries" in the sidebar to view your full query history.
              </div>
            </div>
            <div className="notif-footer">
              <button onClick={dismissAllQueryNotifs} style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "#1d4ed8", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}>
                Got it, dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DEALER CANCELLATION POPUP */}
      {cancelNotifs.length > 0 && (
        <div className="notif-overlay">
          <div className="notif-modal">
            <div className="notif-header">
              <div style={{fontSize:32,marginBottom:8}}>🚫</div>
              <div style={{fontSize:18,fontWeight:900}}>Order Cancellation Notice</div>
              <div style={{fontSize:13,opacity:.85,marginTop:4}}>
                {cancelNotifs.length===1 ? "One of your orders has been cancelled by the seller." : `${cancelNotifs.length} of your orders have been cancelled by the seller.`}
              </div>
            </div>
            <div className="notif-body">
              {cancelNotifs.map((o,i) => (
                <div key={o._id||o.id||i} className="notif-card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:800,color:"#111827"}}>{o.item}</div>
                      <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{o.id} · {o.date} · {o.amt}</div>
                    </div>
                    <span style={{fontSize:10,fontWeight:700,background:"#fee2e2",color:"#dc2626",padding:"2px 8px",borderRadius:12,whiteSpace:"nowrap",marginLeft:8,flexShrink:0}}>Cancelled</span>
                  </div>
                  {o.cancelReason && (
                    <div style={{background:"#fef2f2",borderRadius:6,padding:"8px 12px",marginTop:4}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#991b1b",marginBottom:2}}>📋 Reason from seller:</div>
                      <div style={{fontSize:12,color:"#7f1d1d",lineHeight:1.5}}>{o.cancelReason}</div>
                    </div>
                  )}
                </div>
              ))}
              <div style={{fontSize:12,color:"#6b7280",textAlign:"center",marginTop:4,lineHeight:1.6}}>If you paid online, your refund will be processed within 5–7 business days.</div>
            </div>
            <div className="notif-footer">
              <button onClick={dismissAllNotifs} style={{width:"100%",padding:"12px",borderRadius:8,border:"none",background:"#111827",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>Got it, dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOPBAR */}
      <nav className="tb">
        <div className="tb-logo" onClick={() => setPage("home")}>
          <div className="tb-logo-box">🛍️</div>
          <div>
            <div className="tb-logo-text">Shop<span>Hub</span></div>
            <div className="tb-logo-sub">Explore Plus ✦</div>
          </div>
        </div>
        <div className="tb-search">
          <input 
            type="text" 
            placeholder="Search for products, brands and more…" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="tb-search-btn">🔍</button>
        </div>
        <div className="tb-actions">
          <button className="tb-btn login-btn" onClick={() => setPage("profile")}>👤 {me}</button>
          <div className="tb-divider" />
          <div style={{ position: "relative" }}>
            <button className="tb-btn" onClick={() => setMoreOpen(p => !p)}>More ▾</button>
            {moreOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setMoreOpen(false)} />
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,.18)", minWidth: 210, zIndex: 100, overflow: "hidden", border: "1px solid #f3f4f6" }}>
                  <div style={{ padding: "8px 0" }}>
                    <div
                      onClick={() => { setMoreOpen(false); setContactOpen(true); setContactSent(false); setContactForm({ name: me, email: userEmail || "", phone: "", message: "" }); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#111827", transition: "background .12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: 18 }}>🎧</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>24×7 Customer Care</div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>We're here to help anytime</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="tb-divider" />
          <button className="tb-btn cart" onClick={() => setCartOpen(true)}>
            🛒 Cart {cartCount > 0 && <span className="tb-cart-badge">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* catbar hidden via CSS */}
      <div className="catbar">
        {CATS.map((c, i) => (<div className="cat-item" key={i}><span className="cat-icon">{c.icon}</span>{c.label}</div>))}
      </div>

      {/* ── BODY */}
      <div className="lay">
        <aside className="sb">
          <div className="sb-card">
            <div className="sb-head">
              <div className="sb-av">{me[0]?.toUpperCase()}</div>
              <div>
                <div className="sb-uname">{me}</div>
                <div className="sb-uemail">{userEmail || "member@shophub.in"}</div>
              </div>
            </div>
            {NAV_ITEMS.map(n => (
              <button key={n.id} className={`sb-link ${page===n.id?"active":""}`} onClick={() => setPage(n.id)}>
                <span className="sb-icon">{n.icon}</span>{n.label}
              </button>
            ))}
            <button className={`sb-link ${page==="queries"?"active":""}`} onClick={() => setPage("queries")}>
              <span className="sb-icon">🎧</span>My Queries
            </button>
            <button className="sb-logout" onClick={handleSignOut}>🚪 Sign Out</button>
          </div>
        </aside>

        <main className="main">
          {["checkout","payment","success"].includes(page) && (
            <div className="flow">
              <StepBar />
              {page==="checkout" && (
                <div className="cgrid">
                  <div className="sec">
                    <div className="sec-hd">
                      <span className="sec-title">📍 Shipping Address</span>
                      <button className="sec-link" onClick={() => setPage("home")}>Back to shop</button>
                    </div>
                    <div className="cform">
                      {[["Full Name","text","fullName","Full Name"],["Mobile","tel","mobile","10-digit mobile"],["Pincode","text","pincode","6-digit pincode"],["City","text","city","City"],["State","text","state","State"]].map(([label,type,key,ph]) => (
                        <div className="fg" key={key}>
                          <label>{label}</label>
                          <input type={type} value={shipping[key]} placeholder={ph} onChange={e => { let v=e.target.value; if(key==="mobile") v=v.replace(/\D/g,"").slice(0,10); if(key==="pincode") v=v.replace(/\D/g,"").slice(0,6); setShipping(s=>({...s,[key]:v})); }} />
                        </div>
                      ))}
                      <div className="fg full">
                        <label>Full Address</label>
                        <textarea value={shipping.address} placeholder="House no, Street, Area, Landmark…" onChange={e => setShipping(s => ({...s,address:e.target.value}))} />
                      </div>
                      <div className="fg full" style={{display:"flex",gap:10}}>
                        <button className="ghost-btn" onClick={() => setPage("home")}>← Continue shopping</button>
                        <button className="primary-btn" onClick={goPayment} disabled={!shippingValid}>Continue to Payment →</button>
                      </div>
                    </div>
                  </div>
                  <OrderSummary cart={cart} cartCount={cartCount} cartTotal={cartTotal} />
                </div>
              )}
              {page==="payment" && (
                <div className="cgrid">
                  <div className="sec">
                    <div className="sec-hd">
                      <span className="sec-title">💳 Payment</span>
                      <button className="sec-link" onClick={() => setPage("checkout")}>Edit address</button>
                    </div>
                    <div style={{background:"#f9fafb",borderRadius:4,padding:"12px 14px",marginBottom:18}}>
                      <div style={{fontSize:11,color:"#6b7280",fontWeight:700,marginBottom:4}}>📍 Deliver to</div>
                      <div style={{fontSize:13,fontWeight:800,color:"#111827"}}>{shipping.fullName} · +91 {shipping.mobile}</div>
                      <div style={{fontSize:12.5,color:"#374151",marginTop:2}}>{shipping.address}</div>
                      <div style={{fontSize:12.5,color:"#374151"}}>{shipping.city} {shipping.state} – {shipping.pincode}</div>
                    </div>
                    <div style={{fontSize:13,fontWeight:800,color:"#111827",marginBottom:4}}>Choose Payment Method</div>
                    <div className="pay-methods">
                      <div className={`pay-method-card ${paymentMethod==="COD"?"selected":""}`} onClick={() => setPaymentMethod("COD")}>
                        <span className="pay-method-icon">🚚</span><span className="pay-method-label">Cash on Delivery</span><span className="pay-method-sub">Pay when your order arrives</span>
                      </div>
                      <div className={`pay-method-card ${paymentMethod==="ONLINE"?"selected":""}`} onClick={() => setPaymentMethod("ONLINE")}>
                        <span className="pay-method-icon">⚡</span><span className="pay-method-label">Pay Online</span><span className="pay-method-sub">UPI, Cards, Net Banking</span>
                        <span className="rzp-badge">Secured by <span>Razorpay</span></span>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:10,marginTop:6}}>
                      <button className="ghost-btn" onClick={() => setPage("checkout")}>← Back</button>
                      {paymentMethod==="COD"
                        ? <button className="primary-btn" onClick={placeOrderCOD}>Place Order (COD) →</button>
                        : <button className="rzp-btn" onClick={handleRazorpay} disabled={paymentProcessing}>{paymentProcessing?<><span className="spinner"/>Processing…</>:<>🔒 Pay ₹{cartTotal.toLocaleString("en-IN")} via Razorpay</>}</button>
                      }
                    </div>
                    {paymentMethod==="ONLINE" && <div style={{marginTop:12,fontSize:11,color:"#9ca3af"}}>🔐 256-bit SSL encrypted & secure</div>}
                  </div>
                  <OrderSummary cart={cart} cartCount={cartCount} cartTotal={cartTotal} showItems />
                </div>
              )}
              {page==="success" && invoiceData && (
                <div className="sec" style={{textAlign:"center",padding:"38px 18px"}}>
                  <div style={{fontSize:56,marginBottom:8}}>🎉</div>
                  <div style={{fontSize:22,fontWeight:900,color:"#111827"}}>Order Placed Successfully!</div>
                  <div style={{marginTop:6,fontSize:13,color:"#6b7280",fontWeight:600}}>Payment via: <span style={{color:"#111827",fontWeight:800}}>{invoiceData.paymentMethod}</span></div>
                  {invoiceData.paymentId!=="COD" && <div style={{marginTop:4,fontSize:11,color:"#9ca3af"}}>Payment ID: <span style={{color:"#6366f1",fontWeight:700}}>{invoiceData.paymentId}</span></div>}
                  <div style={{margin:"20px auto",maxWidth:420,background:"#f9fafb",borderRadius:8,padding:"16px 20px",border:"1.5px dashed #e5e7eb",textAlign:"left"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                      <div><div style={{fontSize:12,color:"#6b7280",fontWeight:700}}>ORDER ID</div><div style={{fontSize:14,fontWeight:900,color:"#6366f1"}}>{invoiceData.orderId}</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:12,color:"#6b7280",fontWeight:700}}>DATE</div><div style={{fontSize:13,fontWeight:700,color:"#111827"}}>{invoiceData.orderDate}</div></div>
                    </div>
                    <div style={{borderTop:"1px solid #e5e7eb",paddingTop:10,marginBottom:8}}>
                      {invoiceData.items.map((item,i) => (
                        <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:5}}>
                          <span style={{color:"#374151"}}>{item.name} × {item.qty}</span>
                          <span style={{fontWeight:700,color:"#111827"}}>₹{(item.rawPrice*item.qty).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{borderTop:"1px solid #e5e7eb",paddingTop:8,display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:14,fontWeight:900,color:"#111827"}}>Total</span>
                      <span style={{fontSize:14,fontWeight:900,color:"#111827"}}>₹{invoiceData.total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:4,flexWrap:"wrap"}}>
                    <button onClick={generateInvoice} style={{background:"linear-gradient(135deg,#6366f1,#4f46e5)",color:"#fff",border:"none",borderRadius:8,padding:"12px 22px",fontFamily:"Poppins,sans-serif",fontSize:13,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>📄 Download Invoice (PDF)</button>
                    <button className="primary-btn" onClick={() => setPage("orders")}>View My Orders</button>
                    <button className="ghost-btn" onClick={() => setPage("home")}>Continue Shopping</button>
                  </div>
                  <div style={{marginTop:14,fontSize:11,color:"#9ca3af"}}>📧 Invoice sent to {userEmail}</div>
                </div>
              )}
            </div>
          )}

          {page==="home"       && !selectedProduct && <Home       products={products} orders={orders} addToCart={addToCart} removeFromCart={removeFromCart} isInCart={isInCart} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} setPage={setPage} onProductClick={setSelectedProduct} search={search} />}
          {page==="orders"     && !selectedProduct && <MyOrders   key={userEmail} orders={orders} loading={ordersLoading} onOrdersChange={setOrders} />}
          {/* ✅ showDelete REMOVED — users cannot delete products from the database */}
          {page==="wishlist"   && !selectedProduct && <Wishlist   products={wishlist} addToCart={addToCart} removeFromCart={removeFromCart} isInCart={isInCart} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} onProductClick={setSelectedProduct} />}
          {page==="deals"      && !selectedProduct && <Deals      products={products} addToCart={addToCart} removeFromCart={removeFromCart} isInCart={isInCart} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} onProductClick={setSelectedProduct} />}
          {page==="addproduct" && !selectedProduct && <AddProduct onAdd={handleAddProduct} products={products} onDelete={handleDeleteProduct} />}
          {page==="profile"    && !selectedProduct && <Profile    me={me} userEmail={userEmail} onNavigate={onNavigate} />}
          {page==="queries"    && !selectedProduct && <MyQueries  userEmail={userEmail} />}
          
          {/* ── PRODUCT DETAIL VIEW (Inline, not modal) */}
          {selectedProduct && (
            <ProductDetailModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              addToCart={addToCart}
              isInCart={isInCart}
            />
          )}
        </main>
      </div>

      {/* ── FOOTER */}
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
            <div style={{marginTop:14}}>
              <h4 style={{marginBottom:10}}>Social</h4>
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
              <p style={{marginTop:8}}>CIN: U51109KA2012PTC123456</p>
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
            {["VISA","MC","UPI","COD","EMI","NetBanking"].map(p => (<span key={p} className="pay-chip">{p}</span>))}
          </div>
        </div>
      </footer>

      {/* ── CART DRAWER */}
      {cartOpen && (
        <>
          <div className="cart-overlay" onClick={() => setCartOpen(false)} />
          <div className="cart-drawer">
            <div className="cart-header">
              <div className="cart-header-left">
                <span className="cart-title">🛒 Your Cart</span>
                {cartCount>0 && <span className="cart-count-badge">{cartCount} items</span>}
              </div>
              <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="cart-body">
              {cart.length===0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">🛒</div>
                  <div className="cart-empty-msg">Your cart is empty</div>
                  <div style={{fontSize:12,textAlign:"center",color:"#9ca3af",lineHeight:1.5}}>Add items from the shop to see them here</div>
                </div>
              ) : cart.map(item => (
                <div className="cart-item" key={getKey(item)}>
                  <div className="cart-item-emoji">
                    {item.img && (item.img.startsWith("http")||item.img.startsWith("data:")) ? (
                      <img src={item.img} alt={item.name} style={{width:48,height:48,objectFit:"cover",borderRadius:4}} />
                    ) : (<span style={{fontSize:28}}>{item.img||"📦"}</span>)}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">{item.price}{item.qty>1 && <span style={{color:"#6b7280",fontSize:11,fontWeight:400}}> × {item.qty} = ₹{(item.rawPrice*item.qty).toLocaleString("en-IN")}</span>}</div>
                    <div className="cart-item-off">{item.off}</div>
                    <div className="cart-qty">
                      <button className="qty-btn" onClick={() => changeQty(getKey(item),-1)}>−</button>
                      <span className="qty-num">{item.qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(getKey(item),+1)}>+</button>
                    </div>
                  </div>
                  <button className="cart-remove" onClick={() => removeFromCart(getKey(item))}>🗑️</button>
                </div>
              ))}
            </div>
            {cart.length>0 && (
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="cart-summary-row"><span>Subtotal ({cartCount} items)</span><span>₹{cartTotal.toLocaleString("en-IN")}</span></div>
                  <div className="cart-summary-row"><span>Delivery</span><span style={{color:"#16a34a"}}>FREE</span></div>
                  <div className="cart-summary-row"><span>Total</span><span>₹{cartTotal.toLocaleString("en-IN")}</span></div>
                </div>
                <button className="cart-checkout-btn" onClick={openCheckout}>Proceed to Checkout →</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── CONTACT MODAL */}
      {contactOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480, boxShadow: "0 24px 64px rgba(0,0,0,.25)", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#111827,#1f2937)", padding: "22px 24px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 20, marginBottom: 4 }}>🎧</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: "#fbbf24" }}>24×7 Customer Care</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>We typically respond within 24 hours</div>
              </div>
              <button onClick={() => setContactOpen(false)} style={{ background: "transparent", border: "none", color: "#9ca3af", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>
            {/* Body */}
            <div style={{ padding: "22px 24px" }}>
              {contactSent ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Message Sent!</div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>Our team will get back to you within 24 hours.</div>
                  <button onClick={() => setContactOpen(false)} style={{ marginTop: 20, background: "#111827", color: "#fbbf24", border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}>Close</button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[["Full Name", "text", "name", "Your full name"], ["Phone", "tel", "phone", "10-digit mobile (optional)"]].map(([label, type, key, ph]) => (
                      <div key={key}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</label>
                        <input
                          type={type} placeholder={ph} value={contactForm[key]}
                          onChange={e => setContactForm(f => ({ ...f, [key]: e.target.value }))}
                          style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 6, fontSize: 13, fontFamily: "Poppins,sans-serif", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.4 }}>Email</label>
                      <input
                        type="email" value={userEmail || contactForm.email} readOnly
                        style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 6, fontSize: 13, fontFamily: "Poppins,sans-serif", outline: "none", boxSizing: "border-box", background: "#f9fafb", color: "#6b7280" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.4 }}>Message</label>
                      <textarea
                        placeholder="Describe your issue or question…"
                        value={contactForm.message}
                        onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                        rows={4}
                        style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 6, fontSize: 13, fontFamily: "Poppins,sans-serif", outline: "none", boxSizing: "border-box", resize: "vertical" }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                    <button onClick={() => setContactOpen(false)} style={{ flex: 1, padding: "11px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}>Cancel</button>
                    <button
                      onClick={async () => {
                        if (!contactForm.name.trim() || !contactForm.message.trim()) { showToast("Please fill name and message"); return; }
                        try {
                          await fetch("${API_BASE_URL}/api/contact", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              ...contactForm,
                              email: userEmail || contactForm.email,  // always use logged-in email
                            }),
                          });
                        } catch (e) { console.warn("Contact save failed:", e.message); }
                        setContactSent(true);
                        setContactForm({ name: me, email: userEmail || "", phone: "", message: "" });
                      }}
                      style={{ flex: 2, padding: "11px", borderRadius: 8, border: "none", background: "#111827", color: "#fbbf24", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}
                    >Send Message 🎧</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast" key={toastKey}>✓ {toast}</div>}
      
      {/* Chatbot */}
      <Chatbot userType="user" userEmail={userEmail} userName={userName} />
    </div>
  );
}

function OrderSummary({ cart, cartCount, cartTotal, showItems }) {
  return (
    <div className="sum">
      <div className="sum-title">Order Summary</div>
      {showItems && cart.map((i,idx) => (
        <div key={i._id||i.id||idx} className="sum-row">
          <span style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.name} × {i.qty}</span>
          <b>₹{(i.rawPrice*i.qty).toLocaleString("en-IN")}</b>
        </div>
      ))}
      {!showItems && <div className="sum-row"><span>Items</span><b>{cartCount}</b></div>}
      <div className="sum-row"><span>Subtotal</span><b>₹{cartTotal.toLocaleString("en-IN")}</b></div>
      <div className="sum-row"><span>Delivery</span><b style={{color:"#16a34a"}}>FREE</b></div>
      <div className="sum-total"><span>Total</span><span>₹{cartTotal.toLocaleString("en-IN")}</span></div>
    </div>
  );
}