import { slugify, deslugify } from '@/lib/utils';

/**
 * Represents an example test case for a problem.
 */
export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

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
   * An array of examples for the problem.
   */
  examples: Example[];
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
    examples: [
        {
            input: "nums = [2, 7, 11, 15], target = 9",
            output: "[0, 1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        {
            input: "nums = [3, 2, 4], target = 6",
            output: "[1, 2]"
        },
        {
            input: "nums = [3, 3], target = 6",
            output: "[0, 1]"
        }
    ],
    acceptance: '50.5%',
    tags: ['Array', 'Hash Table'],
    category: 'Arrays',
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple'],
  },
  {
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    statement: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    slug: slugify('Reverse Linked List'),
    examples: [
        {
            input: "head = [1,2,3,4,5]",
            output: "[5,4,3,2,1]"
        },
        {
            input: "head = [1,2]",
            output: "[2,1]"
        },
        {
            input: "head = []",
            output: "[]"
        }
    ],
    acceptance: '75.2%',
    tags: ['Linked List', 'Recursion'],
    category: 'Linked Lists',
    companies: ['Amazon', 'Microsoft', 'Adobe'],
  },
  {
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    statement: 'Given a string s, return the longest palindromic substring in s.',
    slug: slugify('Longest Palindromic Substring'),
    examples: [
        {
            input: 's = "babad"',
            output: '"bab"',
            explanation: '"aba" is also a valid answer.'
        },
        {
            input: 's = "cbbd"',
            output: '"bb"'
        }
    ],
    acceptance: '33.1%',
    tags: ['String', 'Dynamic Programming'],
    category: 'Strings',
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
  },
  {
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    statement: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    slug: slugify('Median of Two Sorted Arrays'),
    examples: [
        {
            input: "nums1 = [1,3], nums2 = [2]",
            output: "2.00000",
            explanation: "merged array = [1,2,3] and median is 2."
        },
        {
            input: "nums1 = [1,2], nums2 = [3,4]",
            output: "2.50000",
            explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
        }
    ],
    acceptance: '39.8%',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    category: 'Searching & Sorting',
    companies: ['Google', 'Amazon', 'Apple', 'Adobe', 'Microsoft'],
  },
  {
    title: 'Container With Most Water',
    difficulty: 'Medium',
    statement: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    slug: slugify('Container With Most Water'),
    examples: [
        {
            input: "height = [1,8,6,2,5,4,8,3,7]",
            output: "49",
            explanation: "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49."
        },
        {
            input: "height = [1,1]",
            output: "1"
        }
    ],
    acceptance: '55.3%',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    category: 'Arrays',
    companies: ['Amazon', 'Google', 'Bloomberg'],
  },
  {
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    statement: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
    slug: slugify('Merge Two Sorted Lists'),
    examples: [
        {
            input: "list1 = [1,2,4], list2 = [1,3,4]",
            output: "[1,1,2,3,4,4]"
        },
        {
            input: "list1 = [], list2 = []",
            output: "[]"
        },
        {
            input: "list1 = [], list2 = [0]",
            output: "[0]"
        }
    ],
    acceptance: '63.0%',
    tags: ['Linked List', 'Recursion'],
    category: 'Linked Lists',
    companies: ['Amazon', 'Microsoft', 'Apple'],
  },
   {
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    statement: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.',
    slug: slugify('Valid Parentheses'),
    examples: [
        {
            input: 's = "()"',
            output: "true"
        },
        {
            input: 's = "()[]{}"',
            output: "true"
        },
        {
            input: 's = "(]"',
            output: "false"
        }
    ],
    acceptance: '41.2%',
    tags: ['String', 'Stack'],
    category: 'Stacks & Queues',
    companies: ['Facebook', 'Amazon', 'Google', 'Microsoft', 'Bloomberg'],
  },
  {
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    statement: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
    slug: slugify('Generate Parentheses'),
    examples: [
        {
            input: "n = 3",
            output: '["((()))","(()())","(())()","()(())","()()()"]'
        },
        {
            input: "n = 1",
            output: '["()"]'
        }
    ],
    acceptance: '73.5%',
    tags: ['String', 'Dynamic Programming', 'Backtracking', 'Recursion'],
    category: 'Backtracking',
    companies: ['Google', 'Amazon', 'Uber'],
  },
   {
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    statement: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    slug: slugify('Trapping Rain Water'),
    examples: [
        {
            input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
            output: "6",
            explanation: "The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped."
        },
        {
            input: "height = [4,2,0,3,2,5]",
            output: "9"
        }
    ],
    acceptance: '61.9%',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
    category: 'Arrays',
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Bloomberg'],
  },
  {
    title: 'Fibonacci Number',
    difficulty: 'Easy',
    statement: 'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is, F(0) = 0, F(1) = 1, F(n) = F(n - 1) + F(n - 2), for n > 1. Given n, calculate F(n).',
    slug: slugify('Fibonacci Number'),
    examples: [
        {
            input: "n = 2",
            output: "1",
            explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1."
        },
        {
            input: "n = 3",
            output: "2",
            explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2."
        },
        {
            input: "n = 4",
            output: "3",
            explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3."
        }
    ],
    acceptance: '70.1%',
    tags: ['Recursion', 'Math', 'Dynamic Programming', 'Memoization'],
    category: 'Dynamic Programming',
    companies: ['Adobe', 'Apple'],
  },
   {
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    statement: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    slug: slugify('Climbing Stairs'),
    examples: [
        {
            input: "n = 2",
            output: "2",
            explanation: "There are two ways to climb to the top. 1. 1 step + 1 step 2. 2 steps"
        },
        {
            input: "n = 3",
            output: "3",
            explanation: "There are three ways to climb to the top. 1. 1 step + 1 step + 1 step 2. 1 step + 2 steps 3. 2 steps + 1 step"
        }
    ],
    acceptance: '52.8%',
    tags: ['Math', 'Dynamic Programming', 'Recursion', 'Memoization'],
    category: 'Interview Prep',
    companies: ['Amazon', 'Apple', 'Adobe'],
  },
  {
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    statement: 'There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length). Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. You must write an algorithm with O(log n) runtime complexity.',
    slug: slugify('Search in Rotated Sorted Array'),
    examples: [
        {
            input: "nums = [4,5,6,7,0,1,2], target = 0",
            output: "4"
        },
        {
            input: "nums = [4,5,6,7,0,1,2], target = 3",
            output: "-1"
        },
        {
            input: "nums = [1], target = 0",
            output: "-1"
        }
    ],
    acceptance: '40.1%',
    tags: ['Array', 'Binary Search'],
    category: 'Interview Prep',
    companies: ['Facebook', 'Amazon', 'Microsoft', 'Bloomberg', 'Google'],
  },
  {
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Medium',
    statement: 'Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.',
    slug: slugify('Kth Smallest Element in a BST'),
    examples: [
        {
            input: "root = [3,1,4,null,2], k = 1",
            output: "1"
        },
        {
            input: "root = [5,3,6,2,4,null,null,1], k = 3",
            output: "3"
        }
    ],
    acceptance: '72.3%',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree', 'Recursion'],
    category: 'Trees',
    companies: ['Amazon', 'Facebook', 'Google'],
  },
  {
    title: 'Permutations',
    difficulty: 'Medium',
    statement: 'Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.',
    slug: slugify('Permutations'),
    examples: [
        {
            input: "nums = [1,2,3]",
            output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"
        },
        {
            input: "nums = [0,1]",
            output: "[[0,1],[1,0]]"
        },
        {
            input: "nums = [1]",
            output: "[[1]]"
        }
    ],
    acceptance: '77.9%',
    tags: ['Array', 'Backtracking', 'Recursion'],
    category: 'Backtracking',
    companies: ['Microsoft', 'Amazon', 'Facebook', 'LinkedIn'],
  },
  {
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    statement: 'Given the root of a binary tree, return its maximum depth. A binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    slug: slugify('Maximum Depth of Binary Tree'),
    examples: [
        {
            input: "root = [3,9,20,null,null,15,7]",
            output: "3"
        },
        {
            input: "root = [1,null,2]",
            output: "2"
        }
    ],
    acceptance: '75.0%',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree', 'Recursion'],
    category: 'Trees',
    companies: ['Amazon', 'Apple', 'LinkedIn'],
  },
   {
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    statement: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.',
    slug: slugify('Product of Array Except Self'),
    examples: [
        {
            input: "nums = [1,2,3,4]",
            output: "[24,12,8,6]"
        },
        {
            input: "nums = [-1,1,0,-3,3]",
            output: "[0,0,9,0,0]"
        }
    ],
    acceptance: '67.1%',
    tags: ['Array', 'Prefix Sum'],
    category: 'Interview Prep',
    companies: ['Amazon', 'Facebook', 'Microsoft', 'Apple', 'Lyft'],
  },
  {
    title: 'Merge Intervals',
    difficulty: 'Medium',
    statement: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    slug: slugify('Merge Intervals'),
    examples: [
        {
            input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
            output: "[[1,6],[8,10],[15,18]]",
            explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
        },
        {
            input: "intervals = [[1,4],[4,5]]",
            output: "[[1,5]]",
            explanation: "Intervals [1,4] and [4,5] are considered overlapping."
        }
    ],
    acceptance: '48.0%',
    tags: ['Array', 'Sorting'],
    category: 'Interview Prep',
    companies: ['Facebook', 'Amazon', 'Google', 'Microsoft', 'Bloomberg'],
  },
  {
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    statement: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
    slug: slugify('Binary Tree Inorder Traversal'),
    examples: [
      {
        input: 'root = [1,null,2,3]',
        output: '[1,3,2]',
        explanation: '1 is the root node, followed by its right child 2, which has a left child 3.'
      },
      {
        input: 'root = []',
        output: '[]',
        explanation: 'An empty tree has no nodes to traverse.'
      },
      {
        input: 'root = [1]',
        output: '[1]',
        explanation: 'A single node tree returns just that node.'
      }
    ],
    acceptance: '70.2%',
    tags: ['Tree', 'Stack', 'Depth-First Search'],
    category: 'Recursion',
    companies: ['Amazon', 'Bloomberg']
  },
  {
    title: '3Sum',
    difficulty: 'Medium',
    statement: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    slug: slugify('3Sum'),
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'These are the unique triplets that sum up to 0.'
      },
      {
        input: 'nums = [0,1,1]',
        output: '[]',
        explanation: 'No triplet sums up to 0.'
      },
      {
        input: 'nums = [0,0,0]',
        output: '[[0,0,0]]',
        explanation: 'The only possible triplet sums up to 0.'
      }
    ],
    acceptance: '35.4%',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    category: 'Interview',
    companies: ['Facebook', 'Amazon', 'Google']
  },
  {
    title: 'Group Anagrams',
    difficulty: 'Medium',
    statement: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    slug: slugify('Group Anagrams'),
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: 'The anagrams are grouped by their character counts.'
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
        explanation: 'A single empty string is its own anagram group.'
      },
      {
        input: 'strs = ["a"]',
        output: '[["a"]]',
        explanation: 'A single character is its own anagram group.'
      }
    ],
    acceptance: '67.5%',
    tags: ['Hash Table', 'String', 'Sorting'],
    category: 'Interview',
    companies: ['Amazon', 'Airbnb']
  },
  {
    title: 'LRU Cache',
    difficulty: 'Medium',
    statement: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
    slug: slugify('LRU Cache'),
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
        explanation: 'LRUCache lRUCache = new LRUCache(2);\n' +
          'lRUCache.put(1, 1); // cache is {1=1}\n' +
          'lRUCache.put(2, 2); // cache is {1=1, 2=2}\n' +
          'lRUCache.get(1);    // return 1\n' +
          'lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\n' +
          'lRUCache.get(2);    // returns -1 (not found)\n' +
          'lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\n' +
          'lRUCache.get(1);    // return -1 (not found)\n' +
          'lRUCache.get(3);    // return 3\n' +
          'lRUCache.get(4);    // return 4'
      }
    ],
    acceptance: '41.9%',
    tags: ['Hash Table', 'Linked List', 'Design'],
    category: 'Design',
    companies: ['Facebook', 'Amazon', 'Google']
  },
  {
    title: 'Word Break',
    difficulty: 'Medium',
    statement: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
    slug: slugify('Word Break'),
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: 'true',
        explanation: 'Return true because "leetcode" can be segmented as "leet code".'
      },
      {
        input: 's = "applepenapple", wordDict = ["apple","pen"]',
        output: 'true',
        explanation: 'Return true because "applepenapple" can be segmented as "apple pen apple".'
      },
      {
        input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
        output: 'false',
        explanation: 'No combination of words from the dictionary can form the string.'
      }
    ],
    acceptance: '45.8%',
    tags: ['Hash Table', 'String', 'Dynamic Programming', 'Trie', 'Memoization'],
    category: 'Dynamic Programming',
    companies: ['Facebook', 'Amazon', 'Google']
  },
  {
    title: 'Course Schedule',
    difficulty: 'Medium',
    statement: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses-1. Some courses may have prerequisites. Determine if you can finish all courses.',
    slug: slugify('Course Schedule'),
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: 'true',
        explanation: 'There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible.'
      },
      {
        input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        output: 'false',
        explanation: 'There are a total of 2 courses to take. To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.'
      },
      {
        input: 'numCourses = 3, prerequisites = [[1,0],[2,1]]',
        output: 'true',
        explanation: 'You can finish all courses in order: 0 -> 1 -> 2.'
      }
    ],
    acceptance: '47.6%',
    tags: ['Graph', 'Topological Sort', 'Depth-First Search', 'Breadth-First Search'],
    category: 'Graph',
    companies: ['Google', 'Amazon']
  },
  {
    title: 'LRU Cache',
    difficulty: 'Medium',
    statement: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class.',
    slug: slugify('LRU Cache'),
    examples: [
        {
            input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
            output: "[null, null, null, 1, null, -1, null, -1, 3, 4]",
            explanation: "LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache is {1=1}\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4"
        }
    ],
    acceptance: '42.5%',
    tags: ['Hash Table', 'Linked List', 'Design'],
    category: 'Interview Prep',
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Bloomberg'],
  },
  {
    title: 'System Design: TinyURL',
    difficulty: 'Medium',
    statement: 'Design a system like TinyURL, a URL shortening service where a user can enter a URL and get a much shorter, unique URL.',
    slug: slugify('System Design TinyURL'),
    examples: [],
    acceptance: 'N/A',
    tags: ['System Design'],
    category: 'Discussion', // This is a discussion topic, not a coding problem for badges
    companies: ['Google', 'Amazon', 'Facebook', 'Uber'],
  },
  {
    title: 'Number of Islands',
    difficulty: 'Medium',
    statement: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.',
    slug: slugify('Number of Islands'),
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: '1',
        explanation: 'There is only one island in the grid.'
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: '3',
        explanation: 'There are three islands in the grid.'
      }
    ],
    acceptance: '64.1%',
    tags: ['Depth-First Search', 'Breadth-First Search', 'Union Find'],
    category: 'Graph',
    companies: ['Amazon', 'Microsoft', 'Facebook']
  },
  {
    title: 'Alien Dictionary',
    difficulty: 'Hard',
    statement: 'There is a new alien language that uses the English alphabet. However, the order among letters is unknown. Given a list of words from the alien language, derive its alphabet order.',
    slug: slugify('Alien Dictionary'),
    acceptance: '33.3%',
    tags: ['Graph', 'Topological Sort'],
    category: 'Graph',
    companies: ['Facebook', 'Google'],
    examples: [
        {
            input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
            output: "1"
        },
        {
            input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
            output: "3"
        }
    ]
  },
  {
    title: 'Course Schedule',
    difficulty: 'Medium',
    statement: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.',
    slug: slugify('Course Schedule'),
    examples: [
        {
            input: "numCourses = 2, prerequisites = [[1,0]]",
            output: "true",
            explanation: "There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible."
        },
        {
            input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
            output: "false",
            explanation: "There are a total of 2 courses to take. To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible."
        }
    ],
    acceptance: '47.1%',
    tags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
    category: 'Interview Prep',
    companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
  },
  {
    title: 'Word Ladder',
    difficulty: 'Hard',
    statement: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter, and every si is in wordList. Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence, or 0 if no such sequence exists.',
    slug: slugify('Word Ladder'),
    examples: [
        {
            input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
            output: "5",
            explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.'
        },
        {
            input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]',
            output: "0",
            explanation: 'The endWord "cog" is not in wordList, therefore no transformation is possible.'
        }
    ],
    acceptance: '38.2%',
    tags: ['Hash Table', 'String', 'Breadth-First Search'],
    category: 'Interview Prep',
    companies: ['Amazon', 'Google', 'Facebook', 'LinkedIn'],
  },
  {
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    statement: 'Design an algorithm to serialize and deserialize a binary tree.',
    slug: slugify('Serialize and Deserialize Binary Tree'),
    acceptance: '55.8%',
    tags: ['Tree', 'Design', 'Depth-First Search', 'Breadth-First Search'],
    category: 'Design',
    companies: ['Facebook', 'Amazon'],
    examples: [
      {
        input: 'root = [1,2,3,null,null,4,5]',
        output: '[1,2,3,null,null,4,5]',
        explanation: 'The binary tree is serialized and then deserialized back to the same structure.'
      }
    ]
  },
  {
    title: 'Coin Change',
    difficulty: 'Medium',
    statement: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins needed to make up that amount.',
    slug: slugify('Coin Change'),
    acceptance: '42.7%',
    tags: ['Dynamic Programming'],
    category: 'Interview',
    companies: ['Amazon', 'Microsoft'],
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1'
      }
    ]
  },
  {
    title: 'Edit Distance',
    difficulty: 'Hard',
    statement: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.',
    slug: slugify('Edit Distance'),
    acceptance: '58.1%',
    tags: ['Dynamic Programming', 'String'],
    category: 'Interview',
    companies: ['Google', 'Facebook'],
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: '3',
        explanation: 'horse -> rorse (replace h with r)\nrorse -> rose (remove r)\nrose -> ros (remove e)'
      }
    ]
  },
  {
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    statement: 'A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.',
    slug: slugify('Implement Trie (Prefix Tree)'),
    acceptance: '61.2%',
    tags: ['Design', 'Trie'],
    category: 'Design',
    companies: ['Google', 'Amazon'],
    examples: [
      {
        input: '["Trie", "insert", "search", "search", "startsWith", "insert", "search"]\n[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]',
        output: '[null, null, true, false, true, null, true]',
        explanation: 'Trie trie = new Trie();\ntrie.insert("apple");\ntrie.search("apple");   // return True\ntrie.search("app");     // return False\ntrie.startsWith("app"); // return True\ntrie.insert("app");\ntrie.search("app");     // return True'
      }
    ]
  },
  {
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    statement: 'The median is the middle value in an ordered integer list. Implement a data structure that supports adding numbers and finding the median efficiently.',
    slug: slugify('Find Median from Data Stream'),
    acceptance: '50.0%',
    tags: ['Two Heaps', 'Design'],
    category: 'Design',
    companies: ['Google', 'Uber'],
    examples: [
      {
        input: '["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]\n[[], [1], [2], [], [3], []]',
        output: '[null, null, null, 1.5, null, 2.0]',
        explanation: 'MedianFinder medianFinder = new MedianFinder();\nmedianFinder.addNum(1);    // arr = [1]\nmedianFinder.addNum(2);    // arr = [1, 2]\nmedianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)\nmedianFinder.addNum(3);    // arr[1, 2, 3]\nmedianFinder.findMedian(); // return 2.0'
      }
    ]
  },
  {
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    statement: 'You are given an array of integers nums, and there is a sliding window of size k which moves from the very left of the array to the very right. Return the maximum value in each window.',
    slug: slugify('Sliding Window Maximum'),
    acceptance: '45.2%',
    tags: ['Monotonic Queue', 'Deque', 'Sliding Window'],
    category: 'Interview',
    companies: ['Amazon', 'Facebook'],
    examples: [
      {
        input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
        output: '[3,3,5,5,6,7]',
        explanation: 'Window position                Max\n---------------               -----\n[1  3  -1] -3  5  3  6  7       3\n 1 [3  -1  -3] 5  3  6  7       3\n 1  3 [-1  -3  5] 3  6  7       5\n 1  3  -1 [-3  5  3] 6  7       5\n 1  3  -1  -3 [5  3  6] 7       6\n 1  3  -1  -3  5 [3  6  7]      7'
      }
    ]
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    statement: 'Given a string s, find the length of the longest substring without repeating characters.',
    slug: slugify('Longest Substring Without Repeating Characters'),
    acceptance: '33.0%',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    category: 'Interview',
    companies: ['Amazon', 'Google'],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ]
  },
  {
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    statement: 'Given two strings s and t, return the minimum window substring of s such that every character in t is included in the window.',
    slug: slugify('Minimum Window Substring'),
    acceptance: '40.1%',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    category: 'Interview',
    companies: ['Facebook', 'Amazon'],
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: 'The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.'
      },
      {
        input: 's = "a", t = "a"',
        output: '"a"',
        explanation: 'The entire string s is the minimum window.'
      },
      {
        input: 's = "a", t = "aa"',
        output: '""',
        explanation: 'Both \'a\'s from t must be included in the window. Since there is only one \'a\' in s, return empty string.'
      }
    ]
  },
  {
    title: 'K Closest Points to Origin',
    difficulty: 'Medium',
    statement: 'Given an array of points where points[i] = [xi, yi] and an integer k, return the k closest points to the origin.',
    examples: [
      {
        input: 'points = [[1,3],[-2,2]], k = 1',
        output: '[[-2,2]]',
        explanation: 'The distance between (1, 3) and the origin is sqrt(10). The distance between (-2, 2) and the origin is sqrt(8). Since sqrt(8) < sqrt(10), (-2, 2) is closer to the origin. We only want the closest k = 1 points from the origin, so the answer is just [[-2,2]].'
      },
      {
        input: 'points = [[3,3],[5,-1],[-2,4]], k = 2',
        output: '[[3,3],[-2,4]]',
        explanation: 'The answer [[-2,4],[3,3]] would also be accepted.'
      }
    ],
    slug: slugify('K Closest Points to Origin'),
    acceptance: '65.0%',
    tags: ['Divide and Conquer', 'Quickselect', 'Heap'],
    category: 'Interview',
    companies: ['Google', 'Uber']
  },
  {
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    statement: 'Given an integer array nums and an integer k, return the k most frequent elements.',
    slug: slugify('Top K Frequent Elements'),
    acceptance: '63.4%',
    tags: ['Hash Table', 'Heap', 'Bucket Sort'],
    category: 'Interview',
    companies: ['Facebook', 'Amazon'],
    examples: [
      {
        input: 'nums = [1,1,1,2,2,3], k = 2',
        output: '[1,2]',
        explanation: '1 and 2 are the two most frequent elements.'
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]',
        explanation: 'The only element is the most frequent.'
      }
    ]
  },
  {
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    statement: 'You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.',
    slug: slugify('Add Two Numbers'),
    acceptance: '42.0%',
    tags: ['Linked List', 'Math'],
    category: 'Interview',
    companies: ['Amazon', 'Microsoft'],
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.'
      },
      {
        input: 'l1 = [0], l2 = [0]',
        output: '[0]'
      }
    ]
  },
  {
    title: 'Rotate Image',
    difficulty: 'Medium',
    statement: 'You are given an n x n 2D matrix representing an image. Rotate the image by 90 degrees (clockwise).',
    slug: slugify('Rotate Image'),
    acceptance: '71.4%',
    tags: ['Array', 'Matrix'],
    category: 'Interview',
    companies: ['Amazon', 'Microsoft'],
    examples: [
      {
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '[[7,4,1],[8,5,2],[9,6,3]]',
        explanation: 'The matrix was rotated 90 degrees clockwise.'
      },
      {
        input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]',
        output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]'
      }
    ]
  },
  {
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    statement: 'Given an m x n matrix, return all elements of the matrix in spiral order.',
    examples: [
      {
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '[1,2,3,6,9,8,7,4,5]',
        explanation: 'The matrix is traversed in a spiral order: 1→2→3→6→9→8→7→4→5.'
      },
      {
        input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]',
        output: '[1,2,3,4,8,12,11,10,9,5,6,7]',
        explanation: 'The matrix is traversed in a spiral order: 1→2→3→4→8→12→11→10→9→5→6→7.'
      }
    ],
    slug: slugify('Spiral Matrix'),
    acceptance: '43.1%',
    tags: ['Matrix', 'Simulation'],
    category: 'Interview',
    companies: ['Amazon']
  },
  {
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'Medium',
    statement: 'There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. Given a matrix of heights, return the list of coordinates that can flow to both oceans.',
    slug: slugify('Pacific Atlantic Water Flow'),
    examples: [
      {
        input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',
        output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]',
        explanation: 'The following cells can flow to both Pacific and Atlantic oceans.'
      },
      {
        input: 'heights = [[2,1],[1,2]]',
        output: '[[0,0],[0,1],[1,0],[1,1]]',
        explanation: 'All cells can flow to both oceans.'
      }
    ],
    acceptance: '55.0%',
    tags: ['Depth-First Search', 'Breadth-First Search', 'Matrix'],
    category: 'Graph',
    companies: ['Google']
  },
  {
    title: 'House Robber',
    difficulty: 'Medium',
    statement: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money. Return the maximum amount of money you can rob tonight without alerting the police.',
    slug: slugify('House Robber'),
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: '4',
        explanation: 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4.'
      },
      {
        input: 'nums = [2,7,9,3,1]',
        output: '12',
        explanation: 'Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1). Total amount you can rob = 2 + 9 + 1 = 12.'
      }
    ],
    acceptance: '50.8%',
    tags: ['Dynamic Programming'],
    category: 'Interview',
    companies: ['Amazon']
  },
  {
    title: 'House Robber II',
    difficulty: 'Medium',
    statement: 'Similar to House Robber, but houses are arranged in a circle. The first and last houses are now neighbors and cannot be robbed together.',
    slug: slugify('House Robber II'),
    examples: [
      {
        input: 'nums = [2,3,2]',
        output: '3',
        explanation: 'You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent. Rob house 2 (money = 3) instead.'
      },
      {
        input: 'nums = [1,2,3,1]',
        output: '4',
        explanation: 'Rob house 2 (money = 2) and house 4 (money = 2). Total amount you can rob = 2 + 2 = 4.'
      }
    ],
    acceptance: '44.0%',
    tags: ['Dynamic Programming'],
    category: 'Interview',
    companies: ['Amazon']
  },
  {
    title: 'Decode Ways',
    difficulty: 'Medium',
    statement: 'A message containing letters from A-Z can be encoded into numbers using the mapping A->1, B->2, ..., Z->26. Given a string s, return the number of ways to decode it.',
    slug: slugify('Decode Ways'),
    examples: [
      {
        input: 's = "12"',
        output: '2',
        explanation: 'It could be decoded as "AB" (1 2) or "L" (12).'
      },
      {
        input: 's = "226"',
        output: '3',
        explanation: 'It could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).'
      },
      {
        input: 's = "06"',
        output: '0',
        explanation: 'Cannot map "06" to "F" because of the leading zero.'
      }
    ],
    acceptance: '29.1%',
    tags: ['Dynamic Programming', 'String'],
    category: 'Interview',
    companies: ['Facebook']
  },
  {
    title: 'Binary Search',
    difficulty: 'Easy',
    statement: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.',
    slug: slugify('Binary Search'),
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.'
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1.'
      }
    ],
    acceptance: '58.2%',
    tags: ['Binary Search', 'Array'],
    category: 'Fundamentals',
    companies: ['General']
  },
  {
    title: 'First Bad Version',
    difficulty: 'Easy',
    statement: 'You are a product manager and currently leading a team to develop a new product. Find the first bad version given an API isBadVersion.',
    slug: slugify('First Bad Version'),
    examples: [
      {
        input: 'n = 5, bad = 4',
        output: '4',
        explanation: 'call isBadVersion(3) -> false, call isBadVersion(5) -> true, call isBadVersion(4) -> true. Then 4 is the first bad version.'
      },
      {
        input: 'n = 1, bad = 1',
        output: '1',
        explanation: 'The first version is already bad.'
      }
    ],
    acceptance: '40.0%',
    tags: ['Binary Search'],
    category: 'Fundamentals',
    companies: ['General']
  },
  {
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    statement: 'You are given an m x n integer matrix matrix with the following two properties: Each row is sorted in non-decreasing order. The first integer of each row is greater than the last integer of the previous row.',
    slug: slugify('Search a 2D Matrix'),
    examples: [
      {
        input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3',
        output: 'true',
        explanation: '3 is found at position [0,1] in the matrix.'
      },
      {
        input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13',
        output: 'false',
        explanation: '13 is not found in the matrix.'
      }
    ],
    acceptance: '47.0%',
    tags: ['Binary Search', 'Matrix'],
    category: 'Interview',
    companies: ['Facebook']
  },
  {
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    statement: 'Given an integer array nums and an integer k, return the kth largest element in the array.',
    slug: slugify('Kth Largest Element in an Array'),
    acceptance: '63.9%',
    tags: ['Heap', 'Quickselect'],
    category: 'Interview',
    companies: ['Amazon'],
    examples: [
      {
        input: 'nums = [3,2,1,5,6,4], k = 2',
        output: '5',
        explanation: 'The sorted array is [1,2,3,4,5,6], so the second largest element is 5.'
      },
      {
        input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4',
        output: '4',
        explanation: 'The sorted array is [1,2,2,3,3,4,5,5,6], so the fourth largest element is 4.'
      }
    ]
  },
  {
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    statement: 'Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment. Design an algorithm to serialize and deserialize a binary tree.',
    slug: slugify('Serialize and Deserialize Binary Tree'),
    examples: [
      {
        input: "root = [1,2,3,null,null,4,5]",
        output: "[1,2,3,null,null,4,5]",
        explanation: "You may serialize the following tree:\n\n    1\n   / \\\n  2   3\n     / \\\n    4   5\n\nas '[1,2,3,null,null,4,5]'"
      }
    ],
    category: 'Discussion', // This is a discussion topic
    companies: ['Google', 'Facebook', 'Amazon', 'Microsoft', 'LinkedIn'],
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
