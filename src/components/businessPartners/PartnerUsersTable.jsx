// src/components/businessPartners/PartnerUsersTable.jsx
import React from "react";

export default function PartnerUsersTable({ users = [], onAdd, onChangeUser, onRemove }) {
  return (
    <div>
      <button type="button" id="add-user-btn" className="btn btn-outline-primary mb-2" onClick={onAdd}>
        Add User
      </button>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Layer</th>
              <th>User Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="user-table-body">
            {users.map((u) => (
              <tr key={u.id}>
                <td><input className="form-control" value={u.userName} onChange={(e) => onChangeUser(u.id, "userName", e.target.value)} /></td>
                <td><input className="form-control" value={u.phone} onChange={(e) => onChangeUser(u.id, "phone", e.target.value)} /></td>
                <td><input className="form-control" value={u.email} onChange={(e) => onChangeUser(u.id, "email", e.target.value)} /></td>
                <td><input className="form-control" value={u.address} onChange={(e) => onChangeUser(u.id, "address", e.target.value)} /></td>
                <td>
                  <select className="form-control" value={u.layer} onChange={(e) => onChangeUser(u.id, "layer", e.target.value)}>
                    <option value="marine">Marine</option>
                    <option value="commercial">Commercial</option>
                    <option value="selling">Selling</option>
                  </select>
                </td>
                <td>
                  <select className="form-control" value={u.status} onChange={(e) => onChangeUser(u.id, "status", e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td><button type="button" className="btn btn-danger" onClick={() => onRemove(u.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
