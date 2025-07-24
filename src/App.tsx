import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import {
  SignUpPage,
  LoginPage,
  EmployeeProfilesPage,
  VisaStatusPage,
  OnboardingPage,
  ErrorPage,
} from "./pages";
import { Layout } from "./components/Layout";
import { HRProtectedRoutes } from "./routes/HRProtectedRoutes";
import { EmployeeRouteProtection } from "./routes/EmployeeRouteProtection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/error"
          element={
            <ErrorPage />
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<HRProtectedRoutes />}>
          <Route
            path="/hr/employees"
            element={
            <Layout>
              <EmployeeProfilesPage />
            </Layout>
          }
          />
          <Route
            path="/hr/visa"
            element={
              <Layout>
                <VisaStatusPage />
              </Layout>
            }
          />
        </Route>

        <Route element={<EmployeeRouteProtection />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
