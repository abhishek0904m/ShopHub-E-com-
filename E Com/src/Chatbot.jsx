import { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "./config";

export default function Chatbot({ userType = "user", userEmail = "", userName = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: userType === "dealer" 
        ? "👋 Hi! I'm your ShopHub assistant. I can help you with managing products, orders, and answering customer queries."
        : "👋 Hi! I'm your ShopHub assistant. How can I help you today? Ask me about products, orders, or anything else!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Call Groq API with user info
      const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          userType,
          userEmail,
          userName,
          history: messages.slice(-10), // Send last 10 messages for context
        }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || "Failed to get response");

      // Add assistant response with action data
      const assistantMessage = {
        role: "assistant",
        content: data.response,
        action: data.action // Include action results
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I'm having trouble connecting right now. Please try again later." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        .chatbot-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          font-family: 'Instrument Sans', sans-serif;
        }

        .chatbot-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border: none;
          box-shadow: 0 4px 20px rgba(251, 191, 36, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          transition: all 0.3s ease;
          animation: pulse 2s infinite;
        }

        .chatbot-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 30px rgba(251, 191, 36, 0.6);
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(251, 191, 36, 0.4); }
          50% { box-shadow: 0 4px 30px rgba(251, 191, 36, 0.7); }
        }

        .chatbot-window {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: 380px;
          height: 550px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chatbot-header {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
        }

        .chatbot-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chatbot-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .chatbot-title {
          font-size: 16px;
          font-weight: 800;
        }

        .chatbot-subtitle {
          font-size: 11px;
          opacity: 0.9;
        }

        .chatbot-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: white;
          transition: all 0.2s;
        }

        .chatbot-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f9fafb;
        }

        .chatbot-message {
          margin-bottom: 16px;
          display: flex;
          gap: 10px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chatbot-message.user {
          flex-direction: row-reverse;
        }

        .chatbot-message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .chatbot-message.assistant .chatbot-message-avatar {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
        }

        .chatbot-message.user .chatbot-message-avatar {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }

        .chatbot-message-content {
          max-width: 75%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
        }

        .chatbot-message.assistant .chatbot-message-content {
          background: white;
          color: #111827;
          border: 1px solid #e5e7eb;
        }

        .chatbot-message.user .chatbot-message-content {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
        }

        .chatbot-input-area {
          padding: 16px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .chatbot-input-wrapper {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

        .chatbot-input {
          flex: 1;
          padding: 12px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-family: 'Instrument Sans', sans-serif;
          outline: none;
          resize: none;
          max-height: 100px;
          transition: border-color 0.2s;
        }

        .chatbot-input:focus {
          border-color: #fbbf24;
        }

        .chatbot-send {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .chatbot-send:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
        }

        .chatbot-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chatbot-typing {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
        }

        .chatbot-typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #9ca3af;
          animation: typing 1.4s infinite;
        }

        .chatbot-typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .chatbot-typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
      `}</style>

      <div className="chatbot-container">
        {!isOpen ? (
          <button className="chatbot-button" onClick={() => setIsOpen(true)}>
            💬
          </button>
        ) : (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <div className="chatbot-header-left">
                <div className="chatbot-avatar">🤖</div>
                <div>
                  <div className="chatbot-title">ShopHub Assistant</div>
                  <div className="chatbot-subtitle">Always here to help</div>
                </div>
              </div>
              <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="chatbot-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chatbot-message ${msg.role}`}>
                  <div className="chatbot-message-avatar">
                    {msg.role === "assistant" ? "🤖" : "👤"}
                  </div>
                  <div className="chatbot-message-content">
                    {msg.content}
                    
                    {/* Display action results */}
                    {msg.action && msg.action.type === "products" && msg.action.data && (
                      <div style={{ marginTop: 12, padding: 10, background: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#0369a1", marginBottom: 8 }}>
                          📦 Found {msg.action.data.length} products:
                        </div>
                        {msg.action.data.slice(0, 3).map((product, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: i < 2 ? "1px solid #e0f2fe" : "none" }}>
                            {product.img && (
                              <img src={product.img} alt={product.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>{product.name}</div>
                              <div style={{ fontSize: 11, color: "#0369a1", fontWeight: 700 }}>{product.price}</div>
                            </div>
                          </div>
                        ))}
                        {msg.action.data.length > 3 && (
                          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6, textAlign: "center" }}>
                            +{msg.action.data.length - 3} more products
                          </div>
                        )}
                      </div>
                    )}
                    
                    {msg.action && msg.action.type === "orders" && msg.action.data && (
                      <div style={{ marginTop: 12, padding: 10, background: "#fef3c7", borderRadius: 8, border: "1px solid #fde68a" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>
                          🧾 Your Orders ({msg.action.data.length}):
                        </div>
                        {msg.action.data.slice(0, 3).map((order, i) => (
                          <div key={i} style={{ padding: "6px 0", borderBottom: i < 2 ? "1px solid #fde68a" : "none" }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>{order.item}</div>
                            <div style={{ fontSize: 11, color: "#92400e", marginTop: 2 }}>
                              {order.id} • {order.status} • {order.amt}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {msg.action && msg.action.type === "stats" && msg.action.data && (
                      <div style={{ marginTop: 12, padding: 10, background: "#dcfce7", borderRadius: 8, border: "1px solid #86efac" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#166534", marginBottom: 8 }}>
                          📊 Your Statistics:
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          <div style={{ fontSize: 11, color: "#166534" }}>
                            Orders: <strong>{msg.action.data.totalOrders}</strong>
                          </div>
                          <div style={{ fontSize: 11, color: "#166534" }}>
                            Products: <strong>{msg.action.data.totalProducts}</strong>
                          </div>
                          <div style={{ fontSize: 11, color: "#166534", gridColumn: "1 / -1" }}>
                            Revenue: <strong>₹{msg.action.data.revenue.toLocaleString("en-IN")}</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="chatbot-message assistant">
                  <div className="chatbot-message-avatar">🤖</div>
                  <div className="chatbot-message-content">
                    <div className="chatbot-typing">
                      <div className="chatbot-typing-dot"></div>
                      <div className="chatbot-typing-dot"></div>
                      <div className="chatbot-typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input-area">
              <div className="chatbot-input-wrapper">
                <textarea
                  className="chatbot-input"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={1}
                  disabled={loading}
                />
                <button 
                  className="chatbot-send" 
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                >
                  {loading ? "⏳" : "➤"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
