// src/api.js  – all API calls to the backend
import { API_BASE_URL } from './config';

const BASE = `${API_BASE_URL}/api`;

// Helper: safe JSON parse with clear error if server returns HTML
const safeJson = async (res) => {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data.message || `Server error ${res.status}`);
    return data;
  } catch (e) {
    // Server returned HTML (404 page, crash page, etc.) instead of JSON
    if (text.startsWith("<")) {
      throw new Error(`Backend not reachable at ${res.url} — is your server running on port 5000?`);
    }
    throw e;
  }
};

// ─────────────────────────────────────────
//  AUTH
// ─────────────────────────────────────────
export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return safeJson(res);
};

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return safeJson(res);
};

// ─────────────────────────────────────────
//  ORDERS
// ─────────────────────────────────────────
export const fetchOrders = async (userName) => {
  const res = await fetch(`${BASE}/orders/${encodeURIComponent(userName)}`);
  return safeJson(res);
};

export const createOrder = async (orderData) => {
  const res = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  return safeJson(res);
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(`${BASE}/orders/${encodeURIComponent(orderId)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return safeJson(res);
};

// ─────────────────────────────────────────
//  PRODUCTS
// ─────────────────────────────────────────
export const fetchProducts = async () => {
  const res = await fetch(`${BASE}/products`);
  return safeJson(res);
};

export const createProduct = async (productData) => {
  const rawPrice = parseInt(productData.rawPrice);
  const mrpPrice = Math.round(rawPrice * 1.2);
  const offPct   = Math.round(((mrpPrice - rawPrice) / mrpPrice) * 100);
  const payload  = {
    ...productData,
    rawPrice,
    price: `₹${rawPrice.toLocaleString("en-IN")}`,
    mrp:   `₹${mrpPrice.toLocaleString("en-IN")}`,
    off:   `${offPct}% off`,
    // defaults for removed fields
    rat:   productData.rat   || "4.0",
    rev:   productData.rev   || "100",
    badge: productData.badge || "",
  };
  const res = await fetch(`${BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return safeJson(res);
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE}/products/${id}`, { method: "DELETE" });
  return safeJson(res);
};
// ─────────────────────────────────────────
//  CART
// ─────────────────────────────────────────
export const fetchCart = async (userEmail) => {
  const res = await fetch(`${BASE}/cart/${encodeURIComponent(userEmail)}`);
  return safeJson(res);
};

export const saveCart = async (userEmail, items) => {
  const res = await fetch(`${BASE}/cart/${encodeURIComponent(userEmail)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  return safeJson(res);
};

export const clearCartDB = async (userEmail) => {
  const res = await fetch(`${BASE}/cart/${encodeURIComponent(userEmail)}`, {
    method: "DELETE",
  });
  return safeJson(res);
};

// ─────────────────────────────────────────
//  DEALERS
// ─────────────────────────────────────────
export const registerDealer = async (dealerData) => {
  const res = await fetch(`${BASE}/dealers/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dealerData),
  });
  return safeJson(res);
};

export const loginDealer = async (email, password, dealerCode) => {
  const res = await fetch(`${BASE}/dealers/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, dealerCode }),
  });
  return safeJson(res);
};

// ─────────────────────────────────────────
//  ADMIN
// ─────────────────────────────────────────
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return safeJson(res);
};