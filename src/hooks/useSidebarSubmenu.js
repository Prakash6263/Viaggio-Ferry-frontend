import { useEffect } from "react";

/**
 * Enables sidebar dropdowns:
 * - Click on .submenu > a toggles its next <ul>
 * - Only one submenu open at a time (like the template)
 * - Auto-opens the submenu that contains the current route
 */
export default function useSidebarSubmenu() {
  useEffect(() => {
    const body = document.body;

    const closeAll = (except) => {
      document.querySelectorAll(".sidebar-menu .submenu > a.subdrop").forEach((a) => {
        if (a === except) return;
        a.classList.remove("subdrop");
        const ul = a.nextElementSibling;
        if (ul) ul.style.display = "none";
      });
    };

    const onToggle = (e) => {
      e.preventDefault();
      // If sidebar is collapsed on desktop, let the hover-expand handle UX
      if (body.classList.contains("mini-sidebar")) return;

      const link = e.currentTarget;
      const sub = link.nextElementSibling;
      const isOpen = link.classList.contains("subdrop");

      if (isOpen) {
        link.classList.remove("subdrop");
        if (sub) sub.style.display = "none";
      } else {
        closeAll(link);
        link.classList.add("subdrop");
        if (sub) sub.style.display = "block";
      }
    };

    // Bind click handlers
    const toggles = Array.from(document.querySelectorAll(".sidebar-menu .submenu > a"));
    toggles.forEach((a) => a.addEventListener("click", onToggle));

    // Auto-open the submenu that contains the current path
    const currentPath = window.location.pathname;
    document.querySelectorAll(".sidebar-menu .submenu").forEach((li) => {
      const match = li.querySelector(`ul a[href="${currentPath}"]`);
      if (match) {
        const a = li.querySelector(":scope > a");
        const ul = a?.nextElementSibling;
        a?.classList.add("subdrop");
        if (ul) ul.style.display = "block";
      }
    });

    return () => {
      toggles.forEach((a) => a.removeEventListener("click", onToggle));
    };
  }, []);
}
