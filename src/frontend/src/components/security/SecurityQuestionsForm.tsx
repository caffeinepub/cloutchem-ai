import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { SecurityQuestion } from '../../backend';

interface SecurityQuestionsFormProps {
  onSubmit: (questions: SecurityQuestion[]) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  minQuestions?: number;
  showAddButton?: boolean;
}

export default function SecurityQuestionsForm({
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save Security Questions',
  minQuestions = 2,
  showAddButton = true,
}: SecurityQuestionsFormProps) {
  const [questions, setQuestions] = useState<SecurityQuestion[]>([
    { question: '', answer: '' },
    { question: '', answer: '' },
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleQuestionChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > minQuestions) {
      const updated = questions.filter((_, i) => i !== index);
      setQuestions(updated);
    }
  };

  const validateAndSubmit = () => {
    const newErrors: string[] = [];

    if (questions.length < minQuestions) {
      newErrors.push(`At least ${minQuestions} security questions are required`);
    }

    questions.forEach((q, index) => {
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

    // Trim whitespace from questions and answers
    const trimmedQuestions = questions.map((q) => ({
      question: q.question.trim(),
      answer: q.answer.trim(),
    }));

    onSubmit(trimmedQuestions);
  };

  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
        <Card key={index} className="bg-card/50 backdrop-blur-sm border-accent/20">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Security Question {index + 1}</h3>
              {questions.length > minQuestions && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveQuestion(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`question-${index}`}>Your Question</Label>
              <Input
                id={`question-${index}`}
                type="text"
                placeholder="e.g., What was the name of your first pet?"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                disabled={isSubmitting}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`answer-${index}`}>Your Answer</Label>
              <Input
                id={`answer-${index}`}
                type="text"
                placeholder="Enter your answer (case-sensitive)"
                value={q.answer}
                onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                disabled={isSubmitting}
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">
                Remember: answers are case-sensitive and must match exactly
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-4">
        {showAddButton && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddQuestion}
            disabled={isSubmitting}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Another Question
          </Button>
        )}

        <Button
          type="button"
          onClick={validateAndSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold"
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
