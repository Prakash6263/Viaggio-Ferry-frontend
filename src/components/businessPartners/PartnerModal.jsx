"use client"

// src/components/businessPartners/PartnerModal.jsx
import React, { useEffect } from "react"
import { createPortal } from "react-dom"
import PartnerUsersTable from "./PartnerUsersTable"

export default function PartnerModal({ open, onClose, onSave, editingPartner = null, allPartners = [] }) {
  const [tab, setTab] = React.useState("basic") // "basic" | "credit" | "contact" | "users"
  const [users, setUsers] = React.useState([])

  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    address: "",
    parentAccount: "", // added parentAccount field
    layer: "Marine",
    partnerStatus: "Active",
    priceList: "",
    creditLimit: {
      limitAmount: 0,
      limitTicket: 0,
    },
    contactInformation: {
      name: "",
      title: "",
      phone: "",
      email: "",
      hotline: "",
    },
  })

  useEffect(() => {
    if (open) document.body.classList.add("modal-open")
    else document.body.classList.remove("modal-open")
    return () => document.body.classList.remove("modal-open")
  }, [open])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) onClose?.()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  useEffect(() => {
    if (editingPartner) {
      setFormData(editingPartner)
    } else {
      setFormData({
        name: "",
        phone: "",
        address: "",
        parentAccount: "", // initialize empty parentAccount
        layer: "Marine",
        partnerStatus: "Active",
        priceList: "",
        creditLimit: {
          limitAmount: 0,
          limitTicket: 0,
        },
        contactInformation: {
          name: "",
          title: "",
          phone: "",
          email: "",
          hotline: "",
        },
      })
    }
  }, [editingPartner, open])

  const addUser = () =>
    setUsers((u) => [
      ...u,
      {
        id: Date.now().toString(36),
        userName: "",
        phone: "",
        email: "",
        address: "",
        layer: "marine",
        status: "active",
      },
    ])
  const changeUser = (id, key, val) => setUsers((u) => u.map((x) => (x.id === id ? { ...x, [key]: val } : x)))
  const removeUser = (id) => setUsers((u) => u.filter((x) => x.id !== id))

  const handleFormChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("contact-")) {
      const fieldName = name.replace("contact-", "")
      setFormData((prev) => ({
        ...prev,
        contactInformation: {
          ...prev.contactInformation,
          [fieldName]: value,
        },
      }))
    } else if (name.startsWith("credit-")) {
      const fieldName = name.replace("credit-", "")
      setFormData((prev) => ({
        ...prev,
        creditLimit: {
          ...prev.creditLimit,
          [fieldName]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...formData,
      users,
    }

    if (formData.layer === "Marine") {
      payload.parentAccount = null
    }

    if (onSave) onSave(payload)
  }

  const getFilteredParentAccounts = () => {
    return allPartners.filter((p) => {
      // Don't show the current partner being edited
      if (editingPartner && p._id === editingPartner._id) return false

      // Filter based on current layer selection
      if (formData.layer === "Marine") {
        // Marine layer can only have Company as parent (or no parent)
        // So filter out any partners that have a parent (they're already in a layer)
        return !p.parentAccount || p.parentAccount === ""
      } else if (formData.layer === "Commercial") {
        // Commercial layer can only have Marine layer partners as parent
        return p.layer === "Marine"
      } else if (formData.layer === "Selling") {
        // Selling layer can have Commercial layer partners as parent
        return p.layer === "Commercial"
      }

      return true
    })
  }

  const availableParentAccounts = getFilteredParentAccounts()

  if (!open) return null

  return createPortal(
    <>
      <div className="modal-backdrop-custom" onClick={() => onClose?.()} />
      <div id="add-partner-modal" className="modal" style={{ display: "block" }}>
        <div className="modal-content">
          <div className="card mb-0" style={{ position: "relative", padding: "20px" }}>
            <span className="close-button" onClick={() => onClose?.()}>
              &times;
            </span>
            <h4 className="mb-3">{editingPartner ? "Edit Partner" : "Add New Partner"}</h4>

            <div className="tab-container">
              <button className={`tab-button ${tab === "basic" ? "active" : ""}`} onClick={() => setTab("basic")}>
                Basic Info
              </button>
              <button className={`tab-button ${tab === "credit" ? "active" : ""}`} onClick={() => setTab("credit")}>
                Credit Limit
              </button>
              <button className={`tab-button ${tab === "contact" ? "active" : ""}`} onClick={() => setTab("contact")}>
                Contact Information
              </button>
              <button className={`tab-button ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>
                Users
              </button>
            </div>

            <form id="new-partner-form" onSubmit={handleSubmit}>
              <div
                id="basic-info-tab"
                className={`tab-content ${tab === "basic" ? "active" : ""}`}
                style={{ display: tab === "basic" ? "block" : "none" }}
              >
                <h4 className="mb-3">Basic Information</h4>
                <div className="form-group">
                  <label htmlFor="basic-name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="basic-name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="basic-phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="basic-phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="basic-address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    id="basic-address"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="basic-layer" className="form-label">
                    Layer
                  </label>
                  <select
                    id="basic-layer"
                    name="layer"
                    className="form-control"
                    value={formData.layer}
                    onChange={handleFormChange}
                  >
                    <option value="Marine">Marine</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Selling">Selling</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="basic-parent-account" className="form-label">
                    Parent Account {formData.layer === "Marine" && "(Company)"}
                    {formData.layer === "Commercial" && "(Marine Partner)"}
                    {formData.layer === "Selling" && "(Commercial Partner)"}
                  </label>
                  <select
                    id="basic-parent-account"
                    name="parentAccount"
                    className="form-control"
                    value={formData.parentAccount}
                    onChange={handleFormChange}
                  >
                    <option value="">-- Select Parent Account --</option>
                    {availableParentAccounts.map((partner) => (
                      <option key={partner._id} value={partner._id}>
                        {partner.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="basic-status" className="form-label">
                    Partner Status
                  </label>
                  <select
                    id="basic-status"
                    name="partnerStatus"
                    className="form-control"
                    value={formData.partnerStatus}
                    onChange={handleFormChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="basic-price" className="form-label">
                    Price List
                  </label>
                  <input
                    type="text"
                    id="basic-price"
                    name="priceList"
                    className="form-control"
                    value={formData.priceList}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div
                id="credit-limit-tab"
                className={`tab-content ${tab === "credit" ? "active" : ""}`}
                style={{ display: tab === "credit" ? "block" : "none" }}
              >
                <h4 className="mb-3">Credit Limit</h4>
                <div className="form-group">
                  <label htmlFor="credit-limit-amount" className="form-label">
                    Limit Amount
                  </label>
                  <input
                    type="number"
                    id="credit-limit-amount"
                    name="credit-limitAmount"
                    className="form-control"
                    value={formData.creditLimit.limitAmount}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="credit-limit-ticket" className="form-label">
                    Limit Ticket
                  </label>
                  <input
                    type="number"
                    id="credit-limit-ticket"
                    name="credit-limitTicket"
                    className="form-control"
                    value={formData.creditLimit.limitTicket}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div
                id="contact-info-tab"
                className={`tab-content ${tab === "contact" ? "active" : ""}`}
                style={{ display: tab === "contact" ? "block" : "none" }}
              >
                <h4 className="mb-3">Contact Information</h4>
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="contact-name"
                    className="form-control"
                    value={formData.contactInformation.name}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    id="contact-title"
                    name="contact-title"
                    className="form-control"
                    value={formData.contactInformation.title}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="contact-phone"
                    className="form-control"
                    value={formData.contactInformation.phone}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="contact-email"
                    className="form-control"
                    value={formData.contactInformation.email}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-hotline" className="form-label">
                    Hotline
                  </label>
                  <input
                    type="tel"
                    id="contact-hotline"
                    name="contact-hotline"
                    className="form-control"
                    value={formData.contactInformation.hotline}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div
                id="users-tab"
                className={`tab-content ${tab === "users" ? "active" : ""}`}
                style={{ display: tab === "users" ? "block" : "none" }}
              >
                <h4 className="mb-3">Users</h4>
                <PartnerUsersTable users={users} onAdd={addUser} onChangeUser={changeUser} onRemove={removeUser} />
              </div>

              <button type="submit" className="btn btn-turquoise">
                {editingPartner ? "Update Partner" : "Save Partner"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
