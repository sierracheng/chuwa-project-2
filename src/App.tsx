import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import {
  SignUpPage,
  LoginPage,
  EmployeeProfilesPage,
  OnboardingPage,
  ErrorPage,
  PersonalInformationPage,
  VisaStatusEmployeePage,
  VisaStatusPage,
} from "./pages";
import { Layout } from "./components/Layout";
import { HRProtectedRoutes } from "./routes/HRProtectedRoutes";
import { EmployeeRouteProtection } from "./routes/EmployeeRouteProtection";
import { HiringManagementPage } from "./pages/hiringManagementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* <Route
          path="/employee/homepage"
          element={
            <Layout>
              <PersonalInformationPage />
            </Layout>
          }
        /> */}

        <Route path="/hr" element={<HRProtectedRoutes />}>
          <Route
            path="hiring"
            element={
              <Layout>
                <HiringManagementPage />
              </Layout>
            }
          />
          <Route
            path="employees"
            element={
              <Layout>
                <EmployeeProfilesPage />
              </Layout>
            }
          />
          <Route
            path="visa"
            element={
              <Layout>
                <VisaStatusPage />
              </Layout>
            }
          />
        </Route>
        {/* Will add onboarding under /employee later*/}

        <Route path="/employee" element={<EmployeeRouteProtection />}>
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route
            path="homepage"
            element={
              <Layout>
                <PersonalInformationPage />
              </Layout>
            }
          />
          <Route
            path="/employee/visa"
            element={
              <Layout>
                <VisaStatusEmployeePage />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
