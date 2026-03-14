import { Route, Routes } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard/Index";
import SubscribersPage from "./pages/Subscribers";
import SubscriberDetails from "./pages/Subscribers/SubscriberDetails";
import SubscriberStatementPage from "./pages/Subscribers/SubscriberStatementPage";
import MeterReadingsPage from "./pages/MeterReadings/MeterReadingsPage";
import BulkMeterReadingsPage from "./pages/MeterReadings/BulkMeterReadingsPage";
import MetersPage from "./pages/Meters/MetersPage";
import InvoiceDetailsPage from "./pages/Invoices/InvoiceDetailsPage";
import LocationsPage from "./pages/Locations/LocationsPage";
import InvoicesPage from "./pages/Invoices/InvociesPage";
import TariffsPage from "./pages/Tarrifs/TarrifsPage";
import ExchangeRatePage from "./pages/Settings/ExchangeRatePage";
import SettingsPage from "./pages/Settings/SettingsPage";
import PaymentsPage from "./pages/Payments/PaymentsPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import UnpaidClientsPage from "./pages/UnpaidClients/UnpaidClientsPage";
import CollectorTasksPage from "./pages/Collectors/CollectorTasksPage";
import AmperePricingPage from "./pages/AmperePricing/AmperePricingPage";
import StaffPage from "./pages/Staff";
// check invoices pages
//check meter readings pages

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RequireAuth />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/subscribers" element={<SubscribersPage />} />
        <Route path="/subscribers/:id" element={<SubscriberDetails />} />
        <Route
          path="/subscribers/:id/statement"
          element={<SubscriberStatementPage />}
        />
        <Route path="/meter-readings" element={<MeterReadingsPage />} />
        <Route
          path="/meter-readings/bulk"
          element={<BulkMeterReadingsPage />}
        />
        <Route path="/meters" element={<MetersPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/invoices/:id" element={<InvoiceDetailsPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/tariffs" element={<TariffsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports/unpaid-clients" element={<UnpaidClientsPage />} />
        <Route path="/settings/exchange-rate" element={<ExchangeRatePage />} />
        <Route path="/settings/ampere-pricing" element={<AmperePricingPage />} />
        <Route path="/collector-tasks" element={<CollectorTasksPage />} />
      </Route>
    </Routes>
  );
}
