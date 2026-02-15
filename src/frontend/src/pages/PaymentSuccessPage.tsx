import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate({ to: '/dashboard' });
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        <Card className="w-full bg-card/50 backdrop-blur-sm border-accent/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Payment Successful!</CardTitle>
            <CardDescription className="text-lg mt-2">
              Your payment has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Thank you for upgrading to Pro! Your account has been updated and you now have
                access to all premium features.
              </p>
              <p className="text-sm text-muted-foreground">
                You can now enjoy unlimited AI caption generation and advanced customization
                options.
              </p>
            </div>

            <Button onClick={handleGoToDashboard} className="w-full" size="lg">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
