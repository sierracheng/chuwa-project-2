import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import {
  SignUpPage,
  LoginPage,
  EmployeeProfilesPage,
  VisaStatusPage,
  OnboardingPage,
  ErrorPage,
  PersonalInformationPage,
  VisaStatusEmployeePage
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
                <VisaStatusEmployeePage />
              </Layout>
            }
          />
        </Route>

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
    </BrowserRouter >
  );
}

export default App;
