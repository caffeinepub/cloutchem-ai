import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSection {
  title: string;
  items: FaqItem[];
}

const FAQ_DATA: FaqSection[] = [
  {
    title: '1. Subscriptions',
    items: [
      {
        question: "Q: What's included in the Free plan?",
        answer: '10 AI-generated captions per month, basic templates, access to core features, and community support.',
      },
      {
        question: "Q: What's included in the Pro plan?",
        answer: 'Unlimited AI captions, advanced customization tools, priority support, full analytics, and unlimited captures.',
      },
      {
        question: 'Q: How do I upgrade or cancel?',
        answer: 'You can upgrade or cancel any time via the subscription settings in the app.',
      },
    ],
  },
  {
    title: '2. Camera & Captures',
    items: [
      {
        question: 'Q: How do I use the camera?',
        answer: "Tap the camera icon to capture photos or videos. Captures are stored in your 'My Captures' page.",
      },
      {
        question: 'Q: Can I delete captures?',
        answer: "Yes, go to 'My Captures', select the media, and tap delete.",
      },
    ],
  },
  {
    title: '3. Account & Login',
    items: [
      {
        question: 'Q: What if I forget my login?',
        answer: "Tap the 'Forgot Login' option on the login screen to reset your credentials.",
      },
      {
        question: 'Q: Can I edit my profile?',
        answer: 'Yes, you can update your profile picture anytime. Username changes are allowed once every 30 days.',
      },
    ],
  },
  {
    title: '4. Support',
    items: [
      {
        question: 'Q: How do I contact support?',
        answer: 'Email us at infocloudchemai@gmail.com for any further questions.',
      },
    ],
  },
];

export default function FaqHelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return FAQ_DATA;
    }

    const query = searchQuery.toLowerCase();
    const filtered: FaqSection[] = [];

    FAQ_DATA.forEach((section) => {
      const matchingItems = section.items.filter((item) => {
        const questionMatch = item.question.toLowerCase().includes(query);
        const answerMatch = item.answer.toLowerCase().includes(query);
        return questionMatch || answerMatch;
      });

      if (matchingItems.length > 0) {
        filtered.push({
          title: section.title,
          items: matchingItems,
        });
      }
    });

    return filtered;
  }, [searchQuery]);

  const totalResults = filteredSections.reduce((sum, section) => sum + section.items.length, 0);
  const hasResults = totalResults > 0;

  const handleClearSearch = () => {
    setSearchQuery('');
  };

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

            {/* Search Bar */}
            <div className="relative pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-background/50 border-border/60 focus-visible:ring-amber-400/40 focus-visible:border-amber-400/60"
                  aria-label="Search frequently asked questions"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearSearch}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  {hasResults ? `Found ${totalResults} result${totalResults === 1 ? '' : 's'}` : 'No results found'}
                </p>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-8 text-foreground/90">
            {hasResults ? (
              filteredSections.map((section, sectionIndex) => (
                <section key={sectionIndex} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
                  <Separator className="opacity-20" />

                  <div className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h3 className="text-lg font-medium text-foreground mb-2">{item.question}</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          <strong>A:</strong>{' '}
                          {item.answer.includes('infocloudchemai@gmail.com') ? (
                            <>
                              Email us at{' '}
                              <a
                                href="mailto:infocloudchemai@gmail.com"
                                className="text-amber-400 hover:text-amber-300 transition-colors underline-offset-4 hover:underline"
                              >
                                infocloudchemai@gmail.com
                              </a>{' '}
                              for any further questions.
                            </>
                          ) : (
                            item.answer
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-medium">No results found</p>
                  <p className="text-sm mt-2">
                    Try adjusting your search terms or{' '}
                    <button
                      onClick={handleClearSearch}
                      className="text-amber-400 hover:text-amber-300 transition-colors underline-offset-4 hover:underline font-medium"
                    >
                      clear the search
                    </button>{' '}
                    to see all FAQs.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
