import { createRouter, RouterProvider, createRoute, createRootRoute, redirect } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CameraPage from './pages/CameraPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import TermsPage from './pages/TermsPage';
import SecurityQuestionsSetupPage from './pages/SecurityQuestionsSetupPage';
import AccountRecoveryPage from './pages/AccountRecoveryPage';
import AppLayout from './components/layout/AppLayout';

// Root route with layout
const rootRoute = createRootRoute({
  component: AppLayout,
});

// Landing page route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

// Login page route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Security questions setup route (authenticated)
const securityQuestionsSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/security-questions-setup',
  component: SecurityQuestionsSetupPage,
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context as { isAuthenticated: boolean };
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});

// Account recovery route (authenticated)
const accountRecoveryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account-recovery',
  component: AccountRecoveryPage,
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context as { isAuthenticated: boolean };
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});

// Dashboard route with protection
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context as { isAuthenticated: boolean };
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});

// Camera route with protection
const cameraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/camera',
  component: CameraPage,
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context as { isAuthenticated: boolean };
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});

// Payment success route (no auth required)
const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

// Payment cancel route (no auth required)
const paymentCancelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-cancel',
  component: PaymentCancelPage,
});

// Terms page route (no auth required)
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  securityQuestionsSetupRoute,
  accountRecoveryRoute,
  dashboardRoute,
  cameraRoute,
  paymentSuccessRoute,
  paymentCancelRoute,
  termsRoute,
]);

function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const router = createRouter({
    routeTree,
    context: { isAuthenticated },
    defaultPreload: 'intent',
  });

  return <RouterProvider router={router} />;
}

export default App;
