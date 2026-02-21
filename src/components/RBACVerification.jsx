/**
 * RBAC Verification Component
 * Use this component to verify that RBAC is working correctly
 * 
 * Shows:
 * - Current user role
 * - Current permissions for currency page
 * - Buttons to test permission changes
 */

import React, { useState } from "react"
import { usePermissions } from "../hooks/usePermissions"
import { useSidebar } from "../context/SidebarContext"
import { usersApi } from "../api/usersApi"
import { formatPermissions } from "../utils/rbacUtils"

export default function RBACVerification() {
  const permissions = usePermissions("/company/administration/currency")
  const { user, menu } = useSidebar()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleReloadSidebar = async () => {
    setLoading(true)
    try {
      const event = new CustomEvent("PERMISSION_UPDATED", {
        detail: { timestamp: Date.now() },
      })
      window.dispatchEvent(event)
      setMessage("✓ Permission update event dispatched! Check console and reload the page.")
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      setMessage("✗ Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      backgroundColor: "#f8f9fa",
      border: "2px solid #05468f",
      borderRadius: "8px",
      padding: "15px",
      maxWidth: "400px",
      zIndex: 9999,
      fontFamily: "monospace",
      fontSize: "12px",
    }}>
      <div style={{ marginBottom: "10px" }}>
        <strong>[RBAC Debug Info]</strong>
        {message && (
          <div style={{
            marginTop: "8px",
            padding: "8px",
            backgroundColor: message.includes("✗") ? "#f8d7da" : "#d4edda",
            borderRadius: "4px",
            color: message.includes("✗") ? "#721c24" : "#155724",
          }}>
            {message}
          </div>
        )}
      </div>

      <div style={{ marginBottom: "8px" }}>
        <div><strong>User Role:</strong> {user?.role || "unknown"}</div>
        <div><strong>User ID:</strong> {user?._id || "N/A"}</div>
      </div>

      <div style={{ marginBottom: "8px", backgroundColor: "#e7f3ff", padding: "8px", borderRadius: "4px" }}>
        <div><strong>Currency Page Permissions:</strong></div>
        <div>Read: {permissions?.read ? "✓" : "✗"}</div>
        <div>Create: {permissions?.create ? "✓" : "✗"}</div>
        <div>Update: {permissions?.update ? "✓" : "✗"}</div>
        <div>Delete: {permissions?.delete ? "✓" : "✗"}</div>
        <div style={{ fontSize: "11px", marginTop: "4px", color: "#666" }}>
          {formatPermissions(permissions)}
        </div>
      </div>

      <button
        onClick={handleReloadSidebar}
        disabled={loading}
        style={{
          width: "100%",
          padding: "8px",
          backgroundColor: "#05468f",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Reloading..." : "Reload Permissions"}
      </button>

      <div style={{ marginTop: "10px", fontSize: "11px", color: "#666" }}>
        <strong>Check browser console</strong> for [v0] [RBAC] logs
      </div>
    </div>
  )
}
