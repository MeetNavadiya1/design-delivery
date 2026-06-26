import AgencyDashboard from "./pages/agency/agency-dashboard";
import ClientList from "./pages/agency/clients/client-list";
import AgencyLayout from "./layout/agency-layout";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/login-page";
import RegisterPage from "./pages/auth/register-page";
import ForgotPasswordPage from "./pages/auth/forgot-password-page";
import VerifyOtpPage from "./pages/auth/verify-otp-page";
import ResetPasswordPage from "./pages/auth/reset-password-page";
import ClientForm from "./pages/agency/clients/client-form";
import EmployeeList from "./pages/agency/employee/emp-list";
import EmployeeForm from "./pages/agency/employee/emp-form";
import ProjectsList from "./pages/agency/projects/project-list";
import ProjectForm from "./pages/agency/projects/project-form";
import TaskForm from "./pages/agency/tasks/task-form";
import TaskList from "./pages/agency/tasks/task-list";
import NotFound from "./pages/not-found";
import Settings from "./pages/settings";
import UploadTask from "./pages/agency/upload-task";
import SendTask from "./pages/agency/send-task";
import ClientFeedback from "./pages/client/client-feedback";

function App() {
  return (
    <Routes>
      <Route path="/" />
      <Route index element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="verify-otp" element={<VerifyOtpPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />

        <Route path="agency" element={<AgencyLayout />}>
          <Route index element={<Navigate to="/agency/dashboard" />} />
          <Route path="dashboard" element={<AgencyDashboard />} />
          {/* clients */}
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/:id" element={<ClientForm />} />
          {/* employees */}
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/:id" element={<EmployeeForm />} />
          {/* projects */}
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/:id" element={<ProjectForm />} />
          {/* Tasks */}
          <Route path="projects/:pid/tasks" element={<TaskList />} />
          <Route path="projects/:pid/tasks/:id" element={<TaskForm />} />
          <Route
            path="projects/:pid/tasks/:id/upload-task"
            element={<UploadTask />}
          />
          <Route
            path="projects/:pid/tasks/:id/send-url/:aid"
            element={<SendTask />}
          />
          <Route path="settings" element={<Settings />} />
        </Route>

      <Route
        path="client-feedback/task/asset/:assetId"
        element={<ClientFeedback />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
