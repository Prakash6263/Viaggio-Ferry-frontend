import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";

export default function CompanyProfileList() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Top Bar */}
          <div className="top-bar d-flex justify-content-between align-items-center">
            <div></div>
            {/* Here grid icon is active (list view), bars is normal */}
            <div>
              <Link to="/company/settings/company-profile" className="me-3">
                <i className="fa-solid fa-bars fa-lg" />
              </Link>
              <Link
                to="/company/settings/company-profile-list"
                className="actives"
              >
                <i className="fa-solid fa-th-large fa-lg" />
              </Link>
            </div>
          </div>

          {/* Company Table */}
          <div className="row g-4">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  {/* little inline style block from HTML – you probably already have this in CSS, but kept as-is */}
                  <style>
                    {`
                      .social-links{
                        display:flex;
                        gap: 10px;
                        align-items: center;
                      }
                      .social-links a {
                        margin-right: 10px;
                        text-decoration: none;
                      }
                    `}
                  </style>

                  <div className="table-responsive">
                    <table
                      id="example"
                      className="table table-striped"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th>Logo</th>
                          <th>Company Name</th>
                          <th>Reg. Number</th>
                          <th>Tax/VAT Number</th>
                          <th>Date Established</th>
                          <th>Address</th>
                          <th>City</th>
                          <th>Country</th>
                          <th>Postal Code</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>Website</th>
                          <th>Currency</th>
                          <th>Applicable Taxes</th>
                          <th>Primary Ports</th>
                          <th>Operating Countries</th>
                          <th>Time Zone</th>
                          <th>Working Days / Hours</th>
                          <th>About Us</th>
                          <th>Vision</th>
                          <th>Mission</th>
                          <th>Purpose</th>
                          <th>Social Links</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="circle-avatar bg-primary">OVL</div>
                          </td>
                          <td>Oceanic Ventures Ltd.</td>
                          <td>REG-1001</td>
                          <td>VAT-OV123456</td>
                          <td>2001-06-15</td>
                          <td>100 Ocean Ave</td>
                          <td>Bayview</td>
                          <td>Atlantica</td>
                          <td>11111</td>
                          <td>+1 234 567 8901</td>
                          <td>contact@oceanicventures.com</td>
                          <td>
                            <a href="#">oceanicventures.com</a>
                          </td>
                          <td>USD</td>
                          <td>VAT, Excise</td>
                          <td>Port Sudan, Jeddah</td>
                          <td>Sudan, Saudi Arabia</td>
                          <td>UTC +3</td>
                          <td>Mon-Fri, 9AM-6PM</td>
                          <td>Leading marine logistics provider.</td>
                          <td>Innovative shipping solutions.</td>
                          <td>Global marine logistics network.</td>
                          <td>Connecting ports worldwide.</td>
                          <td className="social-links">
                            <a href="#">
                              <i className="bi bi-facebook" />
                            </a>
                            <a href="#">
                              <i className="bi bi-instagram" />
                            </a>
                            <a href="#">
                              <i className="bi bi-whatsapp" />
                            </a>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div className="circle-avatar bg-success">MLI</div>
                          </td>
                          <td>Marine Logistics Inc.</td>
                          <td>REG-1002</td>
                          <td>VAT-ML789012</td>
                          <td>2005-11-10</td>
                          <td>200 Harbor St</td>
                          <td>Seaport City</td>
                          <td>Maritima</td>
                          <td>22222</td>
                          <td>+1 345 678 9012</td>
                          <td>info@marinelogistics.com</td>
                          <td>
                            <a href="#">marinelogistics.com</a>
                          </td>
                          <td>EUR</td>
                          <td>VAT</td>
                          <td>Suakin, Jeddah</td>
                          <td>Sudan, UAE</td>
                          <td>UTC +4</td>
                          <td>Mon-Sat, 8AM-7PM</td>
                          <td>Expert in cargo and passenger logistics.</td>
                          <td>Building smarter ports.</td>
                          <td>Innovate sea transport globally.</td>
                          <td>Facilitate trade across borders.</td>
                          <td className="social-links">
                            <a href="#">
                              <i className="bi bi-facebook" />
                            </a>
                            <a href="#">
                              <i className="bi bi-linkedin" />
                            </a>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div className="circle-avatar bg-warning">SBF</div>
                          </td>
                          <td>Sea Breeze Ferries</td>
                          <td>REG-1003</td>
                          <td>VAT-SB345678</td>
                          <td>2010-03-25</td>
                          <td>300 Coastal Rd</td>
                          <td>Marina Bay</td>
                          <td>Oceanica</td>
                          <td>33333</td>
                          <td>+1 456 789 0123</td>
                          <td>support@seabreezeferries.com</td>
                          <td>
                            <a href="#">seabreezeferries.com</a>
                          </td>
                          <td>GBP</td>
                          <td>VAT, Service Tax</td>
                          <td>Port Sudan, Suakin</td>
                          <td>Sudan, Saudi Arabia</td>
                          <td>UTC +3</td>
                          <td>Mon-Sun, 7AM-9PM</td>
                          <td>Affordable ferry services.</td>
                          <td>To make ferry travel accessible.</td>
                          <td>Expand passenger sea routes.</td>
                          <td>Promote coastal connectivity.</td>
                          <td className="social-links">
                            <a href="#">
                              <i className="bi bi-facebook" />
                            </a>
                            <a href="#">
                              <i className="bi bi-instagram" />
                            </a>
                            <a href="#">
                              <i className="bi bi-snapchat" />
                            </a>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div className="circle-avatar bg-info">GSC</div>
                          </td>
                          <td>Global Shipping Co.</td>
                          <td>REG-1004</td>
                          <td>VAT-GS567890</td>
                          <td>2015-08-12</td>
                          <td>400 Dockyard Lane</td>
                          <td>Shiptown</td>
                          <td>Transmar</td>
                          <td>44444</td>
                          <td>+1 567 890 1234</td>
                          <td>contact@globalshipping.com</td>
                          <td>
                            <a href="#">globalshipping.com</a>
                          </td>
                          <td>USD</td>
                          <td>VAT</td>
                          <td>Jeddah, Port Sudan</td>
                          <td>Sudan, Saudi Arabia, UAE</td>
                          <td>UTC +3</td>
                          <td>Mon-Fri, 9AM-5PM</td>
                          <td>Global leader in freight shipping.</td>
                          <td>Connect world by sea.</td>
                          <td>Deliver efficient shipping services.</td>
                          <td>Support global commerce.</td>
                          <td className="social-links">
                            <a href="#">
                              <i className="bi bi-facebook" />
                            </a>
                            <a href="#">
                              <i className="bi bi-linkedin" />
                            </a>
                            <a href="#">
                              <i className="bi bi-whatsapp" />
                            </a>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <div className="circle-avatar bg-danger">AP</div>
                          </td>
                          <td>Atlantic Passage</td>
                          <td>REG-1005</td>
                          <td>VAT-AP123987</td>
                          <td>2018-01-30</td>
                          <td>500 Atlantic Blvd</td>
                          <td>Seaside</td>
                          <td>Coastline</td>
                          <td>55555</td>
                          <td>+1 678 901 2345</td>
                          <td>info@atlanticpassage.com</td>
                          <td>
                            <a href="#">atlanticpassage.com</a>
                          </td>
                          <td>EUR</td>
                          <td>VAT, Excise</td>
                          <td>Suakin, Jeddah</td>
                          <td>Sudan, Saudi Arabia</td>
                          <td>UTC +3</td>
                          <td>Mon-Sat, 8AM-8PM</td>
                          <td>Passage across Atlantic regions.</td>
                          <td>To make sea travel seamless.</td>
                          <td>Safe and reliable ferry passage.</td>
                          <td>Enable global connectivity.</td>
                          <td className="social-links">
                            <a href="#">
                              <i className="bi bi-facebook" />
                            </a>
                            <a href="#">
                              <i className="bi bi-instagram" />
                            </a>
                            <a href="#">
                              <i className="bi bi-linkedin" />
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
