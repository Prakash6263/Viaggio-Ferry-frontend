"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CirclesWithBar } from "react-loader-spinner"
import { currencyApi } from "../../api/currencyApi"

export default function AddCurrencyForm() {
  const navigate = useNavigate()
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [selectedCurrencyId, setSelectedCurrencyId] = useState("")
  const [currencyName, setCurrencyName] = useState("")
  const [currencyCode, setCurrencyCode] = useState("")

  const [defaultCurrencyCode, setDefaultCurrencyCode] = useState("USD")

  const [rates, setRates] = useState([{ id: 1, rateDate: "", rate: "" }])

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true)
        const response = await currencyApi.getAllCurrencies()
        if (response.data) {
          setCurrencies(response.data)
        }

        const companyCurrenciesResponse = await currencyApi.getCompanyCurrencies(1, 100)
        if (companyCurrenciesResponse.data && companyCurrenciesResponse.data.length > 0) {
          const defaultCurrency = companyCurrenciesResponse.data.find((c) => c.isDefault)
          if (defaultCurrency) {
            setDefaultCurrencyCode(defaultCurrency.currencyCode)
          }
        }
      } catch (err) {
        console.error("[v0] Error fetching currencies:", err)
        setError("Failed to load currencies")
      } finally {
        setLoading(false)
      }
    }

    fetchCurrencies()
  }, [])

  const handleCurrencyChange = (currencyId) => {
    const selected = currencies.find((c) => c._id === currencyId)
    if (selected) {
      setSelectedCurrencyId(currencyId)
      setCurrencyCode(selected.currencyCode)
      setCurrencyName(selected.countryName)
    }
  }

  const addRate = () => {
    setRates((r) => [...r, { id: Date.now(), rateDate: "", rate: "" }])
  }

  const removeRate = (id) => setRates((r) => r.filter((x) => x.id !== id))

  const update = (id, key, val) => setRates((arr) => arr.map((x) => (x.id === id ? { ...x, [key]: val } : x)))

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!selectedCurrencyId) {
      setError("Please select a currency")
      return
    }

    if (rates.length === 0 || rates.some((r) => !r.rateDate || !r.rate)) {
      setError("Please add at least one exchange rate")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      const companyId = localStorage.getItem("companyId")
      if (!companyId) {
        throw new Error("Company ID not found")
      }

      // Format exchange rates to match API requirement
      const exchangeRates = rates.map((r) => ({
        rate: Number.parseFloat(r.rate),
        rateDate: new Date(r.rateDate).toISOString(),
      }))

      const payload = {
        currencyId: selectedCurrencyId,
        exchangeRates: exchangeRates,
        isDefault: false,
      }

      const response = await currencyApi.addCompanyCurrency(companyId, payload)

      if (response.success || response.data) {
        navigate("/company/administration/currency")
      }
    } catch (err) {
      console.error("[v0] Submit error:", err)
      setError(err.message || "Failed to add currency")
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
          <label htmlFor="currencySelect" className="form-label">
            Currency Code
          </label>
          <select
            id="currencySelect"
            className="form-control"
            value={selectedCurrencyId}
            onChange={(e) => handleCurrencyChange(e.target.value)}
          >
            <option value="">-- Select Currency --</option>
            {currencies.map((curr) => (
              <option key={curr._id} value={curr._id}>
                {curr.currencyCode} - {curr.countryName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="currencyName" className="form-label">
            Currency Name
          </label>
          <input
            id="currencyName"
            className="form-control"
            placeholder="Auto-filled from selection"
            value={currencyName}
            disabled
          />
        </div>
      </div>

      <h5 className="mb-3">Exchange Rates (to {defaultCurrencyCode})</h5>

      <div className="rates-container mb-3">
        {rates.map((r) => (
          <div key={r.id} className="row rate-row align-items-center mb-2">
            <div className="col-md-5">
              <input
                type="datetime-local"
                className="form-control"
                placeholder="Effective Date & Time"
                value={r.rateDate}
                onChange={(e) => update(r.id, "rateDate", e.target.value)}
                required
              />
            </div>
            <div className="col-md-5">
              <input
                type="number"
                step="any"
                className="form-control"
                placeholder="Rate"
                value={r.rate}
                onChange={(e) => update(r.id, "rate", e.target.value)}
                required
              />
            </div>
            <div className="col-md-2 text-center">
              <button type="button" className="btn btn-danger btn-sm remove-rate" onClick={() => removeRate(r.id)}>
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-end">
        <button type="button" className="btn btn-success btn-add-rate" onClick={addRate}>
          Add New Rate
        </button>
      </div>

      <div className="mt-4">
        <button type="submit" className="btn btn-turquoise btn-save" disabled={submitting}>
          {submitting ? "Saving..." : "Save Currency"}
        </button>
      </div>
    </form>
  )
}
