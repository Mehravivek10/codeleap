// src/services/discussions.ts
import { slugify } from '@/lib/utils';

/**
 * Represents a high-level discussion topic.
 */
export interface DiscussionTopic {
  /** The title of the topic. */
  title: string;
  /** A URL-friendly slug for the topic. */
  slug: string;
  /** A short description of the topic. */
  description: string;
  /** Related tags. */
  tags?: string[];
  /** Optional Lucide icon name. */
  icon?: string;
}

const mockTopics: DiscussionTopic[] = [
  {
    title: 'System Design',
    slug: slugify('System Design'),
    description: 'Discuss scalability, architecture, and design patterns for large-scale systems like TinyURL, Twitter, etc.',
    tags: ['Scalability', 'Databases', 'API Design'],
    icon: 'MessageSquare',
  },
  {
    title: 'Behavioral Questions',
    slug: slugify('Behavioral Questions'),
    description: "Prepare for non-technical interviews. Share your stories and learn how to use the STAR method.",
    tags: ['STAR Method', 'Leadership', 'Teamwork'],
    icon: 'Users',
  },
  {
    title: 'Career Growth',
    slug: slugify('Career Growth'),
    description: 'Talk about promotions, salary negotiations, changing roles, and long-term career planning in tech.',
    tags: ['Negotiation', 'Resume', 'Promotions'],
    icon: 'TrendingUp',
  },
  {
    title: 'Algorithm Deep Dive',
    slug: slugify('Algorithm Deep Dive'),
    description: 'Go beyond the basics. Discuss time/space complexity, trade-offs, and advanced algorithms.',
    tags: ['Big O', 'Complexity', 'Optimization'],
    icon: 'MessageSquare',
  },
  {
    title: 'Interview Experiences',
    slug: slugify('Interview Experiences'),
    description: 'Share your recent interview experiences with different companies. What was the process like? What questions were asked?',
    tags: ['FAANG', 'Startups', 'On-site'],
    icon: 'Users',
  },
   {
    title: 'Tech Stacks & Trends',
    slug: slugify('Tech Stacks & Trends'),
    description: 'Discuss the pros and cons of different technologies, frameworks, and upcoming trends in the industry.',
    tags: ['React', 'Go', 'AI/ML', 'Cloud'],
    icon: 'TrendingUp',
  },
];


/**
 * Asynchronously retrieves a list of all discussion topics.
 * @returns A promise that resolves to an array of DiscussionTopic objects.
 */
export async function getDiscussionTopics(): Promise<DiscussionTopic[]> {
  // In a real app, this would likely come from a database.
  return Promise.resolve(mockTopics);
}
