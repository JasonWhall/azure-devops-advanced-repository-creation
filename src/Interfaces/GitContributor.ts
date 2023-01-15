import { GraphGroup } from 'azure-devops-extension-api/Graph';
import { IIdentity } from 'azure-devops-ui/IdentityPicker';

export interface GitContributor {
  type: string;
  gitActions: string[];
  identities: IIdentity[];
  group?: GraphGroup;
}
