import {
  SecurityNamespaceDescription,
  AccessControlEntry,
  AccessControlList,
  GitContributor,
} from '../Interfaces';
import { getClient } from 'azure-devops-extension-api';
import { RestClientBase } from 'azure-devops-extension-api/Common/RestClientBase';
import { GitPush, GitRepository, GitRepositoryCreateOptions } from 'azure-devops-extension-api/Git';
import {
  GraphGroup,
  GraphGroupVstsCreationContext,
  GraphRestClient,
} from 'azure-devops-extension-api/Graph';

/**
 * Customised {@link https://github.com/microsoft/azure-devops-extension-api/blob/master/src/Git/GitClient.ts GitClient }
 * that allows using optional fields in some interfaces
 */
export class GitClient extends RestClientBase {
  /**
   * Creates a repository in an Azure DevOps project.
   * @param options Options to create the repository
   * @param project Name or Id of the Project
   * @returns A Git Repository Response
   */
  public async createRepository(
    options: Partial<GitRepositoryCreateOptions>,
    project: string
  ): Promise<GitRepository> {
    return await this.beginRequest<GitRepository>({
      apiVersion: '6.0',
      method: 'POST',
      routeTemplate: '{project}/_apis/git/Repositories',
      routeValues: {
        project: project,
      },
      body: options,
    });
  }

  /**
   * Create a Git push in an Azure DevOps repository
   * @param push Options to create a Git Push
   * @param repositoryId The Id of the Repository
   * @param project Name or Id of the Project
   * @returns a Git Push Response
   */
  public async createPush(
    push: Partial<GitPush>,
    repositoryId: string,
    project: string
  ): Promise<GitPush> {
    return await this.beginRequest<GitPush>({
      apiVersion: '6.0',
      method: 'POST',
      routeTemplate: '{project}/_apis/git/repositories/{repositoryId}/pushes',
      routeValues: {
        project: project,
        repositoryId: repositoryId,
      },
      body: push,
    });
  }
}

/**
 * Azure DevOps REST client
 * {@link https://learn.microsoft.com/rest/api/azure/devops/security/security-namespaces Security Namespaces}
 */
export class SecurityNameSpaceClient extends RestClientBase {
  /**
   * Gets an Array of Security Namespaces that contain actions that can permissions can be granted against.
   * @param namespaceId The namespace Id of a Security Namespace, optional.
   * @returns An Array of {@link SecurityNamespaceDescription Security Namespace Descriptions}
   */
  public async getSecurityNamespace(namespaceId?: string): Promise<SecurityNamespaceDescription[]> {
    return await this.beginRequest<SecurityNamespaceDescription[]>({
      apiVersion: '6.0',
      method: 'GET',
      routeTemplate: '_apis/securitynamespaces/{namespaceId}',
      routeValues: {
        namespaceId: namespaceId,
      },
    });
  }
}

/**
 * Azure DevOps REST client
 * {@link https://learn.microsoft.com/rest/api/azure/devops/security/access-control-entries Access Control Entries}
 */
export class AccessControlEntriesClient extends RestClientBase {
  /**
   * Creates a new Access Control Entry
   * @param accessControlEntries An Array of Access Control Entries to Create
   * @param securityNamespaceId The Namespace to Assign the Access control entries to.
   * @returns an Array of created Access Control Entries.
   */
  public async createAccessControlEntry(
    accessControlList: AccessControlList,
    securityNamespaceId: string
  ): Promise<AccessControlEntry[]> {
    return await this.beginRequest<AccessControlEntry[]>({
      apiVersion: '6.0',
      method: 'POST',
      routeTemplate: '_apis/accesscontrolentries/{securityNamespaceId}',
      routeValues: {
        securityNamespaceId: securityNamespaceId,
      },
      body: accessControlList,
    });
  }
}

export async function addGitPermissions(
  contributors: GitContributor[],
  repository: GitRepository
): Promise<void> {
  const gitNamespace = await getSecurityNamespace('Git Repositories');

  const aceEntries: AccessControlEntry[] = [];

  contributors.forEach((contributor) => {
    // TODO: Improve hack?
    const sid = atob(contributor.group?.descriptor.split('.', 2)[1] || '');

    // Iterate over each assigned action bit to sum and return a final permission value
    const calculatedPermission = gitNamespace.actions
      .filter((action) => contributor.gitActions.includes(action.name || ''))
      .map((action) => action.bit || 0)
      .reduce((acc, current) => acc + current);

    const gitPermission: AccessControlEntry = {
      descriptor: `Microsoft.TeamFoundation.Identity;${sid}`,
      allow: calculatedPermission,
      deny: 0,
      extendedInfo: {
        effectiveAllow: calculatedPermission,
        effectiveDeny: 0,
        inheritedAllow: calculatedPermission,
        inheritedDeny: 0,
      },
    };

    aceEntries.push(gitPermission);
  });

  const aceList: AccessControlList = {
    merge: true,
    token: `repov2/${repository.project.id}/${repository.id}`,
    accessControlEntries: aceEntries,
  };

  if (gitNamespace.namespaceId) {
    const client = getClient(AccessControlEntriesClient);
    await client.createAccessControlEntry(aceList, gitNamespace.namespaceId);
  }
}

export async function getSecurityNamespace(name: string): Promise<SecurityNamespaceDescription> {
  const client = getClient(SecurityNameSpaceClient);
  const namespaces = await client.getSecurityNamespace();

  const match = namespaces.filter((namespace) => namespace.displayName == name);

  if (match.length === 0) {
    throw 'Cannot find matching security namespace';
  }

  return match[0];
}

export async function createRepository(
  repoName: string,
  projectId: string
): Promise<GitRepository> {
  const client = getClient(GitClient);

  const options = {
    name: repoName,
    project: {
      id: projectId,
    },
  } as Partial<GitRepositoryCreateOptions>;

  return await client.createRepository(options, projectId);
}

export async function initializeRepository(
  repository: GitRepository,
  createReadme: boolean,
  gitignoreTemplate?: string
): Promise<void> {
  const comment = [];
  const gitChange = [];

  if (createReadme) {
    comment.push('Added README.md');

    gitChange.push({
      changeType: 1,
      item: {
        path: '/README.md',
      },
      newContentTemplate: {
        name: 'README.md',
        type: 'readme',
      },
    });
  }

  if (gitignoreTemplate) {
    const templateName = gitignoreTemplate.split('.', 1)[0];
    comment.push(`.gitignore (${templateName}) files`);

    gitChange.push({
      changeType: 1,
      item: {
        path: '/.gitignore',
      },
      newContentTemplate: {
        name: gitignoreTemplate,
        type: 'gitignore',
      },
    });
  }

  const pushData = {
    commits: [
      {
        comment: comment.join(', '),
        changes: gitChange,
      },
    ],
    refUpdates: [
      {
        name: repository.defaultBranch || 'refs/heads/main',
        oldObjectId: '0000000000000000000000000000000000000000',
      },
    ],
  } as Partial<GitPush>;

  if (createReadme || gitignoreTemplate) {
    const client = getClient(GitClient);
    await client.createPush(pushData, repository.id, repository.project.id);
  }
}

export async function createGroup(
  contributor: GitContributor,
  repoName: string,
  projectId: string
): Promise<GraphGroup> {
  const client = getClient(GraphRestClient);
  const descriptor = await client.getDescriptor(projectId);

  const groupContext = {
    displayName: `${repoName} Repository ${contributor.type}`,
    description: `Repository ${contributor.type} for repository - ${repoName}`,
  } as GraphGroupVstsCreationContext;

  const group = await client.createGroup(groupContext, descriptor?.value);

  contributor.identities.forEach(async (identity) => {
    if (identity.subjectDescriptor) {
      await client.addMembership(identity.subjectDescriptor, group.descriptor);
    }
  });

  return group;
}
