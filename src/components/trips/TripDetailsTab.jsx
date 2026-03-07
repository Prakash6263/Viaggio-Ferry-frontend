import React from "react";

export default function TripDetailsTab({
  form,
  onFormChange,
  onSaveTrip,
  ships,
  ports,
  loadingData
}) {
  return (
    <div id="tripDetailsTab">
      <form className="row g-3" onSubmit={onSaveTrip}>
        <div className="col-md-6">
          <label className="form-label">Trip Name/Code</label>
          <input 
            type="text" 
            className="form-control" 
            name="code" 
            value={form.code} 
            onChange={onFormChange} 
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Assign Vessel</label>
          <select 
            className="form-select" 
            name="vessel" 
            value={form.vessel} 
            onChange={onFormChange} 
            disabled={loadingData}
          >
            <option value="">-- Select a Ship --</option>
            {ships.map((ship) => (
              <option key={ship._id} value={ship._id}>
                {ship.name}
              </option>
            ))}
          </select>
          {loadingData && <small className="text-muted">Loading ships...</small>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Departure Port</label>
          <select 
            className="form-select" 
            name="departurePort" 
            value={form.departurePort} 
            onChange={onFormChange} 
            disabled={loadingData}
          >
            <option value="">-- Select a Port --</option>
            {ports.map((port) => (
              <option key={port._id} value={port._id}>
                {port.name}
              </option>
            ))}
          </select>
          {loadingData && <small className="text-muted">Loading ports...</small>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Arrival Port</label>
          <select 
            className="form-select" 
            name="arrivalPort" 
            value={form.arrivalPort} 
            onChange={onFormChange} 
            disabled={loadingData}
          >
            <option value="">-- Select a Port --</option>
            {ports.map((port) => (
              <option key={port._id} value={port._id}>
                {port.name}
              </option>
            ))}
          </select>
          {loadingData && <small className="text-muted">Loading ports...</small>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Departure Date & Time</label>
          <input 
            type="datetime-local" 
            className="form-control" 
            name="departureAt" 
            value={form.departureAt} 
            onChange={onFormChange} 
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Arrival Date & Time</label>
          <input 
            type="datetime-local" 
            className="form-control" 
            name="arrivalAt" 
            value={form.arrivalAt} 
            onChange={onFormChange} 
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Status</label>
          <select 
            className="form-select" 
            name="status" 
            value={form.status} 
            onChange={onFormChange}
          >
            <option>Scheduled</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Booking Opening Date</label>
          <input 
            type="datetime-local" 
            className="form-control" 
            name="bookingOpen" 
            value={form.bookingOpen} 
            onChange={onFormChange} 
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Booking Closing Date</label>
          <input 
            type="datetime-local" 
            className="form-control" 
            name="bookingClose" 
            value={form.bookingClose} 
            onChange={onFormChange} 
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Check-in Opening Date</label>
          <input 
            type="datetime-local" 
            className="form-control" 
            name="checkinOpen" 
            value={form.checkinOpen} 
            onChange={onFormChange} 
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Check-in Closing Date</label>
          <input 
            type="datetime-local" 
            className="form-control" 
            name="checkinClose" 
            value={form.checkinClose} 
            onChange={onFormChange} 
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Boarding Closing Date</label>
          <input 
            type="datetime-local" 
            className="form-control" 
            name="boardingClose" 
            value={form.boardingClose} 
            onChange={onFormChange} 
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Promotion</label>
          <select 
            className="form-select" 
            name="promotion" 
            value={form.promotion} 
            onChange={onFormChange}
          >
            <option value="">None</option>
            <option value="discount10">Discount 10%</option>
            <option value="earlybird">Early Bird</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Remarks/Notes</label>
          <textarea 
            className="form-control" 
            rows="3" 
            name="remarks" 
            value={form.remarks} 
            onChange={onFormChange}
          ></textarea>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button type="submit" className="btn btn-turquoise">Save Trip</button>
        </div>
      </form>
    </div>
  );
}