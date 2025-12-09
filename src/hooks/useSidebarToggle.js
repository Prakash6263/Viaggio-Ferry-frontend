import { useEffect } from "react";

export default function useSidebarToggle() {
  useEffect(() => {
    const body = document.body;
    const toggleBtn = document.getElementById("toggle_btn");   // desktop hamburger
    const mobileBtn = document.getElementById("mobile_btn");   // mobile hamburger
    const sidebar = document.getElementById("sidebar");

    if (!sidebar) return; // nothing to do

    // ---------- helpers ----------
    const ensureOverlay = () => {
      let ov = document.querySelector(".sidebar-overlay");
      if (!ov) {
        ov = document.createElement("div");
        ov.className = "sidebar-overlay";
        document.body.appendChild(ov);
      }
      return ov;
    };

    const openMobile = (e) => {
      e?.preventDefault?.();
      body.classList.add("slide-nav");
      const ov = ensureOverlay();
      const close = () => {
        body.classList.remove("slide-nav");
        ov.removeEventListener("click", close);
        ov.parentNode && ov.parentNode.removeChild(ov);
      };
      ov.addEventListener("click", close);
    };

    const toggleDesktop = (e) => {
      e?.preventDefault?.();
      // collapse/expand sidebar on desktop
      body.classList.toggle("mini-sidebar");
      // when collapsing, remove any expanded menus
      if (body.classList.contains("mini-sidebar")) {
        document.querySelectorAll(".submenu ul").forEach((ul) => (ul.style.display = ""));
        document.querySelectorAll(".submenu > a").forEach((a) => a.classList.remove("subdrop"));
      }
    };

    // Hover expand when in mini-sidebar (common in these templates)
    const onSidebarMouseEnter = () => {
      if (body.classList.contains("mini-sidebar")) {
        body.classList.add("expand-menu");
      }
    };
    const onSidebarMouseLeave = () => {
      if (body.classList.contains("mini-sidebar")) {
        body.classList.remove("expand-menu");
      }
    };

    // ---------- bind ----------
    toggleBtn?.addEventListener("click", toggleDesktop);
    mobileBtn?.addEventListener("click", openMobile);
    sidebar.addEventListener("mouseenter", onSidebarMouseEnter);
    sidebar.addEventListener("mouseleave", onSidebarMouseLeave);

    // ---------- cleanup ----------
    return () => {
      toggleBtn?.removeEventListener("click", toggleDesktop);
      mobileBtn?.removeEventListener("click", openMobile);
      sidebar.removeEventListener("mouseenter", onSidebarMouseEnter);
      sidebar.removeEventListener("mouseleave", onSidebarMouseLeave);
      const ov = document.querySelector(".sidebar-overlay");
      if (ov) ov.parentNode && ov.parentNode.removeChild(ov);
    };
  }, []);
}
