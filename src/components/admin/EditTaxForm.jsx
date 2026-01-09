"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CirclesWithBar } from "react-loader-spinner"
import { taxApi } from "../../api/taxApi"
import Swal from "sweetalert2"

export default function EditTaxForm({ taxId }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  const [type, setType] = useState("%")
  const [form, setForm] = useState("Refundable")
  const [status, setStatus] = useState("Active")

  useEffect(() => {
    const fetchTaxDetails = async () => {
      try {
        setLoading(true)
        const response = await taxApi.getCompanyTaxes()
        const tax = response.data?.find((t) => t._id === taxId)

        if (tax) {
          setCode(tax.code || "")
          setName(tax.name || "")
          setValue(tax.value || "")
          setType(tax.type || "%")
          setForm(tax.form || "Refundable")
          setStatus(tax.status || "Active")
        } else {
          setError("Tax not found")
        }
      } catch (err) {
        console.error("[v0] Error fetching tax details:", err)
        setError("Failed to load tax details")
      } finally {
        setLoading(false)
      }
    }

    fetchTaxDetails()
  }, [taxId])

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!name || !value) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      const payload = {
        name,
        value: Number.parseFloat(value),
        type,
        form,
        status,
      }

      await taxApi.updateTax(taxId, payload)

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Tax has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      })

      navigate("/company/administration/taxes")
    } catch (err) {
      console.error("[v0] Submit error:", err)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update tax",
      })
      setError(err.message || "Failed to update tax")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
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
    )
  }

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="code" className="form-label">
            Tax Code
          </label>
          <input id="code" className="form-control" value={code} disabled />
        </div>
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">
            Tax Name <span className="text-danger">*</span>
          </label>
          <input
            id="name"
            className="form-control"
            placeholder="Enter tax name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="value" className="form-label">
            Tax Value <span className="text-danger">*</span>
          </label>
          <input
            id="value"
            type="number"
            step="0.01"
            className="form-control"
            placeholder="Enter tax value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="type" className="form-label">
            Tax Type
          </label>
          <select id="type" className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="%">Percentage (%)</option>
            <option value="Fixed">Fixed Amount</option>
          </select>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="form" className="form-label">
            Tax Form
          </label>
          <select id="form" className="form-select" value={form} onChange={(e) => setForm(e.target.value)}>
            <option value="Refundable">Refundable</option>
            <option value="Non-Refundable">Non-Refundable</option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select id="status" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button type="submit" className="btn btn-turquoise btn-save" disabled={submitting}>
          {submitting ? "Updating..." : "Update Tax"}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/company/administration/taxes")}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
