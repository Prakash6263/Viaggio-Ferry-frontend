import React from "react";

export function PageWrapper({ children }) {
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">{children}</div>
    </div>
  );
}
