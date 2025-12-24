"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { companyApi, API_BASE_URL } from "../api/companyapi"
import { CirclesWithBar } from "react-loader-spinner"

export default function CompanyProfile() {
  const navigate = useNavigate()
 const [companyData, setCompanyData] = useState({})

  const [showLoader, setShowLoader] = useState(true)
  const [error, setError] = useState(null)

  const [whoWeAreData, setWhoWeAreData] = useState(null)
  const [showWhoWeAreModal, setShowWhoWeAreModal] = useState(false)
  const [whoWeAreText, setWhoWeAreText] = useState("")
  const [whoWeAreImage, setWhoWeAreImage] = useState(null)
  const [whoWeAreImagePreview, setWhoWeAreImagePreview] = useState("")
  const [whoWeAreSaving, setWhoWeAreSaving] = useState(false)

  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [companySaving, setCompanySaving] = useState(false)
  const [companyFormData, setCompanyFormData] = useState({
    companyName: "",
    taxVatNumber: "",
    dateEstablished: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    mainPhoneNumber: "",
    emailAddress: "",
    website: "",
    defaultCurrency: "",
    timeZone: "",
    workingHours: "",
    facebookUrl: "",
    instagramUrl: "",
    whatsappNumber: "",
    linkedinProfile: "",
    skypeId: "",
  })
  const [companyLogo, setCompanyLogo] = useState(null)
  const [companyLogoPreview, setCompanyLogoPreview] = useState("")

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await companyApi.getCompanyProfile()
        if (response.success) {
          setCompanyData(response.data)
        }
      } catch (err) {
        console.error("Error fetching company profile:", err)
        setError(err.message)
      }
    }



    fetchCompanyProfile()


    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])



  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setWhoWeAreImage(file)
      setWhoWeAreImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSaveWhoWeAre = async () => {
    try {
      setWhoWeAreSaving(true)
      const formData = new FormData()
      formData.append("text", whoWeAreText)
      if (whoWeAreImage) {
        formData.append("image", whoWeAreImage)
      }

      const response = await companyApi.updateWhoWeAre(formData)
      if (response.success) {
        setWhoWeAreData(response.data)
        setShowWhoWeAreModal(false)
      }
    } catch (err) {
      console.error("Error saving Who We Are:", err)
      alert("Failed to save: " + err.message)
    } finally {
      setWhoWeAreSaving(false)
    }
  }

  const handleOpenCompanyModal = () => {
    navigate("/company/administration/edit-profile")
  }

  const handleCompanyInputChange = (e) => {
    const { name, value } = e.target
    setCompanyFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCompanyLogo(file)
      setCompanyLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSaveCompanyProfile = async () => {
    try {
      setCompanySaving(true)
      const formData = new FormData()

      const editableFields = [
        "taxVatNumber",
        "dateEstablished",
        "address",
        "city",
        "country",
        "postalCode",
        "website",
        "timeZone",
        "workingHours",
        "facebookUrl",
        "instagramUrl",
        "whatsappNumber",
        "linkedinProfile",
        "skypeId",
      ]

      editableFields.forEach((key) => {
        if (companyFormData[key] !== undefined && companyFormData[key] !== null) {
          formData.append(key, companyFormData[key])
        }
      })

      // Append logo if selected
      if (companyLogo) {
        formData.append("logo", companyLogo)
      }

      const response = await companyApi.updateCompanyProfile(companyData._id, formData)
      if (response.success) {
        setCompanyData(response.data)
        setShowCompanyModal(false)
      }
    } catch (err) {
      console.error("Error saving Company Profile:", err)
      alert("Failed to save: " + err.message)
    } finally {
      setCompanySaving(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Top Bar */}
          <div className="top-bar d-flex justify-content-between align-items-center">
            <div></div>
          </div>

          {showLoader ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
              <CirclesWithBar
                height="100"
                width="100"
                color="#05468f"
                outerCircleColor="#05468f"
                innerCircleColor="#05468f"
                barColor="#05468f"
                ariaLabel="circles-with-bar-loading"
                visible={true}
              />
            </div>
          ) : (
            <div className="card p-4" style={{ backgroundColor: "#f8f9fa" }}>
              {/* Header with Logo and Edit Button */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="d-flex align-items-center gap-3">
{companyData?.logoUrl ? (
  <img
    src={`https://api.voyagian.com/${companyData.logoUrl}`}
    alt={companyData.companyName || "Company"}
  />
) : (
  <div className="circle-avatar">
    {(companyData?.companyName || "NA").substring(0, 2).toUpperCase()}
  </div>
)}

                  <div>
                    <h2 className="mb-1">{companyData.companyName || "N/A"}</h2>
                    <p className="text-muted mb-0">Registration: {companyData.registrationNumber || "N/A"}</p>
                    <span className="badge bg-success mt-2">{companyData.status || "Active"}</span>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={handleOpenCompanyModal}>
                  <i className="fa-solid fa-edit me-2"></i>Edit
                </button>
              </div>

              <hr className="my-4" />

              {/* Company Information Grid */}
              <div className="row g-4">
                {/* Left Column */}
                <div className="col-lg-6">
                  <h5 className="mb-3">General Information</h5>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Company Name</label>
                    <p className="mb-0">{companyData.companyName || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Date Established</label>
                    <p className="mb-0">{formatDate(companyData.dateEstablished) || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Registration Number</label>
                    <p className="mb-0">{companyData.registrationNumber || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Default Currency</label>
                    <p className="mb-0">{companyData.defaultCurrency || "N/A"}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-lg-6">
                  <h5 className="mb-3">Contact Information</h5>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Email Address</label>
                    <p className="mb-0">
                      <a href={`mailto:${companyData.emailAddress}`}>{companyData.emailAddress || "N/A"}</a>
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Phone Number</label>
                    <p className="mb-0">{companyData.mainPhoneNumber || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Website</label>
                    <p className="mb-0">
                      {companyData.website ? (
                        <a href={companyData.website} target="_blank" rel="noopener noreferrer">
                          {companyData.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              {/* Address Section */}
              <div className="row g-4">
                <div className="col-lg-6">
                  <h5 className="mb-3">Address</h5>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Street Address</label>
                    <p className="mb-0">{companyData.address || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">City</label>
                    <p className="mb-0">{companyData.city || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Country</label>
                    <p className="mb-0">{companyData.country || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Postal Code</label>
                    <p className="mb-0">{companyData.postalCode || "N/A"}</p>
                  </div>
                </div>

                {/* Social Media Section */}
                <div className="col-lg-6">
                  <h5 className="mb-3">Social Media & Other Links</h5>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">LinkedIn</label>
                    <p className="mb-0">
                      {companyData.linkedinProfile ? (
                        <a href={companyData.linkedinProfile} target="_blank" rel="noopener noreferrer">
                          {companyData.linkedinProfile}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Facebook</label>
                    <p className="mb-0">
                      {companyData.facebookUrl ? (
                        <a href={companyData.facebookUrl} target="_blank" rel="noopener noreferrer">
                          {companyData.facebookUrl}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Instagram</label>
                    <p className="mb-0">
                      {companyData.instagramUrl ? (
                        <a href={companyData.instagramUrl} target="_blank" rel="noopener noreferrer">
                          {companyData.instagramUrl}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">WhatsApp</label>
                    <p className="mb-0">
                      {companyData.whatsappNumber ? (
                        <a
                          href={`https://wa.me/${companyData.whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {companyData.whatsappNumber}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              {/* Vision, Mission, Purpose Section */}
              <div className="row g-4">
                <div className="col-lg-4">
                  <h5 className="mb-3">Vision</h5>
                  <p className="mb-0">{companyData.vision || "N/A"}</p>
                </div>
                <div className="col-lg-4">
                  <h5 className="mb-3">Mission</h5>
                  <p className="mb-0">{companyData.mission || "N/A"}</p>
                </div>
                <div className="col-lg-4">
                  <h5 className="mb-3">Purpose</h5>
                  <p className="mb-0">{companyData.purpose || "N/A"}</p>
                </div>
              </div>

              <hr className="my-4" />

{/* Who We Are Section */}
<div className="row g-4">
  <div className="col-lg-12">
    <h5 className="mb-3">Who We Are</h5>

    {companyData.whoWeAreImage ? (
      <div className="mb-3">
        <img
          src={`https://api.voyagian.com${companyData.whoWeAreImage}`}
          alt="Who We Are"
          style={{
            width: "100%",
            maxHeight: "300px",
            objectFit: "cover",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
         
        />
      </div>
    ) : (
      <p className="text-muted">No Who We Are image uploaded</p>
    )}

    <p>{companyData.whoWeAre || "No description available"}</p>
  </div>
</div>


              {/* Additional Information */}
              <div className="row g-4">
                <div className="col-lg-6">
                  <h5 className="mb-3">Additional Information</h5>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Working Hours</label>
                    <p className="mb-0">{companyData.workingHours || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Status</label>
                    <p className="mb-0">
                      <span className={`badge ${companyData.status === "approved" ? "bg-success" : "bg-warning"}`}>
                        {companyData.status || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <h5 className="mb-3">Dates</h5>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Created At</label>
                    <p className="mb-0">{formatDate(companyData.createdAt) || "N/A"}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-600">Last Updated</label>
                    <p className="mb-0">{formatDate(companyData.updatedAt) || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Who We Are Modal */}
      {showWhoWeAreModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowWhoWeAreModal(false)
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Who We Are</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowWhoWeAreModal(false)}
                  disabled={whoWeAreSaving}
                ></button>
              </div>
              <div className="modal-body">
                {/* Image Preview and Upload */}
                <div className="mb-3 text-center">
                  {whoWeAreImagePreview ? (
                    <img
                      src={whoWeAreImagePreview || "/placeholder.svg"}
                      alt="Preview"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div
                      style={{
                        width: "150px",
                        height: "150px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        margin: "0 auto 10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={whoWeAreSaving}
                  />
                </div>

                {/* Text Field */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={whoWeAreText}
                    onChange={(e) => setWhoWeAreText(e.target.value)}
                    placeholder="Enter your company description..."
                    disabled={whoWeAreSaving}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowWhoWeAreModal(false)}
                  disabled={whoWeAreSaving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveWhoWeAre}
                  disabled={whoWeAreSaving}
                >
                  {whoWeAreSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Profile Edit Modal */}
      {showCompanyModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCompanyModal(false)
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Company Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCompanyModal(false)}
                  disabled={companySaving}
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {/* Logo Preview and Upload */}
                <div className="mb-4 text-center">
                  {companyLogoPreview ? (
                    <img
                      src={companyLogoPreview || "/placeholder.svg"}
                      alt="Company Logo Preview"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        border: "1px solid #ddd",
                        padding: "5px",
                      }}
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        margin: "0 auto 10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                      }}
                    >
                      No Logo
                    </div>
                  )}
                  <div>
                    <label className="form-label">Company Logo</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleCompanyLogoChange}
                      disabled={companySaving}
                    />
                  </div>
                </div>

                {/* Basic Information */}
                <h6 className="border-bottom pb-2 mb-3">Basic Information</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Company Name <span className="text-muted small">(Read-only)</span>
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      name="companyName"
                      value={companyFormData.companyName}
                      readOnly
                      style={{ cursor: "not-allowed" }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tax/VAT Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="taxVatNumber"
                      value={companyFormData.taxVatNumber}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date Established</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dateEstablished"
                      value={companyFormData.dateEstablished}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Default Currency <span className="text-muted small">(Read-only)</span>
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      name="defaultCurrency"
                      value={companyFormData.defaultCurrency}
                      readOnly
                      style={{ cursor: "not-allowed" }}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <h6 className="border-bottom pb-2 mb-3 mt-4">Contact Information</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Email Address <span className="text-muted small">(Read-only)</span>
                    </label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      name="emailAddress"
                      value={companyFormData.emailAddress}
                      readOnly
                      style={{ cursor: "not-allowed" }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Main Phone Number <span className="text-muted small">(Read-only)</span>
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      name="mainPhoneNumber"
                      value={companyFormData.mainPhoneNumber}
                      readOnly
                      style={{ cursor: "not-allowed" }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Website</label>
                    <input
                      type="url"
                      className="form-control"
                      name="website"
                      value={companyFormData.website}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                </div>

                {/* Address Information */}
                <h6 className="border-bottom pb-2 mb-3 mt-4">Address Information</h6>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={companyFormData.address}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={companyFormData.city}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      name="country"
                      value={companyFormData.country}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="postalCode"
                      value={companyFormData.postalCode}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                </div>

                {/* Operating Hours */}
                <h6 className="border-bottom pb-2 mb-3 mt-4">Operating Hours</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Time Zone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="timeZone"
                      value={companyFormData.timeZone}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Working Hours</label>
                    <input
                      type="text"
                      className="form-control"
                      name="workingHours"
                      value={companyFormData.workingHours}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                </div>

                {/* Social Media */}
                <h6 className="border-bottom pb-2 mb-3 mt-4">Social Media</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Facebook URL</label>
                    <input
                      type="url"
                      className="form-control"
                      name="facebookUrl"
                      value={companyFormData.facebookUrl}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Instagram URL</label>
                    <input
                      type="url"
                      className="form-control"
                      name="instagramUrl"
                      value={companyFormData.instagramUrl}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">LinkedIn Profile</label>
                    <input
                      type="url"
                      className="form-control"
                      name="linkedinProfile"
                      value={companyFormData.linkedinProfile}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">WhatsApp Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="whatsappNumber"
                      value={companyFormData.whatsappNumber}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Skype ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="skypeId"
                      value={companyFormData.skypeId}
                      onChange={handleCompanyInputChange}
                      disabled={companySaving}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCompanyModal(false)}
                  disabled={companySaving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveCompanyProfile}
                  disabled={companySaving}
                >
                  {companySaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
