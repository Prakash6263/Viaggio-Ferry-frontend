'use client';

import { apiFetch } from "./apiClient";

export const ticketingRuleApi = {
  // Fetch all ticketing rules with pagination and filters
  getTicketingRules: async (page = 1, limit = 10, filters = {}) => {
    try {
      const { search = "", ruleType = "" } = filters;
      const params = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(ruleType && { ruleType }),
      });

      const response = await apiFetch(`/api/ticketing-rules?${params.toString()}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch ticketing rules");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[v0] Get Ticketing Rules Error:", error.message);
      throw error;
    }
  },

  // Get single ticketing rule by ID
  getTicketingRuleById: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid ticketing rule ID");
      }

      const response = await apiFetch(`/api/ticketing-rules/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch ticketing rule");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[v0] Get Ticketing Rule Error:", error.message);
      throw error;
    }
  },

  // Create new ticketing rule
  createTicketingRule: async (formData) => {
    try {
      // Validate required fields
      if (!formData.ruleType || !formData.ruleName || formData.restrictedWindowHours === undefined) {
        throw new Error("Missing required fields");
      }

      // Remove payloadType if it exists (not needed in API)
      const payload = { ...formData };
      delete payload.payloadType;

      const response = await apiFetch("/api/ticketing-rules", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create ticketing rule");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[v0] Create Ticketing Rule Error:", error.message);
      throw error;
    }
  },

  // Update ticketing rule
  updateTicketingRule: async (id, formData) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid ticketing rule ID");
      }

      // Remove payloadType if it exists (not needed in API)
      const payload = { ...formData };
      delete payload.payloadType;

      const response = await apiFetch(`/api/ticketing-rules/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update ticketing rule");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[v0] Update Ticketing Rule Error:", error.message);
      throw error;
    }
  },

  // Delete ticketing rule
  deleteTicketingRule: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid ticketing rule ID");
      }

      const response = await apiFetch(`/api/ticketing-rules/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete ticketing rule");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[v0] Delete Ticketing Rule Error:", error.message);
      throw error;
    }
  },
};
