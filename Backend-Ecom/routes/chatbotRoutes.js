// routes/chatbotRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// ── CHATBOT ENDPOINT WITH AI ACTIONS ──
router.post("/", async (req, res) => {
  const { message, userType, history, userEmail, userName } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      console.log("❌ GROQ_API_KEY not found in environment variables");
      return res.status(500).json({ 
        response: "Sorry, the chatbot is not configured. Please add GROQ_API_KEY to your .env file."
      });
    }

    console.log("✅ API Key found, making request to Groq...");

    // Define available actions
    const availableActions = userType === "dealer" 
      ? `Available actions you can perform:
- view_orders: View all orders
- view_products: View all products
- get_stats: Get business statistics`
      : `Available actions you can perform:
- view_my_orders: View user's orders
- cancel_order: Cancel an order (requires order ID)
- search_products: Search for products
- file_complaint: File a complaint
- track_order: Track order status`;

    const systemContext = userType === "dealer"
      ? `You are a helpful AI assistant for ShopHub dealers. You can help with products, orders, and business growth.

${availableActions}

When a user asks to perform an action, respond with a JSON object in this format:
{"action": "action_name", "params": {...}, "message": "user-friendly message"}

For example:
- "Show my orders" → {"action": "view_orders", "message": "Here are your orders"}
- "What are my sales?" → {"action": "get_stats", "message": "Here are your business statistics"}

If no action is needed, just respond normally without JSON.`
      : `You are a helpful AI shopping assistant for ShopHub. You can help customers with orders, products, and support.

${availableActions}

When a user asks to perform an action, respond with a JSON object in this format:
{"action": "action_name", "params": {...}, "message": "user-friendly message"}

For example:
- "Cancel my order #ORD-1234" → {"action": "cancel_order", "params": {"orderId": "#ORD-1234"}, "message": "I'll cancel order #ORD-1234 for you"}
- "Show my orders" → {"action": "view_my_orders", "message": "Here are your orders"}
- "I want to complain about delivery" → {"action": "file_complaint", "params": {"complaint": "delivery issue"}, "message": "I've recorded your complaint about delivery"}

If no action is needed, just respond normally without JSON.`;

    // Build messages array with history
    const messages = [
      { role: "system", content: systemContext }
    ];

    // Add conversation history
    if (history && history.length > 0) {
      history.slice(-6).forEach(msg => {
        messages.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content
        });
      });
    }

    // Add current message
    messages.push({ role: "user", content: message });

    // Use https module
    const https = require('https');
    const postData = JSON.stringify({
      model: "llama-3.3-70b-versatile", // Updated model
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const apiResponse = await new Promise((resolve, reject) => {
      const req = https.request(options, (apiRes) => {
        let data = '';
        apiRes.on('data', (chunk) => { data += chunk; });
        apiRes.on('end', () => {
          try {
            resolve({ status: apiRes.statusCode, data: JSON.parse(data) });
          } catch (e) {
            reject(new Error('Failed to parse response'));
          }
        });
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    console.log("📡 Groq API Response Status:", apiResponse.status);

    if (apiResponse.status !== 200) {
      console.error("❌ Groq API Error:", JSON.stringify(apiResponse.data, null, 2));
      throw new Error(apiResponse.data.error?.message || "Groq API error");
    }

    let aiResponse = apiResponse.data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    
    console.log("✅ AI Response:", aiResponse);

    // Check if AI wants to perform an action
    let actionResult = null;
    try {
      // Try to parse JSON action from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*"action"[\s\S]*\}/);
      if (jsonMatch) {
        const actionData = JSON.parse(jsonMatch[0]);
        console.log("🎯 Action detected:", actionData.action);

        // Execute the action
        switch (actionData.action) {
          case "view_my_orders":
            if (userEmail) {
              const orders = await Order.find({ userName: userEmail }).sort({ createdAt: -1 }).limit(10);
              actionResult = {
                type: "orders",
                data: orders,
                message: actionData.message || "Here are your recent orders"
              };
            }
            break;

          case "cancel_order":
            if (actionData.params?.orderId && userEmail) {
              const order = await Order.findOne({ 
                id: actionData.params.orderId,
                userName: userEmail 
              });
              if (order && order.status !== "Cancelled" && order.status !== "Delivered") {
                order.status = "Cancelled";
                order.cancelReason = "Cancelled by customer via chatbot";
                order.cancelledBy = "user";
                await order.save();
                actionResult = {
                  type: "success",
                  message: `✅ Order ${actionData.params.orderId} has been cancelled successfully.`
                };
              } else {
                actionResult = {
                  type: "error",
                  message: order ? "This order cannot be cancelled (already delivered or cancelled)" : "Order not found"
                };
              }
            }
            break;

          case "search_products":
            const searchTerm = actionData.params?.query || message;
            const products = await Product.find({
              name: { $regex: searchTerm, $options: 'i' }
            }).limit(5);
            actionResult = {
              type: "products",
              data: products,
              message: actionData.message || `Found ${products.length} products`
            };
            break;

          case "file_complaint":
            // Store complaint (you can create a Complaint model later)
            actionResult = {
              type: "success",
              message: "✅ Your complaint has been recorded. Our support team will contact you within 24 hours."
            };
            break;

          case "track_order":
            if (actionData.params?.orderId && userEmail) {
              const order = await Order.findOne({ 
                id: actionData.params.orderId,
                userName: userEmail 
              });
              if (order) {
                actionResult = {
                  type: "order_status",
                  data: order,
                  message: `Order ${order.id} is currently: ${order.status}`
                };
              }
            }
            break;

          case "view_orders":
            // For dealers
            const allOrders = await Order.find().sort({ createdAt: -1 }).limit(10);
            actionResult = {
              type: "orders",
              data: allOrders,
              message: actionData.message || "Here are recent orders"
            };
            break;

          case "view_products":
            // For dealers
            const allProducts = await Product.find().limit(10);
            actionResult = {
              type: "products",
              data: allProducts,
              message: actionData.message || "Here are your products"
            };
            break;

          case "get_stats":
            // For dealers
            const totalOrders = await Order.countDocuments();
            const totalProducts = await Product.countDocuments();
            const orders = await Order.find();
            const revenue = orders.reduce((sum, o) => {
              const amt = parseInt(o.amt.replace(/[^0-9]/g, "")) || 0;
              return sum + amt;
            }, 0);
            actionResult = {
              type: "stats",
              data: { totalOrders, totalProducts, revenue },
              message: `📊 Stats: ${totalOrders} orders, ${totalProducts} products, ₹${revenue.toLocaleString("en-IN")} revenue`
            };
            break;
        }

        // If action was executed, use the action message
        if (actionResult) {
          aiResponse = actionResult.message;
        }
      }
    } catch (e) {
      console.log("No action detected or action failed:", e.message);
    }

    res.json({ 
      response: aiResponse,
      action: actionResult
    });

  } catch (err) {
    console.error("❌ Chatbot error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ 
      response: "Sorry, I'm having trouble right now. Please try again later.",
      error: err.message
    });
  }
});

module.exports = router;
