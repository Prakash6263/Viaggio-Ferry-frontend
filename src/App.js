import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { PublicRoute } from "./components/ProtectedRoute"
import AuthLogoutHandler from "./components/AuthLogoutHandler"
import CompanyLogin from "./pages/CompanyLogin" // Import CompanyLogin

// Administration
import AdminUserList from "./pages/AdminUserList"
import AdminAddUser from "./pages/AdminAddUser"
import Dashboard from "./pages/Dashboard"
import CompanyCurrencyList from "./pages/CompanyCurrencyList"
import CompanyAddCurrency from "./pages/CompanyAddCurrency"
import CompanyTaxesList from "./pages/CompanyTaxesList"
import CompanyAddTax from "./pages/CompanyAddTax"
import CompanyContactMessages from "./pages/CompanyContactMessages"
import CompanyTerms from "./pages/CompanyTerms"
import CompanyPoliciesEditor from "./pages/CompanyPoliciesEditor"

// Ship and Trip
import CompanyShipsList from "./pages/CompanyShipsList"
import CompanyAddShip from "./pages/CompanyAddShip"
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

//finance

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

//settings
import CompanyProfile from "./pages/CompanyProfile"
import CompanyProfileList from "./pages/CompanyProfileList"
import RolePermission from "./pages/RolePermission"
import AddGroupPermission from "./pages/AddGroupPermission"
import Port from "./pages/Port"
import AddPort from "./pages/AddPort"
import Cabin from "./pages/Cabin"
import AddCabin from "./pages/AddCabin"
import PayloadType from "./pages/PayloadType"
import SystemAlerts from "./pages/SystemAlerts"

export default function App() {
  return (
    <Router>
      <AuthLogoutHandler />
      <Routes>
        {/* Logins Page */}
        <Route path="/company-login" element={<PublicRoute element={<CompanyLogin />} />} />

        {/* Dashboard Page */}
        <Route path="/company/dashboard" element={<Dashboard />} />

        {/* Administration */}
        <Route path="/company/administration/add-user" element={<AdminAddUser />} />
        <Route path="/company/administration/user-list" element={<AdminUserList />} />
        <Route path="/company/administration/currency" element={<CompanyCurrencyList />} />
        <Route path="/company/administration/add-currency" element={<CompanyAddCurrency />} />
        <Route path="/company/administration/taxes" element={<CompanyTaxesList />} />
        <Route path="/company/administration/add-tax" element={<CompanyAddTax />} />
        <Route path="/company/administration/contact-messages" element={<CompanyContactMessages />} />
        <Route path="/company/administration/terms" element={<CompanyTerms />} />
        <Route path="/company/administration/policies" element={<CompanyPoliciesEditor />} />
        {/* Ships and Trips */}
        <Route path="/company/ship-trip/ships" element={<CompanyShipsList />} />
        <Route path="/company/ship-trip/add-ship" element={<CompanyAddShip />} />
        <Route path="/company/ship-trip/trips" element={<CompanyTripsList />} />
        <Route path="/company/ship-trip/add-trip" element={<CompanyAddTrip />} />
        {/* Partners */}
        <Route path="/company/partner-management/promotions" element={<CompanyPromotionsList />} />
        <Route path="/company/partner-management/add-promotion" element={<CompanyAddPromotion />} />
        <Route path="/company/partners" element={<BusinessPartnersPage />} />
        <Route path="/company/b2c-customers" element={<B2CCustomersPage />} />
        <Route path="/company/salesmen" element={<SalesmenPage />} />
        <Route path="/company/markup" element={<MarkupDiscountBoardPage />} />
        <Route path="/company/markup/add-rule" element={<AddRulePage />} />
        <Route path="/company/commission" element={<CommissionBoardPage />} />
        <Route path="/company/commission/add" element={<AddCommissionPage />} />

        {/* Sales and Booking */}
        <Route path="/company/pricelist" element={<PriceListPage />} />
        <Route path="/company/ticketing-rules" element={<TicketingRulesPage />} />
        <Route path="/company/add-ticket-rule" element={<AddTicketRulePage />} />
        <Route path="/company/booking-and-tickets" element={<BookingAndTicketsPage />} />
        <Route path="/company/excess-baggage-tickets" element={<ExcessBaggageTickets />} />

        {/* Checking and Boarding */}
        <Route path="/company/passenger-checking" element={<PassengerCheckingPage />} />
        <Route path="/company/cargo-checking" element={<CargoCheckingPage />} />
        <Route path="/company/vehicle-checking" element={<VehicleCheckingPage />} />
        <Route path="/company/cargo-boarding" element={<CargoBoardingPage />} />
        <Route path="/company/passenger-boarding" element={<PassengerBoardingPage />} />
        <Route path="/company/vehicle-boarding" element={<VehicleBoardingPage />} />
        <Route path="/company/trip-completion" element={<TripCompletionPage />} />

        {/* Finance */}
        <Route path="/company/finance" element={<FinancePage />} />
        <Route path="/company/finance/bank-cash-accounts" element={<BankAndCashAccountsPage />} />
        <Route path="/company/finance/chart-of-accounts" element={<ChartOfAccountsPage />} />
        <Route path="/company/finance/journal-entries" element={<JournalEntries />} />
        <Route path="/company/finance/add-new-journal-entry" element={<AddNewJournalEntry />} />
        <Route path="/company/finance/agent-top-up-deposits" element={<AgentTopup />} />
        <Route path="/company/finance/add-topup" element={<AddTopup />} />
        <Route path="/company/finance/payments-receipts" element={<PaymentsAndReceipts />} />
        <Route path="/company/finance/add-internal-payment-receipt" element={<AddInternalPaymentReceipt />} />
        <Route path="/company/finance/general-ledger" element={<GeneralLedger />} />
        <Route path="/company/finance/trial-balance" element={<TrialBalance />} />
        <Route path="/company/finance/accounting-periods" element={<AccountingPeriodsPage />} />

        {/* Settings */}
        <Route path="/company/settings/company-profile" element={<CompanyProfile />} />
        <Route path="/company/settings/company-profile-list" element={<CompanyProfileList />} />
        <Route path="/company/settings/role-permission" element={<RolePermission />} />
        <Route path="/company/settings/add-group-permission" element={<AddGroupPermission />} />
        <Route path="/company/settings/port" element={<Port />} />
        <Route path="/company/settings/add-port" element={<AddPort />} />
        <Route path="/company/settings/cabin" element={<Cabin />} />
        <Route path="/company/settings/add-cabin" element={<AddCabin />} />
        <Route path="/company/settings/payload-type" element={<PayloadType />} />

        <Route path="/company/system-alerts" element={<SystemAlerts />} />

        {/* Redirect Root → Dashboard */}
        <Route path="/" element={<Navigate to="/company/dashboard" replace />} />
        {/* Redirect Unknown Routes → Dashboard */}
        <Route path="*" element={<Navigate to="/company/dashboard" replace />} />
      </Routes>
    </Router>
  )
}
