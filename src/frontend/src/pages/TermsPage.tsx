import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <Card className="border-border/40 bg-card/95 backdrop-blur shadow-xl">
          <CardHeader className="space-y-4">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Terms of Service
            </CardTitle>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>

          <CardContent className="space-y-8 text-foreground/90">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <Separator className="opacity-20" />
              <p className="leading-relaxed">
                By accessing and using CloutChem AI, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. Use License</h2>
              <Separator className="opacity-20" />
              <p className="leading-relaxed">
                Permission is granted to temporarily access and use CloutChem AI for personal, non-commercial purposes. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or public display</li>
                <li>Attempt to reverse engineer any software contained in CloutChem AI</li>
                <li>Remove any copyright or proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">3. User Accounts</h2>
              <Separator className="opacity-20" />
              <p className="leading-relaxed">
                When you create an account with us, you are responsible for maintaining the security of your account and you are fully 
                responsible for all activities that occur under the account. You must immediately notify us of any unauthorized uses of 
                your account or any other breaches of security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. Subscription and Billing</h2>
              <Separator className="opacity-20" />
              <p className="leading-relaxed">
                Some parts of the service are billed on a subscription basis. You will be billed in advance on a recurring and periodic 
                basis. Billing cycles are set on a monthly or annual basis, depending on the type of subscription plan you select.
              </p>
              <p className="leading-relaxed">
                At the end of each billing cycle, your subscription will automatically renew unless you cancel it or we cancel it. 
                You may cancel your subscription renewal through your account settings or by contacting our support team.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">5. Content Ownership</h2>
              <Separator className="opacity-20" />
              <p className="leading-relaxed">
                You retain all rights to any content you submit, post or display on or through the service. By submitting, posting or 
                displaying content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute 
                such content in connection with the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">6. Prohibited Uses</h2>
              <Separator className="opacity-20" />
              <p className="leading-relaxed">
                You may not use CloutChem AI for any illegal or unauthorized purpose. You must not, in the use of the service, 
                violate any laws in your jurisdiction including but not limited to copyright laws.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">7. Disclaimer</h2>
              <Separator className="opacity-20" />
              <p className="leading-relaxed">
                The materials on CloutChem AI are provided on an 'as is' basis. We make no warranties, expressed or implied, and 
                hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of 
                merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">8. Limitations</h2>
              <Separator className="opacity-20" />
              <p className="leading-relaxed">
                In no event shall CloutChem AI or its suppliers be liable for any damages (including, without limitation, damages for 
                loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on 
                CloutChem AI, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">9. Revisions</h2>
              <Separator className="opacity-20" />
              <p className="leading-relaxed">
                We may revise these terms of service at any time without notice. By using CloutChem AI you are agreeing to be bound 
                by the then current version of these terms of service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">10. Contact Information</h2>
              <Separator className="opacity-20" />
              <p className="leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through our support channels.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
