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
  HomePage,
  EmployeeProfileHrPage
} from "./pages";
import { Layout } from "./components/Layout";
import { HRProtectedRoutes } from "./routes/HRProtectedRoutes";
import { EmployeeRouteProtection } from "./routes/EmployeeRouteProtection";
import { HiringManagementPage } from "./pages/hiringManagementPage";
import { ViewApplicationPage } from "./pages/hiringManagementPage/ViewApplicationPage";

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
            path="homepage"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="hiring"
            element={
              <Layout>
                <HiringManagementPage />
              </Layout>
            }
          />
          <Route
            path="hiring/viewApplication"
            element={
              <Layout>
                <ViewApplicationPage />
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
            path="employee/profile"
            element={
              <Layout>
                <EmployeeProfileHrPage />
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

        {/* Both HR and Employee can access the Onboarding Page */}
        <Route path="onboarding" element={<OnboardingPage />} />

        {/* Employee can only access the following routes */}
        <Route path="/employee" element={<EmployeeRouteProtection />}>
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
