import { createRouter, RouterProvider, createRoute, createRootRoute, redirect } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  paymentSuccessRoute,
  paymentCancelRoute,
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
