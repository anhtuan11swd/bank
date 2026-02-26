import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/admin";
import Branch from "./components/admin/Branch";
import Branding from "./components/admin/branding";
import Currency from "./components/admin/Currency";
import NewEmployee from "./components/admin/NewEmployee";
import EmployeeDashboard from "./components/Employee";
import HomePage from "./components/home";
import AdminLayout from "./components/layout/AdminLayout";
import EmployeeLayout from "./components/layout/EmployeeLayout";
import PageNotFound from "./components/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} path="/" />

        {/* ========== Start Admin Related Routes ========== */}
        <Route element={<AdminLayout />} path="/admin/*">
          <Route element={<Dashboard />} index />
          <Route element={<NewEmployee />} path="new-employee" />
          <Route element={<Branch />} path="branch" />
          <Route element={<Currency />} path="currency" />
          <Route element={<Branding />} path="branding" />
        </Route>
        {/* ========== End Admin Related Routes ========== */}

        {/* ========== Start Employee Related Routes ========== */}
        <Route element={<EmployeeLayout />} path="/employee/*">
          <Route element={<EmployeeDashboard />} index />
        </Route>
        {/* ========== End Employee Related Routes ========== */}

        <Route element={<PageNotFound />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
