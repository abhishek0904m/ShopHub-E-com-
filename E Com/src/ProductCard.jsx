// ─────────────────────────────────────────
//  src/ProductCard.jsx - MYNTRA PREMIUM STYLE
// ─────────────────────────────────────────
import { useState } from "react";

export default function ProductCard({ 
  w, 
  isInCart,
  isInWishlist,
  addToCart, 
  removeFromCart,
  toggleWishlist,
  onDelete, 
  showDelete, 
  onProductClick,
  setPage
}) {
  const [isHovered, setIsHovered] = useState(false);
  const key = w._id || w.id;
  const isRealImage = w.img && (w.img.startsWith("http") || w.img.startsWith("data:image"));

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    if (onProductClick) onProductClick(w);
  };

  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "#fff",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered 
          ? "0 8px 24px rgba(0,0,0,0.12)" 
          : "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      {/* ═══════════════════════════════════════
          IMAGE SECTION
      ═══════════════════════════════════════ */}
      <div style={{
        width: "100%",
        height: 250,
        background: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* White Overlay on Hover (Myntra Style) */}
        {isHovered && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255, 255, 255, 0.3)",
            zIndex: 1,
            animation: "fadeIn 0.3s ease",
          }} />
        )}

        {/* Product Image */}
        {isRealImage ? (
          <img
            src={w.img}
            alt={w.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        ) : (
          <span style={{ fontSize: 56, opacity: 0.3 }}>
            {w.img && w.img.length < 10 ? w.img : "📦"}
          </span>
        )}

        {/* Rating Badge - Bottom Left */}
        <div style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          background: "#fff",
          borderRadius: 20,
          padding: "5px 12px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 11,
          fontWeight: 700,
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          zIndex: 2,
        }}>
          <span style={{ color: "#16a34a" }}>{w.rat || "4.0"}</span>
          <span style={{ color: "#16a34a" }}>★</span>
          <span style={{ color: "#d1d5db" }}>|</span>
          <span style={{ color: "#6b7280" }}>{w.rev || "1.7k"}</span>
        </div>

        {/* Wishlist Button - Top Right (on hover) - Myntra Style */}
        {isHovered && !showDelete && toggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(w);
            }}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "#fff",
              border: "1px solid #d1d5db",
              borderRadius: 50,
              width: 40,
              height: 40,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: isInWishlist && isInWishlist(key) ? "#ef4444" : "#6b7280",
              zIndex: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease",
              animation: "fadeIn 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#374151";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#d1d5db";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {isInWishlist && isInWishlist(key) ? "❤️" : "♡"}
          </button>
        )}

        {/* Delete Button (for dealer dashboard) */}
        {showDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(key); }}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 32,
              height: 32,
              background: "#fff",
              border: "none",
              borderRadius: 50,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              transition: "all 0.2s",
              zIndex: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fee2e2";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.transform = "scale(1)";
            }}
            title="Delete product"
          >
            🗑
          </button>
        )}

        {/* Badge (Hot/Sale/New) */}
        {w.badge && (
          <span style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "#ef4444",
            color: "#fff",
            fontSize: 10,
            fontWeight: 800,
            padding: "4px 10px",
            borderRadius: 4,
            zIndex: 2,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}>
            {w.badge}
          </span>
        )}

        {/* Add to Cart Button - Overlay on Image (on hover) */}
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isInCart(key)) {
                removeFromCart(key);
              } else {
                addToCart(w);
              }
            }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "14px",
              background: isInCart(key) ? "#16a34a" : "#fff",
              color: isInCart(key) ? "#fff" : "#111827",
              border: isInCart(key) ? "none" : "1px solid #d1d5db",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "Assistant, sans-serif",
              animation: "slideUp 0.3s ease",
              zIndex: 3,
              letterSpacing: 0.3,
            }}
            onMouseEnter={(e) => {
              if (isInCart(key)) {
                e.currentTarget.style.background = "#15803d";
              } else {
                e.currentTarget.style.background = "#f9fafb";
              }
            }}
            onMouseLeave={(e) => {
              if (isInCart(key)) {
                e.currentTarget.style.background = "#16a34a";
              } else {
                e.currentTarget.style.background = "#fff";
              }
            }}
          >
            {isInCart(key) ? (
              <>
                <span style={{ fontSize: 16 }}>✓</span>
                <span>ADDED TO BAG</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 16 }}>🛒</span>
                <span>ADD TO BAG</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* ═══════════════════════════════════════
          CONTENT SECTION
      ═══════════════════════════════════════ */}
      <div style={{
        padding: "8px 6px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}>
        {/* Brand Name */}
        {w.brand && (
          <div style={{
            fontSize: 11,
            fontWeight: 800,
            color: "#111827",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}>
            {w.brand}
          </div>
        )}

        {/* Product Name */}
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#111827",
          lineHeight: 1.3,
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          marginBottom: 2,
        }}>
          {w.name}
        </div>

        {/* Price Section */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
        }}>
          {/* Current Price */}
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#111827",
            lineHeight: 1,
          }}>
            {w.price}
          </span>

          {/* Original Price */}
          {w.mrp && (
            <span style={{
              fontSize: 11,
              color: "#9ca3af",
              textDecoration: "line-through",
              fontWeight: 400,
            }}>
              {w.mrp}
            </span>
          )}

          {/* Discount */}
          {w.off && (
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#ff905a",
            }}>
              ({w.off})
            </span>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          ANIMATIONS
      ═══════════════════════════════════════ */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
