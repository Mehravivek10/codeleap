import type { Timestamp } from 'firebase/firestore'; // Import Timestamp type

/**
 * Defines the possible status values for a user's progress on a problem.
 */
export type ProblemStatus = 'Solved' | 'Attempted' | 'Todo';

/**
 * Represents the detailed status of a single problem, potentially including timestamps.
 */
export interface ProblemStatusDetail {
    status: ProblemStatus;
    solvedAt?: Timestamp | null; // Timestamp when the problem was solved
    lastAttemptedAt?: Timestamp | null; // Timestamp of the last attempt
}


/**
 * Represents the user's progress on various problems.
 * The key is the problem slug.
 * The value can be either just the status string (legacy/simple)
 * or a ProblemStatusDetail object for more detailed tracking.
 */
export interface UserProblemStatus {
  [problemSlug: string]: ProblemStatus | ProblemStatusDetail;
}

// You can add more shared types here as your application grows.
// For example, types related to user profiles, submissions, etc.

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    // Add any other profile fields you might store, e.g., solved count, preferences
    solvedCount?: number;
    attemptedCount?: number;
}

/**
 * Represents the structure of a submission document in Firestore.
 */
export interface Submission {
    id?: string; // Optional Firestore document ID (usually added after retrieval)
    userId: string;
    problemSlug: string;
    problemTitle: string;
    language: string;
    code: string; // Consider security implications
    // Use more specific status types if available from your execution engine
    status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Memory Limit Exceeded' | 'Compilation Error' | 'Pending' | 'Running';
    submittedAt: Timestamp; // Use Firestore Timestamp for server-side consistency
    runtime?: number | null; // in ms
    memory?: number | null; // in KB
    // Add output, error messages etc. if needed from execution engine
    output?: string | null;
    error?: string | null;
    testCasesPassed?: number | null;
    totalTestCases?: number | null;
}
