import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/admin";
import Branch from "./components/admin/Branch";
import Branding from "./components/admin/branding";
import Currency from "./components/admin/Currency";
import NewEmployee from "./components/admin/NewEmployee";
import EmployeeDashboard from "./components/Employee";
import Guard from "./components/guard";
import HomePage from "./components/home";
import Login from "./components/home/login";
import AdminLayout from "./components/layout/AdminLayout";
import EmployeeLayout from "./components/layout/EmployeeLayout";
import PageNotFound from "./components/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<Login />} path="/login" />

        {/* ========== Start Admin Related Routes ========== */}
        <Route
          element={<Guard endPoint="/api/login/verify-token" />}
          path="/admin"
        >
          <Route element={<AdminLayout />}>
            <Route element={<Dashboard />} index />
            <Route element={<NewEmployee />} path="new-employee" />
            <Route element={<Branch />} path="branch" />
            <Route element={<Currency />} path="currency" />
            <Route element={<Branding />} path="branding" />
            <Route element={<PageNotFound />} path="*" />
          </Route>
        </Route>
        {/* ========== End Admin Related Routes ========== */}

        {/* ========== Start Employee Related Routes ========== */}
        <Route
          element={<Guard endPoint="/api/login/verify-token" />}
          path="/employee"
        >
          <Route element={<EmployeeLayout />}>
            <Route element={<EmployeeDashboard />} index />
            <Route element={<PageNotFound />} path="*" />
          </Route>
        </Route>
        {/* ========== End Employee Related Routes ========== */}

        <Route element={<PageNotFound />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
