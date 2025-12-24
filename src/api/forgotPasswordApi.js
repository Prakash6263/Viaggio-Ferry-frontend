import { apiFetch } from "./apiClient"

export const forgotPasswordApi = {
  // Step 1: Send OTP to email
  sendOTP: async (email) => {
    try {
      const response = await apiFetch("/api/companies/forgot-password", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to send OTP")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Send OTP Error:", error.message)
      throw error
    }
  },

  // Step 2: Reset password with OTP
  resetPassword: async (email, otp, newPassword) => {
    try {
      const response = await apiFetch("/api/companies/reset-password", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ email, otp, newPassword }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to reset password")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Reset Password Error:", error.message)
      throw error
    }
  },
}
