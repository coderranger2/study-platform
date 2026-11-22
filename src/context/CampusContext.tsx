import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  RoomId,
  StudyRoom,
  WindowState,
  Companion,
  ChatMessage,
  Flashcard,
  FlashcardDeck,
  DailyQuest,
  ShopItem,
  SkyMode,
  ThemeId,
  SensorySettings,
  SoundState,
  UserStats,
} from '../types';
import { sound } from '../services/soundEffects';

// Default Study Rooms
export const INITIAL_ROOMS: Record<RoomId, StudyRoom> = {
  library: {
    id: 'library',
    name: 'Quiet Oak Library',
    tagline: 'Silent Deep Focus & Smart Research',
    hotkey: 'L',
    icon: '📚',
    vibe: 'Warm brass desk lamps, hushed whispers, towering mahogany shelves',
    occupants: 14,
    bgGradient: 'from-amber-950 via-stone-900 to-slate-950',
    accentColor: '#d97706',
    features: ['Adaptive Reader (Reader.exe)', 'PDF Notes Summarizer', 'Deep Quiet Hours'],
  },
  rooftop: {
    id: 'rooftop',
    name: 'Stargazer Rooftop Lounge',
    tagline: '50/10 Pomodoro Sprints & Twilight Stargazing',
    hotkey: 'R',
    icon: '🌆',
    vibe: 'Purple twilight skyline, cool campus breeze, synchronized focus sprints',
    occupants: 19,
    bgGradient: 'from-indigo-950 via-purple-950 to-slate-950',
    accentColor: '#8b5cf6',
    features: ['Group Pomodoro Sync', 'Meteor Shower Ambience', 'Lofi Night Vibes'],
  },
  cafe: {
    id: 'cafe',
    name: 'Bean & Byte Cafe',
    tagline: 'Lo-Fi Coffeehouse & AI Study Assistant',
    hotkey: 'C',
    icon: '☕',
    vibe: 'Steam rising from fresh latte mugs, vinyl crackle, gentle keyboard clicks',
    occupants: 26,
    bgGradient: 'from-amber-900 via-stone-900 to-amber-950',
    accentColor: '#eab308',
    features: ['StudyBot AI Assistant', 'Collaborative Chat', 'Fresh Espresso Sounds'],
  },
  arcade: {
    id: 'arcade',
    name: 'Pixel Quad Arcade',
    tagline: 'Break-Time Lounge & Active-Recall Games',
    hotkey: 'N',
    icon: '🕹️',
    vibe: 'Neon arcade glow, 8-bit chip tunes, flashcard challenge arena',
    occupants: 8,
    bgGradient: 'from-fuchsia-950 via-purple-950 to-blue-950',
    accentColor: '#ec4899',
    features: ['Auto-Flashcards Arena', 'Campus Reward Shop', 'Retro Minigames'],
  },
};

// Initial Windows
export const DEFAULT_WINDOWS: WindowState[] = [
  {
    id: 'campus-map',
    title: 'CampusMap.exe - Interactive Quad Directory',
    icon: '🗺️',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 40, y: 35 },
    size: { width: 520, height: 420 },
  },
  {
    id: 'study-room',
    title: 'StudyRooms.exe - Discord Study Servers & Live Tables',
    icon: '👥',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 380, y: 50 },
    size: { width: 620, height: 480 },
  },
  {
    id: 'pomodoro',
    title: 'Pomodoro.exe - Dial Sprint Timer & Quests',
    icon: '⏱️',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 9,
    position: { x: 920, y: 70 },
    size: { width: 380, height: 490 },
  },
  {
    id: 'study-bot',
    title: 'StudyBot.exe - Retro AI Tutor Messenger',
    icon: '🤖',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 12,
    position: { x: 180, y: 110 },
    size: { width: 560, height: 480 },
  },
  {
    id: 'reader',
    title: 'Reader.exe - Adaptive Neurodivergent Reader & Summarizer',
    icon: '📖',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 13,
    position: { x: 120, y: 70 },
    size: { width: 680, height: 520 },
  },
  {
    id: 'flashcards',
    title: 'Flashcards.exe - 3D Active-Recall Memory Arena',
    icon: '🃏',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 14,
    position: { x: 260, y: 90 },
    size: { width: 560, height: 490 },
  },
  {
    id: 'sound-mixer',
    title: 'SoundMixer.exe - Procedural Binaural Audio Suite',
    icon: '🎚️',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 15,
    position: { x: 440, y: 130 },
    size: { width: 480, height: 430 },
  },
  {
    id: 'sensory-tv',
    title: 'SensoryTV.exe - Retro CRT Lo-Fi Video Window',
    icon: '📺',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 16,
    position: { x: 520, y: 150 },
    size: { width: 510, height: 410 },
  },
  {
    id: 'posture-guard',
    title: 'PostureGuard.exe - Ergonomic Monitor & Webcam Fatigue AI',
    icon: '🧘',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 17,
    position: { x: 300, y: 120 },
    size: { width: 520, height: 440 },
  },
  {
    id: 'shop',
    title: 'CampusShop.exe - Retro Bookstore & Unlocks',
    icon: '🛍️',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 18,
    position: { x: 220, y: 80 },
    size: { width: 600, height: 490 },
  },
  {
    id: 'quests',
    title: 'DailyQuests.exe - Gamified Milestones',
    icon: '📜',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 19,
    position: { x: 410, y: 100 },
    size: { width: 490, height: 450 },
  },
];

// Initial Study Companions
export const INITIAL_COMPANIONS: Companion[] = [
  {
    id: 'comp-1',
    name: 'Sasha_CS',
    avatar: '👩‍💻',
    status: 'Debugging Web Workers in React',
    room: 'cafe',
    minutesStudied: 142,
    isOnline: true,
    avatarSprite: 'typing',
    tableId: 1,
  },
  {
    id: 'comp-2',
    name: 'Kenji_Neuro',
    avatar: '👨‍🔬',
    status: 'Reading Synaptic Pruning Ch. 7',
    room: 'library',
    minutesStudied: 89,
    isOnline: true,
    avatarSprite: 'reading',
    tableId: 1,
  },
  {
    id: 'comp-3',
    name: 'Maya_Art',
    avatar: '🎨',
    status: 'Pixel art shaders for CampusOS',
    room: 'rooftop',
    minutesStudied: 215,
    isOnline: true,
    avatarSprite: 'painting',
    tableId: 2,
  },
  {
    id: 'comp-4',
    name: 'Devin_Math',
    avatar: '📐',
    status: 'Linear Algebra SVD Decomposition',
    room: 'library',
    minutesStudied: 65,
    isOnline: true,
    avatarSprite: 'writing',
    tableId: 2,
  },
  {
    id: 'comp-5',
    name: 'Elena_LoFi',
    avatar: '🎧',
    status: '50m Sprint • Stargazing playlist',
    room: 'rooftop',
    minutesStudied: 180,
    isOnline: true,
    avatarSprite: 'listening',
    tableId: 1,
  },
  {
    id: 'comp-6',
    name: 'Toby_Gaming',
    avatar: '🕹️',
    status: 'Testing flashcard deck speedrun',
    room: 'arcade',
    minutesStudied: 45,
    isOnline: true,
    avatarSprite: 'playing',
    tableId: 1,
  },
];

// Initial Flashcard Decks
export const INITIAL_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-cs-arch',
    title: 'Computer Systems & OS Concepts',
    description: 'Threads, Virtual Memory, Inverted Page Tables & Semaphores',
    category: 'Computer Science',
    cards: [
      {
        id: 'c1',
        deckId: 'deck-cs-arch',
        question: 'What is the purpose of an Operating System Semaphore?',
        answer: 'A synchronization variable used to control concurrent access to common resources in a multi-process system to prevent race conditions.',
        hint: 'Edsger Dijkstra invented it in 1965',
        mastery: 0,
      },
      {
        id: 'c2',
        deckId: 'deck-cs-arch',
        question: 'What is Thrashing in Virtual Memory?',
        answer: 'A state where the CPU spends more time swapping pages between RAM and disk than executing user instructions due to excessive working-set size.',
        hint: 'High page-fault frequency',
        mastery: 1,
      },
      {
        id: 'c3',
        deckId: 'deck-cs-arch',
        question: 'What is the difference between Inode and File Descriptor?',
        answer: 'An Inode is a disk filesystem structure storing file metadata; a File Descriptor is a per-process integer index in the open file table.',
        hint: 'Kernel table vs. disk block pointer',
        mastery: 0,
      },
    ],
  },
  {
    id: 'deck-learning',
    title: 'Cognitive Science & Study Tactics',
    description: 'Active Recall, Dual-Coding, Interleaving & Sleep Consolidations',
    category: 'Neuroscience',
    cards: [
      {
        id: 'c4',
        deckId: 'deck-learning',
        question: 'Why is Active Recall superior to Passive Re-reading?',
        answer: 'Retrieval practice triggers neurogenesis and strengthens synaptic pathways via long-term potentiation, while passive reading merely produces an illusion of competence.',
        hint: 'Testing effect phenomenon',
        mastery: 2,
      },
      {
        id: 'c5',
        deckId: 'deck-learning',
        question: 'What is the Interleaving Effect in study sessions?',
        answer: 'Switching between related topics or problem types rather than blocking one topic reinforces contextual discrimination and categorization.',
        hint: 'Opposite of blocked practice',
        mastery: 1,
      },
    ],
  },
];

// Initial Daily Quests
export const INITIAL_QUESTS: DailyQuest[] = [
  {
    id: 'q1',
    title: 'Complete 2 Pomodoro Sprints',
    desc: 'Focus for two 25-minute or 50-minute blocks without distraction.',
    current: 1,
    target: 2,
    rewardXp: 50,
    rewardCoins: 20,
    completed: false,
    claimed: false,
    icon: '⏱️',
  },
  {
    id: 'q2',
    title: 'Review 5 Flashcards in Arcade',
    desc: 'Test your active recall in the 3D Flashcard arena.',
    current: 3,
    target: 5,
    rewardXp: 40,
    rewardCoins: 15,
    completed: false,
    claimed: false,
    icon: '🃏',
  },
  {
    id: 'q3',
    title: 'Summarize Notes in Library Reader',
    desc: 'Use the Smart Notes Summarizer to digest study material.',
    current: 0,
    target: 1,
    rewardXp: 45,
    rewardCoins: 20,
    completed: false,
    claimed: false,
    icon: '📖',
  },
  {
    id: 'q4',
    title: 'Ergonomic Stretch & Water Break',
    desc: 'Follow the 20-20-20 rule and check in with PostureGuard.',
    current: 1,
    target: 1,
    rewardXp: 30,
    rewardCoins: 10,
    completed: true,
    claimed: false,
    icon: '💧',
  },
];

// Initial Shop Items
export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  // Wallpapers
  {
    id: 'wp-teal',
    category: 'wallpaper',
    name: 'Campus Teal 98',
    description: 'Classic iconic 90s OS teal solid background with retro dithering.',
    price: 0,
    icon: '🖥️',
    unlocked: true,
    previewValue: '#008080',
  },
  {
    id: 'wp-twilight',
    category: 'wallpaper',
    name: 'Neon Twilight Quad',
    description: 'Dynamic animated campus building skyline with glowing lanterns.',
    price: 40,
    icon: '🌆',
    unlocked: true,
    previewValue: 'linear-gradient(to bottom, #1e1b4b, #312e81, #0f172a)',
  },
  {
    id: 'wp-cyber',
    category: 'wallpaper',
    name: 'Cyber Grid 2000',
    description: 'Wireframe perspective 3D grid with glowing horizon sun.',
    price: 60,
    icon: '🌐',
    unlocked: false,
    previewValue: 'radial-gradient(ellipse at bottom, #831843, #09090b)',
  },
  {
    id: 'wp-vapor',
    category: 'wallpaper',
    name: 'Pastel Lo-Fi Sunset',
    description: 'Dreamy purple, pink, and peach clouds over retro campus towers.',
    price: 80,
    icon: '🌸',
    unlocked: false,
    previewValue: 'linear-gradient(to bottom, #f472b6, #c084fc, #38bdf8)',
  },

  // Themes
  {
    id: 'theme-classic95',
    category: 'theme',
    name: 'Classic Gray 95',
    description: 'Traditional beveled chrome buttons, navy blue active window bars.',
    price: 0,
    icon: '🪟',
    unlocked: true,
  },
  {
    id: 'theme-vaporwave',
    category: 'theme',
    name: 'Vaporwave Neon',
    description: 'Hot pink gradient titlebars, cyan highlights, synth aesthetic.',
    price: 50,
    icon: '🌴',
    unlocked: false,
  },
  {
    id: 'theme-matcha',
    category: 'theme',
    name: 'Matcha Pastel',
    description: 'Soothing sage green and cream tones for minimal eye strain.',
    price: 60,
    icon: '🍵',
    unlocked: false,
  },
  {
    id: 'theme-midnight',
    category: 'theme',
    name: 'Midnight Cyberpunk',
    description: 'Deep navy, gold accents, and amber terminal glow.',
    price: 75,
    icon: '🌌',
    unlocked: false,
  },

  // Desk Pets
  {
    id: 'pet-cat',
    category: 'pet',
    name: 'Tamagotchi Pixel Cat',
    description: 'An adorable 8-bit calico cat that naps, purrs, and walks on windows.',
    price: 45,
    icon: '🐱',
    unlocked: true,
  },
  {
    id: 'pet-duck',
    category: 'pet',
    name: 'Rubber Duck Debugger',
    description: 'Quacks encouraging advice and sits on your active window bar.',
    price: 50,
    icon: '🦆',
    unlocked: false,
  },
  {
    id: 'pet-dragon',
    category: 'pet',
    name: 'Pocket Fire Drake',
    description: 'Breathes tiny spark particles when you complete study sprints.',
    price: 100,
    icon: '🐉',
    unlocked: false,
  },

  // Scholar Badges
  {
    id: 'badge-scholar',
    category: 'badge',
    name: 'Golden Scholar Crest',
    description: 'Gilded badge displayed on your Campus ID and taskbar profile.',
    price: 50,
    icon: '🏅',
    unlocked: true,
  },
  {
    id: 'badge-nightowl',
    category: 'badge',
    name: 'Night Owl Insignia',
    description: 'Awarded to champions of the midnight campus study lounge.',
    price: 65,
    icon: '🦉',
    unlocked: false,
  },
];

interface CampusContextType {
  // Rooms
  currentRoom: RoomId;
  rooms: Record<RoomId, StudyRoom>;
  switchRoom: (roomId: RoomId) => void;

  // Windows
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;

  // Gamification & Progression
  stats: UserStats;
  addXp: (amount: number, reason?: string) => void;
  addCoins: (amount: number, reason?: string) => void;
  quests: DailyQuest[];
  claimQuest: (id: string) => void;
  updateQuestProgress: (id: string, increment?: number) => void;

  // Shop & Customization
  shopItems: ShopItem[];
  buyItem: (id: string) => boolean;
  activeTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  activeWallpaper: string;
  setWallpaper: (wpId: string) => void;
  activePet: string;
  setPet: (petId: string) => void;

  // Sky Backdrop Mode
  skyMode: SkyMode;
  setSkyMode: (mode: SkyMode) => void;

  // Sensory & Accessibility
  sensory: SensorySettings;
  updateSensory: (settings: Partial<SensorySettings>) => void;
  toggleCinemaMode: () => void;

  // Sound System
  soundState: SoundState;
  updateSoundState: (settings: Partial<SoundState>) => void;

  // Companions & Chat
  companions: Companion[];
  chatMessages: ChatMessage[];
  sendMessage: (text: string, isBot?: boolean) => void;

  // Flashcards
  decks: FlashcardDeck[];
  addDeck: (deck: FlashcardDeck) => void;
  addCardsToDeck: (deckId: string, cards: Omit<Flashcard, 'id' | 'deckId'>[]) => void;
  updateCardMastery: (deckId: string, cardId: string, mastery: number) => void;

  // Pomodoro
  pomodoroMinutesLeft: number;
  pomodoroSecondsLeft: number;
  isPomodoroRunning: boolean;
  pomodoroMode: 'focus' | 'shortBreak' | 'longBreak';
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: (minutes?: number) => void;
  setPomodoroMode: (mode: 'focus' | 'shortBreak' | 'longBreak') => void;

  // Toast / Notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CampusContext = createContext<CampusContextType | null>(null);

export const CampusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- Persistent State from localStorage ---
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('campus_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      xp: 340,
      level: 3,
      coins: 140,
      pomodorosCompleted: 4,
      cardsReviewedToday: 12,
      studyMinutesToday: 75,
      streakDays: 5,
    };
  });

  const [quests, setQuests] = useState<DailyQuest[]>(() => {
    const saved = localStorage.getItem('campus_quests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_QUESTS;
  });

  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem('campus_shop');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_SHOP_ITEMS;
  });

  const [activeTheme, setActiveTheme] = useState<ThemeId>(() => {
    return (localStorage.getItem('campus_theme') as ThemeId) || 'classic95';
  });

  const [activeWallpaper, setActiveWallpaper] = useState<string>(() => {
    return localStorage.getItem('campus_wallpaper') || 'wp-twilight';
  });

  const [activePet, setActivePet] = useState<string>(() => {
    return localStorage.getItem('campus_pet') || 'pet-cat';
  });

  const [skyMode, setSkyMode] = useState<SkyMode>(() => {
    return (localStorage.getItem('campus_skyMode') as SkyMode) || 'twilight';
  });

  const [currentRoom, setCurrentRoom] = useState<RoomId>(() => {
    return (localStorage.getItem('campus_currentRoom') as RoomId) || 'library';
  });

  const [windows, setWindows] = useState<WindowState[]>(DEFAULT_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<string | null>('study-room');

  const [sensory, setSensory] = useState<SensorySettings>(() => {
    const saved = localStorage.getItem('campus_sensory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      cinemaMode: false,
      activeWindowIdForCinema: null,
      dyslexicFont: false,
      bionicReading: false,
      irlenTint: 'none',
      focusRuler: false,
      focusRulerY: 180,
      focusRulerHeight: 48,
      lineHeight: 1.6,
      letterSpacing: 0,
      fontSize: 16,
    };
  });

  const [soundState, setSoundState] = useState<SoundState>({
    rainVolume: 0.25,
    thunderVolume: 0.1,
    crackleVolume: 0.15,
    cafeVolume: 0,
    alphaVolume: 0,
    masterVolume: 0.7,
    isMuted: false,
  });

  const [companions] = useState<Companion[]>(INITIAL_COMPANIONS);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('campus_chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'msg-1',
        sender: 'StudyBot',
        avatar: '🤖',
        roomId: 'cafe',
        text: 'Welcome to Bean & Byte Cafe! ☕ Type @StudyBot or open StudyBot.exe anytime you need explanations, code debugging, or quick quiz generation!',
        timestamp: '10:00 AM',
        isBot: true,
        badge: 'AI Assistant',
      },
      {
        id: 'msg-2',
        sender: 'Sasha_CS',
        avatar: '👩‍💻',
        roomId: 'cafe',
        text: 'Hey everyone! Working on retro window drag boundaries. The 90s aesthetic is so nostalgic.',
        timestamp: '10:05 AM',
        badge: 'Level 5 Scholar',
      },
      {
        id: 'msg-3',
        sender: 'Elena_LoFi',
        avatar: '🎧',
        roomId: 'rooftop',
        text: 'Rooftop 50/10 sprint starting in 2 minutes! Stargazing view is incredible right now 🌆',
        timestamp: '10:08 AM',
        badge: 'Sprint Leader',
      },
      {
        id: 'msg-4',
        sender: 'Kenji_Neuro',
        avatar: '👨‍🔬',
        roomId: 'library',
        text: 'Library is blissfully quiet. The Bionic Reading filter in Reader.exe is a lifesaver for these neuroscience papers.',
        timestamp: '10:12 AM',
        badge: 'Deep Focus',
      },
    ];
  });

  const [decks, setDecks] = useState<FlashcardDeck[]>(() => {
    const saved = localStorage.getItem('campus_decks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_DECKS;
  });

  // Pomodoro State
  const [pomodoroMinutesLeft, setPomodoroMinutesLeft] = useState<number>(25);
  const [pomodoroSecondsLeft, setPomodoroSecondsLeft] = useState<number>(0);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState<boolean>(false);
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('campus_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('campus_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('campus_shop', JSON.stringify(shopItems));
  }, [shopItems]);

  useEffect(() => {
    localStorage.setItem('campus_theme', activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    localStorage.setItem('campus_wallpaper', activeWallpaper);
  }, [activeWallpaper]);

  useEffect(() => {
    localStorage.setItem('campus_pet', activePet);
  }, [activePet]);

  useEffect(() => {
    localStorage.setItem('campus_skyMode', skyMode);
  }, [skyMode]);

  useEffect(() => {
    localStorage.setItem('campus_currentRoom', currentRoom);
  }, [currentRoom]);

  useEffect(() => {
    localStorage.setItem('campus_sensory', JSON.stringify(sensory));
  }, [sensory]);

  useEffect(() => {
    localStorage.setItem('campus_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('campus_decks', JSON.stringify(decks));
  }, [decks]);

  // Sync Audio State
  useEffect(() => {
    sound.setMute(soundState.isMuted);
    sound.setMasterVolume(soundState.masterVolume);
    sound.updateAmbientLevels({
      rain: soundState.rainVolume,
      thunder: soundState.thunderVolume,
      vinyl: soundState.crackleVolume,
      cafe: soundState.cafeVolume,
      alpha: soundState.alphaVolume,
    });
  }, [soundState]);

  // Keyboard Shortcuts: L (Library), R (Rooftop), C (Cafe), N (Arcade)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      if (key === 'L') {
        switchRoom('library');
      } else if (key === 'R') {
        switchRoom('rooftop');
      } else if (key === 'C') {
        switchRoom('cafe');
      } else if (key === 'N') {
        switchRoom('arcade');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pomodoro countdown timer tick
  useEffect(() => {
    let interval: number | undefined;
    if (isPomodoroRunning) {
      interval = window.setInterval(() => {
        setPomodoroSecondsLeft((prevSec) => {
          if (prevSec > 0) {
            return prevSec - 1;
          } else {
            // Minutes countdown
            setPomodoroMinutesLeft((prevMin) => {
              if (prevMin > 0) {
                return prevMin - 1;
              } else {
                // Session Completed!
                setIsPomodoroRunning(false);
                sound.playTimerDone();
                confetti({
                  particleCount: 80,
                  spread: 70,
                  origin: { y: 0.6 },
                });

                if (pomodoroMode === 'focus') {
                  addXp(60, 'Pomodoro Sprint Completed!');
                  addCoins(25, 'Focus Session Reward');
                  updateQuestProgress('q1', 1);
                  setStats((s) => ({
                    ...s,
                    pomodorosCompleted: s.pomodorosCompleted + 1,
                    studyMinutesToday: s.studyMinutesToday + 25,
                  }));
                  showToast('🎉 Focus Sprint Complete! +60 XP, +25 Coins! Take a 5m break.');
                  setPomodoroMode('shortBreak');
                  return 5;
                } else {
                  showToast('🔔 Break over! Ready for the next focus sprint?');
                  setPomodoroMode('focus');
                  return 25;
                }
              }
            });
            return 59;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPomodoroRunning, pomodoroMode, showToast]);

  // Add XP with level up check
  const addXp = useCallback((amount: number, reason?: string) => {
    setStats((prev) => {
      const newXp = prev.xp + amount;
      const nextLevelThreshold = prev.level * 200;
      let newLevel = prev.level;
      if (newXp >= nextLevelThreshold) {
        newLevel += 1;
        sound.playLevelUp();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
        showToast(`⭐ LEVEL UP! You reached Level ${newLevel}!`);
      }
      return { ...prev, xp: newXp, level: newLevel };
    });
  }, [showToast]);

  // Add Coins
  const addCoins = useCallback((amount: number, reason?: string) => {
    sound.playCoin();
    setStats((prev) => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  }, []);

  // Switch Room
  const switchRoom = useCallback((roomId: RoomId) => {
    sound.playClick();
    setCurrentRoom(roomId);
    showToast(`🚀 Entered ${INITIAL_ROOMS[roomId].name}! [${INITIAL_ROOMS[roomId].hotkey}]`);

    // Ambient sound presets based on room
    if (roomId === 'cafe') {
      setSoundState((s) => ({ ...s, cafeVolume: 0.35, crackleVolume: 0.2 }));
    } else if (roomId === 'rooftop') {
      setSoundState((s) => ({ ...s, alphaVolume: 0.25, rainVolume: 0.15 }));
    } else if (roomId === 'library') {
      setSoundState((s) => ({ ...s, rainVolume: 0.25, crackleVolume: 0.1, cafeVolume: 0 }));
    } else if (roomId === 'arcade') {
      setSoundState((s) => ({ ...s, crackleVolume: 0.1, alphaVolume: 0 }));
    }
  }, [showToast]);

  // Window Management
  const openWindow = useCallback((id: string) => {
    sound.playWindowOpen();
    setWindows((prev) => {
      const highestZ = Math.max(...prev.map((w) => w.zIndex), 10);
      return prev.map((w) => {
        if (w.id === id) {
          return { ...w, isOpen: true, isMinimized: false, zIndex: highestZ + 1 };
        }
        return w;
      });
    });
    setActiveWindowId(id);
  }, []);

  const closeWindow = useCallback((id: string) => {
    sound.playWindowClose();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false, isMinimized: false } : w))
    );
    setActiveWindowId((prevActive) => (prevActive === id ? null : prevActive));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    sound.playClick();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w))
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    sound.playClick();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  }, []);

  const bringToFront = useCallback((id: string) => {
    sound.playClick();
    setWindows((prev) => {
      const highestZ = Math.max(...prev.map((w) => w.zIndex), 10);
      return prev.map((w) => {
        if (w.id === id) {
          return { ...w, zIndex: highestZ + 1, isMinimized: false };
        }
        return w;
      });
    });
    setActiveWindowId(id);
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position: { x, y } } : w))
    );
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size: { width, height } } : w))
    );
  }, []);

  // Daily Quests
  const updateQuestProgress = useCallback((id: string, increment: number = 1) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const nextVal = Math.min(q.target, q.current + increment);
          const completed = nextVal >= q.target;
          return { ...q, current: nextVal, completed };
        }
        return q;
      })
    );
  }, []);

  const claimQuest = useCallback((id: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id && q.completed && !q.claimed) {
          addXp(q.rewardXp, `Claimed: ${q.title}`);
          addCoins(q.rewardCoins, `Claimed: ${q.title}`);
          showToast(`🏆 Claimed Quest: ${q.title} (+${q.rewardXp} XP, +${q.rewardCoins} Coins)`);
          return { ...q, claimed: true };
        }
        return q;
      })
    );
  }, [addXp, addCoins, showToast]);

  // Shop
  const buyItem = useCallback((id: string): boolean => {
    const item = shopItems.find((i) => i.id === id);
    if (!item) return false;
    if (item.unlocked) {
      // Equip directly
      if (item.category === 'theme') {
        setActiveTheme(item.id.replace('theme-', '') as ThemeId);
        showToast(`🎨 Equipped theme: ${item.name}`);
      } else if (item.category === 'wallpaper') {
        setActiveWallpaper(item.id);
        showToast(`🖼️ Applied wallpaper: ${item.name}`);
      } else if (item.category === 'pet') {
        setActivePet(item.id);
        showToast(`🐾 Summoned desk companion: ${item.name}`);
      }
      sound.playClick();
      return true;
    }

    if (stats.coins < item.price) {
      sound.playError();
      showToast(`❌ Need ${item.price - stats.coins} more coins! Complete study sprints or flashcards.`);
      return false;
    }

    // Purchase
    sound.playCoin();
    setStats((s) => ({ ...s, coins: s.coins - item.price }));
    setShopItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, unlocked: true } : i))
    );

    // Equip
    if (item.category === 'theme') {
      setActiveTheme(item.id.replace('theme-', '') as ThemeId);
    } else if (item.category === 'wallpaper') {
      setActiveWallpaper(item.id);
    } else if (item.category === 'pet') {
      setActivePet(item.id);
    }

    showToast(`🎉 Unlocked & Equipped: ${item.name}!`);
    return true;
  }, [shopItems, stats.coins, showToast]);

  // Sensory Settings
  const updateSensory = useCallback((settings: Partial<SensorySettings>) => {
    setSensory((prev) => ({ ...prev, ...settings }));
  }, []);

  const toggleCinemaMode = useCallback(() => {
    sound.playClick();
    setSensory((prev) => {
      const nextCinema = !prev.cinemaMode;
      return {
        ...prev,
        cinemaMode: nextCinema,
        activeWindowIdForCinema: nextCinema ? activeWindowId : null,
      };
    });
  }, [activeWindowId]);

  // Sound State
  const updateSoundState = useCallback((settings: Partial<SoundState>) => {
    setSoundState((prev) => ({ ...prev, ...settings }));
  }, []);

  // Room Chat
  const sendMessage = useCallback((text: string, isBot = false) => {
    sound.playClick();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: isBot ? 'StudyBot' : 'You (Scholar)',
      avatar: isBot ? '🤖' : '🎓',
      roomId: currentRoom,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isBot,
      badge: isBot ? 'AI Assistant' : `Lvl ${stats.level}`,
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // Check if message mentions StudyBot or is in cafe
    if (!isBot && (text.includes('@StudyBot') || text.includes('?') || text.toLowerCase().includes('studybot'))) {
      setTimeout(() => {
        const botReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'StudyBot',
          avatar: '🤖',
          roomId: currentRoom,
          text: `Got your inquiry: "${text.replace('@StudyBot', '').trim()}". You can also open StudyBot.exe from the taskbar for complete deep-dive explanations, syntax-highlighted code, or flashcard generation!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBot: true,
          badge: 'AI Assistant',
        };
        setChatMessages((prev) => [...prev, botReply]);
        sound.playWindowOpen();
      }, 900);
    }
  }, [currentRoom, stats.level]);

  // Flashcards
  const addDeck = useCallback((deck: FlashcardDeck) => {
    setDecks((prev) => [...prev, deck]);
    showToast(`🃏 Created new study deck: ${deck.title}!`);
  }, [showToast]);

  const addCardsToDeck = useCallback((deckId: string, cards: Omit<Flashcard, 'id' | 'deckId'>[]) => {
    setDecks((prev) =>
      prev.map((d) => {
        if (d.id === deckId) {
          const newCards: Flashcard[] = cards.map((c, i) => ({
            ...c,
            id: `card-${Date.now()}-${i}`,
            deckId,
          }));
          return { ...d, cards: [...d.cards, ...newCards] };
        }
        return d;
      })
    );
    showToast(`✨ Added ${cards.length} cards to deck!`);
  }, [showToast]);

  const updateCardMastery = useCallback((deckId: string, cardId: string, mastery: number) => {
    setDecks((prev) =>
      prev.map((d) => {
        if (d.id === deckId) {
          return {
            ...d,
            cards: d.cards.map((c) => (c.id === cardId ? { ...c, mastery } : c)),
          };
        }
        return d;
      })
    );
  }, []);

  // Pomodoro Actions
  const startPomodoro = useCallback(() => {
    sound.playClick();
    setIsPomodoroRunning(true);
  }, []);

  const pausePomodoro = useCallback(() => {
    sound.playClick();
    setIsPomodoroRunning(false);
  }, []);

  const resetPomodoro = useCallback((minutes = 25) => {
    sound.playClick();
    setIsPomodoroRunning(false);
    setPomodoroMinutesLeft(minutes);
    setPomodoroSecondsLeft(0);
  }, []);

  return (
    <CampusContext.Provider
      value={{
        currentRoom,
        rooms: INITIAL_ROOMS,
        switchRoom,
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        bringToFront,
        updateWindowPosition,
        updateWindowSize,
        stats,
        addXp,
        addCoins,
        quests,
        claimQuest,
        updateQuestProgress,
        shopItems,
        buyItem,
        activeTheme,
        setTheme: setActiveTheme,
        activeWallpaper,
        setWallpaper: setActiveWallpaper,
        activePet,
        setPet: setActivePet,
        skyMode,
        setSkyMode,
        sensory,
        updateSensory,
        toggleCinemaMode,
        soundState,
        updateSoundState,
        companions,
        chatMessages,
        sendMessage,
        decks,
        addDeck,
        addCardsToDeck,
        updateCardMastery,
        pomodoroMinutesLeft,
        pomodoroSecondsLeft,
        isPomodoroRunning,
        pomodoroMode,
        startPomodoro,
        pausePomodoro,
        resetPomodoro,
        setPomodoroMode,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = (): CampusContextType => {
  const ctx = useContext(CampusContext);
  if (!ctx) throw new Error('useCampus must be used within a CampusProvider');
  return ctx;
};
