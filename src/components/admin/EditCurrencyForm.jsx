// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { CirclesWithBar } from "react-loader-spinner"
// import { currencyApi } from "../../api/currencyApi"

// export default function EditCurrencyForm({ currencyId }) {
//   const navigate = useNavigate()
//   const [currencies, setCurrencies] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [error, setError] = useState("")

//   const [selectedCurrencyId, setSelectedCurrencyId] = useState("")
//   const [currencyName, setCurrencyName] = useState("")
//   const [currencyCode, setCurrencyCode] = useState("")

//   const [defaultCurrencyCode, setDefaultCurrencyCode] = useState("USD")

//   const [rates, setRates] = useState([{ id: 1, rate: "" }])

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const currenciesResponse = await currencyApi.getAllCurrencies()
//         if (currenciesResponse.data) {
//           setCurrencies(currenciesResponse.data)
//         }

//         const currencyResponse = await currencyApi.getCompanyCurrencyById(currencyId)

//         if (currencyResponse.data) {
//           const currency = currencyResponse.data
//           setSelectedCurrencyId(currency.currencyId || currency._id)
//           setCurrencyCode(currency.currencyCode)
//           setCurrencyName(currency.countryName)
//         }

//         const companyCurrenciesResponse = await currencyApi.getCompanyCurrencies(1, 100)
//         if (companyCurrenciesResponse.data && companyCurrenciesResponse.data.length > 0) {
//           const defaultCurrency = companyCurrenciesResponse.data.find((c) => c.isDefault)
//           if (defaultCurrency) {
//             setDefaultCurrencyCode(defaultCurrency.currencyCode)
//           }
//         }
//       } catch (err) {
//         console.error("[v0] Error fetching currency details:", err)
//         setError("Failed to load currency details")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [currencyId])

//   const handleCurrencyChange = (currencyId) => {
//     const selected = currencies.find((c) => c._id === currencyId)
//     if (selected) {
//       setSelectedCurrencyId(currencyId)
//       setCurrencyCode(selected.currencyCode)
//       setCurrencyName(selected.countryName)
//     }
//   }

//   const addRate = () => {
//     setRates((r) => [...r, { id: Date.now(), rate: "" }])
//   }

//   const removeRate = (id) => setRates((r) => r.filter((x) => x.id !== id))

//   const update = (id, key, val) => setRates((arr) => arr.map((x) => (x.id === id ? { ...x, [key]: val } : x)))

//   const onSubmit = async (e) => {
//     e.preventDefault()

//     if (!selectedCurrencyId) {
//       setError("Please select a currency")
//       return
//     }

//     if (rates.length === 0 || rates.some((r) => !r.rate)) {
//       setError("Please add at least one exchange rate")
//       return
//     }

//     try {
//       setSubmitting(true)
//       setError("")

//       const companyId = localStorage.getItem("companyId")
//       if (!companyId) {
//         throw new Error("Company ID not found")
//       }

//       for (const rate of rates) {
//         const payload = {
//           rate: Number.parseFloat(rate.rate),
//         }
//         await currencyApi.addExchangeRate(currencyId, payload)
//       }

//       navigate("/company/administration/currency")
//     } catch (err) {
//       console.error("[v0] Submit error:", err)
//       setError(err.message || "Failed to update currency")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
//         <CirclesWithBar
//           height="100"
//           width="100"
//           color="#05468f"
//           outerCircleColor="#05468f"
//           innerCircleColor="#05468f"
//           barColor="#05468f"
//           ariaLabel="circles-with-bar-loading"
//           visible={true}
//         />
//       </div>
//     )
//   }

//   return (
//     <form onSubmit={onSubmit}>
//       {error && (
//         <div className="alert alert-danger alert-dismissible fade show" role="alert">
//           {error}
//           <button type="button" className="btn-close" onClick={() => setError("")}></button>
//         </div>
//       )}

//       <div className="row mb-4">
//         <div className="col-md-6">
//           <label htmlFor="currencyCode" className="form-label">
//             Currency Code
//           </label>
//           <input id="currencyCode" className="form-control" value={currencyCode} disabled />
//         </div>
//         <div className="col-md-6">
//           <label htmlFor="currencyName" className="form-label">
//             Currency Name
//           </label>
//           <input
//             id="currencyName"
//             className="form-control"
//             placeholder="Auto-filled from selection"
//             value={currencyName}
//             disabled
//           />
//         </div>
//       </div>

//       <h5 className="mb-3">Exchange Rates (to {defaultCurrencyCode})</h5>

//       <div className="rates-container mb-3">
//         {rates.map((r) => (
//           <div key={r.id} className="row rate-row align-items-center mb-2">
//             <div className="col-md-10">
//               <input
//                 type="number"
//                 step="any"
//                 className="form-control"
//                 placeholder="Rate"
//                 value={r.rate}
//                 onChange={(e) => update(r.id, "rate", e.target.value)}
//                 required
//               />
//             </div>
//             <div className="col-md-2 text-center">
//               <button type="button" className="btn btn-danger btn-sm remove-rate" onClick={() => removeRate(r.id)}>
//                 <i className="bi bi-trash"></i>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="text-end">
//         <button type="button" className="btn btn-success btn-add-rate" onClick={addRate}>
//           Add New Rate
//         </button>
//       </div>

//       <div className="mt-4">
//         <button type="submit" className="btn btn-turquoise btn-save" disabled={submitting}>
//           {submitting ? "Saving..." : "Update Currency"}
//         </button>
//       </div>
//     </form>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CirclesWithBar } from "react-loader-spinner"
import { currencyApi } from "../../api/currencyApi"
import CanDisable from "../CanDisable"

export default function EditCurrencyForm({ currencyId }) {
  const navigate = useNavigate()
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [selectedCurrencyId, setSelectedCurrencyId] = useState("")
  const [currencyName, setCurrencyName] = useState("")
  const [currencyCode, setCurrencyCode] = useState("")

  const [defaultCurrencyCode, setDefaultCurrencyCode] = useState("USD")

  const [rates, setRates] = useState([{ id: 1, rate: "" }])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const currenciesResponse = await currencyApi.getAllCurrencies()
        if (currenciesResponse.data) {
          setCurrencies(currenciesResponse.data)
        }

        const currencyResponse = await currencyApi.getCompanyCurrencyById(currencyId)

        if (currencyResponse.data) {
          const currency = currencyResponse.data
          setSelectedCurrencyId(currency.currencyId || currency._id)
          setCurrencyCode(currency.currencyCode)
          setCurrencyName(currency.countryName)
        }

        const companyCurrenciesResponse = await currencyApi.getCompanyCurrencies(1, 100)
        if (companyCurrenciesResponse.data && companyCurrenciesResponse.data.length > 0) {
          const defaultCurrency = companyCurrenciesResponse.data.find((c) => c.isDefault)
          if (defaultCurrency) {
            setDefaultCurrencyCode(defaultCurrency.currencyCode)
          }
        }
      } catch (err) {
        console.error("[v0] Error fetching currency details:", err)
        setError("Failed to load currency details")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currencyId])

  const handleCurrencyChange = (currencyId) => {
    const selected = currencies.find((c) => c._id === currencyId)
    if (selected) {
      setSelectedCurrencyId(currencyId)
      setCurrencyCode(selected.currencyCode)
      setCurrencyName(selected.countryName)
    }
  }

  const addRate = () => {
    setRates((r) => [...r, { id: Date.now(), rate: "" }])
  }

  const removeRate = (id) => setRates((r) => r.filter((x) => x.id !== id))

  const update = (id, key, val) => setRates((arr) => arr.map((x) => (x.id === id ? { ...x, [key]: val } : x)))

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!selectedCurrencyId) {
      setError("Please select a currency")
      return
    }

    if (rates.length === 0 || rates.some((r) => !r.rate)) {
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

      for (const rate of rates) {
        const payload = {
          rate: Number.parseFloat(rate.rate),
        }
        await currencyApi.addExchangeRate(currencyId, payload)
      }

      navigate("/company/administration/currency")
    } catch (err) {
      console.error("[v0] Submit error:", err)
      setError(err.message || "Failed to update currency")
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
          <label htmlFor="currencyCode" className="form-label">
            Currency Code
          </label>
          <input id="currencyCode" className="form-control" value={currencyCode} disabled />
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
            <div className="col-md-10">
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
  <CanDisable action="update">
    <button type="submit" className="btn btn-turquoise btn-save" disabled={submitting}>
    {submitting ? "Saving..." : "Update Currency"}
    </button>
  </CanDisable>
  </div>
    </form>
  )
}
