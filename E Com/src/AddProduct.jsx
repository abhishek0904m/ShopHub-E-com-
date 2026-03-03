// ─────────────────────────────────────────
//  src/AddProduct.jsx
// ─────────────────────────────────────────
import { useState } from "react";

const CATEGORIES = ["Electronics","Fashion","Home","Beauty","Books","Sports","Toys","Kitchen","Automotive","General"];

const EMPTY = { name:"", rawPrice:"", img:"", images:[], description:"", category:"Electronics", brand:"" };

export default function AddProduct({ onAdd, products, onDelete, dealerId, dealerCode }) {
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(null); // for primary image file preview
  const [additionalPreviews, setAdditionalPreviews] = useState([]); // for additional images

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  // Handle image file upload → convert to base64 for preview & storage
  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setPreview(base64);
      set("img", base64);
    };
    reader.readAsDataURL(file);
  };

  // Handle additional images upload
  const handleAdditionalImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(base64Images => {
      const newImages = [...form.images, ...base64Images];
      set("images", newImages);
      setAdditionalPreviews(newImages);
    });
  };

  const removeAdditionalImage = (index) => {
    const newImages = form.images.filter((_, i) => i !== index);
    set("images", newImages);
    setAdditionalPreviews(newImages);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.rawPrice) {
      alert("Please fill in Product Name and Price.");
      return;
    }
    setSaving(true);
    try {
      await onAdd(form);
      setSuccess(true);
      setForm(EMPTY);
      setPreview(null);
      setAdditionalPreviews([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert("Error saving product: " + e.message);
    }
    setSaving(false);
  };

  // ✅ FIX: support both MongoDB _id and local id
  const getKey = (p) => p._id || p.id;

  return (
    <>
      {/* ── ADD FORM */}
      <div className="sec" style={{marginBottom:12}}>
        <div className="sec-hd">
          <span className="sec-title">➕ Add New Product</span>
          {success && (
            <span style={{background:"#dcfce7",color:"#16a34a",fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:20}}>
              ✓ Product added!
            </span>
          )}
        </div>

        <div className="form-grid">

          {/* Name */}
          <div className="fg full">
            <label>PRODUCT NAME *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Samsung Galaxy S24" />
          </div>

          {/* Brand */}
          <div className="fg">
            <label>BRAND NAME</label>
            <input value={form.brand || ""} onChange={e => set("brand", e.target.value)} placeholder="e.g. MISCHIEF MONKEY" />
          </div>

          {/* Price */}
          <div className="fg">
            <label>PRICE (₹) *</label>
            <input type="number" value={form.rawPrice} onChange={e => set("rawPrice", e.target.value)} placeholder="e.g. 29999" min="1" />
          </div>

          {/* Category */}
          <div className="fg">
            <label>CATEGORY</label>
            <select value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* ✅ NEW: Image upload */}
          <div className="fg full">
            <label>PRIMARY PRODUCT IMAGE</label>
            <div style={{display:"flex",alignItems:"flex-start",gap:16,marginTop:4}}>
              {/* File upload box */}
              <label style={{
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                width:120,height:120,border:"2px dashed #d1d5db",borderRadius:12,cursor:"pointer",
                background:"#f9fafb",transition:"border-color .2s",flexShrink:0
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor="#fbbf24"}
                onMouseLeave={e => e.currentTarget.style.borderColor="#d1d5db"}
              >
                {preview ? (
                  <img src={preview} alt="preview" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:10}} />
                ) : (
                  <>
                    <span style={{fontSize:28,marginBottom:4}}>📷</span>
                    <span style={{fontSize:11,color:"#9ca3af",fontWeight:600}}>Upload Image</span>
                  </>
                )}
                <input type="file" accept="image/*" style={{display:"none"}} onChange={handleImageFile} />
              </label>

              <div style={{flex:1}}>
                <div style={{fontSize:12,color:"#6b7280",marginBottom:8}}>Or paste an image URL:</div>
                <input
                  placeholder="https://example.com/product.jpg"
                  value={preview ? "" : form.img}
                  onChange={e => {
                    set("img", e.target.value);
                    setPreview(null);
                  }}
                  style={{width:"100%",boxSizing:"border-box"}}
                />
                {preview && (
                  <button onClick={() => { setPreview(null); set("img",""); }}
                    style={{marginTop:8,fontSize:11,color:"#dc2626",background:"none",border:"none",cursor:"pointer",padding:0}}>
                    ✕ Remove image
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ✅ NEW: Additional Images */}
          <div className="fg full">
            <label>ADDITIONAL IMAGES (Optional - up to 5 more)</label>
            <div style={{marginTop:8}}>
              <label style={{
                display:"inline-flex",alignItems:"center",gap:8,
                padding:"10px 16px",border:"2px dashed #d1d5db",borderRadius:10,
                cursor:"pointer",background:"#f9fafb",transition:"all .2s",fontSize:13,fontWeight:600,color:"#6b7280"
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor="#fbbf24";
                  e.currentTarget.style.background="#fffbf0";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor="#d1d5db";
                  e.currentTarget.style.background="#f9fafb";
                }}
              >
                <span style={{fontSize:20}}>📸</span>
                Upload Additional Images
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  style={{display:"none"}} 
                  onChange={handleAdditionalImages}
                  disabled={form.images.length >= 5}
                />
              </label>
              
              {/* Preview additional images */}
              {additionalPreviews.length > 0 && (
                <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
                  {additionalPreviews.map((img, idx) => (
                    <div key={idx} style={{position:"relative",width:80,height:80}}>
                      <img src={img} alt={`additional ${idx+1}`} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:8,border:"1px solid #e5e7eb"}} />
                      <button
                        onClick={() => removeAdditionalImage(idx)}
                        style={{
                          position:"absolute",top:-6,right:-6,width:20,height:20,
                          borderRadius:"50%",background:"#dc2626",color:"#fff",
                          border:"2px solid #fff",fontSize:10,cursor:"pointer",
                          display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700
                        }}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ✅ NEW: Product Description */}
          <div className="fg full">
            <label>PRODUCT DESCRIPTION</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Describe your product in detail... Include key features, specifications, materials, dimensions, etc."
              rows={6}
              style={{width:"100%",boxSizing:"border-box",resize:"vertical",minHeight:120}}
            />
            <div style={{fontSize:11,color:"#9ca3af",marginTop:4}}>
              {form.description.length} characters
            </div>
          </div>

        </div>

        {/* Preview */}
        {form.name && form.rawPrice && (
          <div style={{marginTop:18,padding:"14px 16px",background:"#f9fafb",borderRadius:12,border:"1.5px dashed #e5e7eb"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",marginBottom:8}}>PREVIEW</div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              {form.img ? (
                <img src={form.img} alt="product" style={{width:56,height:56,objectFit:"cover",borderRadius:10,border:"1px solid #e5e7eb"}} />
              ) : (
                <div style={{width:56,height:56,background:"#f3f4f6",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>📦</div>
              )}
              <div>
                <div style={{fontWeight:700,color:"#111827",fontSize:14}}>{form.name}</div>
                <div style={{fontSize:13,color:"#6b7280"}}>{form.category}</div>
                <div style={{fontWeight:800,color:"#111827",fontSize:15,marginTop:2}}>
                  ₹{parseInt(form.rawPrice||0).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            marginTop:18,background:"#111827",color:"#fbbf24",border:"none",
            borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:800,
            cursor:saving?"not-allowed":"pointer",opacity:saving?0.55:1,
            display:"flex",alignItems:"center",gap:8
          }}
        >
          {saving ? "⏳ Saving..." : "➕ Add Product"}
        </button>
      </div>

      {/* ── EXISTING PRODUCTS LIST */}
      <div className="sec">
        <div className="sec-hd">
          <span className="sec-title">📋 All Products ({products.length})</span>
        </div>
        {products.length === 0 ? (
          <div style={{textAlign:"center",padding:30,color:"#9ca3af"}}>No products yet.</div>
        ) : (
          <div style={{borderRadius:10,overflow:"hidden",border:"1px solid #f3f4f6"}}>
            {/* Table header */}
            <div style={{
              display:"grid",gridTemplateColumns:"70px minmax(0,1fr) 110px 90px 70px",
              background:"#f9fafb",padding:"10px 14px",
              fontSize:10.5,fontWeight:700,color:"#6b7280",
              letterSpacing:.4,textTransform:"uppercase",borderBottom:"1px solid #e5e7eb"
            }}>
              <span>Image</span>
              <span>Name</span>
              <span>Category</span>
              <span>Price</span>
              <span>Delete</span>
            </div>

            {/* Rows */}
            {products.map(p => (
              <div
                key={getKey(p)}
                style={{
                  display:"grid",gridTemplateColumns:"70px minmax(0,1fr) 110px 90px 70px",
                  padding:"10px 14px",borderBottom:"1px solid #f9fafb",
                  alignItems:"center",fontSize:13,transition:"background .15s"
                }}
                onMouseEnter={e => e.currentTarget.style.background="#fffbf0"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}
              >
                {/* Image or emoji fallback */}
                {p.img && (p.img.startsWith("http") || p.img.startsWith("data:")) ? (
                  <img src={p.img} alt={p.name} style={{width:44,height:44,objectFit:"cover",borderRadius:8,border:"1px solid #e5e7eb"}} />
                ) : (
                  <span style={{fontSize:28}}>{p.img || "📦"}</span>
                )}

                <span style={{color:"#111827",fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",paddingRight:8}}>
                  {p.name}
                </span>
                <span style={{color:"#6b7280",fontSize:12}}>{p.category}</span>
                <span style={{color:"#111827",fontWeight:700}}>{p.price || `₹${p.rawPrice}`}</span>

                {/* ✅ FIX: use getKey() for delete so MongoDB _id works */}
                <button
                  onClick={() => onDelete(getKey(p))}
                  style={{
                    background:"#fee2e2",border:"none",color:"#dc2626",
                    borderRadius:6,padding:"5px 9px",fontSize:13,
                    fontWeight:700,cursor:"pointer"
                  }}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}