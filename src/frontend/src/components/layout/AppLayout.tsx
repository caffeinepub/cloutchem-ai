import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';
import { useStripeBuyButtonScript } from '../../hooks/useStripeBuyButtonScript';

export default function AppLayout() {
  // Load Stripe Buy Button script once at the app layout level
  // This ensures it's available throughout the SPA lifecycle without re-injection on route changes
  useStripeBuyButtonScript();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
