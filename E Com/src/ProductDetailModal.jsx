// ─────────────────────────────────────────
//  src/ProductDetailModal.jsx - Flipkart-style Product Detail View
// ─────────────────────────────────────────
import { useState, useEffect } from "react";

export default function ProductDetailModal({ product, onClose, addToCart, isInCart }) {
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  
  if (!product) return null;

  const key = product._id || product.id;
  const inCart = isInCart(key);
  const isRealImage = product.img && (product.img.startsWith("http") || product.img.startsWith("data:image"));
  
  // Combine primary image with additional images
  const allImages = [];
  if (isRealImage) allImages.push(product.img);
  if (product.images && Array.isArray(product.images)) {
    allImages.push(...product.images.filter(img => img && (img.startsWith("http") || img.startsWith("data:image"))));
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
  };

  // Scroll to top when modal opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* Fullscreen Image Viewer */}
      {fullscreenImage !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.95)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
            animation: "fadeIn 0.3s ease",
          }}
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              backdropFilter: "blur(10px)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              e.currentTarget.style.borderColor = "#fff";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(0,0,0,0.5)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
            }}
          >
            ✕
          </button>
          <img
            src={allImages[fullscreenImage]}
            alt="Fullscreen view"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: 8,
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          />
          {allImages.length > 1 && (
            <div style={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 8,
              background: "rgba(0,0,0,0.5)",
              padding: 12,
              borderRadius: 12,
              backdropFilter: "blur(10px)",
            }}>
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenImage(idx);
                  }}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    border: "none",
                    background: idx === fullscreenImage ? "#fbbf24" : "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Detail Section - Inline (not overlay) */}
      <div 
        className="sec"
        style={{
          maxWidth: "1200px",
          margin: "0 auto 12px",
          animation: "fadeInUp 0.4s ease",
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInUp {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        {/* Header with Back Button */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: "2px solid #f3f4f6",
        }}>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              border: "none",
              color: "#6b7280",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#f3f4f6";
              e.currentTarget.style.color = "#111827";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#6b7280";
            }}
          >
            <span style={{ fontSize: 18 }}>←</span>
            Back to Products
          </button>
          <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>
            {product.category || "General"}
          </div>
        </div>

        {/* Content */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "420px 1fr",
          gap: 40,
        }}>
          {/* Left: Image Gallery */}
          <div>
            {/* Main Image */}
            <div style={{
              background: "#f9fafb",
              borderRadius: 16,
              padding: 24,
              border: "2px solid #f3f4f6",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 400,
              position: "relative",
              cursor: allImages.length > 0 ? "pointer" : "default",
            }}
              onClick={() => allImages.length > 0 && setFullscreenImage(selectedImage)}
            >
              {product.badge && (
                <span style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  background: "linear-gradient(135deg, #111827, #1f2937)",
                  color: "#fbbf24",
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "6px 12px",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}>
                  {product.badge}
                </span>
              )}
              {allImages.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "6px 12px",
                  borderRadius: 8,
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}>
                  <span style={{fontSize:14}}>🔍</span>
                  Click to zoom
                </div>
              )}
              {allImages.length > 0 ? (
                <img
                  src={allImages[selectedImage]}
                  alt={product.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: 400,
                    objectFit: "contain",
                    borderRadius: 12,
                  }}
                />
              ) : (
                <span style={{ fontSize: 120 }}>
                  {product.img && product.img.length < 10 ? product.img : "📦"}
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      minWidth: 70,
                      width: 70,
                      height: 70,
                      borderRadius: 8,
                      border: selectedImage === idx ? "3px solid #fbbf24" : "2px solid #e5e7eb",
                      background: "#f9fafb",
                      cursor: "pointer",
                      overflow: "hidden",
                      transition: "all 0.2s",
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => {
                      if (selectedImage !== idx) {
                        e.currentTarget.style.borderColor = "#fbbf24";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedImage !== idx) {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.transform = "scale(1)";
                      }
                    }}
                  >
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button
                onClick={handleAddToCart}
                disabled={inCart}
                style={{
                  flex: 1,
                  background: inCart ? "linear-gradient(135deg, #16a34a, #15803d)" : "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 20px",
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: inCart ? "not-allowed" : "pointer",
                  fontFamily: "Poppins, sans-serif",
                  boxShadow: "0 4px 16px rgba(251, 191, 36, 0.3)",
                  transition: "all 0.3s",
                  opacity: inCart ? 0.7 : 1,
                }}
                onMouseEnter={e => !inCart && (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={e => !inCart && (e.currentTarget.style.transform = "translateY(0)")}
              >
                {inCart ? "✓ In Cart" : "🛒 Add to Cart"}
              </button>
              <button
                style={{
                  width: 50,
                  height: 50,
                  background: "#fff",
                  border: "2px solid #e5e7eb",
                  borderRadius: 10,
                  fontSize: 20,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#fbbf24";
                  e.currentTarget.style.background = "#fffbf0";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.background = "#fff";
                }}
              >
                ❤️
              </button>
            </div>
          </div>

          {/* Right: Product Info */}
          <div style={{ overflow: "auto" }}>
            {/* Product Name */}
            <h1 style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#111827",
              marginBottom: 8,
              lineHeight: 1.3,
              letterSpacing: "-0.5px",
            }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                background: "linear-gradient(135deg, #111827, #1f2937)",
                color: "#fbbf24",
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}>
                ★ {product.rat || "4.0"}
              </div>
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                {product.rev || "100"} ratings
              </span>
            </div>

            {/* Price */}
            <div style={{
              background: "linear-gradient(135deg, #f9fafb, #ffffff)",
              border: "2px solid #f3f4f6",
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: "#111827" }}>
                  {product.price}
                </span>
                <span style={{
                  fontSize: 20,
                  color: "#9ca3af",
                  textDecoration: "line-through",
                  fontWeight: 500,
                }}>
                  {product.mrp}
                </span>
                <span style={{
                  background: "#dcfce7",
                  color: "#16a34a",
                  fontSize: 14,
                  fontWeight: 800,
                  padding: "4px 12px",
                  borderRadius: 8,
                }}>
                  {product.off}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                ✓ You save {product.mrp ? `₹${parseInt(product.mrp.replace(/[^0-9]/g, "")) - parseInt(product.price.replace(/[^0-9]/g, ""))}` : ""}
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8,
                letterSpacing: "0.5px",
              }}>
                QUANTITY
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: "2px solid #e5e7eb",
                    background: "#fff",
                    fontSize: 18,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#fbbf24";
                    e.currentTarget.style.background = "#fffbf0";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  −
                </button>
                <span style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#111827",
                  minWidth: 40,
                  textAlign: "center",
                }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: "2px solid #e5e7eb",
                    background: "#fff",
                    fontSize: 18,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#fbbf24";
                    e.currentTarget.style.background = "#fffbf0";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Product Highlights */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#111827",
                marginBottom: 12,
                letterSpacing: "-0.3px",
              }}>
                Product Highlights
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "✓", text: "100% Original Product", color: "#16a34a" },
                  { icon: "🚚", text: "Free Delivery on orders above ₹499", color: "#2563eb" },
                  { icon: "↩️", text: "7 Days Easy Return Policy", color: "#f59e0b" },
                  { icon: "💳", text: "Cash on Delivery Available", color: "#8b5cf6" },
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    background: "#f9fafb",
                    borderRadius: 10,
                    border: "1px solid #f3f4f6",
                  }}>
                    <span style={{
                      fontSize: 16,
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `${item.color}22`,
                      borderRadius: 8,
                    }}>
                      {item.icon}
                    </span>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Description */}
            <div>
              <div style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#111827",
                marginBottom: 12,
                letterSpacing: "-0.3px",
              }}>
                Product Description
              </div>
              <div style={{
                fontSize: 14,
                color: "#6b7280",
                lineHeight: 1.7,
                padding: 16,
                background: "#f9fafb",
                borderRadius: 12,
                border: "1px solid #f3f4f6",
              }}>
                {product.description && product.description.trim() ? (
                  <div style={{ whiteSpace: "pre-wrap" }}>{product.description}</div>
                ) : (
                  <>
                    <p style={{ marginBottom: 12 }}>
                      This is a premium quality {product.name} from the {product.category || "General"} category. 
                      Perfect for your daily needs with excellent build quality and durability.
                    </p>
                    <p>
                      <strong style={{ color: "#111827" }}>Key Features:</strong>
                    </p>
                    <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                      <li>High-quality materials</li>
                      <li>Long-lasting durability</li>
                      <li>Modern design</li>
                      <li>Great value for money</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
