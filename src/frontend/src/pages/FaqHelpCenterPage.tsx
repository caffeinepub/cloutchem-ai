import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function FaqHelpCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <Card className="border-border/40 bg-card/95 backdrop-blur shadow-xl">
          <CardHeader className="space-y-4">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              FAQ & Help Center
            </CardTitle>
            <p className="text-muted-foreground">
              Need help? Find answers to common questions about CloudCam AI, including subscriptions, camera usage, and troubleshooting. 
              If you don't see your answer here, you can contact support directly.
            </p>
          </CardHeader>

          <CardContent className="space-y-8 text-foreground/90">
            {/* Subscriptions Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. Subscriptions</h2>
              <Separator className="opacity-20" />
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Q: What's included in the Free plan?</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    <strong>A:</strong> 10 AI-generated captions per month, basic templates, access to core features, and community support.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Q: What's included in the Pro plan?</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    <strong>A:</strong> Unlimited AI captions, advanced customization tools, priority support, full analytics, and unlimited captures.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Q: How do I upgrade or cancel?</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    <strong>A:</strong> You can upgrade or cancel any time via the subscription settings in the app.
                  </p>
                </div>
              </div>
            </section>

            {/* Camera & Captures Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. Camera & Captures</h2>
              <Separator className="opacity-20" />
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Q: How do I use the camera?</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    <strong>A:</strong> Tap the camera icon to capture photos or videos. Captures are stored in your 'My Captures' page.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Q: Can I delete captures?</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    <strong>A:</strong> Yes, go to 'My Captures', select the media, and tap delete.
                  </p>
                </div>
              </div>
            </section>

            {/* Account & Login Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">3. Account & Login</h2>
              <Separator className="opacity-20" />
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Q: What if I forget my login?</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    <strong>A:</strong> Tap the 'Forgot Login' option on the login screen to reset your credentials.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Q: Can I edit my profile?</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    <strong>A:</strong> Yes, you can update your profile picture anytime. Username changes are allowed once every 30 days.
                  </p>
                </div>
              </div>
            </section>

            {/* Support Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. Support</h2>
              <Separator className="opacity-20" />
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Q: How do I contact support?</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    <strong>A:</strong> Email us at{' '}
                    <a 
                      href="mailto:infocloudchemai@gmail.com" 
                      className="text-amber-400 hover:text-amber-300 transition-colors underline-offset-4 hover:underline"
                    >
                      infocloudchemai@gmail.com
                    </a>
                    {' '}for any further questions.
                  </p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
