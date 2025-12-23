import { useState, useEffect } from "react"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { Link, useNavigate } from "react-router-dom"
import { companyApi, API_BASE_URL } from "../api/companyapi"

const EditCompanyProfile = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [companyId, setCompanyId] = useState("")

  // Image previews
  const [imagePreviews, setImagePreviews] = useState({
    logo: null,
    whoWeAreImage: null,
    adminProfileImage: null,
  })

  // Form state (ALL fields preserved)
  const [formData, setFormData] = useState({
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
    applicableTaxes: "",
    operatingPorts: "",
    operatingCountries: "",
    timeZone: "",
    workingHours: "",
    whoWeAre: "",
    vision: "",
    mission: "",
    purpose: "",
    facebookUrl: "",
    instagramUrl: "",
    whatsappNumber: "",
    linkedinProfile: "",
    skypeId: "",
    logo: null,
    whoWeAreImage: null,
    adminProfileImage: null,
  })

  // =============================
  // FETCH PROFILE (GET API)
  // =============================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)

        const response = await companyApi.getCompanyProfile()
        const company = response.data // ✅ FIX

        setCompanyId(company._id)

        // Image previews
        setImagePreviews({
          logo: company.logoUrl
            ? `${API_BASE_URL}${company.logoUrl}`
            : null,
          whoWeAreImage: company.whoWeAreImage
            ? `${API_BASE_URL}${company.whoWeAreImage}`
            : null,
          adminProfileImage: company.adminProfileImage
            ? `${API_BASE_URL}${company.adminProfileImage}`
            : null,
        })

        // Populate form with existing data
        setFormData({
          companyName: company.companyName || "",
          taxVatNumber: company.taxVatNumber || "",
          dateEstablished: company.dateEstablished
            ? company.dateEstablished.split("T")[0]
            : "",
          address: company.address || "",
          city: company.city || "",
          country: company.country || "",
          postalCode: company.postalCode || "",
          mainPhoneNumber: company.mainPhoneNumber || "",
          emailAddress: company.emailAddress || "",
          website: company.website || "",
          defaultCurrency: company.defaultCurrency || "",
          applicableTaxes: Array.isArray(company.applicableTaxes)
            ? company.applicableTaxes.join(", ")
            : "",
          operatingPorts: Array.isArray(company.operatingPorts)
            ? company.operatingPorts.join(", ")
            : "",
          operatingCountries: Array.isArray(company.operatingCountries)
            ? company.operatingCountries.join(", ")
            : "",
          timeZone: company.timeZone || "",
          workingHours: company.workingHours || "",
          whoWeAre: company.whoWeAre || "",
          vision: company.vision || "",
          mission: company.mission || "",
          purpose: company.purpose || "",
          facebookUrl: company.facebookUrl || "",
          instagramUrl: company.instagramUrl || "",
          whatsappNumber: company.whatsappNumber || "",
          linkedinProfile: company.linkedinProfile || "",
          skypeId: company.skypeId || "",
          logo: null,
          whoWeAreImage: null,
          adminProfileImage: null,
        })
      } catch (err) {
        console.error(err)
        setError("Failed to load company profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // =============================
  // INPUT HANDLERS
  // =============================
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (!files || !files[0]) return

    setFormData((prev) => ({ ...prev, [name]: files[0] }))
    setImagePreviews((prev) => ({
      ...prev,
      [name]: URL.createObjectURL(files[0]),
    }))
  }

  // =============================
  // SUBMIT (UPDATE API)
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")
      setSuccess("")

      const fd = new FormData()

      // Text fields (UNCHANGED OR CHANGED → ALL SENT)
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key === "logo" ||
          key === "whoWeAreImage" ||
          key === "adminProfileImage"
        )
          return

        if (key === "applicableTaxes" || key === "operatingPorts" || key === "operatingCountries") {
          const arr = value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
          fd.append(key, JSON.stringify(arr))
        } else {
          fd.append(key, value)
        }
      })

      // Files (only if changed)
      if (formData.logo) fd.append("logo", formData.logo)
      if (formData.whoWeAreImage)
        fd.append("whoWeAreImage", formData.whoWeAreImage)
      if (formData.adminProfileImage)
        fd.append("adminProfileImage", formData.adminProfileImage)

      await companyApi.updateCompanyProfile(companyId, fd)

      setSuccess("Company profile updated successfully")
      setTimeout(() => navigate("/company/settings/company-profile"), 1500)
    } catch (err) {
      console.error(err)
      setError(err.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  // =============================
  // UI
  // =============================
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content container-fluid">
          <Link to="/company/settings/company-profile" className="btn btn-secondary mb-3">
            ← Back
          </Link>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

                     <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Basic Company Info */}
                <div className="col-md-12">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">Basic Company Information</h5>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Company Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Enter company name"
                          disabled
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Tax/VAT Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="taxVatNumber"
                          value={formData.taxVatNumber}
                          onChange={handleInputChange}
                          placeholder="Enter tax/VAT number"
                        />
                      </div>
                      {/* Added logo preview section */}
                      <div className="mb-3">
                        <label className="form-label">Logo</label>
                        <input
                          type="file"
                          className="form-control"
                          name="logo"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        {imagePreviews.logo && (
                          <div className="mt-2">
                            <img
                              src={imagePreviews.logo || "/placeholder.svg"}
                              alt="Logo Preview"
                              style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "4px" }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Date Established</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dateEstablished"
                          value={formData.dateEstablished}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="col-md-12">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">Contact Details</h5>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Street Address"
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Country</label>
                          <input
                            type="text"
                            className="form-control"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="Country"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Postal Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="Postal Code"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Main Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="mainPhoneNumber"
                          value={formData.mainPhoneNumber}
                          onChange={handleInputChange}
                          placeholder="+1 234 567 890"
                          disabled
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          name="emailAddress"
                          value={formData.emailAddress}
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                          disabled
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Website</label>
                        <input
                          type="text"
                          className="form-control"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operational Details */}
                <div className="col-md-12">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">Operational Details</h5>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Default Currency</label>
                        <select
                          className="form-select"
                          name="defaultCurrency"
                          value={formData.defaultCurrency}
                          onChange={handleInputChange}
                          disabled
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="AED">AED</option>
                          <option value="SAR">SAR</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Applicable Taxes</label>
                        <input
                          type="text"
                          className="form-control"
                          name="applicableTaxes"
                          value={formData.applicableTaxes}
                          onChange={handleInputChange}
                          placeholder="VAT, Service Tax (comma-separated)"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Operating Ports</label>
                        <input
                          type="text"
                          className="form-control"
                          name="operatingPorts"
                          value={formData.operatingPorts}
                          onChange={handleInputChange}
                          placeholder="Port A, Port B, Port C (comma-separated)"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Operating Countries</label>
                        <input
                          type="text"
                          className="form-control"
                          name="operatingCountries"
                          value={formData.operatingCountries}
                          onChange={handleInputChange}
                          placeholder="USA, Canada, Mexico (comma-separated)"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Time Zone</label>
                        <input
                          type="text"
                          className="form-control"
                          name="timeZone"
                          value={formData.timeZone}
                          onChange={handleInputChange}
                          placeholder="UTC -5"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Working Hours</label>
                        <input
                          type="text"
                          className="form-control"
                          name="workingHours"
                          value={formData.workingHours}
                          onChange={handleInputChange}
                          placeholder="Mon-Fri, 9am-5pm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Us */}
                <div className="col-md-12">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">About Us</h5>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Who We Are</label>
                        <textarea
                          className="form-control"
                          name="whoWeAre"
                          value={formData.whoWeAre}
                          onChange={handleInputChange}
                          placeholder="Description of the company"
                          rows="3"
                        ></textarea>
                      </div>
                      {/* Added whoWeAreImage preview section */}
                      <div className="mb-3">
                        <label className="form-label">Who We Are Image</label>
                        <input
                          type="file"
                          className="form-control"
                          name="whoWeAreImage"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        {imagePreviews.whoWeAreImage && (
                          <div className="mt-2">
                            <img
                              src={imagePreviews.whoWeAreImage || "/placeholder.svg"}
                              alt="Who We Are Preview"
                              style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "4px" }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Vision</label>
                        <textarea
                          className="form-control"
                          name="vision"
                          value={formData.vision}
                          onChange={handleInputChange}
                          placeholder="Our vision"
                          rows="3"
                        ></textarea>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Mission</label>
                        <textarea
                          className="form-control"
                          name="mission"
                          value={formData.mission}
                          onChange={handleInputChange}
                          placeholder="Our mission"
                          rows="3"
                        ></textarea>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Purpose</label>
                        <textarea
                          className="form-control"
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          placeholder="Our purpose"
                          rows="3"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media & Other */}
                <div className="col-md-12">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">Social Media & Other</h5>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Admin Profile Image</label>
                        <input
                          type="file"
                          className="form-control"
                          name="adminProfileImage"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        {/* Added adminProfileImage preview section */}
                        {imagePreviews.adminProfileImage && (
                          <div className="mt-2">
                            <img
                              src={imagePreviews.adminProfileImage || "/placeholder.svg"}
                              alt="Admin Profile Preview"
                              style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "50%" }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Facebook URL</label>
                        <input
                          type="text"
                          className="form-control"
                          name="facebookUrl"
                          value={formData.facebookUrl}
                          onChange={handleInputChange}
                          placeholder="https://facebook.com/..."
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Instagram URL</label>
                        <input
                          type="text"
                          className="form-control"
                          name="instagramUrl"
                          value={formData.instagramUrl}
                          onChange={handleInputChange}
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">WhatsApp Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="whatsappNumber"
                          value={formData.whatsappNumber}
                          onChange={handleInputChange}
                          placeholder="+1 234 567 890"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">LinkedIn Profile</label>
                        <input
                          type="text"
                          className="form-control"
                          name="linkedinProfile"
                          value={formData.linkedinProfile}
                          onChange={handleInputChange}
                          placeholder="https://linkedin.com/..."
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Skype ID</label>
                        <input
                          type="text"
                          className="form-control"
                          name="skypeId"
                          value={formData.skypeId}
                          onChange={handleInputChange}
                          placeholder="Your Skype ID"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="col-md-12">
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <Link to="/company/settings/company-profile" className="btn btn-secondary">
                    Cancel
                  </Link>
                </div>
              </div>
            
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditCompanyProfile
