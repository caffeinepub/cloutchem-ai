import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <Card className="border-border/40 bg-card/95 backdrop-blur shadow-xl">
          <CardHeader className="space-y-4">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Privacy Policy
            </CardTitle>
            <p className="text-muted-foreground">
              Effective Date: February 15, 2026
            </p>
          </CardHeader>

          <CardContent className="space-y-8 text-foreground/90">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
              <Separator className="opacity-20" />
              <div className="space-y-3 leading-relaxed">
                <p><strong>Account Information:</strong> Name, email, and login credentials.</p>
                <p><strong>Profile Data:</strong> Username and profile picture.</p>
                <p><strong>Camera Data:</strong> Photos and videos captured through the app.</p>
                <p><strong>Usage Data:</strong> Interaction with app features, AI-generated captions, and subscription usage.</p>
                <p><strong>Billing Information:</strong> Subscription details processed securely via Stripe.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
              <Separator className="opacity-20" />
              <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
                <li>To provide, maintain, and improve CloudCam AI features.</li>
                <li>To process subscriptions and manage payments.</li>
                <li>To deliver AI-powered captions, content insights, and analytics.</li>
                <li>To communicate updates, support requests, and important notifications.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">3. Sharing & Disclosure</h2>
              <Separator className="opacity-20" />
              <div className="space-y-3 leading-relaxed">
                <p>User content is private to the user unless otherwise shared through app features.</p>
                <p>Information may be shared with service providers like Stripe solely for payment processing.</p>
                <p>We do not sell your personal information to third parties.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. Camera & Media Storage</h2>
              <Separator className="opacity-20" />
              <div className="space-y-3 leading-relaxed">
                <p>All photos and videos uploaded or captured in the app are stored securely on our backend.</p>
                <p>Users may delete their media from the app at any time.</p>
                <p>Storage limits may apply depending on your subscription plan.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">5. Age Requirements</h2>
              <Separator className="opacity-20" />
              <div className="space-y-3 leading-relaxed">
                <p>Users must be 16 years or older to use CloudCam AI.</p>
                <p>Subscription and camera features are restricted to eligible users.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">6. Security</h2>
              <Separator className="opacity-20" />
              <p className="leading-relaxed">
                We implement reasonable technical and organizational measures to protect your data.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">7. Your Rights</h2>
              <Separator className="opacity-20" />
              <p className="leading-relaxed">
                Users may request access, correction, or deletion of personal data by contacting:{' '}
                <a 
                  href="mailto:infocloudchemai@gmail.com" 
                  className="text-amber-400 hover:text-amber-300 transition-colors underline-offset-4 hover:underline"
                >
                  infocloudchemai@gmail.com
                </a>
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">8. Changes to This Policy</h2>
              <Separator className="opacity-20" />
              <p className="leading-relaxed">
                Updates to this policy will be posted within the app and on the website with a revised effective date.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
