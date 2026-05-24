import type { LucideIcon } from 'lucide-react';
import {
  HelpCircle,
  ToggleLeft,
  Layers,
  Link2,
  Network,
  Globe,
  Shield,
  Cable,
  Server,
  MousePointerClick,
  TextCursorInput,
  Package,
  Hash,
  CircleOff,
} from 'lucide-react';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category =
  | 'OSI Model'
  | 'TCP/IP'
  | 'General Networking'
  | 'Protocols & Ports'
  | 'Network Security'
  | 'Hardware & Cabling';

export type GameMode =
  | 'classic'
  | 'true-false'
  | 'layer-order'
  | 'match-pairs'
  | 'layer-pick'
  | 'fill-blank'
  | 'encapsulation-order'
  | 'port-picker'
  | 'odd-one-out';

export interface ClassicChallenge {
  type: 'classic';
  id: string;
  category: Category;
  difficulty: Difficulty;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface TrueFalseChallenge {
  type: 'true-false';
  id: string;
  category: Category;
  difficulty: Difficulty;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface LayerOrderChallenge {
  type: 'layer-order';
  id: string;
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  /** Correct order from top (Layer 7) to bottom (Layer 1) */
  correctOrder: string[];
  explanation: string;
}

export interface MatchPairsChallenge {
  type: 'match-pairs';
  id: string;
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  leftLabel: string;
  rightLabel: string;
  pairs: { left: string; right: string }[];
  explanation: string;
}

export interface LayerPickChallenge {
  type: 'layer-pick';
  id: string;
  category: Category;
  difficulty: Difficulty;
  clue: string;
  correctLayer: string;
  explanation: string;
}

export interface FillBlankChallenge {
  type: 'fill-blank';
  id: string;
  category: Category;
  difficulty: Difficulty;
  /** Use ___ where the blank should appear */
  sentence: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface EncapsulationChallenge {
  type: 'encapsulation-order';
  id: string;
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  /** Correct order from first encapsulation step to last */
  steps: string[];
  explanation: string;
}

export interface PortPickerChallenge {
  type: 'port-picker';
  id: string;
  category: Category;
  difficulty: Difficulty;
  protocol: string;
  context?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface OddOneOutChallenge {
  type: 'odd-one-out';
  id: string;
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  options: string[];
  oddIndex: number;
  explanation: string;
}

export type Challenge =
  | ClassicChallenge
  | TrueFalseChallenge
  | LayerOrderChallenge
  | MatchPairsChallenge
  | LayerPickChallenge
  | FillBlankChallenge
  | EncapsulationChallenge
  | PortPickerChallenge
  | OddOneOutChallenge;

export interface GameModeConfig {
  id: GameMode;
  name: string;
  description: string;
  howToPlay: string;
  icon: LucideIcon;
  rounds: number;
}

export interface CategoryConfig {
  id: Category | 'all';
  name: string;
  description: string;
  icon: LucideIcon;
}

export const GAME_MODES: GameModeConfig[] = [
  {
    id: 'classic',
    name: 'Classic Quiz',
    description: 'Multiple choice — pick the best answer',
    howToPlay: 'Read the question and tap one answer. You\'ll see feedback right away.',
    icon: HelpCircle,
    rounds: 5,
  },
  {
    id: 'true-false',
    name: 'True or False',
    description: 'Quick yes/no on networking facts',
    howToPlay: 'Read the statement and tap True or False.',
    icon: ToggleLeft,
    rounds: 5,
  },
  {
    id: 'layer-pick',
    name: 'Layer Spotlight',
    description: 'Tap the OSI layer that fits the clue',
    howToPlay: 'Read the clue, then tap the matching layer in the stack.',
    icon: MousePointerClick,
    rounds: 5,
  },
  {
    id: 'fill-blank',
    name: 'Fill the Blank',
    description: 'Complete the sentence with the right word',
    howToPlay: 'Read the sentence and tap the word that fills the blank.',
    icon: TextCursorInput,
    rounds: 5,
  },
  {
    id: 'port-picker',
    name: 'Port Picker',
    description: 'Match protocols to their port numbers',
    howToPlay: 'See the protocol name and tap the correct port number.',
    icon: Hash,
    rounds: 5,
  },
  {
    id: 'odd-one-out',
    name: 'Odd One Out',
    description: 'Find the term that does not belong',
    howToPlay: 'Read the question and tap the option that does not fit the group.',
    icon: CircleOff,
    rounds: 5,
  },
  {
    id: 'match-pairs',
    name: 'Protocol Match',
    description: 'Match each term to its partner',
    howToPlay: 'One term at a time — pick the correct match from the options shown.',
    icon: Link2,
    rounds: 4,
  },
  {
    id: 'layer-order',
    name: 'Stack the Layers',
    description: 'Put OSI layers in the correct order',
    howToPlay: 'Tap a layer to select it, then use Move Up or Move Down. Tap Check when ready.',
    icon: Layers,
    rounds: 2,
  },
  {
    id: 'encapsulation-order',
    name: 'Encapsulation Rush',
    description: 'Order the steps data takes through the stack',
    howToPlay: 'Tap a step to select it, then use Move Up or Move Down. Tap Check when ready.',
    icon: Package,
    rounds: 3,
  },
];

export const CATEGORIES: CategoryConfig[] = [
  { id: 'all', name: 'All Topics', description: 'Mixed questions from every category', icon: Globe },
  { id: 'OSI Model', name: 'OSI Model', description: 'Layers, PDUs, and encapsulation', icon: Layers },
  { id: 'TCP/IP', name: 'TCP/IP', description: 'Internet model and transport protocols', icon: Network },
  { id: 'General Networking', name: 'General Networking', description: 'IPs, DNS, routing, and fundamentals', icon: Globe },
  { id: 'Protocols & Ports', name: 'Protocols & Ports', description: 'HTTP, DNS, FTP, and well-known ports', icon: Server },
  { id: 'Network Security', name: 'Network Security', description: 'Encryption, firewalls, and threats', icon: Shield },
  { id: 'Hardware & Cabling', name: 'Hardware & Cabling', description: 'Cables, switches, and physical media', icon: Cable },
];

export const OSI_LAYERS = [
  'Application',
  'Presentation',
  'Session',
  'Transport',
  'Network',
  'Data Link',
  'Physical',
] as const;

export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
