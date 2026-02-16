import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CameraPage from './pages/CameraPage';
import SecurityQuestionsSetupPage from './pages/SecurityQuestionsSetupPage';
import AccountRecoveryPage from './pages/AccountRecoveryPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import FaqHelpCenterPage from './pages/FaqHelpCenterPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import MyCapturesPage from './pages/MyCapturesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: PrivacyPolicyPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FaqHelpCenterPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentCancelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-cancel',
  component: PaymentCancelPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
  beforeLoad: ({ context }) => {
    if (!(context as any).isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});

const cameraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/camera',
  component: CameraPage,
  beforeLoad: ({ context }) => {
    if (!(context as any).isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});

const myCapturesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-captures',
  component: MyCapturesPage,
  beforeLoad: ({ context }) => {
    if (!(context as any).isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});

const securityQuestionsSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/security-questions-setup',
  component: SecurityQuestionsSetupPage,
  beforeLoad: ({ context }) => {
    if (!(context as any).isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});

const accountRecoveryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account-recovery',
  component: AccountRecoveryPage,
  beforeLoad: ({ context }) => {
    if (!(context as any).isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  termsRoute,
  privacyRoute,
  faqRoute,
  paymentSuccessRoute,
  paymentCancelRoute,
  dashboardRoute,
  cameraRoute,
  myCapturesRoute,
  securityQuestionsSetupRoute,
  accountRecoveryRoute,
]);

const router = createRouter({
  routeTree,
  context: { isAuthenticated: false },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppWithAuth() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return <RouterProvider router={router} context={{ isAuthenticated }} />;
}

export default function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppWithAuth />
      </QueryClientProvider>
    </StrictMode>
  );
}
