import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function CompanyPoliciesEditor() {
  const [activeTab, setActiveTab] = useState("terms");
  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");

  useEffect(() => {
    // Load from localStorage initially (you can replace with API)
    setTermsContent(localStorage.getItem("terms_html") || "");
    setPrivacyContent(localStorage.getItem("privacy_html") || "");
  }, []);

  const handleSave = (type, status) => {
    const content = type === "terms" ? termsContent : privacyContent;
    const key = type === "terms" ? "terms_html" : "privacy_html";
    localStorage.setItem(key, content);
    alert(`${type === "terms" ? "Terms" : "Privacy Policy"} ${status} successfully.`);
  };

  const handlePreview = (type) => {
    const content = type === "terms" ? termsContent : privacyContent;
    const newWindow = window.open("", "_blank", "width=1024,height=768");
    newWindow.document.write(`
      <html>
        <head>
          <title>Preview - ${type}</title>
          <link rel="stylesheet" href="/assets/css/style.css" />
        </head>
        <body class="p-4">${content}</body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* Page Header */}
        <div className="page-header">
          <div className="content-page-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Policies Editor</h5>
            <div className="list-btn">
              <ul className="filter-list mb-0">
                <li>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleSave(activeTab, "saved")}
                  >
                    <i className="bi bi-save me-2"></i>Save Draft
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => handlePreview(activeTab)}
                  >
                    <i className="bi bi-eye me-2"></i>Preview
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-turquoise"
                    onClick={() => handleSave(activeTab, "published")}
                  >
                    <i className="bi bi-upload me-2"></i>Publish
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "terms" ? "active" : ""}`}
              onClick={() => setActiveTab("terms")}
            >
              Terms & Conditions
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "privacy" ? "active" : ""}`}
              onClick={() => setActiveTab("privacy")}
            >
              Privacy Policy
            </button>
          </li>
        </ul>

        {/* Editors */}
        <div className="mt-3">
          {activeTab === "terms" ? (
            <CKEditor
              editor={ClassicEditor}
              data={termsContent}
              onChange={(event, editor) => {
                const data = editor.getData();
                setTermsContent(data);
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
            <CKEditor
              editor={ClassicEditor}
              data={privacyContent}
              onChange={(event, editor) => {
                const data = editor.getData();
                setPrivacyContent(data);
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
          )}
        </div>
      </PageWrapper>
    </div>
  );
}
