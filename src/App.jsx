
import AgencyDashboard from "./pages/agency/agency-dashboard"
import LandingPage from "./pages/landing-page"
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom"
import ForgotPasswordPage from "./pages/forgot-password-page"
import ResetPasswordPage from "./pages/reset-password-page"
import RegisterPage from "./pages/register-page"
import AgencyLayout from "./Layouts/agency-layout"
import LoginPage from './pages/login-page'
import RoleProtectedRoute from "./RoleProtectedRoute"


function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/'>
        <Route index element={<LandingPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='forgot-password' element={< ForgotPasswordPage />} />
        <Route path='reset-password' element={< ResetPasswordPage />} />
        <Route path='register' element={<RegisterPage />} />
        {/* <Route path='reset-password' element={<ResetPassword />} /> */}

        {/* public routes */}
        {/* <Route element={<CommonLayout />}>
        </Route> */}

        {/* agency routes */}
        <Route element={<RoleProtectedRoute allowedRoles={['agency', 'superadmin']} />}>
          <Route path='agency-dashboard' element={<AgencyLayout />}>
            <Route index element={<AgencyDashboard />} />
            {/* <Route path='agency-projects' element={<AgencyProjects />}>
              <Route path='create-project' element={<CreateProject />} />
              <Route path='view-project/:project-id' element={<ViewProject />} />
            </Route>
            <Route path="agency-clients" element={<AgencyClients />} />
            <Route path="agency-employees" element={<AgencyEmployees />} />
            <Route path="agency-settings" element={<AgencySettings />} /> */}
          </Route>
        </Route>

        {/* designer routes */}
        {/* <Route element={<RoleProtectedRoute allowedRoles={['designer', 'superadmin']} />}>
          <Route path='designer-dashboard' element={<DesignerLayout />}>
            <Route index element={<DesignerDashboard />} />
            <Route path='designer-projects' element={<DesignerProjects />}>
              <Route path='view-project/:project-id' element={<ViewDesignerProject />} />
              <Route path='view-project/:project-id/requirement/:requirement-id' element={<ViewAssets />} />
              <Route path='view-project/:project-id/requirement/:requirement-id/asset-collaboration' element={<ViewAssetsCollaboration />} />
            </Route>
            <Route path="designer-settings" element={<DesignerSettings />} />
            <Route path="designer-notification" element={<DesignerNotification />} />
          </Route>
        </Route> */}

        {/* end-client routes */}
        {/* <Route element={<RoleProtectedRoute allowedRoles={['end-client', 'superadmin']} />}>
          <Route path='end-client-dashboard' element={<EndClientLayout />}>
            <Route index element={<EndClientDashboard />} />
            <Route path='end-client-projects' element={<EndClientProjects />}>
              <Route path='view-project/:project-id' element={<ViewEndCLientProject />} />
              <Route path='view-project/:project-id/requirement/:requirement-id' element={<ViewEndCLientAssets />} />
              <Route path='view-project/:project-id/requirement/:requirement-id/asset-collaboration' element={<ViewAssetsCollaboration />} />
            </Route>
            <Route path="end-client-settings" element={<EndClientSettings />} />
            <Route path="end-client-notification" element={<EndClientNotification />} />
            <Route path="calender" element={<CalenderView />} />
          </Route>
        </Route> */}
      </Route >
    )
  )

  return (
    <RouterProvider router={router} />
    // <LandingPage/>
    // <Login/>
    // <LoginPage />
    // <ResetPasswordPage />
  )
}

export default App