"use client"

import { useEffect, useState } from "react"
import { CirclesWithBar } from "react-loader-spinner"
import { currencyApi } from "../../api/currencyApi"

export default function CurrencyHistoryTable({ currencyId }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currencyInfo, setCurrencyInfo] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)

        const [infoResponse, historyResponse] = await Promise.all([
          currencyApi.getCompanyCurrencyById(currencyId),
          currencyApi.getExchangeRateHistory(currencyId, 50),
        ])

        if (infoResponse.data) {
          setCurrencyInfo(infoResponse.data)
        }

        setHistory(historyResponse.data?.history || historyResponse.data || [])
        setError(null)
      } catch (err) {
        console.error("[v0] Error fetching currency history:", err)
        setError(err.message || "Failed to load currency history")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [currencyId])

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  useEffect(() => {
    const el = document.getElementById("historyTable")
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
  }, [history])

  return (
    <div className="card-table card p-2">
      <div className="card-body">
        {currencyInfo && (
          <div className="mb-3 p-2 bg-light rounded">
            <h6>
              {currencyInfo.currencyCode} - {currencyInfo.countryName}
            </h6>
          </div>
        )}

        {loading && (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
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
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="table-responsive">
            <table id="historyTable" className="table table-striped" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Exchange Rate</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((record) => (
                    <tr key={record._id}>
                      <td>{record.rate ? record.rate.toFixed(4) : "N/A"}</td>
                      <td>{formatDateTime(record.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">
                      No exchange rate history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
