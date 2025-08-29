// src/services/achievements.ts

/**
 * Represents a user achievement or badge.
 */
export interface Achievement {
  /** A unique identifier for the achievement. */
  id: string;
  /** The title of the achievement. */
  title: string;
  /** A short description of what the achievement is for. */
  description: string;
  /** An emoji to represent the badge visually. */
  emoji: string;
  /** The criteria for earning the achievement. */
  criteria: {
    /** The type of criteria (e.g., 'tag', 'difficulty'). */
    type: 'tag' | 'difficulty';
    /** The specific tag to track (if type is 'tag'). */
    tag?: string;
    /** The number of problems to solve to earn the achievement. */
    count: number;
  };
}

const mockAchievements: Achievement[] = [
  {
    id: 'array-novice',
    title: 'Array Apprentice',
    description: 'Solve 3 problems with the "Array" tag.',
    emoji: '📚',
    criteria: { type: 'tag', tag: 'Array', count: 3 },
  },
  {
    id: 'array-master',
    title: 'Array Master',
    description: 'Solve 10 problems with the "Array" tag.',
    emoji: '🏆',
    criteria: { type: 'tag', tag: 'Array', count: 10 },
  },
  {
    id: 'recursion-adept',
    title: 'Recursion Adept',
    description: 'Solve 5 problems involving recursion.',
    emoji: '🔄',
    criteria: { type: 'tag', tag: 'Recursion', count: 5 },
  },
  {
    id: 'string-sorcerer',
    title: 'String Sorcerer',
    description: 'Solve 5 problems with the "String" tag.',
    emoji: '✍️',
    criteria: { type: 'tag', tag: 'String', count: 5 },
  },
  {
    id: 'dp-dynamo',
    title: 'DP Dynamo',
    description: 'Solve 3 problems using Dynamic Programming.',
    emoji: '🧠',
    criteria: { type: 'tag', tag: 'Dynamic Programming', count: 3 },
  },
  {
    id: 'tree-navigator',
    title: 'Tree Navigator',
    description: 'Solve 3 problems involving binary trees.',
    emoji: '🌳',
    criteria: { type: 'tag', tag: 'Binary Tree', count: 3 },
  },
  {
    id: 'linked-list-pro',
    title: 'Linked List Pro',
    description: 'Solve 2 problems with the "Linked List" tag.',
    emoji: '🔗',
    criteria: { type: 'tag', tag: 'Linked List', count: 2 },
  },
   {
    id: 'hash-table-hero',
    title: 'Hash Table Hero',
    description: 'Solve 2 problems using Hash Tables.',
    emoji: '🔑',
    criteria: { type: 'tag', tag: 'Hash Table', count: 2 },
  },
];

/**
 * Asynchronously retrieves a list of all available achievements.
 * @returns A promise that resolves to an array of Achievement objects.
 */
export async function getAchievements(): Promise<Achievement[]> {
  // In a real app, this might be a database call.
  return Promise.resolve(mockAchievements);
}
