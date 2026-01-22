/**
 * ICON MAP CONFIGURATION
 * ======================
 * Maps backend icon codes to CSS icon classes.
 * The sidebar renders icons using CSS classes (font icons).
 * 
 * Backend sends icon codes like: "fe-home", "fa-user", "fa-cog"
 * This map ensures consistent rendering.
 */

/**
 * Icon code to CSS class mapping
 * Supports both Feather icons (fe-*) and Font Awesome icons (fa-*)
 */
export const iconMap = {
  // Feather Icons
  "fe-home": "fe fe-home",
  "fe-globe": "fe fe-globe",
  "fe-users": "fe fe-users",
  "fe-power": "fe fe-power",
  "fe-settings": "fe fe-settings",
  "fe-bell": "fe fe-bell",
  "fe-calendar": "fe fe-calendar",
  "fe-file-text": "fe fe-file-text",
  "fe-bar-chart": "fe fe-bar-chart",
  "fe-clipboard": "fe fe-clipboard",
  "fe-anchor": "fe fe-anchor",
  "fe-truck": "fe fe-truck",
  "fe-box": "fe fe-box",
  "fe-check-circle": "fe fe-check-circle",
  "fe-edit": "fe fe-edit",
  "fe-trash": "fe fe-trash",
  "fe-plus": "fe fe-plus",

  // Font Awesome Icons
  "fa-user": "fa fa-user",
  "fa-users": "fa fa-users",
  "fa-cog": "fa fa-cog",
  "fa-cogs": "fa fa-cogs",
  "fa-shopping-cart": "fa fa-shopping-cart",
  "fa-credit-card": "fa fa-credit-card",
  "fa-clipboard-list": "fa fa-clipboard-list",
  "fa-bell": "fa fa-bell",
  "fa-chart-line": "fa fa-chart-line",
  "fa-chart-bar": "fa fa-chart-bar",
  "fa-chart-pie": "fa fa-chart-pie",
  "fa-ship": "fa fa-ship",
  "fa-anchor": "fa fa-anchor",
  "fa-truck": "fa fa-truck",
  "fa-box": "fa fa-box",
  "fa-tags": "fa fa-tags",
  "fa-percent": "fa fa-percent",
  "fa-dollar-sign": "fa fa-dollar-sign",
  "fa-file-invoice": "fa fa-file-invoice",
  "fa-file-invoice-dollar": "fa fa-file-invoice-dollar",
  "fa-building": "fa fa-building",
  "fa-sitemap": "fa fa-sitemap",
  "fa-list": "fa fa-list",
  "fa-list-alt": "fa fa-list-alt",
  "fa-th-list": "fa fa-th-list",
  "fa-ticket-alt": "fa fa-ticket-alt",
  "fa-receipt": "fa fa-receipt",
  "fa-money-bill": "fa fa-money-bill",
  "fa-money-check": "fa fa-money-check",
  "fa-wallet": "fa fa-wallet",
  "fa-university": "fa fa-university",
  "fa-book": "fa fa-book",
  "fa-calendar": "fa fa-calendar",
  "fa-calendar-alt": "fa fa-calendar-alt",
  "fa-clock": "fa fa-clock",
  "fa-check": "fa fa-check",
  "fa-check-circle": "fa fa-check-circle",
  "fa-times": "fa fa-times",
  "fa-times-circle": "fa fa-times-circle",
  "fa-exclamation-triangle": "fa fa-exclamation-triangle",
  "fa-info-circle": "fa fa-info-circle",
  "fa-question-circle": "fa fa-question-circle",
  "fa-eye": "fa fa-eye",
  "fa-edit": "fa fa-edit",
  "fa-trash": "fa fa-trash",
  "fa-plus": "fa fa-plus",
  "fa-minus": "fa fa-minus",
  "fa-search": "fa fa-search",
  "fa-filter": "fa fa-filter",
  "fa-download": "fa fa-download",
  "fa-upload": "fa fa-upload",
  "fa-print": "fa fa-print",
  "fa-envelope": "fa fa-envelope",
  "fa-phone": "fa fa-phone",
  "fa-map-marker": "fa fa-map-marker",
  "fa-globe": "fa fa-globe",
  "fa-link": "fa fa-link",
  "fa-lock": "fa fa-lock",
  "fa-unlock": "fa fa-unlock",
  "fa-key": "fa fa-key",
  "fa-shield-alt": "fa fa-shield-alt",
  "fa-user-shield": "fa fa-user-shield",
  "fa-user-cog": "fa fa-user-cog",
  "fa-user-plus": "fa fa-user-plus",
  "fa-user-minus": "fa fa-user-minus",
  "fa-user-check": "fa fa-user-check",
  "fa-user-times": "fa fa-user-times",
}

/**
 * Get CSS class for an icon code
 * @param {string} iconCode - Icon code from backend (e.g., "fe-home", "fa-user")
 * @returns {string} CSS class string for the icon
 */
export const getIconClass = (iconCode) => {
  if (!iconCode) return "fe fe-circle" // Default fallback icon

  // Check if icon exists in map
  if (iconMap[iconCode]) {
    return iconMap[iconCode]
  }

  // If icon code is already a valid class format, return as is
  if (iconCode.startsWith("fe ") || iconCode.startsWith("fa ")) {
    return iconCode
  }

  // Try to construct class from code
  if (iconCode.startsWith("fe-")) {
    return `fe ${iconCode}`
  }

  if (iconCode.startsWith("fa-")) {
    return `fa ${iconCode}`
  }

  // Fallback to default icon
  return "fe fe-circle"
}

export default iconMap
