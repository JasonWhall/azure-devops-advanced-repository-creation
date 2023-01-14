import { IIdentity } from 'azure-devops-ui/IdentityPicker';

export interface GitContributor {
  type: string;
  gitActions: string[];
  identities: IIdentity[];
}
