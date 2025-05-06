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
   /**
    * Category of the problem (e.g., Recursion, Interview).
    */
   category?: string;
   /**
    * List of companies known to ask this question (optional).
    */
   companies?: string[];
}

// Mock data with slugs and additional details
const mockProblems: Problem[] = [
  // Existing Problems (Add category/companies)
  {
    title: 'Two Sum',
    difficulty: 'Easy',
    statement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    slug: slugify('Two Sum'),
    acceptance: '50.5%',
    tags: ['Array', 'Hash Table'],
    category: 'Interview',
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple'],
  },
  {
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    statement: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    slug: slugify('Reverse Linked List'),
    acceptance: '75.2%',
    tags: ['Linked List', 'Recursion'],
    category: 'Recursion',
    companies: ['Amazon', 'Microsoft', 'Adobe'],
  },
  {
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    statement: 'Given a string s, return the longest palindromic substring in s.',
    slug: slugify('Longest Palindromic Substring'),
    acceptance: '33.1%',
    tags: ['String', 'Dynamic Programming'],
    category: 'Interview',
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
  },
  {
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    statement: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    slug: slugify('Median of Two Sorted Arrays'),
    acceptance: '39.8%',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    category: 'Interview',
    companies: ['Google', 'Amazon', 'Apple', 'Adobe', 'Microsoft'],
  },
  {
    title: 'Container With Most Water',
    difficulty: 'Medium',
    statement: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    slug: slugify('Container With Most Water'),
    acceptance: '55.3%',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    category: 'Interview',
    companies: ['Amazon', 'Google', 'Bloomberg'],
  },
  {
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    statement: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
    slug: slugify('Merge Two Sorted Lists'),
    acceptance: '63.0%',
    tags: ['Linked List', 'Recursion'],
    category: 'Recursion',
    companies: ['Amazon', 'Microsoft', 'Apple'],
  },
   {
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    statement: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.',
    slug: slugify('Valid Parentheses'),
    acceptance: '41.2%',
    tags: ['String', 'Stack'],
    category: 'Interview',
    companies: ['Facebook', 'Amazon', 'Google', 'Microsoft', 'Bloomberg'],
  },
  {
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    statement: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
    slug: slugify('Generate Parentheses'),
    acceptance: '73.5%',
    tags: ['String', 'Dynamic Programming', 'Backtracking', 'Recursion'],
    category: 'Recursion',
    companies: ['Google', 'Amazon', 'Uber'],
  },
   {
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    statement: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    slug: slugify('Trapping Rain Water'),
    acceptance: '61.9%',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
    category: 'Interview',
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Bloomberg'],
  },

  // New Problems (Recursion & Interview Focus)
  {
    title: 'Fibonacci Number',
    difficulty: 'Easy',
    statement: 'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is, F(0) = 0, F(1) = 1, F(n) = F(n - 1) + F(n - 2), for n > 1. Given n, calculate F(n).',
    slug: slugify('Fibonacci Number'),
    acceptance: '70.1%',
    tags: ['Recursion', 'Math', 'Dynamic Programming', 'Memoization'],
    category: 'Recursion',
    companies: ['Adobe', 'Apple'],
  },
   {
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    statement: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    slug: slugify('Climbing Stairs'),
    acceptance: '52.8%',
    tags: ['Math', 'Dynamic Programming', 'Recursion', 'Memoization'],
    category: 'Interview',
    companies: ['Amazon', 'Apple', 'Adobe'],
  },
  {
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    statement: 'There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length). Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. You must write an algorithm with O(log n) runtime complexity.',
    slug: slugify('Search in Rotated Sorted Array'),
    acceptance: '40.1%',
    tags: ['Array', 'Binary Search'],
    category: 'Interview',
    companies: ['Facebook', 'Amazon', 'Microsoft', 'Bloomberg', 'Google'],
  },
  {
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Medium',
    statement: 'Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.',
    slug: slugify('Kth Smallest Element in a BST'),
    acceptance: '72.3%',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree', 'Recursion'],
    category: 'Recursion',
    companies: ['Amazon', 'Facebook', 'Google'],
  },
  {
    title: 'Permutations',
    difficulty: 'Medium',
    statement: 'Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.',
    slug: slugify('Permutations'),
    acceptance: '77.9%',
    tags: ['Array', 'Backtracking', 'Recursion'],
    category: 'Recursion',
    companies: ['Microsoft', 'Amazon', 'Facebook', 'LinkedIn'],
  },
  {
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    statement: 'Given the root of a binary tree, return its maximum depth. A binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    slug: slugify('Maximum Depth of Binary Tree'),
    acceptance: '75.0%',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree', 'Recursion'],
    category: 'Recursion',
    companies: ['Amazon', 'Apple', 'LinkedIn'],
  },
   {
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    statement: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.',
    slug: slugify('Product of Array Except Self'),
    acceptance: '67.1%',
    tags: ['Array', 'Prefix Sum'],
    category: 'Interview',
    companies: ['Amazon', 'Facebook', 'Microsoft', 'Apple', 'Lyft'],
  },
  {
    title: 'Merge Intervals',
    difficulty: 'Medium',
    statement: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    slug: slugify('Merge Intervals'),
    acceptance: '48.0%',
    tags: ['Array', 'Sorting'],
    category: 'Interview',
    companies: ['Facebook', 'Amazon', 'Google', 'Microsoft', 'Bloomberg'],
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


/**
 * Asynchronously retrieves problems grouped by company.
 *
 * @returns A promise that resolves to an object where keys are company names
 *          and values are arrays of Problem objects associated with that company.
 */
export async function getProblemsByCompany(): Promise<Record<string, Problem[]>> {
    const problems = await getProblems();
    const problemsByCompany: Record<string, Problem[]> = {};

    problems.forEach(problem => {
        if (problem.companies && problem.companies.length > 0) {
            problem.companies.forEach(company => {
                if (!problemsByCompany[company]) {
                    problemsByCompany[company] = [];
                }
                problemsByCompany[company].push(problem);
            });
        }
    });

    // Sort company names alphabetically
    const sortedCompanies = Object.keys(problemsByCompany).sort();
    const sortedProblemsByCompany: Record<string, Problem[]> = {};
    sortedCompanies.forEach(company => {
        sortedProblemsByCompany[company] = problemsByCompany[company];
        // Optionally sort problems within each company group (e.g., by difficulty)
        sortedProblemsByCompany[company].sort((a, b) => {
             const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
             return (diffOrder[a.difficulty as keyof typeof diffOrder] || 4) - (diffOrder[b.difficulty as keyof typeof diffOrder] || 4);
        });
    });

    return sortedProblemsByCompany;
}

/**
 * Asynchronously retrieves problems grouped by category.
 *
 * @returns A promise that resolves to an object where keys are category names
 *          and values are arrays of Problem objects associated with that category.
 */
export async function getProblemsByCategory(): Promise<Record<string, Problem[]>> {
    const problems = await getProblems();
    const problemsByCategory: Record<string, Problem[]> = {};

    problems.forEach(problem => {
        const category = problem.category || 'Uncategorized'; // Default category
        if (!problemsByCategory[category]) {
            problemsByCategory[category] = [];
        }
        problemsByCategory[category].push(problem);
    });

     // Sort category names alphabetically (optional)
     const sortedCategories = Object.keys(problemsByCategory).sort();
     const sortedProblemsByCategory: Record<string, Problem[]> = {};
     sortedCategories.forEach(category => {
         sortedProblemsByCategory[category] = problemsByCategory[category];
         // Optionally sort problems within each category group (e.g., by difficulty)
          sortedProblemsByCategory[category].sort((a, b) => {
              const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
              return (diffOrder[a.difficulty as keyof typeof diffOrder] || 4) - (diffOrder[b.difficulty as keyof typeof diffOrder] || 4);
          });
     });


    return sortedProblemsByCategory;
}