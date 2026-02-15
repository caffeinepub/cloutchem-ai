import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Copy, Check } from 'lucide-react';
import { generateCaptions, type Tone, type Platform, type CaptionSuggestion } from '@/utils/captionGenerator';

export default function AICaptionGenerator() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<Tone>('casual');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [keywords, setKeywords] = useState('');
  const [suggestions, setSuggestions] = useState<CaptionSuggestion[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    
    // Simulate a brief generation delay for better UX
    setTimeout(() => {
      const newSuggestions = generateCaptions({
        topic,
        tone,
        platform,
        keywords,
      });
      setSuggestions(newSuggestions);
      setIsGenerating(false);
    }, 500);
  };

  const handleCopy = async (suggestion: CaptionSuggestion) => {
    try {
      await navigator.clipboard.writeText(suggestion.text);
      setCopiedId(suggestion.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const isGenerateDisabled = !topic.trim() || isGenerating;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <CardTitle className="text-2xl">AI Caption Generator</CardTitle>
        </div>
        <CardDescription className="text-base">
          Generate engaging captions for your social media posts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Post Topic / Description *</Label>
              <Textarea
                id="topic"
                placeholder="e.g., Launching my new product, Morning workout routine, Travel tips for Europe..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="min-h-[100px] bg-background/50 border-accent/20 focus:border-accent/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords / Hashtags (optional)</Label>
              <Input
                id="keywords"
                placeholder="e.g., #entrepreneur #motivation #success"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="bg-background/50 border-accent/20 focus:border-accent/40"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(value) => setTone(value as Tone)}>
                <SelectTrigger id="tone" className="bg-background/50 border-accent/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="funny">Funny</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
                <SelectTrigger id="platform" className="bg-background/50 border-accent/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter / X</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerateDisabled}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Captions
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Generated Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-accent/20">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Generated Captions
            </h3>
            <div className="grid gap-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className="p-4 rounded-lg bg-accent/5 border border-accent/20 hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                          Option {index + 1}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {suggestion.text}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(suggestion)}
                      className="shrink-0 border-accent/20 hover:border-accent/40 hover:bg-accent/10"
                    >
                      {copiedId === suggestion.id ? (
                        <>
                          <Check className="w-4 h-4 mr-1 text-green-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {suggestions.length === 0 && !isGenerating && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-amber-400/50" />
            <p className="text-sm">
              Enter a topic and click "Generate Captions" to get started
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
