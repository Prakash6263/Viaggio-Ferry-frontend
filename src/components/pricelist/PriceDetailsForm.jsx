import React, { useEffect, useRef } from "react";

/**
 * PriceDetailsForm
 * - renders the details form markup exactly like HTML
 * - attaches select-with-tags behavior to selects that have class 'select-with-tags'
 * - accepts `onBack` callback to switch back to list view
 */
export default function PriceDetailsForm({ idPrefix = "passenger", onBack }) {
  const rootRef = useRef(null);

  useEffect(() => {
    // Select-with-tags implementation copied from original page
    // Works for all selects with class 'select-with-tags' inside this component
    const selects = rootRef.current ? rootRef.current.querySelectorAll('.select-with-tags') : [];
    const handlers = [];

    selects.forEach((select) => {
      const selectedContainer = select.nextElementSibling; // div.selected-tags
      const selectedItems = new Set();

      const changeHandler = () => {
        const value = select.value;
        if (value && !selectedItems.has(value)) {
          selectedItems.add(value);
          addTag(value, selectedContainer, selectedItems);
        }
        select.selectedIndex = 0; // reset placeholder
      };

      const addTag = (value, container, itemsSet) => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `<span>${value}</span><button type="button" data-value="${value}">&times;</button>`;
        container.appendChild(tag);

        const btn = tag.querySelector('button');
        const btnHandler = (e) => {
          const val = e.target.getAttribute('data-value');
          itemsSet.delete(val);
          tag.remove();
        };
        btn.addEventListener('click', btnHandler);
        // store cleanup
        handlers.push(() => btn.removeEventListener('click', btnHandler));
      };

      select.addEventListener('change', changeHandler);
      handlers.push(() => select.removeEventListener('change', changeHandler));
    });

    return () => {
      handlers.forEach((h) => h && h());
    };
  }, []);

  // helper to render the price-details table rows exactly like HTML's sample
  return (
    <div ref={rootRef}>
      <button
        className="mb-4 btn btn-turquoise"
        onClick={(e) => {
          e.preventDefault();
          onBack && onBack();
        }}
      >
        &larr; Back to List
      </button>

      <form className="vstack gap-4">
        <div>
          <h5 className="fw-bold mb-4">Price List Header</h5>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <label htmlFor={`${idPrefix}-name`} className="form-label">Price List Name</label>
              <input type="text" id={`${idPrefix}-name`} name={`${idPrefix}-name`} className="form-control" />
            </div>
            <div className="col-md-6 col-lg-3">
              <label htmlFor={`${idPrefix}-effective-date`} className="form-label">Effective Date &amp; Time</label>
              <input type="datetime-local" id={`${idPrefix}-effective-date`} name={`${idPrefix}-effective-date`} className="form-control" />
            </div>
            <div className="col-md-6 col-lg-3">
              <label htmlFor={`${idPrefix}-tax-base`} className="form-label">Tax Base</label>
              <select id={`${idPrefix}-tax-base`} name={`${idPrefix}-tax-base`} className="form-select">
                <option>Fare Only</option>
                <option>Fare &amp; Taxes</option>
              </select>
            </div>
            <div className="col-md-6 col-lg-3">
              <label htmlFor={`${idPrefix}-currency`} className="form-label">Currency</label>
              <input type="text" id={`${idPrefix}-currency`} name={`${idPrefix}-currency`} className="form-control" />
            </div>
          </div>
        </div>

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
                  <th scope="col" className="px-2 py-3 text-start fw-semibold">Tax form</th>
                  <th scope="col" className="px-2 py-3 text-start fw-semibold">Total Price</th>
                  <th scope="col" className="px-2 py-3 text-start fw-semibold">Allowed Luggage (Pieces)</th>
                  <th scope="col" className="px-2 py-3 text-start fw-semibold">Allowed Luggage (Weight)</th>
                  <th scope="col" className="px-2 py-3 text-start fw-semibold">Excess Luggage Price (kg)</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                <tr>
                  <td className="px-2 py-4 text-nowrap">Adult</td>
                  <td className="px-2 py-4 text-nowrap">One Way</td>
                  <td className="px-2 py-4 text-nowrap">Economy</td>
                  <td className="px-2 py-4 text-nowrap">Port A</td>
                  <td className="px-2 py-4 text-nowrap">Port B</td>
                  <td className="px-2 py-4 text-nowrap">Tourist</td>
                  <td className="px-2 py-4 text-nowrap">150.00</td>
                  <td className="px-2 py-4 text-nowrap">VAT, Port Tax</td>
                  <td className="px-2 py-4 text-nowrap">Tax form</td>
                  <td className="px-2 py-4 text-nowrap">165.75</td>
                  <td className="px-2 py-4 text-nowrap">1</td>
                  <td className="px-2 py-4 text-nowrap">20 kg</td>
                  <td className="px-2 py-4 text-nowrap">5.00</td>
                </tr>

                {/* editable row (keeps same markup as HTML) */}
                <tr>
                  <td className="px-2 py-4">
                    <select id="new-passenger-type" className="form-select w-100 rounded-2 p-1">
                      <option>Adult</option><option>Child</option>
                    </select>
                  </td>

                  <td className="px-2 py-4">
                    <select id="new-ticket-type" className="form-select w-100 rounded-2 p-1">
                      <option>One Way</option><option>Return</option>
                    </select>
                  </td>

                  <td className="px-2 py-4">
                    <select id="new-cabin" className="form-select w-100 rounded-2 p-1">
                      <option>Economy</option><option>Business</option><option>First Class</option>
                    </select>
                  </td>

                  <td className="px-2 py-4">
                    <select id="new-origin-port" className="form-select w-100 rounded-2 p-1">
                      <option>Port A</option><option>Port B</option><option>Port C</option>
                    </select>
                  </td>

                  <td className="px-2 py-4">
                    <select id="new-destination-port" className="form-select w-100 rounded-2 p-1">
                      <option>Port A</option><option>Port B</option><option>Port C</option>
                    </select>
                  </td>

                  <td className="px-2 py-4">
                    <select id="new-visa-type" className="form-select w-100 rounded-2 p-1">
                      <option>Tourist</option><option>Business</option><option>Student</option><option>N/A</option>
                    </select>
                  </td>

                  <td className="px-2 py-4">
                    <input type="number" step="0.01" id="new-basic-price" className="form-control w-100 rounded-2 p-1" />
                  </td>

                  <td className="px-2 py-4">
                    <select className="select-with-tags form-select rounded-2 p-1 h-24" style={{ width: 150 }}>
                      <option selected disabled>Select Tax </option>
                      <option value="VAT">VAT</option>
                      <option value="Port Tax">Port Tax</option>
                      <option value="Security Fee">Security Fee</option>
                      <option value="Fuel Surcharge">Fuel Surcharge</option>
                    </select>
                    <div className="selected-tags"></div>
                  </td>

                  <td>
                    <select className="form-select" id="taxform" style={{ width: 150 }}>
                      <option value="Refundable">Refundable</option>
                      <option value="Non Refundable">Non Refundable</option>
                    </select>
                  </td>

                  <td className="px-2 py-4">
                    <input type="number" step="0.01" id="new-total-price" className="form-control w-100 rounded-2 p-1" />
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
          <button type="submit" className="btn btn-turquoise fw-medium">
            Save Details
          </button>
        </div>
      </form>
    </div>
  );
}
