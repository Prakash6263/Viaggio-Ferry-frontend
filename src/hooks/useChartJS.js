import { useEffect, useRef } from "react";


/**
* Initialize a Chart.js chart on a <canvas> by id.
* - Requires Chart.js UMD to be loaded globally in public/index.html
* - Returns a ref you can attach to ensure cleanup.
*/
export function useChartJS({ canvasId, config }) {
const chartRef = useRef(null);


useEffect(() => {
const el = document.getElementById(canvasId);
if (!el || !window.Chart) return;


// destroy if already exists (hot reload / remount)
try {
if (chartRef.current) {
chartRef.current.destroy();
}
} catch {}


chartRef.current = new window.Chart(el.getContext("2d"), config);


return () => {
try { chartRef.current && chartRef.current.destroy(); } catch {}
chartRef.current = null;
};
}, [canvasId, JSON.stringify(config)]);


return chartRef;
}