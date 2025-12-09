"use client"

// src/pages/CompanyTerms.jsx
import { useEffect, useState } from "react"
import  Header  from "../components/layout/Header" // Changed Header from default import to named import
import { Sidebar } from "../components/layout/Sidebar" // Changed Sidebar from default import to named import
import { PageWrapper } from "../components/layout/PageWrapper" // Changed PageWrapper from default import to named import
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { getPublishedTerms, saveDraftTerms, publishTerms } from "../api/termApi"
import Swal from "sweetalert2" // Import SweetAlert2

/**
 * Terms & Conditions page with editor
 * - Fetches published terms from API
 * - Allows editing and publishing via API
 * - Falls back to localStorage if API fails
 */
export default function CompanyTerms() {
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState("") // published content
  const [draft, setDraft] = useState("") // current editing draft
  const [status, setStatus] = useState("Published")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const companyId = localStorage.getItem("companyId") || "default-company"

  useEffect(() => {
    const loadTerms = async () => {
      setLoading(true)
      setError(null)
      try {
        // Try to fetch published terms from API
        const publishedResponse = await getPublishedTerms(companyId)
        if (publishedResponse?.success && publishedResponse?.content) {
          setContent(publishedResponse.content)
          setDraft(publishedResponse.content)
          setStatus(publishedResponse.status || "Published")
        } else {
          // Fallback to localStorage
          const saved = localStorage.getItem("terms_html")
          const savedDraft = localStorage.getItem("terms_draft_html")
          const savedStatus = localStorage.getItem("terms_status") || (saved ? "Published" : "Draft")

          setContent(saved || FALLBACK_HTML)
          setDraft(savedDraft || saved || FALLBACK_HTML)
          setStatus(savedStatus)
        }
      } catch (err) {
        console.warn("[CompanyTerms] API error, falling back to localStorage:", err)
        const saved = localStorage.getItem("terms_html")
        const savedDraft = localStorage.getItem("terms_draft_html")
        const savedStatus = localStorage.getItem("terms_status") || (saved ? "Published" : "Draft")

        setContent(saved || FALLBACK_HTML)
        setDraft(savedDraft || saved || FALLBACK_HTML)
        setStatus(savedStatus)
        setError("Failed to load terms from server. Using local copy.")
      } finally {
        setLoading(false)
      }
    }

    loadTerms()
  }, [companyId])

  const openEditor = () => {
    setEditing(true)
  }

  const cancelEdit = () => {
    // revert draft to published content
    setDraft(content)
    setEditing(false)
  }

  const saveDraft = async () => {
    setSaving(true)
    setError(null)
    try {
      // Try to save to API
      const response = await saveDraftTerms(companyId, draft)
      if (response?.success) {
        setStatus("Draft")
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Draft saved successfully.",
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        // Fallback to localStorage
        localStorage.setItem("terms_draft_html", draft)
        localStorage.setItem("terms_status", "Draft")
        setStatus("Draft")
        Swal.fire({
          icon: "info",
          title: "Saved Locally",
          text: "Draft saved locally.",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    } catch (err) {
      // Fallback to localStorage on error
      console.warn("[CompanyTerms] Error saving draft to API, using localStorage:", err)
      localStorage.setItem("terms_draft_html", draft)
      localStorage.setItem("terms_status", "Draft")
      setStatus("Draft")
      Swal.fire({
        icon: "warning",
        title: "Saved Locally",
        text: "Failed to save draft to server. Saved locally instead.",
        timer: 2000,
        showConfirmButton: false,
      })
      setError("Failed to save draft to server. Saved locally instead.")
    } finally {
      setSaving(false)
    }
  }

  const publish = async () => {
    setSaving(true)
    setError(null)
    try {
      const response = await publishTerms(companyId, draft)
      if (response?.success) {
        setContent(draft)
        setStatus("Published")
        setEditing(false)
        Swal.fire({
          icon: "success",
          title: "Published",
          text: "Terms published successfully.",
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        // Fallback to localStorage
        localStorage.setItem("terms_html", draft)
        localStorage.setItem("terms_draft_html", draft)
        localStorage.setItem("terms_status", "Published")
        localStorage.setItem("terms_updated_at", new Date().toLocaleString())
        setContent(draft)
        setStatus("Published")
        setEditing(false)
        Swal.fire({
          icon: "info",
          title: "Published Locally",
          text: "Terms published locally.",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    } catch (err) {
      // Fallback to localStorage on error
      console.warn("[CompanyTerms] Error publishing via API, using localStorage:", err)
      localStorage.setItem("terms_html", draft)
      localStorage.setItem("terms_draft_html", draft)
      localStorage.setItem("terms_status", "Published")
      localStorage.setItem("terms_updated_at", new Date().toLocaleString())
      setContent(draft)
      setStatus("Published")
      setEditing(false)
      Swal.fire({
        icon: "warning",
        title: "Published Locally",
        text: "Failed to publish to server. Published locally instead.",
        timer: 2000,
        showConfirmButton: false,
      })
      setError("Failed to publish to server. Published locally instead.")
    } finally {
      setSaving(false)
    }
  }

  const preview = () => {
    const w = window.open("", "_blank", "width=900,height=700")
    w.document.write(`
      <html>
        <head>
          <title>Terms Preview</title>
          <link rel="stylesheet" href="/assets/css/style.css" />
        </head>
        <body class="p-4">${draft}</body>
      </html>`)
    w.document.close()
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        {/* Error Banner */}
        {error && (
          <div className="alert alert-warning alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle me-2" />
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} />
          </div>
        )}

        <div className="page-header">
          <div className="content-page-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Terms &amp; Conditions</h5>

            <div className="list-btn">
              <ul className="filter-list mb-0">
                {!editing && (
                  <>
                    <li>
                      <button className="btn btn-outline-secondary me-2" onClick={() => preview()} disabled={loading}>
                        <i className="bi bi-eye me-1" /> Preview
                      </button>
                    </li>

                    <li>
                      <button className="btn btn-primary" onClick={openEditor} disabled={loading}>
                        <i className="bi bi-pencil me-1" /> Edit
                      </button>
                    </li>
                  </>
                )}

                {editing && (
                  <>
                    <li>
                      <button className="btn btn-outline-secondary me-2" onClick={saveDraft} disabled={saving}>
                        <i className="bi bi-save me-1" /> {saving ? "Saving..." : "Save Draft"}
                      </button>
                    </li>
                    <li>
                      <button className="btn btn-outline-dark me-2" onClick={preview} disabled={saving}>
                        <i className="bi bi-eye me-1" /> Preview
                      </button>
                    </li>
                    <li>
                      <button className="btn btn-success me-2" onClick={publish} disabled={saving}>
                        <i className="bi bi-upload me-1" /> {saving ? "Publishing..." : "Publish"}
                      </button>
                    </li>
                    <li>
                      <button className="btn btn-secondary" onClick={cancelEdit} disabled={saving}>
                        <i className="bi bi-x-circle me-1" /> Cancel
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Main content column */}
          <div className="col-lg-10">
            <div className="card d-flex">
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading terms...</p>
                  </div>
                ) : editing ? (
                  <CKEditor
                    editor={ClassicEditor}
                    data={draft}
                    onChange={(event, editor) => {
                      const data = editor.getData()
                      setDraft(data)
                    }}
                    config={{
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "blockQuote",
                        "|",
                        "undo",
                        "redo",
                      ],
                    }}
                  />
                ) : (
                  <div className="terms-content" dangerouslySetInnerHTML={{ __html: content }} />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar meta */}
          <div className="col-lg-2">
            <div className="card d-flex">
              <div className="card-body">
                <h6 className="mb-2">Meta</h6>
                <div className="text-muted small mb-2">Status:</div>
                <div className="fw-medium mb-2">
                  {status === "Published" ? (
                    <span className="badge bg-success">Published</span>
                  ) : (
                    <span className="badge bg-secondary">Draft</span>
                  )}
                </div>
                <div className="text-muted small mb-2">Last Edited:</div>
                <div className="fw-medium mb-2">{localStorage.getItem("terms_updated_at") || "—"}</div>
                <div className="text-muted small mb-2">Editor:</div>
                <div className="fw-medium">Admin</div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}

// fallback HTML when there is no content saved yet
const FALLBACK_HTML = `
  <h4>Welcome</h4>
  <p>These are the Terms & Conditions for using this service. Replace this content by clicking "Edit".</p>
  <h5>Booking</h5>
  <p>All bookings are subject to availability and terms set by the company.</p>
`
