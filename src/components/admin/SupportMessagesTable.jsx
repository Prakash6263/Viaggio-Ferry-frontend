"use client"

import { useEffect, useState } from "react"
import { CirclesWithBar } from "react-loader-spinner"
import { apiRequest } from "../../api/apiClient"

export default function SupportMessagesTable() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [replySending, setReplySending] = useState(false)
  const [replyError, setReplyError] = useState(null)
  const [replySuccess, setReplySuccess] = useState(false)
  const [statusFilter, setStatusFilter] = useState("All")

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiRequest("/api/contact-messages/company/messages")
      setMessages(response.data || [])
    } catch (err) {
      console.error("Error fetching messages:", err)
      setError(err.message || "Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async () => {
    if (!replyText.trim() || !selectedMessage) {
      setReplyError("Please enter a reply message")
      return
    }

    try {
      setReplySending(true)
      setReplyError(null)
      setReplySuccess(false)

      const response = await apiRequest(`/api/contact-messages/company/messages/${selectedMessage._id}/reply`, {
        method: "POST",
        body: JSON.stringify({ reply: replyText }),
      })

      if (response.success) {
        setReplySuccess(true)
        setReplyText("")
        setTimeout(() => {
          document.querySelector('[data-bs-dismiss="modal"]')?.click()
          setReplySuccess(false)
          fetchMessages()
        }, 2000)
      }
    } catch (err) {
      console.error("Error sending reply:", err)
      setReplyError(err.message || "Failed to send reply")
    } finally {
      setReplySending(false)
    }
  }

  useEffect(() => {
    const el = document.getElementById("supportMessagesTable")
    if (!el || !window.DataTable) return

    try {
      if (el._dt) {
        el._dt.destroy()
        el._dt = null
      }
    } catch {}

    const dt = new window.DataTable(el, {
      paging: true,
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100],
      searching: true,
      ordering: true,
      info: true,
      layout: {
        topStart: "pageLength",
        topEnd: "search",
        bottomStart: "info",
        bottomEnd: "paging",
      },
    })

    el._dt = dt
    return () => {
      try {
        dt.destroy()
      } catch {}
      el._dt = null
    }
  }, [messages])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const decodeMessage = (encodedMessage) => {
    if (!encodedMessage) return "No message content"
    if (encodedMessage.includes(".")) {
      try {
        const parts = encodedMessage.split(".")
        if (parts.length === 3) {
          return "Message content received"
        }
      } catch (e) {
        console.error("Error decoding message:", e)
      }
    }
    return encodedMessage
  }

  const getFilteredMessages = () => {
    if (statusFilter === "All") {
      return messages
    }
    return messages.filter((msg) => msg.status === statusFilter)
  }

  const filteredMessages = getFilteredMessages()

  if (loading) {
    return (
      <div className="card-table card p-2">
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
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
      </div>
    )
  }

  return (
    <div className="card-table card p-2">
      <div className="card-body">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        <div className="mb-3">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label htmlFor="statusFilter" className="form-label mb-0" style={{ whiteSpace: "nowrap" }}>
              Status:
            </label>
            <select
              id="statusFilter"
              className="form-select"
              style={{ width: "200px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="New">New</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table id="supportMessagesTable" className="table table-striped" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Date Received</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <tr key={msg._id}>
                    <td>{formatDate(msg.createdAt)}</td>
                    <td>{msg.fullName}</td>
                    <td>{msg.email}</td>
                    <td>{msg.subject}</td>
                    <td>
                      <span className={`badge ${msg.status === "New" ? "bg-info" : "bg-secondary"}`}>
                        {msg.status || "New"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#viewMessageModal"
                        onClick={() => setSelectedMessage(msg)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-outline-danger btn-sm ms-1">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No messages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      <div className="modal fade" id="viewMessageModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Support Message</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              {selectedMessage && (
                <>
                  <div className="mb-3">
                    <strong>Name:</strong>
                    <p>{selectedMessage.fullName}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong>
                    <p>{selectedMessage.email}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Subject:</strong>
                    <p>{selectedMessage.subject}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Message:</strong>
                    <p>{decodeMessage(selectedMessage.message)}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong>
                    <p>
                      <span className={`badge ${selectedMessage.status === "New" ? "bg-info" : "bg-secondary"}`}>
                        {selectedMessage.status || "New"}
                      </span>
                    </p>
                  </div>
                  <div className="mb-3">
                    <strong>Date Received:</strong>
                    <p>{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Internal Notes / Reply:</strong>
                    <p>{selectedMessage.internalNotes || "No notes"}</p>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button
                className="btn btn-turquoise"
                data-bs-toggle="modal"
                data-bs-target="#replyMessageModal"
                data-bs-dismiss="modal"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      <div className="modal fade" id="replyMessageModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Reply to Message</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              {selectedMessage && (
                <>
                  <div className="mb-3 pb-3 border-bottom">
                    <p className="mb-1">
                      <strong>To:</strong> {selectedMessage.fullName} ({selectedMessage.email})
                    </p>
                    <p className="mb-0">
                      <strong>Subject:</strong> Re: {selectedMessage.subject}
                    </p>
                  </div>

                  {replyError && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      {replyError}
                      <button type="button" className="btn-close" onClick={() => setReplyError(null)}></button>
                    </div>
                  )}

                  {replySuccess && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      Reply sent successfully!
                      <button type="button" className="btn-close" onClick={() => setReplySuccess(false)}></button>
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="replyTextarea" className="form-label">
                      Your Reply
                    </label>
                    <textarea
                      id="replyTextarea"
                      className="form-control"
                      rows="5"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      disabled={replySending}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal" disabled={replySending}>
                Cancel
              </button>
              <button className="btn btn-turquoise" onClick={handleReply} disabled={replySending || !replyText.trim()}>
                {replySending ? (
                  <>
                    <CirclesWithBar
                      height="20"
                      width="20"
                      color="#fff"
                      outerCircleColor="#05468f"
                      innerCircleColor="#05468f"
                      barColor="#fff"
                      ariaLabel="circles-with-bar-loading"
                      visible={true}
                    />
                    <span className="ms-2">Sending...</span>
                  </>
                ) : (
                  "Send Reply"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
