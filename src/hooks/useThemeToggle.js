import { useEffect } from "react";

export function useThemeToggle() {
  useEffect(() => {
    const themeToggle = document.getElementById("themeToggle");
    const html = document.documentElement;

    // load saved theme
    if (localStorage.getItem("theme") === "dark") {
      html.setAttribute("data-theme", "dark");
      if (themeToggle) themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
    }

    const onToggle = () => {
      if (html.getAttribute("data-theme") === "dark") {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        if (themeToggle) themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        if (themeToggle) themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
    };

    themeToggle?.addEventListener("click", onToggle);
    return () => themeToggle?.removeEventListener("click", onToggle);
  }, []);
}
