import { GraphGroup } from 'azure-devops-extension-api/Graph';
import { IIdentity } from 'azure-devops-ui/IdentityPicker';

export interface GitContributor {
  /**
   * The Contributor Type. e.g. Maintainers, Collaborators etc.
   */
  type: string;

  /**
   * The Git Actions allowed to the Identity.
   * These can be found in actions in the SecurityNamespace
   * https://dev.azure.com/{organisation}/_apis/securitynamespaces
   */
  gitActions: string[];

  /**
   * An array of Identities that will be assigned to the group
   */
  identities: IIdentity[];

  /**
   * The created group the Identities will be assigned to
   */
  group?: GraphGroup;
}
