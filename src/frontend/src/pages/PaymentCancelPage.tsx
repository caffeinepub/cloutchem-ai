import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate({ to: '/dashboard' });
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-red-600/20 flex items-center justify-center">
          <XCircle className="w-12 h-12 text-orange-500" />
        </div>

        <Card className="w-full bg-card/50 backdrop-blur-sm border-accent/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Payment Canceled</CardTitle>
            <CardDescription className="text-lg mt-2">
              Your checkout session was canceled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                No charges were made to your account. You can return to your dashboard or try
                upgrading again when you're ready.
              </p>
              <p className="text-sm text-muted-foreground">
                If you experienced any issues during checkout, please contact support.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleGoToDashboard} variant="outline" className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button onClick={handleGoToDashboard} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
