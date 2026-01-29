import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLoading } from "./context/LoadingContext";
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

export default function App() {
  const location = useLocation();
  const { showLoading, hideLoading } = useLoading();

  // Show loading only on window refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Show loading immediately when refresh starts
      showLoading();
      sessionStorage.setItem('isRefreshing', 'true');
    };

    const handleLoad = () => {
      // Small delay to ensure loading screen is visible
      setTimeout(() => {
        sessionStorage.removeItem('isRefreshing');
        hideLoading();
      }, 500);
    };

    // Check if this is a refresh and show loading immediately
    const isRefreshing = sessionStorage.getItem('isRefreshing');
    if (isRefreshing) {
      showLoading();
      // Auto-hide after a reasonable time if load event doesn't fire
      setTimeout(() => {
        sessionStorage.removeItem('isRefreshing');
        hideLoading();
      }, 2000);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("load", handleLoad);
    };
  }, [showLoading, hideLoading]);

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
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings/exchange-rate" element={<ExchangeRatePage />} />
      </Route>
    </Routes>
  );
}
