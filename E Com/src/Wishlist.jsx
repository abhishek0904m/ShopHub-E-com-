// ─────────────────────────────────────────
//  src/Wishlist.jsx - ENHANCED
// ─────────────────────────────────────────
import { useState } from "react";
import ProductCard from "./ProductCard";

export default function Wishlist({ products, addToCart, removeFromCart, isInCart, toggleWishlist, isInWishlist, onDelete, showDelete, onProductClick }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || p.category === cat;
    return matchSearch && matchCat;
  });

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
          <span style={{ fontSize: 24 }}>🛒</span>
          <span style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#111827",
            letterSpacing: -0.5,
          }}>
            All Products ({filtered.length})
          </span>
        </div>
      </div>

      {/* ── Filters */}
      <div style={{
        display: "flex",
        gap: 12,
        marginBottom: 20,
        flexWrap: "wrap",
        alignItems: "center",
        background: "#fff",
        padding: "16px 20px",
        borderRadius: 12,
        border: "1px solid #f3f4f6",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}>
        <input
          placeholder="🔍 Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            border: "1.5px solid #e5e7eb",
            borderRadius: 8,
            padding: "10px 14px",
            fontFamily: "Poppins, sans-serif",
            fontSize: 13,
            outline: "none",
            transition: "all 0.2s ease"
          }}
          onFocus={e => {
            e.target.style.borderColor = "#fbbf24";
            e.target.style.boxShadow = "0 0 0 3px rgba(251,191,36,0.1)";
          }}
          onBlur={e => {
            e.target.style.borderColor = "#e5e7eb";
            e.target.style.boxShadow = "none";
          }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                background: cat === c ? "linear-gradient(135deg, #111827, #1f2937)" : "#f3f4f6",
                color: cat === c ? "#fbbf24" : "#374151",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontFamily: "Poppins, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: cat === c ? "0 2px 8px rgba(0,0,0,0.15)" : "none"
              }}
              onMouseEnter={(e) => {
                if (cat !== c) {
                  e.currentTarget.style.background = "#e5e7eb";
                }
              }}
              onMouseLeave={(e) => {
                if (cat !== c) {
                  e.currentTarget.style.background = "#f3f4f6";
                }
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "#fff",
          borderRadius: 12,
          border: "2px dashed #e5e7eb",
          animation: "fadeIn 0.5s ease"
        }}>
          <div style={{
            fontSize: 64,
            marginBottom: 16,
            opacity: 0.5,
            animation: "bounce 2s ease-in-out infinite"
          }}>🔍</div>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#6b7280"
          }}>No products found</div>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}>
          {filtered.map(w => (
            <ProductCard
              key={w.id}
              w={w}
              isInCart={isInCart}
              isInWishlist={isInWishlist}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              toggleWishlist={toggleWishlist}
              onDelete={onDelete}
              showDelete={showDelete}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}