import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/admin";
import NewEmployee from "./components/admin/NewEmployee";
import HomePage from "./components/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<Dashboard />} path="/admin" />
        <Route element={<NewEmployee />} path="/admin/new-employee" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
