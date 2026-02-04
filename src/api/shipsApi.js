/**
 * Ships API Service
 * Handles all API calls for ship management
 */

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Get the authorization token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem("token");
};

/**
 * Get default headers for all requests
 */
const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

/**
 * Handle API errors
 */
const handleError = (response) => {
  if (response.status === 401) {
    throw { code: 401, message: "Session expired" };
  }
  if (response.status === 403) {
    throw { code: 403, message: "Access denied" };
  }
  if (response.status >= 500) {
    throw { code: 500, message: "Server error" };
  }
  // For other errors, try to parse JSON response
  return response.json().then(data => {
    throw { 
      code: response.status, 
      message: data.message || "An error occurred",
      data 
    };
  });
};

/**
 * GET /api/ships?page=&limit=&search=
 * Fetch list of ships with pagination and search
 */
export const getShips = async ({ page = 1, limit = 10, search = "" } = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);
    if (search) queryParams.append("search", search);

    const url = `${BASE_URL}/api/ships${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders()
    });

    if (!response.ok) {
      return handleError(response);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * GET /api/ships/:id
 * Fetch a single ship by ID
 */
export const getShipById = async (id) => {
  try {
    const url = `${BASE_URL}/api/ships/${id}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders()
    });

    if (!response.ok) {
      return handleError(response);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * POST /api/ships
 * Create a new ship
 */
export const createShip = async (payload) => {
  try {
    const url = `${BASE_URL}/api/ships`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return handleError(response);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * PUT /api/ships/:id
 * Update an existing ship
 */
export const updateShip = async (id, payload) => {
  try {
    const url = `${BASE_URL}/api/ships/${id}`;
    
    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return handleError(response);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * DELETE /api/ships/:id
 * Delete a ship
 */
export const deleteShip = async (id) => {
  try {
    const url = `${BASE_URL}/api/ships/${id}`;
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders()
    });

    if (!response.ok) {
      return handleError(response);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
