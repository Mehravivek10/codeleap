import { slugify, deslugify } from '@/lib/utils';

/**
 * Represents a coding problem with its title, difficulty, statement, and slug.
 */
export interface Problem {
  /**
   * The title of the coding problem.
   */
  title: string;
  /**
   * The difficulty level of the problem (e.g., Easy, Medium, Hard).
   */
  difficulty: string;
  /**
   * The problem statement.
   */
  statement: string;
  /**
   * A URL-friendly slug generated from the title.
   */
  slug: string;
  /**
   * Acceptance rate (optional).
   */
  acceptance?: string;
   /**
   * Topic tags (optional).
   */
   tags?: string[];
}

// Mock data with slugs and additional details
const mockProblems: Problem[] = [
  {
    title: 'Two Sum',
    difficulty: 'Easy',
    statement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    slug: slugify('Two Sum'),
    acceptance: '50.5%',
    tags: ['Array', 'Hash Table'],
  },
  {
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    statement: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    slug: slugify('Reverse Linked List'),
    acceptance: '75.2%',
    tags: ['Linked List', 'Recursion'],
  },
  {
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    statement: 'Given a string s, return the longest palindromic substring in s.',
    slug: slugify('Longest Palindromic Substring'),
    acceptance: '33.1%',
    tags: ['String', 'Dynamic Programming'],
  },
  {
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    statement: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    slug: slugify('Median of Two Sorted Arrays'),
    acceptance: '39.8%',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
  },
  {
    title: 'Container With Most Water',
    difficulty: 'Medium',
    statement: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    slug: slugify('Container With Most Water'),
    acceptance: '55.3%',
    tags: ['Array', 'Two Pointers', 'Greedy'],
  },
  {
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    statement: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
    slug: slugify('Merge Two Sorted Lists'),
    acceptance: '63.0%',
    tags: ['Linked List', 'Recursion'],
  },
   {
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    statement: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.',
    slug: slugify('Valid Parentheses'),
    acceptance: '41.2%',
    tags: ['String', 'Stack'],
  },
  {
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    statement: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
    slug: slugify('Generate Parentheses'),
    acceptance: '73.5%',
    tags: ['String', 'Dynamic Programming', 'Backtracking'],
  },
   {
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    statement: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    slug: slugify('Trapping Rain Water'),
    acceptance: '61.9%',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
  }
];

/**
 * Asynchronously retrieves a list of coding problems.
 *
 * @returns A promise that resolves to an array of Problem objects.
 */
export async function getProblems(): Promise<Problem[]> {
  // Simulate API call delay
  // await new Promise(resolve => setTimeout(resolve, 500));
  return mockProblems;
}

/**
 * Asynchronously retrieves a single coding problem by its slug.
 *
 * @param slug The URL-friendly slug of the problem.
 * @returns A promise that resolves to the Problem object or undefined if not found.
 */
export async function getProblemBySlug(slug: string): Promise<Problem | undefined> {
  // Simulate API call delay
  // await new Promise(resolve => setTimeout(resolve, 200));
  // In a real app, you would fetch based on the slug or derive the title/ID from it
  const problem = mockProblems.find((p) => p.slug === slug);
  return problem;
}
