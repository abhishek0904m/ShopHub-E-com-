// ─────────────────────────────────────────
//  src/shared.js  – constants & shared CSS
// ─────────────────────────────────────────

export const RAZORPAY_KEY_ID = "rzp_test_qUmhUFElBiSNIs";

export const DEALS = [
  { id:"electronics", title:"Big Electronics Sale",  desc:"Up to 40% off on mobiles, laptops & gadgets",   badge:"TODAY ONLY",  emoji:"📱", bg:"#f9fafb", category:"Electronics" },
  { id:"fashion",     title:"Fashion Week Bonanza",  desc:"Buy 2 Get 1 FREE on all clothing & accessories", badge:"3 DAYS LEFT", emoji:"👗", bg:"#fffbeb", category:"Fashion"     },
  { id:"shipping",    title:"Free Shipping Week",    desc:"Free delivery on all orders above ₹499",          badge:"ALWAYS",      emoji:"🚚", bg:"#f0fdf4", category:"all"         },
  { id:"refer",       title:"Refer & Earn ₹200",     desc:"Earn ₹200 ShopHub credits for every referral",   badge:"NEW",         emoji:"🎁", bg:"#faf5ff", category:"all"         },
];

// ✅ Empty — category bar is fully removed
export const CATS = [];

export const NAV_ITEMS = [
  {id:"home",     icon:"🏠", label:"Home"},
  {id:"orders",   icon:"📦", label:"My Orders"},
  {id:"wishlist", icon:"❤️",  label:"Wishlist"},
  {id:"deals",    icon:"🏷️", label:"Deals"},
  {id:"profile",  icon:"👤", label:"Profile"},
];

export const sc = s => s==="Delivered" ? "d" : s==="In Transit" ? "t" : "c";
export const si = s => s==="Delivered" ? "✓ " : s==="In Transit" ? "⟳ " : "✕ ";

export const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  /* ── RESET */
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { overflow-x:hidden; width:100%; }
  body {
    font-family:'Poppins',sans-serif;
    background:#e8ecf1;
    min-height:100vh;
    width:100%;
    overflow-x:hidden;
    margin:0 !important;
    padding:0 !important;
  }
  #root {
    font-family:'Poppins',sans-serif;
    min-height:100vh;
    width:100%;
    display:flex;
    flex-direction:column;
    margin:0;
    padding:0;
  }

  /* ── TOPBAR */
  .tb {
    position:sticky;
    top:0;
    z-index:300;
    background:linear-gradient(135deg, #1a1f2e 0%, #252b3b 100%);
    height:80px;
    width:100%;
    display:flex;
    align-items:center;
    gap:14px;
    padding:0 24px;
    box-shadow:0 4px 24px rgba(0,0,0,.4), 0 0 0 1px rgba(251,191,36,.1);
    margin:0;
    border-radius:0;
    flex-shrink:0;
    position:relative;
    overflow:hidden;
  }
  .tb::before {
    content:'';
    position:absolute;
    top:0;
    left:0;
    right:0;
    height:2px;
    background:linear-gradient(90deg, transparent, #fbbf24, transparent);
    opacity:0.6;
  }
  .tb-logo { display:flex; align-items:center; gap:8px; flex-shrink:0; cursor:pointer; transition:transform .3s ease; }
  .tb-logo:hover { transform:translateY(-2px); }
  .tb-logo-box { width:38px; height:38px; border-radius:6px; background:linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 4px 12px rgba(251,191,36,.3); transition:all .3s ease; }
  .tb-logo-box:hover { box-shadow:0 6px 20px rgba(251,191,36,.5); transform:scale(1.05); }
  .tb-logo-text { font-size:19px; font-weight:800; color:#fff; letter-spacing:-.3px; line-height:1; }
  .tb-logo-text span { color:#fbbf24; }
  .tb-logo-sub { font-size:10px; color:#fbbf24; font-weight:600; font-style:italic; margin-top:1px; }

  .tb-search {
    flex:1;
    min-width:0;
    display:flex;
    align-items:center;
    background:#fff;
    border-radius:4px;
    overflow:hidden;
    height:54px;
    border:none;
    margin:0 16px;
    box-shadow:0 2px 8px rgba(0,0,0,.1);
    transition:all .3s ease;
  }
  .tb-search:focus-within { box-shadow:0 4px 16px rgba(251,191,36,.2); transform:translateY(-1px); }
  .tb-search input {
    flex:1;
    min-width:0;
    border:none;
    outline:none;
    background:transparent;
    padding:0 18px;
    font-family:'Poppins',sans-serif;
    font-size:15px;
    color:#111827;
  }
  .tb-search input::placeholder { color:#9ca3af; }
  .tb-search-btn {
    background:transparent;
    border:none;
    padding:0 18px;
    height:54px;
    cursor:pointer;
    display:flex;
    align-items:center;
    border-left:1px solid #e5e7eb;
    color:#2874f0;
    font-size:20px;
  }
  .tb-search-btn:hover { background:#f3f4f6; }

  .tb-actions { display:flex; align-items:center; gap:6px; flex-shrink:0; margin-left:16px; }
  .tb-btn {
    display:flex;
    align-items:center;
    gap:6px;
    background:transparent;
    border:none;
    color:#fff;
    padding:6px 14px;
    cursor:pointer;
    font-family:'Poppins',sans-serif;
    font-size:13px;
    font-weight:600;
    white-space:nowrap;
    border-radius:2px;
    transition:background .15s;
    height:38px;
  }
  .tb-btn:hover { background:rgba(255,255,255,.15); }
  .tb-btn.login-btn {
    background:#fff;
    color:#2874f0;
    font-weight:700;
    font-size:14px;
    padding:6px 28px;
  }
  .tb-btn.login-btn:hover { background:#f0f4ff; }
  .tb-btn.cart {
    background:transparent;
    color:#fff;
    font-weight:700;
    font-size:14px;
    gap:8px;
  }
  .tb-cart-badge {
    background:#fbbf24;
    color:#111827;
    border-radius:50%;
    width:18px;
    height:18px;
    font-size:10px;
    font-weight:800;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .tb-divider { width:1px; height:24px; background:rgba(255,255,255,.25); margin:0 4px; }

  /* ✅ CATBAR — completely hidden */
  .catbar { display:none; }
  .cat-item { display:none; }

  /* ── LAYOUT */
  .lay {
    display:flex;
    gap:12px;
    padding:14px 14px 0 14px;
    width:100%;
    overflow-x:hidden;
    flex:1;
  }
  .main { flex:1; min-width:0; }

  /* ── SIDEBAR */
  .sb { width:185px; flex-shrink:0; position:relative; }
  .sb::before { content:''; position:absolute; top:0; right:0; width:1px; height:100%; background:linear-gradient(180deg, transparent, rgba(251,191,36,.2), transparent); }
  .sb-card { background:linear-gradient(180deg, #1e2330 0%, #1a1f2e 100%); border-radius:4px; overflow:hidden; box-shadow:4px 0 24px rgba(0,0,0,.3); }
  .sb-head { background:linear-gradient(135deg,#252b3b,#1a1f2e); padding:18px 16px; display:flex; align-items:center; gap:10px; border-bottom:2px solid rgba(251,191,36,.1); position:relative; }
  .sb-head::after { content:''; position:absolute; bottom:-2px; left:16px; right:16px; height:2px; background:linear-gradient(90deg, transparent, #fbbf24, transparent); opacity:.3; }
  .sb-av { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:800; color:#1e2330; flex-shrink:0; box-shadow:0 4px 12px rgba(251,191,36,.4); transition:all .3s ease; }
  .sb-av:hover { transform:scale(1.1) rotate(5deg); box-shadow:0 6px 20px rgba(251,191,36,.6); }
  .sb-uname { color:#f9fafb; font-size:12.5px; font-weight:700; }
  .sb-uemail { color:#6b7280; font-size:10px; margin-top:1px; }
  .sb-link { display:flex; align-items:center; gap:9px; padding:11px 14px; cursor:pointer; color:#9ca3af; font-size:13px; font-weight:500; border-bottom:1px solid #252b3b; background:transparent; border-left:3px solid transparent; border-right:none; border-top:none; width:100%; text-align:left; font-family:'Poppins',sans-serif; transition:all .3s cubic-bezier(.4,0,.2,1); position:relative; margin:2px 8px; border-radius:10px; }
  .sb-link::before { content:''; position:absolute; left:0; top:50%; transform:translateY(-50%); width:3px; height:0; background:linear-gradient(180deg, #fbbf24, #f59e0b); border-radius:0 3px 3px 0; transition:height .3s ease; }
  .sb-link:hover { background:#252b3b; color:#fbbf24; }
  .sb-link:hover::before { height:60%; }
  .sb-link.active { background:linear-gradient(90deg, rgba(251,191,36,.15), rgba(251,191,36,.05)); color:#fbbf24; font-weight:700; border-left:3px solid #fbbf24; box-shadow:inset 0 0 20px rgba(251,191,36,.1); }
  .sb-link.active::before { height:100%; }
  .sb-icon { font-size:15px; flex-shrink:0; width:18px; text-align:center; transition:transform .3s ease; }
  .sb-link:hover .sb-icon { transform:scale(1.2); }
  .sb-logout { display:flex; align-items:center; gap:9px; padding:11px 14px; width:100%; border:none; background:linear-gradient(90deg, rgba(239,68,68,.1), transparent); cursor:pointer; color:#ef4444; font-family:'Poppins',sans-serif; font-size:13px; font-weight:600; border-top:1px solid rgba(239,68,68,.2); text-align:left; transition:all .3s ease; }
  .sb-logout:hover { background:linear-gradient(90deg, rgba(239,68,68,.2), rgba(239,68,68,.05)); transform:translateX(4px); }

  /* ── SECTION */
  .sec { background:#fff; border-radius:16px; padding:18px; margin-bottom:12px; box-shadow:0 4px 20px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.05); border:1px solid rgba(0,0,0,.05); transition:all .3s ease; position:relative; overflow:hidden; }
  .sec::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24); opacity:0; transition:opacity .3s ease; }
  .sec:hover { box-shadow:0 8px 32px rgba(0,0,0,.12), 0 2px 6px rgba(0,0,0,.08); transform:translateY(-2px); }
  .sec:hover::before { opacity:1; }
  .sec-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
  .sec-title { font-size:15px; font-weight:800; color:#111827; letter-spacing:-.5px; }
  .sec-link { font-size:12px; color:#fbbf24; font-weight:700; cursor:pointer; background:none; border:none; font-family:'Poppins',sans-serif; transition:opacity .15s; }
  .sec-link:hover { opacity:.75; }

  /* ── PRODUCT GRID */
  .pgrid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
  .pcard { background:#fff; border-radius:12px; padding:13px 11px; box-shadow:0 2px 8px rgba(0,0,0,.06); border:2px solid #f3f4f6; cursor:pointer; transition:all .4s cubic-bezier(.4,0,.2,1); position:relative; overflow:hidden; }
  .pcard::before { content:''; position:absolute; top:0; left:0; right:0; bottom:0; background:linear-gradient(135deg, rgba(251,191,36,.05), transparent); opacity:0; transition:opacity .3s ease; }
  .pcard:hover { border-color:#fbbf24; box-shadow:0 12px 40px rgba(251,191,36,.25), 0 4px 12px rgba(0,0,0,.1); transform:translateY(-8px) scale(1.02); }
  .pcard:hover::before { opacity:1; }
  .p-emoji { font-size:46px; text-align:center; display:block; padding:5px 0; }
  .p-badge { position:absolute; top:9px; left:9px; background:linear-gradient(135deg, #111827 0%, #1f2937 100%); color:#fbbf24; font-size:9px; font-weight:800; padding:2px 7px; border-radius:2px; box-shadow:0 2px 8px rgba(0,0,0,.3); animation:pulse-badge 2s ease-in-out infinite; }
  @keyframes pulse-badge { 0%, 100% { transform:scale(1); } 50% { transform:scale(1.05); } }
  .p-del-btn { position:absolute; top:8px; right:8px; background:#fee2e2; border:none; font-size:13px; cursor:pointer; padding:3px 7px; border-radius:2px; color:#dc2626; font-weight:700; transition:background .15s; }
  .p-del-btn:hover { background:#fca5a5; }
  .p-name { font-size:12px; font-weight:600; color:#111827; margin-top:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .p-price { font-size:15px; font-weight:800; color:#111827; margin-top:3px; }
  .p-mrp { font-size:11px; color:#9ca3af; text-decoration:line-through; margin-left:4px; font-weight:400; }
  .p-off { font-size:11px; color:#16a34a; font-weight:700; margin-top:2px; }
  .p-rating { display:flex; align-items:center; gap:4px; margin-top:4px; }
  .p-rbadge { background:#111827; color:#fbbf24; font-size:10px; font-weight:700; padding:2px 6px; border-radius:2px; }
  .p-rcount { font-size:10px; color:#9ca3af; }
  .p-btn { width:100%; margin-top:9px; background:linear-gradient(135deg, #111827 0%, #1f2937 100%); color:#fbbf24; border:none; border-radius:2px; padding:8px; font-family:'Poppins',sans-serif; font-size:12px; font-weight:700; cursor:pointer; transition:all .3s ease; box-shadow:0 4px 12px rgba(0,0,0,.2); position:relative; overflow:hidden; }
  .p-btn::before { content:''; position:absolute; top:50%; left:50%; width:0; height:0; background:rgba(251,191,36,.3); border-radius:50%; transform:translate(-50%, -50%); transition:width .5s, height .5s; }
  .p-btn:hover::before { width:300px; height:300px; }
  .p-btn:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,.3); }
  .p-btn.added { background:linear-gradient(135deg, #16a34a 0%, #15803d 100%); }

  /* ── BUTTONS */
  .primary-btn { background:linear-gradient(135deg, #111827 0%, #1f2937 100%); color:#fbbf24; border:none; border-radius:2px; padding:12px 14px; font-family:'Poppins',sans-serif; font-size:13px; font-weight:900; cursor:pointer; transition:all .3s ease; box-shadow:0 4px 16px rgba(0,0,0,.2); position:relative; overflow:hidden; letter-spacing:.5px; }
  .primary-btn::before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg, transparent, rgba(251,191,36,.3), transparent); transition:left .5s ease; }
  .primary-btn:hover::before { left:100%; }
  .primary-btn:hover { transform:translateY(-2px); box-shadow:0 6px 24px rgba(0,0,0,.3); }
  .primary-btn:disabled { opacity:.55; cursor:not-allowed; }
  .ghost-btn { background:#fff; border:2px solid #e5e7eb; color:#111827; border-radius:2px; padding:12px 14px; font-family:'Poppins',sans-serif; font-size:13px; font-weight:800; cursor:pointer; transition:all .3s ease; }
  .ghost-btn:hover { border-color:#111827; background:#f9fafb; transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,.1); }

  /* ── ORDER BADGE */
  .obadge { display:inline-flex; align-items:center; gap:3px; padding:3px 9px; border-radius:3px; font-size:11px; font-weight:700; width:fit-content; }
  .obadge.d { background:#dcfce7; color:#16a34a; }
  .obadge.t { background:#fef3c7; color:#d97706; }
  .obadge.c { background:#fee2e2; color:#dc2626; }

  /* ── CART DRAWER */
  .cart-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:400; backdrop-filter:blur(2px); }
  .cart-drawer { position:fixed; top:0; right:0; bottom:0; width:380px; max-width:95vw; background:#fff; z-index:500; display:flex; flex-direction:column; box-shadow:-4px 0 30px rgba(0,0,0,.2); animation:slideIn .25s ease; }
  @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
  .cart-header { background:#1e2330; padding:18px 20px; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; }
  .cart-header-left { display:flex; align-items:center; gap:10px; }
  .cart-title { color:#f9fafb; font-size:16px; font-weight:800; }
  .cart-count-badge { background:#fbbf24; color:#111827; border-radius:2px; font-size:11px; font-weight:800; padding:2px 9px; }
  .cart-close { background:#2a3145; border:none; color:#9ca3af; width:32px; height:32px; border-radius:2px; cursor:pointer; font-size:18px; display:flex; align-items:center; justify-content:center; }
  .cart-close:hover { background:#353d55; color:#fff; }
  .cart-body { flex:1; overflow-y:auto; padding:16px; }
  .cart-body::-webkit-scrollbar { width:4px; }
  .cart-body::-webkit-scrollbar-thumb { background:#e5e7eb; border-radius:2px; }
  .cart-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:12px; color:#9ca3af; }
  .cart-empty-icon { font-size:56px; }
  .cart-empty-msg { font-size:14px; font-weight:600; color:#6b7280; }
  .cart-item { display:flex; align-items:center; gap:12px; padding:12px; border-radius:2px; border:1.5px solid #f3f4f6; margin-bottom:8px; transition:border-color .15s; }
  .cart-item:hover { border-color:#fbbf24; }
  .cart-item-emoji { font-size:34px; width:52px; height:52px; background:#f9fafb; border-radius:2px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .cart-item-info { flex:1; min-width:0; }
  .cart-item-name { font-size:13px; font-weight:600; color:#111827; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .cart-item-price { font-size:14px; font-weight:800; color:#111827; margin-top:2px; }
  .cart-item-off { font-size:10.5px; color:#16a34a; font-weight:700; }
  .cart-qty { display:flex; align-items:center; gap:6px; margin-top:6px; }
  .qty-btn { width:26px; height:26px; border-radius:2px; border:1.5px solid #e5e7eb; background:#f9fafb; color:#374151; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .qty-btn:hover { border-color:#fbbf24; background:#fef9c3; }
  .qty-num { font-size:13px; font-weight:700; color:#111827; min-width:20px; text-align:center; }
  .cart-remove { background:none; border:none; color:#ef4444; cursor:pointer; font-size:14px; padding:4px; }
  .cart-remove:hover { background:#fee2e2; }
  .cart-footer { flex-shrink:0; padding:16px; border-top:2px solid #f3f4f6; background:#fff; }
  .cart-summary { background:#f9fafb; border-radius:2px; padding:12px 14px; margin-bottom:12px; }
  .cart-summary-row { display:flex; justify-content:space-between; align-items:center; font-size:12.5px; color:#6b7280; margin-bottom:6px; }
  .cart-summary-row:last-child { margin-bottom:0; font-size:15px; font-weight:800; color:#111827; padding-top:8px; border-top:1px solid #e5e7eb; }
  .cart-summary-row span:last-child { font-weight:700; color:#111827; }
  .cart-checkout-btn { width:100%; background:#111827; color:#fbbf24; border:none; border-radius:2px; padding:14px; font-family:'Poppins',sans-serif; font-size:14px; font-weight:800; cursor:pointer; }
  .cart-checkout-btn:hover { background:#1f2937; }

  /* ── CHECKOUT */
  .flow { max-width:900px; margin:0 auto; }
  .flow-steps { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
  .step { flex:1; background:#fff; border:1.5px solid #f3f4f6; border-radius:2px; padding:10px 12px; box-shadow:0 2px 10px rgba(0,0,0,.05); display:flex; align-items:center; justify-content:space-between; font-size:12px; font-weight:700; color:#6b7280; }
  .step.active { border-color:#fbbf24; color:#111827; }
  .step.done { border-color:#16a34a; color:#16a34a; }
  .step .dot { width:26px; height:26px; border-radius:3px; display:flex; align-items:center; justify-content:center; background:#f3f4f6; color:#6b7280; font-weight:800; }
  .step.active .dot { background:#fef9c3; color:#111827; }
  .step.done .dot { background:#dcfce7; color:#16a34a; }
  .cgrid { display:grid; grid-template-columns:1.2fr .8fr; gap:12px; }
  .cform { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .cform .full { grid-column:1/-1; }
  .cform label { font-size:10.5px; font-weight:800; color:#374151; letter-spacing:.4px; text-transform:uppercase; display:block; margin-bottom:4px; }
  .cform input, .cform textarea, .cform select { width:100%; border:1.5px solid #e5e7eb; border-radius:2px; padding:11px 12px; font-family:'Poppins',sans-serif; font-size:13px; outline:none; }
  .cform textarea { min-height:92px; resize:vertical; }
  .cform input:focus, .cform textarea:focus, .cform select:focus { border-color:#fbbf24; box-shadow:0 0 0 3px rgba(251,191,36,.12); }
  .sum { background:#fff; border-radius:2px; padding:16px; box-shadow:0 2px 12px rgba(0,0,0,.07); border:1.5px solid #f3f4f6; }
  .sum-title { font-size:13px; font-weight:900; color:#111827; margin-bottom:10px; }
  .sum-row { display:flex; justify-content:space-between; font-size:12.5px; color:#6b7280; margin-bottom:8px; }
  .sum-row b { color:#111827; }
  .sum-total { border-top:1px solid #e5e7eb; padding-top:10px; margin-top:8px; font-size:15px; font-weight:900; color:#111827; display:flex; justify-content:space-between; }

  /* ── PAYMENT */
  .pay-methods { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:16px 0; }
  .pay-method-card { border:2px solid #e5e7eb; border-radius:2px; padding:16px 18px; cursor:pointer; transition:all .2s; background:#fafafa; display:flex; flex-direction:column; align-items:center; gap:8px; font-family:'Poppins',sans-serif; }
  .pay-method-card:hover { border-color:#fbbf24; background:#fffbf0; transform:translateY(-2px); }
  .pay-method-card.selected { border-color:#111827; background:#111827; }
  .pay-method-icon { font-size:30px; }
  .pay-method-label { font-size:13px; font-weight:800; color:#111827; }
  .pay-method-sub { font-size:10.5px; color:#6b7280; font-weight:500; text-align:center; }
  .pay-method-card.selected .pay-method-label { color:#fbbf24; }
  .pay-method-card.selected .pay-method-sub { color:#9ca3af; }
  .rzp-badge { display:inline-flex; align-items:center; gap:5px; background:#072654; color:#fff; border-radius:2px; font-size:10px; font-weight:700; padding:4px 10px; margin-top:8px; }
  .rzp-badge span { color:#5cc8ff; }
  .rzp-btn { background:#5469d4; color:#fff; border:none; border-radius:2px; padding:13px 20px; font-family:'Poppins',sans-serif; font-size:13px; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:8px; }
  .rzp-btn:hover { background:#4357c5; }
  .rzp-btn:disabled { opacity:.55; cursor:not-allowed; }
  .spinner { width:16px; height:16px; border:2.5px solid rgba(255,255,255,.4); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }

  /* ── TOAST */
  .toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#111827; color:#fbbf24; padding:10px 20px; border-radius:3px; font-size:13px; font-weight:700; z-index:600; box-shadow:0 4px 20px rgba(0,0,0,.3); animation:toastIn .3s ease, toastOut .3s ease 1.7s forwards; }
  @keyframes toastIn  { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  @keyframes toastOut { from{opacity:1} to{opacity:0} }

  /* ── FORM */
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .fg { display:flex; flex-direction:column; gap:5px; }
  .fg.full { grid-column:1/-1; }
  .fg label { font-size:10.5px; font-weight:700; color:#374151; letter-spacing:.4px; text-transform:uppercase; }
  .fg input, .fg select, .fg textarea { border:1.5px solid #e5e7eb; border-radius:2px; padding:10px 12px; font-family:'Poppins',sans-serif; font-size:13px; color:#111827; outline:none; background:#fff; }
  .fg input:focus, .fg select:focus, .fg textarea:focus { border-color:#fbbf24; box-shadow:0 0 0 3px rgba(251,191,36,.12); }
  .save-btn { margin-top:18px; background:#111827; color:#fff; border:none; border-radius:2px; padding:12px 28px; font-family:'Poppins',sans-serif; font-size:14px; font-weight:700; cursor:pointer; }
  .save-btn:hover { background:#1f2937; }

  /* ── FOOTER */
  .sh-footer { background:#172337; color:#9ca3af; width:100%; margin:0; padding:0; flex-shrink:0; }
  .sh-footer-top { display:grid; grid-template-columns:1.2fr 0.9fr 0.9fr 1.1fr 1.2fr 1.3fr; gap:0; padding:32px 40px 28px; border-bottom:1px solid #253347; }
  .sh-footer-col { padding-right:24px; border-right:1px solid #253347; }
  .sh-footer-col:last-child { border-right:none; padding-right:0; padding-left:24px; }
  .sh-footer-col:not(:first-child):not(:last-child) { padding-left:24px; }
  .sh-footer-col h4 { color:#6b7280; font-size:11px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; margin-bottom:14px; }
  .sh-footer-col a { display:block; color:#c9d3df; text-decoration:none; font-size:12.5px; margin-bottom:10px; transition:color .15s; font-weight:400; }
  .sh-footer-col a:hover { color:#fbbf24; }
  .sh-footer-social { display:flex; gap:14px; margin-top:4px; }
  .sh-footer-social a { display:flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:50%; border:1.5px solid #374151; color:#9ca3af; font-size:16px; text-decoration:none; transition:border-color .15s, color .15s; margin-bottom:0; }
  .sh-footer-social a:hover { border-color:#fbbf24; color:#fbbf24; }
  .sh-footer-contact p { font-size:12px; color:#c9d3df; line-height:1.7; margin-bottom:4px; }
  .sh-footer-contact .sh-footer-phone { color:#fbbf24; font-weight:700; font-size:13px; text-decoration:none; }
  .sh-footer-bottom { display:flex; align-items:center; justify-content:space-between; padding:14px 40px; background:#111d2b; flex-wrap:wrap; gap:10px; }
  .sh-footer-bottom-left { display:flex; align-items:center; gap:24px; flex-wrap:wrap; }
  .sh-footer-bottom-left a { color:#6b7280; text-decoration:none; font-size:12px; transition:color .15s; display:flex; align-items:center; gap:6px; }
  .sh-footer-bottom-left a:hover { color:#fbbf24; }
  .sh-footer-bottom-left a .bb-icon { font-size:18px; }
  .sh-footer-copy { font-size:12px; color:#4b5563; }
  .sh-footer-pay { display:flex; align-items:center; gap:5px; }
  .pay-chip { background:#253347; color:#d1d5db; font-size:10px; font-weight:700; padding:3px 7px; border-radius:2px; letter-spacing:.3px; }

  /* ── RESPONSIVE */
  @media(max-width:1100px) {
    .sb{width:165px}
    .pgrid{grid-template-columns:repeat(3,1fr)}
    .sh-footer-top{grid-template-columns:repeat(3,1fr)}
    .sh-footer-col:nth-child(3) { border-right:none; }
    .sh-footer-col:nth-child(4) { padding-left:0; border-right:1px solid #253347; }
  }
  @media(max-width:860px) {
    .lay{flex-direction:column;padding:8px 8px 0 8px}
    .sb{width:100%}
    .pgrid{grid-template-columns:repeat(2,1fr)}
    .cgrid{grid-template-columns:1fr}
    .cform{grid-template-columns:1fr}
    .tb{padding:0 12px;gap:8px;height:56px}
    .tb-logo-text{font-size:16px}
    .tb-search{height:36px}
    .cart-drawer{width:100%}
    .form-grid{grid-template-columns:1fr}
    .sh-footer-top{grid-template-columns:repeat(2,1fr);padding:20px 16px;gap:0}
    .sh-footer-col { border-right:none !important; padding-left:0 !important; padding-right:0 !important; border-bottom:1px solid #253347; padding-bottom:16px; margin-bottom:16px; }
    .sh-footer-col:last-child { border-bottom:none; margin-bottom:0; }
    .sh-footer-bottom{padding:12px 16px;font-size:11px}
    .sh-footer-bottom-left{gap:12px}
  }
`;