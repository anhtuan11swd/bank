import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Guard from "./components/guard";
import Loader from "./components/loader";

// Lazy load tất cả các page components để tối ưu hiệu suất
const Dashboard = lazy(() => import("./components/admin"));
const Branch = lazy(() => import("./components/admin/Branch"));
const Branding = lazy(() => import("./components/admin/branding"));
const Currency = lazy(() => import("./components/admin/Currency"));
const NewEmployee = lazy(() => import("./components/admin/NewEmployee"));
const EmployeeDashboard = lazy(() => import("./components/Employee"));
const NewAccount = lazy(() => import("./components/shared/new-account"));
const EmpTransaction = lazy(
  () => import("./components/Employee/emp-transaction"),
);
const AdminTransaction = lazy(
  () => import("./components/admin/AdminTransaction"),
);
const HomePage = lazy(() => import("./components/home"));
const Login = lazy(() => import("./components/home/login"));
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));
const EmployeeLayout = lazy(() => import("./components/layout/EmployeeLayout"));
const CustomerLayout = lazy(() => import("./components/layout/CustomerLayout"));
const CustomerDashboard = lazy(() => import("./components/Customer"));
const CustomerTransactions = lazy(
  () => import("./components/Customer/transactions"),
);
const PageNotFound = lazy(() => import("./components/PageNotFound"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<Login />} path="/login" />

          {/* ========== Start Admin Related Routes ========== */}
          <Route element={<Guard endPoint="/api/verify-token" />} path="/admin">
            <Route element={<AdminLayout />}>
              <Route element={<Dashboard />} index />
              <Route element={<NewEmployee />} path="new-employee" />
              <Route element={<NewAccount />} path="new-account" />
              <Route element={<AdminTransaction />} path="new-transaction" />
              <Route element={<Branch />} path="branch" />
              <Route element={<Currency />} path="currency" />
              <Route element={<Branding />} path="branding" />
              <Route element={<PageNotFound />} path="*" />
            </Route>
          </Route>
          {/* ========== End Admin Related Routes ========== */}

          {/* ========== Start Employee Related Routes ========== */}
          <Route
            element={<Guard endPoint="/api/verify-token" />}
            path="/employee"
          >
            <Route element={<EmployeeLayout />}>
              <Route element={<EmployeeDashboard />} index />
              <Route element={<NewAccount />} path="new-account" />
              <Route element={<EmpTransaction />} path="new-transaction" />
              <Route element={<PageNotFound />} path="*" />
            </Route>
          </Route>
          {/* ========== End Employee Related Routes ========== */}

          {/* ========== Start Customer Related Routes ========== */}
          <Route
            element={<Guard endPoint="/api/verify-token" />}
            path="/customer"
          >
            <Route element={<CustomerLayout />}>
              <Route element={<CustomerDashboard />} index />
              <Route element={<CustomerTransactions />} path="transactions" />
              <Route element={<PageNotFound />} path="*" />
            </Route>
          </Route>
          {/* ========== End Customer Related Routes ========== */}

          <Route element={<PageNotFound />} path="*" />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
