// Mobile Menu Component
import { useState, useEffect } from "react";
import "./mobile-responsive.css";

export default function MobileMenu({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Add mobile menu button and overlay to the dashboard
  useEffect(() => {
    const handleMenuToggle = () => {
      const sidebar = document.querySelector(".sb");
      const overlay = document.querySelector(".mobile-overlay");
      
      if (sidebar) {
        sidebar.classList.toggle("active");
      }
      if (overlay) {
        overlay.classList.toggle("active");
      }
      setMenuOpen(prev => !prev);
    };

    // Create mobile menu button
    const topbar = document.querySelector(".tb");
    if (topbar && !document.querySelector(".mobile-menu-btn")) {
      const menuBtn = document.createElement("button");
      menuBtn.className = "mobile-menu-btn";
      menuBtn.innerHTML = "☰";
      menuBtn.onclick = handleMenuToggle;
      topbar.insertBefore(menuBtn, topbar.firstChild);
    }

    // Create overlay
    if (!document.querySelector(".mobile-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "mobile-overlay";
      overlay.onclick = handleMenuToggle;
      document.body.appendChild(overlay);
    }

    // Close menu when clicking sidebar links
    const sidebarLinks = document.querySelectorAll(".sb-link, .sb-logout");
    sidebarLinks.forEach(link => {
      link.addEventListener("click", () => {
        const sidebar = document.querySelector(".sb");
        const overlay = document.querySelector(".mobile-overlay");
        if (sidebar) sidebar.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
        setMenuOpen(false);
      });
    });

    return () => {
      const btn = document.querySelector(".mobile-menu-btn");
      const overlay = document.querySelector(".mobile-overlay");
      if (btn) btn.remove();
      if (overlay) overlay.remove();
    };
  }, []);

  return <>{children}</>;
}
