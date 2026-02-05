// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
// import { PublicRoute, ProtectedRoute } from "./components/ProtectedRoute"
// import AuthLogoutHandler from "./components/AuthLogoutHandler"
// import CompanyLogin from "./pages/CompanyLogin" // Import CompanyLogin
// import CompanyForgotPassword from "./pages/CompanyForgotPassword" // Import forgot password page
// import CompanySupport from "./pages/CompanySupport"

// // Administration
// import AdminUserList from "./pages/AdminUserList"
// import AdminAddUser from "./pages/AdminAddUser"
// import Dashboard from "./pages/Dashboard"
// import CompanyCurrencyList from "./pages/CompanyCurrencyList"
// import CompanyAddCurrency from "./pages/CompanyAddCurrency"
// import CompanyEditCurrency from "./pages/CompanyEditCurrency"
// import CompanyCurrencyHistory from "./pages/CompanyCurrencyHistory"
// import CompanyTaxesList from "./pages/CompanyTaxesList"
// import CompanyAddTax from "./pages/CompanyAddTax"
// import CompanyEditTax from "./pages/CompanyEditTax" // Import CompanyEditTax
// import CompanyContactMessages from "./pages/CompanyContactMessages"
// import CompanyTerms from "./pages/CompanyTerms"
// import CompanyPoliciesEditor from "./pages/CompanyPoliciesEditor"
// import EditUser from "./pages/AdminEditUser"
// // Ship and Trip
// import CompanyShipsList from "./pages/CompanyShipsList"
// import CompanyAddShip from "./pages/CompanyAddShip"
// import CompanyTripsList from "./pages/CompanyTripsList"
// import CompanyAddTrip from "./pages/CompanyAddTrip"

// // Partner
// import CompanyPromotionsList from "./pages/CompanyPromotionsList"
// import CompanyAddPromotion from "./pages/CompanyAddPromotion"
// import BusinessPartnersPage from "./pages/BusinessPartners"
// import B2CCustomersPage from "./pages/B2CCustomersPage"
// import SalesmenPage from "./pages/SalesmenPage"
// import MarkupDiscountBoardPage from "./pages/MarkupDiscountBoardPage"
// import AddRulePage from "./pages/AddRulePage"
// import CommissionBoardPage from "./pages/CommissionBoardPage"
// import AddCommissionPage from "./pages/AddCommissionPage"

// // Sales and Booking
// import PriceListPage from "./pages/PriceListPage"
// import TicketingRulesPage from "./pages/TicketingRulesPage"
// import AddTicketRulePage from "./pages/AddTicketRulePage"
// import BookingAndTicketsPage from "./pages/BookingAndTicketsPage"
// import ExcessBaggageTickets from "./pages/ExcessBaggageTickets"

// // Checking and Boarding
// import PassengerCheckingPage from "./pages/PassengerCheckingPage"
// import CargoCheckingPage from "./pages/CargoCheckingPage"
// import VehicleCheckingPage from "./pages/VehicleCheckingPage"
// import CargoBoardingPage from "./pages/CargoBoardingPage"
// import PassengerBoardingPage from "./pages/PassengerBoardingPage"
// import VehicleBoardingPage from "./pages/VehicleBoardingPage"
// import TripCompletionPage from "./pages/TripCompletionPage"

// //finance

// import FinancePage from "./pages/FinancePage"
// import BankAndCashAccountsPage from "./pages/BankAndCashAccountsPage"
// import ChartOfAccountsPage from "./pages/ChartOfAccountsPage"
// import JournalEntries from "./pages/JournalEntries"
// import AddNewJournalEntry from "./pages/AddNewJournalEntry"
// import AgentTopup from "./pages/AgentTopup"
// import AddTopup from "./pages/AddTopup"
// import PaymentsAndReceipts from "./pages/PaymentsAndReceipts"
// import AddInternalPaymentReceipt from "./pages/AddInternalPaymentReceipt"
// import GeneralLedger from "./pages/GeneralLedger"
// import TrialBalance from "./pages/TrialBalance"
// import AccountingPeriodsPage from "./pages/AccountingPeriods"

// //settings
// import CompanyProfile from "./pages/CompanyProfile"
// import CompanyEditProfile from "./pages/EditCompanyProfile"
// import CompanyProfileList from "./pages/CompanyProfileList"
// import RolePermission from "./pages/RolePermission"
// import AddGroupPermission from "./pages/AddGroupPermission"
// import Port from "./pages/Port"
// import AddPort from "./pages/AddPort"
// import Cabin from "./pages/Cabin"
// import AddCabin from "./pages/AddCabin"
// import PayloadType from "./pages/PayloadType"
// import SystemAlerts from "./pages/SystemAlerts"

// export default function App() {
//   return (
//     <Router>
//       <AuthLogoutHandler />
//       <Routes>
//         {/* Logins Page */}
//         <Route path="/company-login" element={<PublicRoute element={<CompanyLogin />} />} />
//         <Route path="/company-forgot-password" element={<PublicRoute element={<CompanyForgotPassword />} />} />

//         {/* Dashboard Page */}
//         <Route path="/company/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />

//         {/* Administration */}
//         <Route path="/company/administration/add-user" element={<ProtectedRoute element={<AdminAddUser />} />} />
//         <Route
//           path="/company/administration/edit-profile"
//           element={<ProtectedRoute element={<CompanyEditProfile />} />}
//         />
//         <Route path="/company/administration/user-list" element={<ProtectedRoute element={<AdminUserList />} />} />
//         <Route path="/company/administration/currency" element={<ProtectedRoute element={<CompanyCurrencyList />} />} />
//         <Route
//           path="/company/administration/add-currency"
//           element={<ProtectedRoute element={<CompanyAddCurrency />} />}
//         />
//         <Route
//           path="/company/administration/edit-currency/:currencyId"
//           element={<ProtectedRoute element={<CompanyEditCurrency />} />}
//         />
//         <Route
//           path="/company/administration/edit-user/:userId"
//           element={<ProtectedRoute element={<EditUser />} />}
//         />
//         <Route
//           path="/company/administration/currency-history/:currencyId"
//           element={<ProtectedRoute element={<CompanyCurrencyHistory />} />}
//         />
//         <Route path="/company/administration/taxes" element={<ProtectedRoute element={<CompanyTaxesList />} />} />
//         <Route path="/company/administration/add-tax" element={<ProtectedRoute element={<CompanyAddTax />} />} />
//         <Route
//           path="/company/administration/edit-tax/:taxId"
//           element={<ProtectedRoute element={<CompanyEditTax />} />}
//         />
//         <Route
//           path="/company/administration/contact-messages"
//           element={<ProtectedRoute element={<CompanyContactMessages />} />}
//         />
//         <Route path="/company/administration/terms" element={<ProtectedRoute element={<CompanyTerms />} />} />
//         <Route
//           path="/company/administration/policies"
//           element={<ProtectedRoute element={<CompanyPoliciesEditor />} />}
//         />
//         <Route path="/company/administration/support" element={<ProtectedRoute element={<CompanySupport />} />} />
//         {/* Ships and Trips */}
//         <Route path="/company/ship-trip/ships" element={<ProtectedRoute element={<CompanyShipsList />} />} />
//         <Route path="/company/ship-trip/add-ship" element={<ProtectedRoute element={<CompanyAddShip />} />} />
//         <Route path="/company/ship-trip/trips" element={<ProtectedRoute element={<CompanyTripsList />} />} />
//         <Route path="/company/ship-trip/add-trip" element={<ProtectedRoute element={<CompanyAddTrip />} />} />

//         {/* Partners */}
//         <Route
//           path="/company/partner-management/promotions"
//           element={<ProtectedRoute element={<CompanyPromotionsList />} />}
//         />
//         <Route
//           path="/company/partner-management/add-promotion"
//           element={<ProtectedRoute element={<CompanyAddPromotion />} />}
//         />
//         <Route path="/company/partners" element={<ProtectedRoute element={<BusinessPartnersPage />} />} />
//         <Route path="/company/b2c-customers" element={<ProtectedRoute element={<B2CCustomersPage />} />} />
//         <Route path="/company/salesmen" element={<ProtectedRoute element={<SalesmenPage />} />} />
//         <Route path="/company/markup" element={<ProtectedRoute element={<MarkupDiscountBoardPage />} />} />
//         <Route path="/company/markup/add-rule" element={<ProtectedRoute element={<AddRulePage />} />} />
//         <Route path="/company/commission" element={<ProtectedRoute element={<CommissionBoardPage />} />} />
//         <Route path="/company/commission/add" element={<ProtectedRoute element={<AddCommissionPage />} />} />

//         {/* Sales and Booking */}
//         <Route path="/company/pricelist" element={<ProtectedRoute element={<PriceListPage />} />} />
//         <Route path="/company/ticketing-rules" element={<ProtectedRoute element={<TicketingRulesPage />} />} />
//         <Route path="/company/add-ticket-rule" element={<ProtectedRoute element={<AddTicketRulePage />} />} />
//         <Route path="/company/booking-and-tickets" element={<ProtectedRoute element={<BookingAndTicketsPage />} />} />
//         <Route path="/company/excess-baggage-tickets" element={<ProtectedRoute element={<ExcessBaggageTickets />} />} />

//         {/* Checking and Boarding */}
//         <Route path="/company/passenger-checking" element={<ProtectedRoute element={<PassengerCheckingPage />} />} />
//         <Route path="/company/cargo-checking" element={<ProtectedRoute element={<CargoCheckingPage />} />} />
//         <Route path="/company/vehicle-checking" element={<ProtectedRoute element={<VehicleCheckingPage />} />} />
//         <Route path="/company/cargo-boarding" element={<ProtectedRoute element={<CargoBoardingPage />} />} />
//         <Route path="/company/passenger-boarding" element={<ProtectedRoute element={<PassengerBoardingPage />} />} />
//         <Route path="/company/vehicle-boarding" element={<ProtectedRoute element={<VehicleBoardingPage />} />} />
//         <Route path="/company/trip-completion" element={<ProtectedRoute element={<TripCompletionPage />} />} />

//         {/* Finance */}
//         <Route path="/company/finance" element={<ProtectedRoute element={<FinancePage />} />} />
//         <Route
//           path="/company/finance/bank-cash-accounts"
//           element={<ProtectedRoute element={<BankAndCashAccountsPage />} />}
//         />
//         <Route
//           path="/company/finance/chart-of-accounts"
//           element={<ProtectedRoute element={<ChartOfAccountsPage />} />}
//         />
//         <Route path="/company/finance/journal-entries" element={<ProtectedRoute element={<JournalEntries />} />} />
//         <Route
//           path="/company/finance/add-new-journal-entry"
//           element={<ProtectedRoute element={<AddNewJournalEntry />} />}
//         />
//         <Route path="/company/finance/agent-top-up-deposits" element={<ProtectedRoute element={<AgentTopup />} />} />
//         <Route path="/company/finance/add-topup" element={<ProtectedRoute element={<AddTopup />} />} />
//         <Route
//           path="/company/finance/payments-receipts"
//           element={<ProtectedRoute element={<PaymentsAndReceipts />} />}
//         />
//         <Route
//           path="/company/finance/add-internal-payment-receipt"
//           element={<ProtectedRoute element={<AddInternalPaymentReceipt />} />}
//         />
//         <Route path="/company/finance/general-ledger" element={<ProtectedRoute element={<GeneralLedger />} />} />
//         <Route path="/company/finance/trial-balance" element={<ProtectedRoute element={<TrialBalance />} />} />
//         <Route
//           path="/company/finance/accounting-periods"
//           element={<ProtectedRoute element={<AccountingPeriodsPage />} />}
//         />

//         {/* Settings */}
//         <Route path="/company/settings/company-profile" element={<ProtectedRoute element={<CompanyProfile />} />} />
//         <Route
//           path="/company/settings/company-profile-list"
//           element={<ProtectedRoute element={<CompanyProfileList />} />}
//         />
//         <Route path="/company/settings/role-permission" element={<ProtectedRoute element={<RolePermission />} />} />
//         <Route
//           path="/company/settings/add-group-permission"
//           element={<ProtectedRoute element={<AddGroupPermission />} />}
//         />
//         <Route path="/company/settings/port" element={<ProtectedRoute element={<Port />} />} />
//         <Route path="/company/settings/add-port" element={<ProtectedRoute element={<AddPort />} />} />
//         <Route path="/company/settings/cabin" element={<ProtectedRoute element={<Cabin />} />} />
//         <Route path="/company/settings/add-cabin" element={<ProtectedRoute element={<AddCabin />} />} />
//         <Route path="/company/settings/payload-type" element={<ProtectedRoute element={<PayloadType />} />} />

//         <Route path="/company/system-alerts" element={<ProtectedRoute element={<SystemAlerts />} />} />

//         {/* Redirect Root → Dashboard */}
//         <Route path="/" element={<Navigate to="/company/dashboard" replace />} />
//         {/* Redirect Unknown Routes → Dashboard */}
//         <Route path="*" element={<Navigate to="/company/dashboard" replace />} />
//       </Routes>
//     </Router>
//   )
// }



"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { SidebarProvider, useSidebar } from "./context/SidebarContext"
import { PublicRoute, ProtectedRoute, RouteGuard, ForbiddenPage } from "./components/ProtectedRoute"
import AuthLogoutHandler from "./components/AuthLogoutHandler"
import { loginApi } from "./api/loginApi"

// Public Pages
import CompanyLogin from "./pages/CompanyLogin"
import CompanyForgotPassword from "./pages/CompanyForgotPassword"
import CompanySupport from "./pages/CompanySupport"

// Administration
import AdminUserList from "./pages/AdminUserList"
import AdminAddUser from "./pages/AdminAddUser"
import Dashboard from "./pages/Dashboard"
import CompanyCurrencyList from "./pages/CompanyCurrencyList"
import CompanyAddCurrency from "./pages/CompanyAddCurrency"
import CompanyEditCurrency from "./pages/CompanyEditCurrency"
import CompanyCurrencyHistory from "./pages/CompanyCurrencyHistory"
import CompanyTaxesList from "./pages/CompanyTaxesList"
import CompanyAddTax from "./pages/CompanyAddTax"
import CompanyEditTax from "./pages/CompanyEditTax"
import CompanyContactMessages from "./pages/CompanyContactMessages"
import CompanyTerms from "./pages/CompanyTerms"
import CompanyPoliciesEditor from "./pages/CompanyPoliciesEditor"
import EditUser from "./pages/AdminEditUser"

// Ship and Trip
import CompanyShipsList from "./pages/CompanyShipsList"
import CompanyAddShip from "./pages/CompanyAddShip"
import CompanyEditShip from "./pages/CompanyEditShip"
import CompanyTripsList from "./pages/CompanyTripsList"
import CompanyAddTrip from "./pages/CompanyAddTrip"

// Partner
import CompanyPromotionsList from "./pages/CompanyPromotionsList"
import CompanyAddPromotion from "./pages/CompanyAddPromotion"
import BusinessPartnersPage from "./pages/BusinessPartners"
import B2CCustomersPage from "./pages/B2CCustomersPage"
import SalesmenPage from "./pages/SalesmenPage"
import MarkupDiscountBoardPage from "./pages/MarkupDiscountBoardPage"
import AddRulePage from "./pages/AddRulePage"
import CommissionBoardPage from "./pages/CommissionBoardPage"
import AddCommissionPage from "./pages/AddCommissionPage"

// Sales and Booking
import PriceListPage from "./pages/PriceListPage"
import TicketingRulesPage from "./pages/TicketingRulesPage"
import AddTicketRulePage from "./pages/AddTicketRulePage"
import BookingAndTicketsPage from "./pages/BookingAndTicketsPage"
import ExcessBaggageTickets from "./pages/ExcessBaggageTickets"

// Checking and Boarding
import PassengerCheckingPage from "./pages/PassengerCheckingPage"
import CargoCheckingPage from "./pages/CargoCheckingPage"
import VehicleCheckingPage from "./pages/VehicleCheckingPage"
import CargoBoardingPage from "./pages/CargoBoardingPage"
import PassengerBoardingPage from "./pages/PassengerBoardingPage"
import VehicleBoardingPage from "./pages/VehicleBoardingPage"
import TripCompletionPage from "./pages/TripCompletionPage"

// Finance
import FinancePage from "./pages/FinancePage"
import BankAndCashAccountsPage from "./pages/BankAndCashAccountsPage"
import ChartOfAccountsPage from "./pages/ChartOfAccountsPage"
import JournalEntries from "./pages/JournalEntries"
import AddNewJournalEntry from "./pages/AddNewJournalEntry"
import AgentTopup from "./pages/AgentTopup"
import AddTopup from "./pages/AddTopup"
import PaymentsAndReceipts from "./pages/PaymentsAndReceipts"
import AddInternalPaymentReceipt from "./pages/AddInternalPaymentReceipt"
import GeneralLedger from "./pages/GeneralLedger"
import TrialBalance from "./pages/TrialBalance"
import AccountingPeriodsPage from "./pages/AccountingPeriods"

// Settings
import CompanyProfile from "./pages/CompanyProfile"
import CompanyEditProfile from "./pages/EditCompanyProfile"
import CompanyProfileList from "./pages/CompanyProfileList"
import RolePermission from "./pages/RolePermission"
import AddGroupPermission from "./pages/AddGroupPermission"
import Port from "./pages/Port"
import AddPort from "./pages/AddPort"
import Cabin from "./pages/Cabin"
import AddCabin from "./pages/AddCabin"
import EditCabin from "./pages/EditCabin"
import PayloadType from "./pages/PayloadType"
import SystemAlerts from "./pages/SystemAlerts"
import EditPort from "./pages/EditPort"

/**
 * APP BOOTSTRAP COMPONENT
 * =======================
 * Handles initial app loading state.
 * Shows loader while sidebar is being fetched.
 */
function AppBootstrap({ children }) {
  const { loading, error } = useSidebar()
  const isAuthenticated = loginApi.isAuthenticated()

  // If not authenticated, don't show loader (let routes handle redirect)
  if (!isAuthenticated) {
    return children
  }

  // Show loader while fetching sidebar
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading system menu...</p>
        </div>
      </div>
    )
  }

  // Show error state if sidebar failed to load
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="text-center">
          <div className="text-danger mb-3">
            <i className="fe fe-alert-circle" style={{ fontSize: "3rem" }}></i>
          </div>
          <h4 className="text-danger">Unable to Load System Menu</h4>
          <p className="text-muted">{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              loginApi.logout()
              window.location.href = "/company-login"
            }}
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return children
}

/**
 * MAIN APP COMPONENT
 * ==================
 * Wraps application in providers and defines routes.
 */
function AppRoutes() {
  return (
    <AppBootstrap>
      <AuthLogoutHandler />
      <Routes>
        {/* Public Routes */}
        <Route path="/company-login" element={<PublicRoute element={<CompanyLogin />} />} />
        <Route path="/company-forgot-password" element={<PublicRoute element={<CompanyForgotPassword />} />} />

        {/* 403 Forbidden Page */}
        <Route path="/403" element={<ForbiddenPage />} />

        {/* Dashboard */}
        <Route path="/company/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />

        {/* Administration */}
        <Route path="/company/administration/add-user" element={<ProtectedRoute element={<AdminAddUser />} />} />
        <Route
          path="/company/administration/edit-profile"
          element={<ProtectedRoute element={<CompanyEditProfile />} />}
        />
        <Route path="/company/administration/user-list" element={<ProtectedRoute element={<AdminUserList />} />} />
        <Route path="/company/administration/currency" element={<ProtectedRoute element={<CompanyCurrencyList />} />} />
        <Route
          path="/company/administration/add-currency"
          element={<ProtectedRoute element={<CompanyAddCurrency />} />}
        />
        <Route
          path="/company/administration/edit-currency/:currencyId"
          element={<ProtectedRoute element={<CompanyEditCurrency />} />}
        />
        <Route path="/company/administration/edit-user/:userId" element={<ProtectedRoute element={<EditUser />} />} />
        <Route
          path="/company/administration/currency-history/:currencyId"
          element={<ProtectedRoute element={<CompanyCurrencyHistory />} />}
        />
        <Route path="/company/administration/taxes" element={<ProtectedRoute element={<CompanyTaxesList />} />} />
        <Route path="/company/administration/add-tax" element={<ProtectedRoute element={<CompanyAddTax />} />} />
        <Route
          path="/company/administration/edit-tax/:taxId"
          element={<ProtectedRoute element={<CompanyEditTax />} />}
        />
        <Route
          path="/company/administration/contact-messages"
          element={<ProtectedRoute element={<CompanyContactMessages />} />}
        />
        <Route path="/company/administration/terms" element={<ProtectedRoute element={<CompanyTerms />} />} />
        <Route
          path="/company/administration/policies"
          element={<ProtectedRoute element={<CompanyPoliciesEditor />} />}
        />
        <Route path="/company/administration/support" element={<ProtectedRoute element={<CompanySupport />} />} />

        {/* Ships and Trips */}
        <Route path="/company/ship-trip/ships" element={<ProtectedRoute element={<CompanyShipsList />} />} />
        <Route path="/company/ship-trip/add-ship" element={<ProtectedRoute element={<CompanyAddShip />} />} />
        <Route path="/company/ship-trip/edit-ship/:id" element={<ProtectedRoute element={<CompanyEditShip />} />} />
        <Route path="/company/ship-trip/trips" element={<ProtectedRoute element={<CompanyTripsList />} />} />
        <Route path="/company/ship-trip/add-trip" element={<ProtectedRoute element={<CompanyAddTrip />} />} />

        {/* Partners */}
        <Route
          path="/company/partner-management/promotions"
          element={<ProtectedRoute element={<CompanyPromotionsList />} />}
        />
        <Route
          path="/company/partner-management/add-promotion"
          element={<ProtectedRoute element={<CompanyAddPromotion />} />}
        />
        <Route path="/company/partners" element={<ProtectedRoute element={<BusinessPartnersPage />} />} />
        <Route path="/company/b2c-customers" element={<ProtectedRoute element={<B2CCustomersPage />} />} />
        <Route path="/company/salesmen" element={<ProtectedRoute element={<SalesmenPage />} />} />
        <Route path="/company/markup" element={<ProtectedRoute element={<MarkupDiscountBoardPage />} />} />
        <Route path="/company/markup/add-rule" element={<ProtectedRoute element={<AddRulePage />} />} />
        <Route path="/company/commission" element={<ProtectedRoute element={<CommissionBoardPage />} />} />
        <Route path="/company/commission/add" element={<ProtectedRoute element={<AddCommissionPage />} />} />

        {/* Sales and Booking */}
        <Route path="/company/pricelist" element={<ProtectedRoute element={<PriceListPage />} />} />
        <Route path="/company/ticketing-rules" element={<ProtectedRoute element={<TicketingRulesPage />} />} />
        <Route path="/company/add-ticket-rule" element={<ProtectedRoute element={<AddTicketRulePage />} />} />
        <Route path="/company/booking-and-tickets" element={<ProtectedRoute element={<BookingAndTicketsPage />} />} />
        <Route path="/company/excess-baggage-tickets" element={<ProtectedRoute element={<ExcessBaggageTickets />} />} />

        {/* Checking and Boarding */}
        <Route path="/company/passenger-checking" element={<ProtectedRoute element={<PassengerCheckingPage />} />} />
        <Route path="/company/cargo-checking" element={<ProtectedRoute element={<CargoCheckingPage />} />} />
        <Route path="/company/vehicle-checking" element={<ProtectedRoute element={<VehicleCheckingPage />} />} />
        <Route path="/company/cargo-boarding" element={<ProtectedRoute element={<CargoBoardingPage />} />} />
        <Route path="/company/passenger-boarding" element={<ProtectedRoute element={<PassengerBoardingPage />} />} />
        <Route path="/company/vehicle-boarding" element={<ProtectedRoute element={<VehicleBoardingPage />} />} />
        <Route path="/company/trip-completion" element={<ProtectedRoute element={<TripCompletionPage />} />} />

        {/* Finance */}
        <Route path="/company/finance" element={<ProtectedRoute element={<FinancePage />} />} />
        <Route
          path="/company/finance/bank-cash-accounts"
          element={<ProtectedRoute element={<BankAndCashAccountsPage />} />}
        />
        <Route
          path="/company/finance/chart-of-accounts"
          element={<ProtectedRoute element={<ChartOfAccountsPage />} />}
        />
        <Route path="/company/finance/journal-entries" element={<ProtectedRoute element={<JournalEntries />} />} />
        <Route
          path="/company/finance/add-new-journal-entry"
          element={<ProtectedRoute element={<AddNewJournalEntry />} />}
        />
        <Route path="/company/finance/agent-top-up-deposits" element={<ProtectedRoute element={<AgentTopup />} />} />
        <Route path="/company/finance/add-topup" element={<ProtectedRoute element={<AddTopup />} />} />
        <Route
          path="/company/finance/payments-receipts"
          element={<ProtectedRoute element={<PaymentsAndReceipts />} />}
        />
        <Route
          path="/company/finance/add-internal-payment-receipt"
          element={<ProtectedRoute element={<AddInternalPaymentReceipt />} />}
        />
        <Route path="/company/finance/general-ledger" element={<ProtectedRoute element={<GeneralLedger />} />} />
        <Route path="/company/finance/trial-balance" element={<ProtectedRoute element={<TrialBalance />} />} />
        <Route
          path="/company/finance/accounting-periods"
          element={<ProtectedRoute element={<AccountingPeriodsPage />} />}
        />

        {/* Settings */}
        <Route path="/company/settings/company-profile" element={<ProtectedRoute element={<CompanyProfile />} />} />
        <Route
          path="/company/settings/company-profile-list"
          element={<ProtectedRoute element={<CompanyProfileList />} />}
        />
        <Route path="/company/settings/role-permission" element={<ProtectedRoute element={<RolePermission />} />} />
        <Route
          path="/company/settings/add-group-permission"
          element={<ProtectedRoute element={<AddGroupPermission />} />}
        />
        <Route path="/company/settings/port" element={<ProtectedRoute element={<Port />} />} />
        <Route path="/company/settings/add-port" element={<ProtectedRoute element={<AddPort />} />} />
        <Route path="/company/settings/port/:id" element={<ProtectedRoute element={<EditPort />} />} />
        <Route path="/company/settings/cabin" element={<ProtectedRoute element={<Cabin />} />} />
        <Route path="/company/settings/cabin/:cabinId" element={<ProtectedRoute element={<EditCabin />} />} />
        <Route path="/company/settings/add-cabin" element={<ProtectedRoute element={<AddCabin />} />} />
        <Route path="/company/settings/payload-type" element={<ProtectedRoute element={<PayloadType />} />} />

        {/* System Alerts */}
        <Route path="/company/system-alerts" element={<ProtectedRoute element={<SystemAlerts />} />} />

        {/* Redirect Root → Dashboard */}
        <Route path="/" element={<Navigate to="/company/dashboard" replace />} />

        {/* Redirect Unknown Routes → Dashboard */}
        <Route path="*" element={<Navigate to="/company/dashboard" replace />} />
      </Routes>
    </AppBootstrap>
  )
}

/**
 * ROOT APP COMPONENT
 * ==================
 * Wraps everything in Router and SidebarProvider
 */
export default function App() {
  return (
    <Router>
      <SidebarProvider>
        <AppRoutes />
      </SidebarProvider>
    </Router>
  )
}
