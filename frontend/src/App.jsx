import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/admin";
import Branch from "./components/admin/Branch";
import Branding from "./components/admin/branding";
import NewEmployee from "./components/admin/NewEmployee";
import HomePage from "./components/home";
import PageNotFound from "./components/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<Dashboard />} path="/admin" />
        <Route element={<NewEmployee />} path="/admin/new-employee" />
        <Route element={<Branch />} path="/admin/branch" />
        <Route element={<Branding />} path="/admin/branding" />
        <Route element={<PageNotFound />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
