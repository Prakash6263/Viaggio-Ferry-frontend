import React, { useEffect, useState } from "react";
import { priceListApi } from "../../api/priceListApi";
import { CirclesWithBar } from "react-loader-spinner";

/**
 * PriceTable - fetches and displays price lists from API
 * Props:
 *  - category: "passenger", "vehicle", or "cargo"
 *  - onRowClick: callback when a row is clicked
 *  - refreshTrigger: optional prop to trigger data refresh
 */
export default function PriceTable({ category = "passenger", onRowClick, refreshTrigger }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPriceLists = async () => {
      try {
        setLoading(true);
        const response = await priceListApi.getPriceLists(1, 10, category);
        
        if (response?.data && Array.isArray(response.data)) {
          setData(response.data);
        } else {
          setData([]);
        }
        setError(null);
      } catch (err) {
        console.error("[v0] Error fetching price lists:", err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceLists();
  }, [category, refreshTrigger]);

  // Format the date to display only date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(/,/, "");
  };

  // Convert tax base format for display
  const formatTaxBase = (taxBase) => {
    if (taxBase === "fare_only") return "Fare Only";
    if (taxBase === "fare_plus_tax") return "Fare & Taxes";
    return taxBase || "";
  };

  // Get currency code from currency object
  const getCurrencyCode = (currency) => {
    if (typeof currency === "string") return currency;
    if (currency?.currencyCode) return currency.currencyCode;
    return "";
  };

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">Error: {error}</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped mb-0">
        <thead>
          <tr>
            <th scope="col" className="px-4 py-3 text-start fw-semibold">Price List Name</th>
            <th scope="col" className="px-4 py-3 text-start fw-semibold">Effective Date &amp; Time</th>
            <th scope="col" className="px-4 py-3 text-start fw-semibold">Tax Base</th>
            <th scope="col" className="px-4 py-3 text-start fw-semibold">Currency</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {data.length > 0 ? (
            data.map((r) => (
              <tr
                key={r._id}
                className="cursor-pointer"
                onClick={() => onRowClick && onRowClick(r)}
              >
                <td className="px-4 py-4 text-nowrap">{r.priceListName}</td>
                <td className="px-4 py-4 text-nowrap">{formatDateTime(r.effectiveDateTime)}</td>
                <td className="px-4 py-4 text-nowrap">{formatTaxBase(r.taxBase)}</td>
                <td className="px-4 py-4 text-nowrap">{getCurrencyCode(r.currency)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-4 text-center text-muted">
                No price lists found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
