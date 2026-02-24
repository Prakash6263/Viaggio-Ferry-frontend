// "use client"

// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { taxApi } from "../../api/taxApi"
// import { Bars } from "react-loader-spinner"

// export default function AddTaxForm() {
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState(false)
//   const [form, setForm] = useState({
//     code: "",
//     name: "",
//     value: "",
//     type: "%", // "%" | "Fixed"
//     form: "Refundable", // renamed from "taxform" to "form" to match API
//     status: "Active", // changed from "active" boolean to "status" string
//   })

//   const onChange = (e) => {
//     const { name, value } = e.target
//     setForm((s) => ({ ...s, [name]: value }))
//   }

//   const onSubmit = async (e) => {
//     e.preventDefault()

//     if (!form.code || !form.name || !form.value) {
//       alert("Please fill in all required fields")
//       return
//     }

//     try {
//       setLoading(true)

//       const payload = {
//         code: form.code,
//         name: form.name,
//         value: Number.parseFloat(form.value),
//         type: form.type,
//         form: form.form,
//         status: form.status,
//       }

//       await taxApi.createTax(payload)

//       navigate("/company/administration/taxes")
//     } catch (error) {
//       alert(`Error creating tax: ${error.message}`)
//       console.error("Tax creation error:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <form id="groupForm" onSubmit={onSubmit}>
//       <h5 className="mb-3">Add New Tax</h5>

//       <div className="row mb-3">
//         <div className="col-md-6">
//           <label className="form-label">Tax Code</label>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="e.g., VAT"
//             name="code"
//             value={form.code}
//             onChange={onChange}
//             required
//           />
//         </div>
//         <div className="col-md-6">
//           <label className="form-label">Tax Name</label>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="e.g., Value Added Tax"
//             name="name"
//             value={form.name}
//             onChange={onChange}
//             required
//           />
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label className="form-label">Tax Value</label>
//           <input
//             type="number"
//             step="any"
//             className="form-control"
//             placeholder="e.g., 15.00"
//             name="value"
//             value={form.value}
//             onChange={onChange}
//             required
//           />
//         </div>
//         <div className="col-md-4">
//           <label className="form-label">Tax Type</label>
//           <select className="form-select" name="type" value={form.type} onChange={onChange}>
//             <option value="%">%</option>
//             <option value="Fixed">Fixed</option>
//           </select>
//         </div>
//       </div>

//       <div className="row mb-3">
//         <div className="col-md-6">
//           <label className="form-label">Tax Form</label>
//           <select className="form-select" name="form" value={form.form} onChange={onChange}>
//             <option value="Refundable">Refundable</option>
//             <option value="Non Refundable">Non Refundable</option>
//           </select>
//         </div>
//         <div className="col-md-6">
//           <label className="form-label">Status</label>
//           <select className="form-select" name="status" value={form.status} onChange={onChange}>
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//         </div>
//       </div>

//       <div>
//         <button type="button" className="btn btn-secondary me-2" onClick={() => navigate(-1)} disabled={loading}>
//           Cancel
//         </button>
//         <button type="submit" className="btn btn-turquoise" disabled={loading}>
//           {loading ? (
//             <>
//               <Bars color="#fff" height={16} width={16} /> Saving...
//             </>
//           ) : (
//             "Save Tax"
//           )}
//         </button>
//       </div>
//     </form>
//   )
// }


"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { taxApi } from "../../api/taxApi"
import { Bars } from "react-loader-spinner"
import CanDisable from "../CanDisable"

export default function AddTaxForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    code: "",
    name: "",
    value: "",
    type: "%", // "%" | "Fixed"
    form: "Refundable", // renamed from "taxform" to "form" to match API
    status: "Active", // changed from "active" boolean to "status" string
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!form.code || !form.name || !form.value) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)

      const payload = {
        code: form.code,
        name: form.name,
        value: Number.parseFloat(form.value),
        type: form.type,
        form: form.form,
        status: form.status,
      }

      await taxApi.createTax(payload)

      navigate("/company/administration/taxes")
    } catch (error) {
      alert(`Error creating tax: ${error.message}`)
      console.error("Tax creation error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form id="groupForm" onSubmit={onSubmit}>
      <h5 className="mb-3">Add New Tax</h5>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Tax Code</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., VAT"
            name="code"
            value={form.code}
            onChange={onChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Tax Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., Value Added Tax"
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Tax Value</label>
          <input
            type="number"
            step="any"
            className="form-control"
            placeholder="e.g., 15.00"
            name="value"
            value={form.value}
            onChange={onChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Tax Type</label>
          <select className="form-select" name="type" value={form.type} onChange={onChange}>
            <option value="%">%</option>
            <option value="Fixed">Fixed</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Refund Form</label>
          <select className="form-select" name="form" value={form.form} onChange={onChange}>
            <option value="Refundable">Refundable</option>
            <option value="Non Refundable">Non Refundable</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Status</label>
          <select className="form-select" name="status" value={form.status} onChange={onChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <button type="button" className="btn btn-secondary me-2" onClick={() => navigate(-1)} disabled={loading}>
          Cancel
        </button>
        <CanDisable action="create" path="/company/administration/taxes">
          <button type="submit" className="btn btn-turquoise" disabled={loading}>
            {loading ? (
              <>
                <Bars color="#fff" height={16} width={16} /> Saving...
              </>
            ) : (
              "Save Tax"
            )}
          </button>
        </CanDisable>
      </div>
    </form>
  )
}
