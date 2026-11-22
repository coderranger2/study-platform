export type RoomId = 'library' | 'rooftop' | 'cafe' | 'arcade';

export interface StudyRoom {
  id: RoomId;
  name: string;
  tagline: string;
  hotkey: string;
  icon: string;
  vibe: string;
  occupants: number;
  bgGradient: string;
  accentColor: string;
  features: string[];
}

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  defaultSize?: { width: number; height: number };
}

export interface Companion {
  id: string;
  name: string;
  avatar: string;
  status: string;
  room: RoomId;
  minutesStudied: number;
  isOnline: boolean;
  avatarSprite: string;
  tableId: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  roomId: RoomId;
  text: string;
  timestamp: string;
  isBot?: boolean;
  badge?: string;
  reactions?: Record<string, number>;
}

export interface Flashcard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  hint?: string;
  mastery: number; // 0: new, 1: learning, 2: mastered
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  category: string;
  cards: Flashcard[];
}

export interface DailyQuest {
  id: string;
  title: string;
  desc: string;
  current: number;
  target: number;
  rewardXp: number;
  rewardCoins: number;
  completed: boolean;
  claimed: boolean;
  icon: string;
}

export interface ShopItem {
  id: string;
  category: 'wallpaper' | 'theme' | 'pet' | 'badge';
  name: string;
  description: string;
  price: number;
  icon: string;
  unlocked: boolean;
  previewValue?: string;
}

export type SkyMode = 'realtime' | 'golden' | 'twilight' | 'midnight' | 'dawn';

export type ThemeId = 'classic95' | 'vaporwave' | 'matcha' | 'midnight' | 'solarized';

export type IrlenTint = 'none' | 'peach' | 'amber' | 'mint' | 'lavender' | 'blue';

export interface SensorySettings {
  cinemaMode: boolean;
  activeWindowIdForCinema: string | null;
  dyslexicFont: boolean;
  bionicReading: boolean;
  irlenTint: IrlenTint;
  focusRuler: boolean;
  focusRulerY: number;
  focusRulerHeight: number;
  lineHeight: number;
  letterSpacing: number;
  fontSize: number;
}

export interface SoundState {
  rainVolume: number;
  thunderVolume: number;
  crackleVolume: number;
  cafeVolume: number;
  alphaVolume: number;
  masterVolume: number;
  isMuted: boolean;
}

export interface UserStats {
  xp: number;
  level: number;
  coins: number;
  pomodorosCompleted: number;
  cardsReviewedToday: number;
  studyMinutesToday: number;
  streakDays: number;
}
