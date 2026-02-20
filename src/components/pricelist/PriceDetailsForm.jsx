import React, { useEffect, useRef, useState, useCallback } from "react";
import { partnerApi } from "../../api/partnerApi";
import { currencyApi } from "../../api/currencyApi";
import { payloadTypesApi } from "../../api/payloadTypesApi";
import { cabinsApi } from "../../api/cabinsApi";
import { portsApi } from "../../api/portsApi";
import { taxApi } from "../../api/taxApi";
import { priceListApi } from "../../api/priceListApi";
import Swal from "sweetalert2";
import { CirclesWithBar } from "react-loader-spinner";
import CanDisable from "../CanDisable";

/**
 * PriceDetailsForm
 * - renders the details form markup exactly like HTML
 * - attaches select-with-tags behavior to selects that have class 'select-with-tags'
 * - accepts `onBack` callback to switch back to list view
 * - if priceListId is provided, loads existing price list (edit mode with read-only header)
 * - if priceListId is null, shows create mode form
 */
export default function PriceDetailsForm({ idPrefix = "passenger", onBack, priceListId = null }) {
  const rootRef = useRef(null);
  const [marinePartners, setMarinePartners] = useState([]);
  const [selectedPartners, setSelectedPartners] = useState(new Set());
  const [currencies, setCurrencies] = useState([]);
  const [currenciesLoading, setCurrenciesLoading] = useState(true);
  const [payloadTypes, setPayloadTypes] = useState([]);
  const [payloadTypesLoading, setPayloadTypesLoading] = useState(true);
  const [cabins, setCabins] = useState([]);
  const [cabinsLoading, setCabinsLoading] = useState(true);
  const [ports, setPorts] = useState([]);
  const [portsLoading, setPortsLoading] = useState(true);
  const [taxes, setTaxes] = useState([]);
  const [taxesLoading, setTaxesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingPriceList, setExistingPriceList] = useState(null);
  const [priceListLoading, setPriceListLoading] = useState(false);
  const [isDisablingDetail, setIsDisablingDetail] = useState(false);

  // State for price calculation (replaces DOM manipulation)
  const [basicPrice, setBasicPrice] = useState(0);
  const [selectedTaxIds, setSelectedTaxIds] = useState([]);
  const [currentTaxBase, setCurrentTaxBase] = useState('fare_only');
  const [totalPrice, setTotalPrice] = useState(0);

  // Load existing price list if in edit mode
  useEffect(() => {
    console.log("[v0] PriceDetailsForm received priceListId:", priceListId);
    if (priceListId) {
      setIsEditMode(true);
      const fetchPriceList = async () => {
        try {
          console.log("[v0] Fetching price list with ID:", priceListId);
          setPriceListLoading(true);
          const response = await priceListApi.getPriceListById(priceListId);
          console.log("[v0] Price list API response:", response);
          if (response?.success && response.data) {
            setExistingPriceList(response.data);
          }
        } catch (error) {
          console.error("[v0] Error fetching price list:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load price list details',
          });
          onBack && onBack();
        } finally {
          setPriceListLoading(false);
        }
      };
      fetchPriceList();
    } else {
      console.log("[v0] Create mode - no priceListId");
      setIsEditMode(false);
    }
  }, [priceListId]);

  // Prefill form with existing price list data
  useEffect(() => {
    if (existingPriceList && existingPriceList.header && currencies.length > 0) {
      const header = existingPriceList.header;

      // Prefill header fields
      const nameInput = document.getElementById(`${idPrefix}-name`);
      const dateInput = document.getElementById(`${idPrefix}-effective-date`);
      const taxBaseSelect = document.getElementById(`${idPrefix}-tax-base`);
      const currencySelect = document.getElementById(`${idPrefix}-currency`);
      const partnersContainer = document.getElementById(`${idPrefix}-partners-tags`);

      if (nameInput) nameInput.value = header.priceListName || '';
      if (dateInput && header.effectiveDateTime) {
        // Convert ISO datetime to YYYY-MM-DDTHH:mm format for datetime-local input
        const date = new Date(header.effectiveDateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
        dateInput.value = formatted;
      }
      if (taxBaseSelect) taxBaseSelect.value = header.taxBase || 'fare_only';
      if (currencySelect) {
        // header.currency is an object with _id field from API response
        const currencyId = typeof header.currency === 'object' ? header.currency._id : header.currency;
        currencySelect.value = currencyId || '';
      }

      // Populate partners tags
      if (partnersContainer && header.partners && Array.isArray(header.partners)) {
        partnersContainer.innerHTML = '';
        header.partners.forEach(partnerObj => {
          // partnerObj is an object with _id and name from API response
          const partnerId = partnerObj._id;
          const partnerName = partnerObj.name;

          if (partnerId && partnerName) {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.setAttribute('data-id', partnerId);
            tag.innerHTML = `<span>${partnerName}</span><button type="button" data-id="${partnerId}">&times;</button>`;
            partnersContainer.appendChild(tag);

            const btn = tag.querySelector('button');
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              tag.remove();
            });
          }
        });
      }
    }
  }, [existingPriceList, currencies, idPrefix]);

  // Fetch marine partners on component mount
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await partnerApi.getMarinePartners(1, 10);
        if (response && response.data) {
          setMarinePartners(response.data);
        }
      } catch (error) {
        console.error("Error fetching marine partners:", error);
      }
    };
    fetchPartners();
  }, []);

  // Fetch currencies on component mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setCurrenciesLoading(true);
        const response = await currencyApi.getCompanyCurrencies(1, 10);
        if (response && response.data) {
          setCurrencies(response.data);
        }
      } catch (error) {
        console.error("Error fetching company currencies:", error);
      } finally {
        setCurrenciesLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  // Fetch payload types based on the current tab type
  useEffect(() => {
    const fetchPayloadTypes = async () => {
      try {
        setPayloadTypesLoading(true);
        const response = await payloadTypesApi.getPayloadTypes(1, 100, idPrefix);

        // Handle different response formats
        let data = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response?.data?.payloadTypes && Array.isArray(response.data.payloadTypes)) {
          data = response.data.payloadTypes;
        } else if (response?.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (response?.payloadTypes && Array.isArray(response.payloadTypes)) {
          data = response.payloadTypes;
        } else if (response?.list && Array.isArray(response.list)) {
          data = response.list;
        }

        setPayloadTypes(data);
      } catch (error) {
        console.error("[v0] Error fetching payload types:", error);
        setPayloadTypes([]);
      } finally {
        setPayloadTypesLoading(false);
      }
    };
    fetchPayloadTypes();
  }, [idPrefix]);

  // Fetch cabins based on the current tab type
  useEffect(() => {
    const fetchCabins = async () => {
      try {
        setCabinsLoading(true);
        const response = await cabinsApi.getCabins(1, 100, "", idPrefix);

        // Handle different response formats
        let data = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response?.data?.cabins && Array.isArray(response.data.cabins)) {
          data = response.data.cabins;
        } else if (response?.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (response?.cabins && Array.isArray(response.cabins)) {
          data = response.cabins;
        } else if (response?.list && Array.isArray(response.list)) {
          data = response.list;
        }

        setCabins(data);
      } catch (error) {
        console.error("[v0] Error fetching cabins:", error);
        setCabins([]);
      } finally {
        setCabinsLoading(false);
      }
    };
    fetchCabins();
  }, [idPrefix]);

  // Fetch ports on component mount
  useEffect(() => {
    const fetchPorts = async () => {
      try {
        setPortsLoading(true);
        const response = await portsApi.getPorts(1, 100, "");

        // Handle different response formats
        let data = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response?.data?.ports && Array.isArray(response.data.ports)) {
          data = response.data.ports;
        } else if (response?.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (response?.ports && Array.isArray(response.ports)) {
          data = response.ports;
        } else if (response?.list && Array.isArray(response.list)) {
          data = response.list;
        }

        setPorts(data);
      } catch (error) {
        console.error("[v0] Error fetching ports:", error);
        setPorts([]);
      } finally {
        setPortsLoading(false);
      }
    };
    fetchPorts();
  }, []);

  // Fetch taxes on component mount
  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        setTaxesLoading(true);
        const response = await taxApi.getCompanyTaxes();
        console.log("[v0] Tax API response:", response);

        // Handle different response formats
        let data = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response?.data?.taxes && Array.isArray(response.data.taxes)) {
          data = response.data.taxes;
        } else if (response?.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (response?.taxes && Array.isArray(response.taxes)) {
          data = response.taxes;
        } else if (response?.list && Array.isArray(response.list)) {
          data = response.list;
        }

        console.log("[v0] Taxes loaded:", data);
        setTaxes(data);
      } catch (error) {
        console.error("[v0] Error fetching taxes:", error);
        setTaxes([]);
      } finally {
        setTaxesLoading(false);
      }
    };
    fetchTaxes();
  }, []);

  // Pure calculation function - no DOM manipulation
  const calculatePrice = useCallback((price, ids, base, allTaxes) => {
    const numPrice = Number(price);

    // Handle empty price string
    if (price === '') {
      return 0;
    }

    // Block negative values
    if (numPrice < 0) {
      return 0;
    }

    // No taxes selected
    if (!ids || ids.length === 0) {
      return Math.round(numPrice * 100) / 100;
    }

    // Create tax map for lookup preserving order
    const taxMap = new Map(allTaxes.map(tax => [tax._id, tax]));

    // Build selected taxes array preserving order from ids array
    const selectedTaxes = ids
      .map(id => taxMap.get(id))
      .filter(tax => tax !== undefined);

    if (selectedTaxes.length === 0) {
      return Math.round(numPrice * 100) / 100;
    }

    let total = numPrice;

    if (base === 'fare_only') {
      // Each tax calculated on base price only
      selectedTaxes.forEach(tax => {
        const taxType = (tax.type || '').toLowerCase();

        if (taxType === '%' || taxType === 'percentage') {
          const taxAmount = (numPrice * Number(tax.value)) / 100;
          total += taxAmount;
        } else if (taxType === 'fixed') {
          total += Number(tax.value) || 0;
        }
      });
    } else if (base === 'fare_plus_tax') {
      // Each tax calculated on cumulative total (compounding)
      selectedTaxes.forEach(tax => {
        const taxType = (tax.type || '').toLowerCase();

        if (taxType === '%' || taxType === 'percentage') {
          const taxAmount = (total * Number(tax.value)) / 100;
          total += taxAmount;
        } else if (taxType === 'fixed') {
          total += Number(tax.value) || 0;
        }
      });
    }

    return Math.round(total * 100) / 100;
  }, []);

  // Auto-calculate when basicPrice, selectedTaxIds, or currentTaxBase change
  useEffect(() => {
    const calculated = calculatePrice(basicPrice, selectedTaxIds, currentTaxBase, taxes);
    setTotalPrice(calculated);
  }, [basicPrice, selectedTaxIds, currentTaxBase, taxes, calculatePrice]);

  // Handler for disabling a detail
  const handleDisableDetail = async (detailId) => {
    try {
      const result = await Swal.fire({
        title: "Disable Detail",
        text: "Are you sure you want to permanently disable this detail? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, disable it!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      console.log("[v0] Disabling detail:", detailId);
      setIsDisablingDetail(true);

      const response = await priceListApi.disablePriceListDetail(detailId);
      console.log("[v0] Disable detail response:", response);

      // Update the UI by refreshing the price list data
      if (response?.data) {
        setExistingPriceList((prev) => ({
          ...prev,
          details: prev.details.map((detail) =>
            detail._id === detailId
              ? { ...detail, isDisabled: true }
              : detail
          ),
        }));
      }

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Disabled!",
        text: "Detail has been disabled successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("[v0] Error disabling detail:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to disable detail: " + (error.response?.data?.message || error.message),
      });
    } finally {
      setIsDisablingDetail(false);
    }
  };

  // Handler for partners select change
  const handlePartnerChange = (e) => {
    const partnerId = e.target.value;
    const partnerName = e.target.options[e.target.selectedIndex]?.dataset.name || "";

    if (partnerId && !selectedPartners.has(partnerId)) {
      const newSelected = new Set(selectedPartners);
      newSelected.add(partnerId);
      setSelectedPartners(newSelected);

      // Update the display area
      const container = document.getElementById(`${idPrefix}-partners-tags`);
      if (container) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.setAttribute('data-id', partnerId);
        tag.innerHTML = `<span>${partnerName}</span><button type="button" data-id="${partnerId}">&times;</button>`;
        container.appendChild(tag);

        const btn = tag.querySelector('button');
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const id = e.target.getAttribute('data-id');
          const updated = new Set(selectedPartners);
          updated.delete(id);
          setSelectedPartners(updated);
          tag.remove();
        });
      }

      // Reset select
      e.target.value = "";
    }
  };

  // Handle form submission - Create or Add Detail
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Get all detail form values
      const basicPriceVal = basicPrice;
      const passengerType = document.getElementById('new-passenger-type')?.value;
      const ticketType = document.getElementById('new-ticket-type')?.value;
      const cabin = document.getElementById('new-cabin')?.value;
      const originPort = document.getElementById('new-origin-port')?.value;
      const destinationPort = document.getElementById('new-destination-port')?.value;
      const visaType = document.getElementById('new-visa-type')?.value;
      const taxForm = document.getElementById('new-tax-form')?.value;
      const allowedPieces = document.getElementById('new-allowed-pieces')?.value;
      const allowedWeight = document.getElementById('new-allowed-weight')?.value;
      const excessPrice = document.getElementById('new-excess-price')?.value;

      // Get selected taxes from state (not from DOM)
      const selectedTaxIdsList = selectedTaxIds;
      console.log("[v0] Selected tax IDs for submission:", selectedTaxIds);

      // Validate required detail fields
      if (basicPriceVal === '' || basicPriceVal === null || basicPriceVal < 0 || !passengerType || !cabin || !originPort || !destinationPort) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Fields',
          text: 'Please fill in all required detail fields and ensure price is not negative.',
        });
        setIsSubmitting(false);
        return;
      }

      // If in edit mode, add detail to existing price list
      if (isEditMode && priceListId) {
        const detailPayload = {
          passengerType,
          ticketType: ticketType || 'one_way',
          cabin,
          originPort,
          destinationPort,
          visaType: visaType || 'Tourist',
          basicPrice: parseFloat(basicPriceVal),
          taxIds: selectedTaxIdsList,
          taxForm: taxForm || 'refundable',
          allowedLuggagePieces: parseInt(allowedPieces) || 1,
          allowedLuggageWeight: parseInt(allowedWeight) || 20,
          excessLuggagePricePerKg: parseFloat(excessPrice) || 2.5,
        };

        console.log("[v0] Submitting edit mode detail payload:", detailPayload);

        const response = await priceListApi.addPriceListDetail(priceListId, detailPayload);

        if (response?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.message || 'Price list detail added successfully!',
          }).then(() => {
            // Reload the price list
            setExistingPriceList(null);
            const fetchPriceList = async () => {
              const updatedResponse = await priceListApi.getPriceListById(priceListId);
              if (updatedResponse?.success) {
                setExistingPriceList(updatedResponse.data);
                // Clear form fields for adding another detail
                document.getElementById('new-passenger-type').value = '';
                document.getElementById('new-ticket-type').value = '';
                document.getElementById('new-cabin').value = '';
                document.getElementById('new-origin-port').value = '';
                document.getElementById('new-destination-port').value = '';
                document.getElementById('new-visa-type').value = '';
                document.getElementById('new-allowed-pieces').value = '';
                document.getElementById('new-allowed-weight').value = '';
                document.getElementById('new-excess-price').value = '';
                document.getElementById('new-tax-form').value = 'refundable';
                // Reset state
                setBasicPrice(0);
                setSelectedTaxIds([]);
                setCurrentTaxBase('fare_only');
                setTotalPrice(0);
                // Clear tax tags
                const selectedTaxTagsContainer = document.getElementById(`${idPrefix}-tax-tags`);
                if (selectedTaxTagsContainer) {
                  selectedTaxTagsContainer.innerHTML = '';
                }
              }
            };
            fetchPriceList();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response?.message || 'Failed to add detail.',
          });
        }
      } else {
        // Create mode - create full price list
        const priceListName = document.getElementById(`${idPrefix}-name`)?.value;
        const effectiveDateTime = document.getElementById(`${idPrefix}-effective-date`)?.value;
        const taxBase = document.getElementById(`${idPrefix}-tax-base`)?.value;
        const currency = document.getElementById(`${idPrefix}-currency`)?.value;

        // Get selected partners from tags
        const partnersTagsContainer = document.getElementById(`${idPrefix}-partners-tags`);
        const partnerIds = [];
        if (partnersTagsContainer) {
          const tags = partnersTagsContainer.querySelectorAll('.tag');
          tags.forEach(tag => {
            const btn = tag.querySelector('button');
            const partnerId = btn?.getAttribute('data-id');
            if (partnerId) partnerIds.push(partnerId);
          });
        }

        // Validate required header fields
        if (!priceListName || !effectiveDateTime || !taxBase || !currency) {
          Swal.fire({
            icon: 'warning',
            title: 'Missing Fields',
            text: 'Please fill in all required header fields.',
          });
          setIsSubmitting(false);
          return;
        }

        // Prepare payload for creation
        const payload = {
          header: {
            priceListName,
            effectiveDateTime,
            taxBase,
            currency,
            category: idPrefix,
            partners: partnerIds,
            status: 'active',
          },
          detail: {
            passengerType,
            ticketType: ticketType || 'one_way',
            cabin,
            originPort,
            destinationPort,
            visaType: visaType || 'Tourist',
            basicPrice: parseFloat(basicPriceVal),
            taxIds: selectedTaxIdsList,
            taxForm: taxForm || 'refundable',
            allowedLuggagePieces: parseInt(allowedPieces) || 1,
            allowedLuggageWeight: parseInt(allowedWeight) || 20,
            excessLuggagePricePerKg: parseFloat(excessPrice) || 2.5,
          },
        };

        console.log("[v0] Create mode payload:", payload);

        const response = await priceListApi.createPriceList(payload);

        if (response?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.message || 'Price list created successfully!',
          }).then(() => {
            onBack && onBack();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response?.message || 'Failed to create price list.',
          });
        }
      }
    } catch (error) {
      console.error('[v0] Error submitting:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message || 'An error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // helper to render the price-details table rows exactly like HTML's sample
  const isLoading = currenciesLoading || payloadTypesLoading || cabinsLoading || portsLoading || taxesLoading || priceListLoading || isDisablingDetail;

  return (
    <div ref={rootRef}>
      {isLoading && (
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

      {!isLoading && (
        <>
          <button
            className="mb-4 btn btn-turquoise"
            onClick={(e) => {
              e.preventDefault();
              onBack && onBack();
            }}
          >
            &larr; Back to List
          </button>

          <form className="vstack gap-4" onSubmit={handleSubmit}>
            {isEditMode && priceListLoading && (
              <div className="alert alert-info">Loading price list details...</div>
            )}

            {isEditMode && !priceListLoading && existingPriceList && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">Price List Header (Read-Only)</h5>
                  <button type="button" className="btn btn-sm btn-secondary">
                    ✎ Edit Header
                  </button>
                </div>
                <div className="row g-4 mb-4">
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Price List Name</label>
                    <input type="text" className="form-control" value={existingPriceList.header?.priceListName || ''} disabled />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Effective Date & Time</label>
                    <input type="text" className="form-control" value={existingPriceList.header?.effectiveDateTime ? new Date(existingPriceList.header.effectiveDateTime).toLocaleString() : ''} disabled />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Tax Base</label>
                    <input type="text" className="form-control" value={existingPriceList.header?.taxBase === 'fare_only' ? 'Fare Only' : 'Fare & Taxes'} disabled />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Currency</label>
                    <input type="text" className="form-control" value={existingPriceList.header?.currency?.currencyCode || ''} disabled />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Partners</label>
                    <input type="text" className="form-control" value={existingPriceList.header?.partners?.map(p => p.name).join(', ') || 'None'} disabled />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Status</label>
                    <input type="text" className="form-control" value={existingPriceList.header?.status || ''} disabled />
                  </div>
                </div>

                <hr />
              </div>
            )}

            {!isEditMode && (
              <div>
                <h5 className="fw-bold mb-4">Price List Header</h5>
                <div className="row g-4 mb-4">
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Price List Name</label>
                    <input type="text" id={`${idPrefix}-name`} className="form-control" placeholder="Enter price list name" />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Effective Date & Time</label>
                    <input type="datetime-local" id={`${idPrefix}-effective-date`} className="form-control" />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Tax Base</label>
                    <select 
                      id={`${idPrefix}-tax-base`} 
                      className="form-select"
                      value={currentTaxBase}
                      onChange={(e) => setCurrentTaxBase(e.target.value)}
                    >
                      <option value="fare_only">Fare Only</option>
                      <option value="fare_plus_tax">Fare & Taxes</option>
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Currency</label>
                    <select id={`${idPrefix}-currency`} className="form-select">
                      <option value="">Select Currency</option>
                      {currencies.map((currency) => (
                        <option key={currency._id} value={currency._id}>
                          {currency.currencyCode}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Partners</label>
                    <select
                      id={`${idPrefix}-partners`}
                      className="form-select"
                      onChange={(e) => {
                        const option = e.target.options[e.target.selectedIndex];
                        if (option.value) {
                          // Add selected partner as tag
                          const partnersContainer = document.getElementById(`${idPrefix}-partners-tags`);
                          const tag = document.createElement('div');
                          tag.className = 'tag';
                          tag.setAttribute('data-id', option.value);
                          tag.innerHTML = `<span>${option.text}</span><button type="button" data-id="${option.value}">&times;</button>`;
                          partnersContainer.appendChild(tag);

                          const btn = tag.querySelector('button');
                          btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            const select = document.getElementById(`${idPrefix}-partners`);
                            Array.from(select.options).forEach(opt => {
                              if (opt.value === option.value) opt.selected = false;
                            });
                            tag.remove();
                          });

                          // Reset dropdown
                          e.target.selectedIndex = 0;
                        }
                      }}
                    >
                      <option value="">Select Marine Partners</option>
                      {marinePartners.map((partner) => (
                        <option key={partner._id} value={partner._id}>
                          {partner.name}
                        </option>
                      ))}
                    </select>
                    <div id={`${idPrefix}-partners-tags`} className="selected-tags mt-2"></div>
                  </div>
                </div>
                <hr />
              </div>
            )}

            {/* Detail Form Section - shown in both create and edit modes */}
            <div className="card p-2 rounded-3 shadow-sm">
              <h3 className="mb-4">Price List Details</h3>
              <div className="table-responsive">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Passenger Type</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Ticket Type</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Cabin</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Origin Port</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Destination Port</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Visa Type</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Basic Price</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Taxes</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Tax Form</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Total Price</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Allowed Luggage (Pieces)</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Allowed Luggage (Weight)</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Excess Luggage Price (kg)</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Status</th>
                      <th scope="col" className="px-2 py-3 text-start fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {/* Show existing details in edit mode */}
                    {isEditMode && existingPriceList?.details && existingPriceList.details.length > 0 && (
                      existingPriceList.details.map((detail) => {
                        // passengerType can be either an object with name property or just an ID string
                        const passengerTypeName = typeof detail.passengerType === 'object'
                          ? detail.passengerType?.name
                          : payloadTypes.find(pt => pt._id === detail.passengerType)?.name || detail.passengerType;
                        // taxIds contains full tax objects with name field
                        const taxNames = detail.taxIds?.map(tax => tax?.name || 'N/A').join(', ') || 'N/A';

                        return (
                          <tr key={detail._id}>
                            <td className="px-2 py-4 text-nowrap">{passengerTypeName}</td>
                            <td className="px-2 py-4 text-nowrap">{detail.ticketType || 'N/A'}</td>
                            <td className="px-2 py-4 text-nowrap">{detail.cabin?.name || 'N/A'}</td>
                            <td className="px-2 py-4 text-nowrap">{detail.originPort?.name || 'N/A'}</td>
                            <td className="px-2 py-4 text-nowrap">{detail.destinationPort?.name || 'N/A'}</td>
                            <td className="px-2 py-4 text-nowrap">{detail.visaType || 'N/A'}</td>
                            <td className="px-2 py-4 text-nowrap">{detail.basicPrice || 'N/A'}</td>
                            <td className="px-2 py-4 text-nowrap">{taxNames}</td>
                            <td className="px-2 py-4 text-nowrap">{detail.taxForm || 'N/A'}</td>
                            <td className="px-2 py-4 text-nowrap">{detail.totalPrice || 'N/A'}</td>
                            <td className="px-2 py-4 text-nowrap">{detail.allowedLuggagePieces || 'N/A'}</td>
                            <td className="px-2 py-4 text-nowrap">{detail.allowedLuggageWeight || 'N/A'}</td>
                            <td className="px-2 py-4 text-nowrap">{detail.excessLuggagePricePerKg || 'N/A'}</td>
                            <td className="px-2 py-4 text-nowrap">
                              <span className={`badge ${detail.isDisabled ? 'bg-danger' : 'bg-success'}`}>
                                {detail.isDisabled ? 'Disabled' : 'Active'}
                              </span>
                            </td>
                            <td className="px-2 py-4">
                              {!detail.isDisabled && (
                                <CanDisable action="update" path="/company/pricing/pricelist">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDisableDetail(detail._id)}
                                    title="Disable this detail permanently"
                                  >
                                    Disable
                                  </button>
                                </CanDisable>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}

                    {/* editable row for adding new detail */}
                    <tr>
                      <td className="px-2 py-4">
                        <select id="new-passenger-type" className="form-select w-100 rounded-2 p-1">
                          <option value="">Select {idPrefix === 'passenger' ? 'Passenger' : idPrefix === 'vehicle' ? 'Vehicle' : 'Cargo'} Type</option>
                          {payloadTypes.map((payloadType) => (
                            <option key={payloadType._id} value={payloadType._id}>
                              {payloadType.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-2 py-4">
                        <select id="new-ticket-type" className="form-select w-100 rounded-2 p-1">
                          <option value="">Select Ticket Type</option>
                          <option value="one_way">One Way</option>
                          <option value="round_trip">Round Trip</option>
                          <option value="return">Return</option>
                        </select>
                      </td>

                      <td className="px-2 py-4">
                        <select id="new-cabin" className="form-select w-100 rounded-2 p-1" disabled={cabinsLoading}>
                          <option value="">Select Cabin</option>
                          {cabins.map((cabin) => (
                            <option key={cabin._id} value={cabin._id}>
                              {cabin.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-2 py-4">
                        <select id="new-origin-port" className="form-select w-100 rounded-2 p-1" disabled={portsLoading}>
                          <option value="">Select Origin Port</option>
                          {ports.map((port) => (
                            <option key={port._id} value={port._id}>
                              {port.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-2 py-4">
                        <select id="new-destination-port" className="form-select w-100 rounded-2 p-1" disabled={portsLoading}>
                          <option value="">Select Destination Port</option>
                          {ports.map((port) => (
                            <option key={port._id} value={port._id}>
                              {port.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-2 py-4">
                        <select id="new-visa-type" className="form-select w-100 rounded-2 p-1">
                          <option>Tourist</option><option>Business</option><option>Student</option><option>N/A</option>
                        </select>
                      </td>

                      <td className="px-2 py-4">
                        <input 
                          type="number" 
                          step="0.01" 
                          id="new-basic-price" 
                          className="form-control w-100 rounded-2 p-1"
                          value={basicPrice}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setBasicPrice('');
                            } else {
                              setBasicPrice(Number(val));
                            }
                          }}
                        />
                      </td>

                      <td className="px-2 py-4">
                        <select
                          id={`${idPrefix}-tax-select`}
                          className="select-with-tags form-select rounded-2 p-1 h-24"
                          style={{ width: 150 }}
                          disabled={taxesLoading}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            if (!selectedValue) return;

                            // Immediately update selectedTaxIds state
                            setSelectedTaxIds(prev =>
                              prev.includes(selectedValue)
                                ? prev
                                : [...prev, selectedValue]
                            );

                            // Reset dropdown
                            e.target.selectedIndex = 0;
                          }}
                        >
                          <option value="">Select Tax</option>
                          {taxes.map((tax) => (
                            <option key={tax._id} value={tax._id}>
                              {tax.name}
                            </option>
                          ))}
                        </select>
                        <div id={`${idPrefix}-tax-tags`} className="selected-tags">
                          {selectedTaxIds.map(taxId => {
                            const tax = taxes.find(t => t._id === taxId);
                            return (
                              <div key={taxId} className="tag">
                                <span>{tax?.name}</span>
                                <button 
                                  type="button" 
                                  onClick={() => setSelectedTaxIds(prev => prev.filter(id => id !== taxId))}
                                >
                                  &times;
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td>
                        <select className="form-select" id="new-tax-form" style={{ width: 150 }}>
                          <option value="refundable">Refundable</option>
                          <option value="non_refundable">Non Refundable</option>
                        </select>
                      </td>

                      <td className="px-2 py-4">
                        <input 
                          type="number" 
                          step="0.01" 
                          id="new-total-price" 
                          className="form-control w-100 rounded-2 p-1" 
                          value={totalPrice}
                          readOnly 
                        />
                      </td>

                      <td className="px-2 py-4">
                        <input type="number" id="new-allowed-pieces" className="form-control w-100 rounded-2 p-1" />
                      </td>

                      <td className="px-2 py-4">
                        <input type="number" step="0.01" id="new-allowed-weight" className="form-control w-100 rounded-2 p-1" />
                      </td>

                      <td className="px-2 py-4">
                        <input type="number" step="0.01" id="new-excess-price" className="form-control w-100 rounded-2 p-1" />
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-turquoise fw-medium" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Details"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
