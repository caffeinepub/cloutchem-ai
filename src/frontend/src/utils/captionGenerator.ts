export type Tone = 'professional' | 'casual' | 'funny' | 'inspirational' | 'educational';
export type Platform = 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok';

export interface CaptionInput {
  topic: string;
  tone: Tone;
  platform: Platform;
  keywords?: string;
}

export interface CaptionSuggestion {
  id: string;
  text: string;
}

const toneTemplates: Record<Tone, string[]> = {
  professional: [
    'Excited to share insights on {topic}. {keywords}',
    'Key takeaways from {topic}: Professional growth starts with understanding. {keywords}',
    'Exploring {topic} and its impact on our industry. {keywords}',
  ],
  casual: [
    'Just vibing with {topic} today! 🌟 {keywords}',
    'Here\'s my take on {topic}... what do you think? {keywords}',
    'Loving everything about {topic} lately! {keywords}',
  ],
  funny: [
    'Me trying to explain {topic} be like... 😂 {keywords}',
    'Plot twist: {topic} is actually way cooler than you think! {keywords}',
    'When {topic} hits different 💯 {keywords}',
  ],
  inspirational: [
    'Let {topic} remind you that growth is a journey, not a destination. ✨ {keywords}',
    'Every day is a chance to learn more about {topic}. Keep pushing forward! 🚀 {keywords}',
    'Your passion for {topic} can change the world. Believe in yourself! 💪 {keywords}',
  ],
  educational: [
    'Did you know? {topic} is more fascinating than you might think. Here\'s why: {keywords}',
    'Breaking down {topic} into simple terms everyone can understand. {keywords}',
    'Let\'s dive deep into {topic} and explore what makes it essential. {keywords}',
  ],
};

const platformEmojis: Record<Platform, string[]> = {
  instagram: ['✨', '💫', '🌟', '💎', '🔥', '💯'],
  twitter: ['🧵', '👇', '🔥', '💡', '⚡', '🎯'],
  linkedin: ['💼', '📊', '🚀', '💡', '🎯', '📈'],
  facebook: ['👍', '❤️', '🎉', '🌟', '💬', '👏'],
  tiktok: ['🎵', '✨', '🔥', '💯', '🎬', '⚡'],
};

const callToActions: Record<Platform, string[]> = {
  instagram: [
    'Double tap if you agree! 💙',
    'Save this for later! 📌',
    'Share with someone who needs this! ✨',
    'Drop a 💯 in the comments!',
  ],
  twitter: [
    'RT if you agree!',
    'What are your thoughts? Reply below 👇',
    'Thread 🧵',
    'Bookmark this for later!',
  ],
  linkedin: [
    'What\'s your experience with this? Share in the comments.',
    'Connect with me to discuss more!',
    'Follow for more insights.',
    'Thoughts? Let\'s discuss in the comments.',
  ],
  facebook: [
    'What do you think? Comment below!',
    'Tag a friend who needs to see this!',
    'Share if you found this helpful!',
    'React with ❤️ if you agree!',
  ],
  tiktok: [
    'Follow for more! 🔥',
    'Duet this if you agree!',
    'Part 2 coming soon! 👀',
    'Drop a ❤️ if you relate!',
  ],
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function formatCaption(template: string, topic: string, keywords: string): string {
  let caption = template.replace('{topic}', topic);
  
  if (keywords.trim()) {
    caption = caption.replace('{keywords}', keywords);
  } else {
    caption = caption.replace('{keywords}', '').trim();
  }
  
  return caption;
}

export function generateCaptions(input: CaptionInput): CaptionSuggestion[] {
  const { topic, tone, platform, keywords = '' } = input;
  
  if (!topic.trim()) {
    return [];
  }

  const templates = toneTemplates[tone];
  const emojis = platformEmojis[platform];
  const ctas = callToActions[platform];
  
  const suggestions: CaptionSuggestion[] = [];
  
  // Generate 3 unique captions
  for (let i = 0; i < 3; i++) {
    const template = templates[i % templates.length];
    let caption = formatCaption(template, topic, keywords);
    
    // Add platform-specific emoji
    if (Math.random() > 0.3) {
      caption += ' ' + getRandomElement(emojis);
    }
    
    // Add call-to-action for some captions
    if (i === 2) {
      caption += '\n\n' + getRandomElement(ctas);
    }
    
    suggestions.push({
      id: `caption-${i}-${Date.now()}`,
      text: caption,
    });
  }
  
  return suggestions;
}
