import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import SecurityQuestionsForm from '../components/security/SecurityQuestionsForm';
import { useSetSecurityQuestions, useHasSecurityQuestions } from '../hooks/useSecurityQuestions';
import { Separator } from '@/components/ui/separator';

export default function SecurityQuestionsSetupPage() {
  const navigate = useNavigate();
  const { data: hasQuestions, isLoading: checkingStatus } = useHasSecurityQuestions();
  const setQuestions = useSetSecurityQuestions();

  // Redirect if already set up
  useEffect(() => {
    if (hasQuestions === true) {
      navigate({ to: '/dashboard' });
    }
  }, [hasQuestions, navigate]);

  const handleSubmit = async (questions: { question: string; answer: string }[]) => {
    try {
      await setQuestions.mutateAsync(questions);
      // Success - navigate to dashboard
      navigate({ to: '/dashboard' });
    } catch (error) {
      // Error is handled by the mutation
      console.error('Failed to set security questions:', error);
    }
  };

  if (checkingStatus) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="space-y-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Security Questions Setup
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mt-1">Secure your CloudCam AI account</p>
            </div>
          </div>
        </div>

        <Separator className="opacity-20" />

        {/* Info Card */}
        <Card className="bg-accent/10 backdrop-blur-sm border-amber-500/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              <CardTitle>Why Security Questions?</CardTitle>
            </div>
            <CardDescription className="text-base">
              Security questions provide an additional layer of protection for your account. They allow you to verify
              your identity and manage your security settings within CloudCam AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Important:</strong> These questions are for in-app account recovery
              only. They do not reset your Internet Identity credentials.
            </p>
            <p>Choose questions with answers you'll remember, as they are case-sensitive and must match exactly.</p>
          </CardContent>
        </Card>

        {/* Error Display */}
        {setQuestions.isError && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-base">
              {setQuestions.error instanceof Error ? setQuestions.error.message : 'Failed to save security questions'}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
          <CardHeader>
            <CardTitle className="text-xl">Create Your Security Questions</CardTitle>
            <CardDescription>You must create at least 2 security questions to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <SecurityQuestionsForm
              onSubmit={handleSubmit}
              isSubmitting={setQuestions.isPending}
              submitLabel="Complete Setup"
              minQuestions={2}
              showAddButton={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
