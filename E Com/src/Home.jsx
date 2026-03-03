// ─────────────────────────────────────────
//  src/Home.jsx - ORGANIZED BY CATEGORY WITH SEARCH
// ─────────────────────────────────────────
import { useState } from "react";
import ProductCard from "./ProductCard";
import "./mobile-responsive.css";

export default function Home({ products, orders, addToCart, removeFromCart, isInCart, toggleWishlist, isInWishlist, setPage, onProductClick, search: searchProp }) {
  const [search, setSearch] = useState(searchProp || "");

  // Use search from prop if provided, otherwise use local state
  const searchTerm = searchProp !== undefined ? searchProp : search;

  // Filter products by search
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort products by oldest first (ascending order)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const dateA = a.createdAt || a._id || 0;
    const dateB = b.createdAt || b._id || 0;
    return dateA > dateB ? 1 : -1; // Oldest first
  });

  // Group products by category
  const productsByCategory = sortedProducts.reduce((acc, product) => {
    const category = product.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const categories = Object.keys(productsByCategory);

  // Category emojis
  const categoryEmojis = {
    "Electronics": "📱",
    "Fashion": "👕",
    "Home": "🏠",
    "Beauty": "💄",
    "Books": "📚",
    "Sports": "⚽",
    "Toys": "🧸",
    "Kitchen": "🍳",
    "Automotive": "🚗",
    "General": "🛍️"
  };

  return (
    <>
      {/* ── HERO BANNER */}
      <div style={{
        borderRadius: 14,
        marginBottom: 20,
        background: "linear-gradient(135deg, #1a1f2e 0%, #252b3b 60%, #1e2330 100%)",
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 20px rgba(0,0,0,.25)",
        position: "relative",
        overflow: "hidden",
        minHeight: 140,
      }}>
        {/* Animated background circles */}
        <div style={{
          position: "absolute",
          right: -30,
          top: -30,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,191,36,.1) 0%, transparent 70%)",
          animation: "pulse 3s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          right: 80,
          bottom: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,191,36,.06) 0%, transparent 70%)",
          animation: "pulse 4s ease-in-out infinite",
        }} />
        
        <div style={{ zIndex: 1, flex: 1 }}>
          <span style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            color: "#111827",
            fontSize: 10,
            fontWeight: 800,
            padding: "4px 10px",
            borderRadius: 6,
            letterSpacing: 0.8,
            marginBottom: 10,
            boxShadow: "0 2px 8px rgba(251,191,36,.3)",
          }}>
            ⚡ FLASH SALE
          </span>
          <div style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#f9fafb",
            lineHeight: 1.2,
            marginBottom: 8,
            letterSpacing: -0.5,
          }}>
            Welcome to <span style={{ color: "#fbbf24" }}>ShopHub!</span>
          </div>
          <div style={{
            fontSize: 13,
            color: "#9ca3af",
            marginBottom: 16,
            fontWeight: 500,
          }}>
            {products.length} products · Free shipping on ₹499+
          </div>
          <button 
            onClick={() => setPage("deals")}
            style={{
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              color: "#111827",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontFamily: "Assistant, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(251,191,36,.4)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(251,191,36,.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(251,191,36,.4)";
            }}
          >
            Explore Deals →
          </button>
        </div>
        <div style={{ fontSize: 56, zIndex: 1, opacity: 0.9 }}>🛍️</div>
      </div>

      {/* ── STATS CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12,
        marginBottom: 24,
      }}>
        {[
          { ico: "📦", num: orders.length, lbl: "Total Orders", color: "#fbbf24", bg: "#fffbeb" },
          { ico: "🛍️", num: products.length, lbl: "Products", color: "#10b981", bg: "#f0fdf4" },
          { ico: "🎁", num: "₹200", lbl: "ShopHub Credits", color: "#6366f1", bg: "#eef2ff" },
          { ico: "🔥", num: categories.length, lbl: "Categories", color: "#ef4444", bg: "#fef2f2" },
        ].map((s, i) => (
          <div 
            key={i}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #f3f4f6",
              transition: "all 0.3s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
            }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 3,
              background: `linear-gradient(90deg, ${s.color}, ${s.color}dd)`,
            }} />
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              background: s.bg,
            }}>
              {s.ico}
            </div>
            <div>
              <div style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1,
                marginBottom: 4,
              }}>
                {s.num}
              </div>
              <div style={{
                fontSize: 11,
                color: "#6b7280",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.3,
              }}>
                {s.lbl}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── PRODUCTS BY CATEGORY */}
      {products.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "#fff",
          borderRadius: 16,
          border: "2px dashed #e5e7eb",
        }}>
          <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>📦</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>
            No products yet
          </div>
          <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>
            Products will appear here once dealers add them
          </div>
        </div>
      ) : (
        categories.map((category) => (
          <div key={category} style={{ 
            marginBottom: 28,
            background: "#fff",
            padding: "24px 20px",
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              position: "relative",
              zIndex: 1,
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <span style={{ fontSize: 20 }}>{categoryEmojis[category] || "🛍️"}</span>
                <span style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#111827",
                  letterSpacing: -0.3,
                }}>
                  {category}
                </span>
                <span style={{
                  background: "#f3f4f6",
                  color: "#6b7280",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 20,
                  marginLeft: 6,
                }}>
                  {productsByCategory[category].length}
                </span>
              </div>
            </div>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}>
              {productsByCategory[category].map(w => (
                <ProductCard 
                  key={w.id || w._id} 
                  w={w} 
                  isInCart={isInCart}
                  isInWishlist={isInWishlist}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  toggleWishlist={toggleWishlist}
                  onProductClick={onProductClick}
                  setPage={setPage}
                />
              ))}
            </div>
          </div>
        ))
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
