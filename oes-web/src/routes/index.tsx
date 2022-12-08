import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation, Outlet } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';
import { PATH_DASHBOARD } from './paths';
import RoleBasedGuard from 'src/guards/RoleBasedGuard';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = useAuth();

  const isDashboard = pathname.includes('/dashboard') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'new-password', element: <NewPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },
        {
          path: 'student',
          element: (
            <RoleBasedGuard hasContent roles={['STUDENT']}>
              <Outlet />
            </RoleBasedGuard>
          ),
          children: [
            {
              path: 'examination',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.examination.list} replace />,
                  index: true,
                },
                { path: 'list', element: <ExaminationListPage /> },
              ],
            },
          ],
        },
        {
          path: 'lecturer',
          element: (
            <RoleBasedGuard hasContent roles={['LECTURER']}>
              <Outlet />
            </RoleBasedGuard>
          ),
          children: [
            {
              path: 'subject',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.subject.list} replace />,
                  index: true,
                },
                { path: 'list', element: <SubjectListPage /> },
                { path: 'new', element: <SubjectNewPage /> },
                { path: 'edit/:id', element: <SubjectEditPage /> },
                { path: 'view/:id', element: <SubjectDetailPage /> },
              ],
            },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { element: <Navigate to="/auth/login" replace />, index: true },
        { path: 'about-us', element: <About /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../pages/auth/NewPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));

const About = Loadable(lazy(() => import('../pages/About')));
const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));

const SubjectListPage = Loadable(lazy(() => import('../pages/subject/SubjectList')));
const SubjectDetailPage = Loadable(lazy(() => import('../pages/subject/SubjectDetail')));
const SubjectEditPage = Loadable(lazy(() => import('../pages/subject/SubjectEdit')));
const SubjectNewPage = Loadable(lazy(() => import('../pages/subject/SubjectNew')));

const ExaminationListPage = Loadable(lazy(() => import('../pages/examination/ExaminationList')));
