'use client';

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CirclesWithBar } from "react-loader-spinner";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { portsApi } from "../api/portsApi";
import { countryApi } from "../api/countryApi";
import Can from "../components/Can";
import CanDisable from "../components/CanDisable";

export default function AddPort() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    country: "",
    timezone: "",
    status: "Active",
    notes: "",
  });

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        const countriesData = await countryApi.getCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error("[v0] Error fetching countries:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load countries",
        });
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "portName" ? "name" : id === "portCode" ? "code" : id === "countrySelect" ? "country" : id === "statusSelect" ? "status" : id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.code || !formData.country || !formData.timezone) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields",
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        country: formData.country,
        timezone: formData.timezone,
        status: formData.status,
        notes: formData.notes,
      };

      await portsApi.createPort(payload);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Port created successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/company/settings/port");
    } catch (error) {
      console.error("[v0] Error creating port:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create port",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <Can action="create" path="/company/settings/port">
          <div className="content container-fluid">
          {/* Back Button */}
          <div className="mb-3">
            <Link to="/company/settings/port" className="btn btn-turquoise">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  <h5 className="mb-3">Add New Port</h5>

                  {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                      <CirclesWithBar
                        height="80"
                        width="80"
                        color="#05468f"
                        outerCircleColor="#05468f"
                        innerCircleColor="#05468f"
                        barColor="#05468f"
                        ariaLabel="circles-with-bar-loading"
                        visible={true}
                      />
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="portName" className="form-label">
                            Port Name <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="portName"
                            placeholder="e.g., Port Sudan"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="portCode" className="form-label">
                            Port Code <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="portCode"
                            placeholder="e.g., PSD"
                            value={formData.code}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="countrySelect" className="form-label">
                            Country <span style={{ color: "red" }}>*</span>
                          </label>
                          <select
                            id="countrySelect"
                            className="form-select"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                            disabled={countriesLoading}
                          >
                            <option value="">
                              {countriesLoading ? "Loading countries..." : "Select Country"}
                            </option>
                            {countries.map((country) => (
                              <option key={country.name} value={country.name}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="timezone" className="form-label">
                            Timezone <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="timezone"
                            placeholder="e.g., UTC+02:00"
                            value={formData.timezone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="statusSelect" className="form-label">
                          Status
                        </label>
                        <select
                          id="statusSelect"
                          className="form-select"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="notes" className="form-label">
                          Notes
                        </label>
                        <textarea
                          className="form-control"
                          id="notes"
                          rows="3"
                          placeholder="Add a note about this port"
                          value={formData.notes}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>

                      <CanDisable action="create" path="/company/settings/port">
                        <button type="submit" className="btn btn-turquoise" disabled={loading}>
                          {loading ? "Creating..." : "Add Port"}
                        </button>
                      </CanDisable>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Can>
      </PageWrapper>
    </div>
  );
}
