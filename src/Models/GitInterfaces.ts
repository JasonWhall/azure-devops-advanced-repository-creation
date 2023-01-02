import { GitPush, GitRepositoryCreateOptions } from 'azure-devops-extension-api/Git';

/**
 * Extending `GitPush` Model with optional properties.
 * Following the same pattern as azure-devops-node-api.
 * Avoids setting unncessary properties when utilising the interface.
 */
export type GitPushModel = Partial<GitPush>;

/**
 * Extending `GitRepositoryCreateOptions` Model with optional properties.
 * Following the same pattern as azure-devops-node-api.
 * Avoids setting unncessary properties when utilising the interface.
 */
export type GitRepositoryCreateOptionsModel = Partial<GitRepositoryCreateOptions>;
