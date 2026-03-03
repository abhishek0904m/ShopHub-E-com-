// ─────────────────────────────────────────
//  src/Deals.jsx - DYNAMIC DEALS
// ─────────────────────────────────────────
import { useState } from "react";
import ProductCard from "./ProductCard";

export default function Deals({ products, addToCart, removeFromCart, isInCart, toggleWishlist, isInWishlist, onProductClick }) {
  const [activeDeal, setActiveDeal] = useState(null);

  // Group products by category that have discounts
  const productsByCategory = products
    .filter(p => p.off) // Only products with discounts
    .reduce((acc, product) => {
      const category = product.category || "General";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

  // Create dynamic deals from categories
  const dynamicDeals = Object.keys(productsByCategory).map(category => {
    const categoryProducts = productsByCategory[category];
    const avgDiscount = Math.round(
      categoryProducts.reduce((sum, p) => {
        const discountMatch = p.off?.match(/(\d+)%/);
        return sum + (discountMatch ? parseInt(discountMatch[1]) : 0);
      }, 0) / categoryProducts.length
    );

    // Category specific data
    const categoryData = {
      "Electronics": { emoji: "📱", badge: "TODAY ONLY", bg: "#f9fafb" },
      "Fashion": { emoji: "👗", badge: "3 DAYS LEFT", bg: "#fffbeb" },
      "Home": { emoji: "🏠", badge: "ALWAYS", bg: "#f0fdf4" },
      "Beauty": { emoji: "💄", badge: "NEW", bg: "#fef2f2" },
      "Books": { emoji: "📚", badge: "SALE", bg: "#ede9fe" },
      "Sports": { emoji: "⚽", badge: "HOT DEAL", bg: "#fef3c7" },
      "Toys": { emoji: "🧸", badge: "KIDS SPECIAL", bg: "#fce7f3" },
      "Kitchen": { emoji: "🍳", badge: "TRENDING", bg: "#ecfdf5" },
      "Automotive": { emoji: "🚗", badge: "MEGA SALE", bg: "#f1f5f9" },
      "General": { emoji: "🛍️", badge: "SPECIAL", bg: "#f9fafb" },
    };

    const data = categoryData[category] || categoryData["General"];

    return {
      id: category.toLowerCase(),
      title: `${category} Sale`,
      desc: `Up to ${avgDiscount}% off on ${categoryProducts.length} products`,
      badge: data.badge,
      emoji: data.emoji,
      bg: data.bg,
      category: category,
      count: categoryProducts.length
    };
  });

  const dealProducts = activeDeal
    ? productsByCategory[activeDeal.category] || []
    : [];

  return (
    <>
      {/* ── DEALS GRID */}
      <div style={{ marginBottom: 32, animation: "fadeInUp 0.5s ease" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <span style={{ fontSize: 28 }}>🏷️</span>
            <span style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: -0.5,
            }}>
              Deals For You
            </span>
          </div>
          {activeDeal && (
            <button 
              onClick={() => setActiveDeal(null)}
              style={{
                background: "transparent",
                border: "2px solid #e5e7eb",
                color: "#6b7280",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: 10,
                fontFamily: "Assistant, sans-serif",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#fbbf24";
                e.currentTarget.style.color = "#111827";
                e.currentTarget.style.transform = "translateX(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.color = "#6b7280";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              ← Back to Deals
            </button>
          )}
        </div>

        {dynamicDeals.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#fff",
            borderRadius: 16,
            border: "2px dashed #e5e7eb",
          }}>
            <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>🏷️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>
              No deals available yet
            </div>
            <div style={{ fontSize: 13, color: "#9ca3af" }}>
              Deals will appear here when products with discounts are added
            </div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
            marginBottom: activeDeal ? 32 : 0
          }}>
            {dynamicDeals.map((d, index) => (
              <div
                key={d.id}
                onClick={() => setActiveDeal(d.id === activeDeal?.id ? null : d)}
                style={{
                  borderRadius: 18,
                  padding: 24,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 20,
                  boxShadow: "0 4px 16px rgba(0,0,0,.08)",
                  cursor: "pointer",
                  border: activeDeal?.id === d.id ? "2px solid #fbbf24" : "2px solid transparent",
                  background: activeDeal?.id === d.id 
                    ? "linear-gradient(135deg, #fffbf0 0%, #fef3c7 100%)" 
                    : `linear-gradient(135deg, ${d.bg} 0%, #ffffff 100%)`,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  animation: `fadeInUp 0.5s ease ${index * 0.1}s both`,
                }}
                onMouseEnter={e => {
                  if(activeDeal?.id !== d.id) {
                    e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.15)";
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.08)";
                }}
              >
                {/* Animated background gradient */}
                <div style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)",
                  animation: "pulse 3s ease-in-out infinite",
                }} />
                
                <span style={{
                  fontSize: 48,
                  flexShrink: 0,
                  marginTop: 4,
                  animation: "bounce 2s ease-in-out infinite",
                  display: "inline-block",
                }}>
                  {d.emoji}
                </span>
                
                <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
                  <span style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #111827, #1f2937)",
                    color: "#fbbf24",
                    fontSize: 10,
                    fontWeight: 800,
                    padding: "4px 12px",
                    borderRadius: 6,
                    letterSpacing: 1,
                    marginBottom: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}>
                    {d.badge}
                  </span>
                  
                  <div style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#111827",
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}>
                    {d.title}
                  </div>
                  
                  <div style={{
                    fontSize: 13,
                    color: "#6b7280",
                    marginBottom: 16,
                    lineHeight: 1.5,
                  }}>
                    {d.desc}
                  </div>
                  
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setActiveDeal(d.id === activeDeal?.id ? null : d);
                    }}
                    style={{
                      background: "linear-gradient(135deg, #111827, #1f2937)",
                      color: "#fbbf24",
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 24px",
                      fontFamily: "Assistant, sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(251,191,36,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                  >
                    {activeDeal?.id === d.id ? "Hide Products ↑" : "Shop Now →"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── DEAL PRODUCTS */}
      {activeDeal && (
        <div style={{ 
          marginBottom: 32,
          animation: "fadeInUp 0.5s ease"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            padding: "16px 20px",
            background: "linear-gradient(135deg, #fffbf0, #fef3c7)",
            borderRadius: 14,
            border: "2px solid #fbbf24",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <span style={{ fontSize: 28 }}>{activeDeal.emoji}</span>
              <span style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#111827",
              }}>
                {activeDeal.title} — Products
              </span>
            </div>
            <span style={{
              fontSize: 14,
              color: "#6b7280",
              fontWeight: 600,
              background: "#fff",
              padding: "6px 14px",
              borderRadius: 8,
            }}>
              {dealProducts.length} items
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}>
            {dealProducts.map(w => (
              <ProductCard 
                key={w.id || w._id} 
                w={w} 
                isInCart={isInCart}
                isInWishlist={isInWishlist}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                toggleWishlist={toggleWishlist}
                onProductClick={onProductClick} 
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
}
