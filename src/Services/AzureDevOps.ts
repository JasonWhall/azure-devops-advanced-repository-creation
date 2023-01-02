import * as SDK from 'azure-devops-extension-sdk';
import {
  CommonServiceIds,
  getClient,
  IProjectPageService,
  IVssRestClientOptions,
} from 'azure-devops-extension-api';
import {
  RestClientBase,
  RestClientRequestParams,
} from 'azure-devops-extension-api/Common/RestClientBase';
import { GitRepository } from 'azure-devops-extension-api/Git';
import { GitPushModel, GitRepositoryCreateOptionsModel } from '../Models';

/**
 * Helper class for making generic API calls to Azure DevOps when the existing API clients are missing updated specifications.
 */
export class DevOpsClient extends RestClientBase {
  constructor(options: IVssRestClientOptions) {
    super(options);
  }

  public async newRequest<T>(requestParams: RestClientRequestParams) {
    return this.beginRequest<T>(requestParams);
  }
}

export async function createRepository(repoName: string): Promise<GitRepository> {
  const projectService = await SDK.getService<IProjectPageService>(
    CommonServiceIds.ProjectPageService
  );
  const project = await projectService.getProject();

  const createOptions = {
    name: repoName,
    project: {
      id: project?.id,
      name: project?.name,
    },
  } as GitRepositoryCreateOptionsModel;

  const client = getClient(DevOpsClient);

  const repositoryResult = await client.newRequest<GitRepository>({
    apiVersion: '6.0',
    method: 'POST',
    routeTemplate: '{project}/_apis/git/Repositories',
    routeValues: {
      project: project?.id,
    },
    body: createOptions,
  });

  return repositoryResult;
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
  } as GitPushModel;

  if (createReadme || gitignoreTemplate) {
    const client = getClient(DevOpsClient);

    await client.newRequest<GitPushModel>({
      apiVersion: '6.0',
      method: 'POST',
      routeTemplate: '{project}/_apis/git/repositories/{repositoryId}/pushes',
      routeValues: {
        project: repository.project.id,
        repositoryId: repository.id,
      },
      body: pushData,
    });
  }
}
