import { useEffect } from "react";
export default function useSidebarDefaultOpen() {
  useEffect(() => {
    document.body.classList.remove("mini-sidebar"); // show full labels
  }, []);
}
