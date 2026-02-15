import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import SecurityQuestionsForm from '../components/security/SecurityQuestionsForm';
import { useVerifySecurityQuestions, useResetSecurityQuestions } from '../hooks/useSecurityQuestions';
import type { SecurityQuestion } from '../backend';

export default function AccountRecoveryPage() {
  const [step, setStep] = useState<'verify' | 'reset' | 'success'>('verify');
  const [verificationAnswers, setVerificationAnswers] = useState<SecurityQuestion[]>([
    { question: '', answer: '' },
    { question: '', answer: '' },
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  const verifyMutation = useVerifySecurityQuestions();
  const resetMutation = useResetSecurityQuestions();

  const handleAnswerChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...verificationAnswers];
    updated[index] = { ...updated[index], [field]: value };
    setVerificationAnswers(updated);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleVerify = async () => {
    const newErrors: string[] = [];

    verificationAnswers.forEach((q, index) => {
      if (!q.question.trim()) {
        newErrors.push(`Question ${index + 1} cannot be empty`);
      }
      if (!q.answer.trim()) {
        newErrors.push(`Answer ${index + 1} cannot be empty`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const trimmedAnswers = verificationAnswers.map((q) => ({
        question: q.question.trim(),
        answer: q.answer.trim(),
      }));

      await verifyMutation.mutateAsync(trimmedAnswers);
      // Verification successful - move to reset step
      setStep('reset');
      setErrors([]);
    } catch (error) {
      // Error is handled by the mutation
      console.error('Verification failed:', error);
    }
  };

  const handleReset = async (newQuestions: SecurityQuestion[]) => {
    try {
      await resetMutation.mutateAsync({
        newQuestions,
        currentAnswers: verificationAnswers,
      });
      // Reset successful
      setStep('success');
    } catch (error) {
      // Error is handled by the mutation
      console.error('Reset failed:', error);
    }
  };

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
                  Account Recovery
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mt-1">Verify your identity and update security questions</p>
            </div>
          </div>
        </div>

        <Separator className="opacity-20" />

        {/* Info Card */}
        <Card className="bg-accent/10 backdrop-blur-sm border-amber-500/30">
          <CardContent className="pt-6 space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Important:</strong> This recovery process is for managing your
              CloudCam AI security questions only. It does not reset your Internet Identity credentials.
            </p>
            <p>Answer your current security questions to verify your identity, then set new ones.</p>
          </CardContent>
        </Card>

        {/* Step 1: Verify Current Answers */}
        {step === 'verify' && (
          <>
            {verifyMutation.isError && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-base">
                  {verifyMutation.error instanceof Error
                    ? verifyMutation.error.message
                    : 'Verification failed. Please check your answers and try again.'}
                </AlertDescription>
              </Alert>
            )}

            {errors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="text-xl">Step 1: Verify Your Identity</CardTitle>
                <CardDescription>Answer your current security questions to proceed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {verificationAnswers.map((q, index) => (
                  <Card key={index} className="bg-background/50 border-accent/10">
                    <CardContent className="pt-6 space-y-4">
                      <h3 className="text-lg font-semibold">Security Question {index + 1}</h3>

                      <div className="space-y-2">
                        <Label htmlFor={`verify-question-${index}`}>Your Question</Label>
                        <Input
                          id={`verify-question-${index}`}
                          type="text"
                          placeholder="Enter your original question"
                          value={q.question}
                          onChange={(e) => handleAnswerChange(index, 'question', e.target.value)}
                          disabled={verifyMutation.isPending}
                          className="bg-background/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`verify-answer-${index}`}>Your Answer</Label>
                        <Input
                          id={`verify-answer-${index}`}
                          type="text"
                          placeholder="Enter your answer (case-sensitive)"
                          value={q.answer}
                          onChange={(e) => handleAnswerChange(index, 'answer', e.target.value)}
                          disabled={verifyMutation.isPending}
                          className="bg-background/50"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  onClick={handleVerify}
                  disabled={verifyMutation.isPending}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold gap-2"
                >
                  Verify Answers
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 2: Set New Questions */}
        {step === 'reset' && (
          <>
            {resetMutation.isError && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-base">
                  {resetMutation.error instanceof Error
                    ? resetMutation.error.message
                    : 'Failed to update security questions'}
                </AlertDescription>
              </Alert>
            )}

            <Alert className="bg-green-500/10 border-green-500/30">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertDescription className="text-base">
                Identity verified! Now set your new security questions.
              </AlertDescription>
            </Alert>

            <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="text-xl">Step 2: Set New Security Questions</CardTitle>
                <CardDescription>Create at least 2 new security questions</CardDescription>
              </CardHeader>
              <CardContent>
                <SecurityQuestionsForm
                  onSubmit={handleReset}
                  isSubmitting={resetMutation.isPending}
                  submitLabel="Update Security Questions"
                  minQuestions={2}
                  showAddButton={true}
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border-green-500/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle className="text-2xl">Security Questions Updated!</CardTitle>
              </div>
              <CardDescription className="text-base">
                Your security questions have been successfully updated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your new security questions are now active. Make sure to remember your answers as they are
                case-sensitive.
              </p>
              <Button
                onClick={() => (window.location.href = '/dashboard')}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
