// src/api/termApi.js
/**
 * Terms & Conditions API
 * Handles all API calls for fetching, updating, and publishing terms & conditions
 */

// Get the base URL from environment or use a default
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"



/**
 * Fetch published terms & conditions for a company
 * @param {string} companyId - The company ID
 * @returns {Promise<Object>} - Terms data object
 */
export const getPublishedTerms = async (companyId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/terms-and-conditions/${companyId}/published`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch published terms: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[termApi] Error fetching published terms:", error)
    throw error
  }
}

/**
 * Fetch draft terms & conditions for a company
 * @param {string} companyId - The company ID
 * @returns {Promise<Object>} - Draft terms data object
 */
export const getDraftTerms = async (companyId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/terms-and-conditions/${companyId}/draft`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch draft terms: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[termApi] Error fetching draft terms:", error)
    throw error
  }
}

/**
 * Save draft terms & conditions
 * @param {string} companyId - The company ID
 * @param {string} content - The HTML content of the terms
 * @returns {Promise<Object>} - Updated draft terms object
 */
export const saveDraftTerms = async (companyId, content) => {
  try {
    const response = await fetch(`${BASE_URL}/api/terms-and-conditions/${companyId}/draft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      throw new Error(`Failed to save draft terms: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[termApi] Error saving draft terms:", error)
    throw error
  }
}

/**
 * Publish terms & conditions (promotes draft to published with content)
 * @param {string} companyId - The company ID
 * @param {string} content - The HTML content to publish
 * @returns {Promise<Object>} - Published terms object
 */
export const publishTerms = async (companyId, content) => {
  try {
    const response = await fetch(`${BASE_URL}/api/terms-and-conditions/${companyId}/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      throw new Error(`Failed to publish terms: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[termApi] Error publishing terms:", error)
    throw error
  }
}

/**
 * Get version history of terms & conditions
 * @param {string} companyId - The company ID
 * @returns {Promise<Array>} - Array of version history
 */
export const getTermsVersionHistory = async (companyId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/terms-and-conditions/${companyId}/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch version history: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[termApi] Error fetching version history:", error)
    throw error
  }
}
