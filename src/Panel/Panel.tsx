import './Panel.scss';
import { showRootComponent } from '../Common';
import { GitContributor } from '../Interfaces';
import {
  addGitPermissions,
  createGroup,
  createRepository,
  initializeRepository,
} from '../Services';
import {
  LoadingSpinner,
  GitRepoDropdown,
  RepoIdentityPicker,
  GitignoreDropdown,
} from '../Components';
import * as React from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { PanelFooter, PanelContent } from 'azure-devops-ui/Panel';
import { TextField, TextFieldWidth } from 'azure-devops-ui/TextField';
import { Checkbox } from 'azure-devops-ui/Checkbox';
import { Button } from 'azure-devops-ui/Button';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';
import { MessageCard, MessageCardSeverity } from 'azure-devops-ui/MessageCard';
import { IListBoxItem } from 'azure-devops-ui/ListBox';
import { Icon } from 'azure-devops-ui/Icon';
import { ObservableArray } from 'azure-devops-ui/Core/Observable';
import { IIdentity } from 'azure-devops-ui/IdentityPicker';
import {
  CommonServiceIds,
  IHostNavigationService,
  IProjectPageService,
} from 'azure-devops-extension-api';

interface IPanelContentState {
  repoName: string;
  loading: boolean;
  errorOnCreate: boolean;
  errorMessage?: string;
  createReadme: boolean;
  gitIgnoreSelection: string;
  defaultBranch: string;
}

export class RepoPanelContent extends React.Component<{}, IPanelContentState> {
  private maintainers = new ObservableArray<IIdentity>([]);
  private collaborators = new ObservableArray<IIdentity>([]);

  constructor(props: {}) {
    super(props);

    this.state = {
      repoName: '',
      loading: false,
      errorOnCreate: false,
      createReadme: true,
      gitIgnoreSelection: '',
      defaultBranch: 'main', // TODO: Determine from project settings
    };
  }

  public async componentDidMount() {
    SDK.init();
  }

  public render(): JSX.Element {
    return (
      <div className='flex-column flex-grow'>
        {this.state.loading && <LoadingSpinner label='Repository creation in progress ...' />}
        {this.state.errorOnCreate && (
          // @ts-expect-error MessageCardProps type incorrectly does not allow children
          <MessageCard
            severity={MessageCardSeverity.Error}
            onDismiss={() => this.setState({ errorOnCreate: false })}
          >
            {this.state.errorMessage}
          </MessageCard>
        )}
        <PanelContent>
          <div className='flex-column flex-grow rhythm-vertical-16'>
            <GitRepoDropdown label='Repository type' />
            <TextField
              value={this.state.repoName}
              onChange={(_e, newValue) => this.setState({ repoName: newValue })}
              placeholder='Enter a name for your Git repository'
              width={TextFieldWidth.auto}
              label='Repository name *'
            />
            <Checkbox
              label='Add a README'
              checked={this.state.createReadme}
              disabled={this.state.loading}
              onChange={(_e, checked) => this.setState({ createReadme: checked })}
            />
            <GitignoreDropdown onSelect={(_e, item) => this.setGitignoreSelection(item)} />
            <RepoIdentityPicker
              label='Maintainers'
              onIdentitiesRemoved={(ids) => this.onIdentitiesRemoved(ids, this.maintainers)}
              onIdentityAdded={(id) => this.onIdentityAdded(id, this.maintainers)}
              onIdentityRemoved={(id) => this.onIdentityRemoved(id, this.maintainers)}
              selectedIdentities={this.maintainers}
            />
            <RepoIdentityPicker
              label='External Collaborators'
              onIdentitiesRemoved={(ids) => this.onIdentitiesRemoved(ids, this.collaborators)}
              onIdentityAdded={(id) => this.onIdentityAdded(id, this.collaborators)}
              onIdentityRemoved={(id) => this.onIdentityRemoved(id, this.collaborators)}
              selectedIdentities={this.collaborators}
            />
            {(this.state.createReadme || this.state.gitIgnoreSelection) && (
              <span className='margin-16'>
                Your repository will be initialized with a <Icon iconName='OpenSource'></Icon>
                <code>{this.state.defaultBranch}</code> branch.
              </span>
            )}
          </div>
        </PanelContent>
        <PanelFooter>
          <ButtonGroup className='bolt-panel-footer-buttons flex-grow'>
            <Button text='Cancel' onClick={() => this.finalise()} />
            <Button
              primary={true}
              text='Create'
              onClick={() => this.create()}
              disabled={this.state.repoName.length < 1 || this.state.loading}
            />
          </ButtonGroup>
        </PanelFooter>
      </div>
    );
  }

  private async create(): Promise<void> {
    this.setState({ loading: true });

    const contributorGroups: GitContributor[] = [
      {
        type: 'Maintainers',
        gitActions: [
          'Administer',
          'GenericRead',
          'GenericContribute',
          'ForcePush',
          'CreateBranch',
          'CreateTag',
          'ManageNote',
          'PolicyExempt',
          'RenameRepository',
          'EditPolicies',
          'RemoveOthersLocks',
          'ManagePermissions',
          'PullRequestBypassPolicy',
          'PullRequestContribute',
        ],
        identities: this.maintainers.value,
      },
      {
        type: 'External Collaborators',
        gitActions: ['GenericContribute', 'GenericRead', 'CreateBranch', 'PullRequestContribute'],
        identities: this.collaborators.value,
      },
    ];

    const projectService = await SDK.getService<IProjectPageService>(
      CommonServiceIds.ProjectPageService
    );

    try {
      const projectId = await projectService.getProject().then((project) => project?.id);

      if (!projectId) {
        throw new Error('Unable to Identify Project Id');
      }

      const repository = await createRepository(this.state.repoName, projectId);

      await initializeRepository(
        repository,
        this.state.createReadme,
        this.state.gitIgnoreSelection
      );

      contributorGroups.forEach(async (contributor) => {
        contributor.group = await createGroup(contributor, this.state.repoName, projectId);
      });

      await addGitPermissions(contributorGroups, repository);

      this.setState({ loading: false });
      await this.finalise(repository.webUrl);
    } catch (err) {
      // On failure, we try to extract the message to present as a messagebox
      let message = 'Unable to create repository';

      if (err instanceof Error) message = err.message;

      this.setState({
        errorOnCreate: true,
        loading: false,
        errorMessage: message,
      });
    }
  }

  private setGitignoreSelection(item: IListBoxItem): void {
    let gitIgnore = '';

    if (item.text != 'None') {
      gitIgnore = item.id;
    }

    this.setState({ gitIgnoreSelection: gitIgnore });
  }

  private onIdentitiesRemoved(
    identities: IIdentity[],
    selectedIdentities: ObservableArray<IIdentity>
  ): void {
    selectedIdentities.value = selectedIdentities.value.filter((entity: IIdentity) => {
      identities.filter((item) => item.entityId === entity.entityId).length === 0;
    });
  }

  private onIdentityAdded(
    identity: IIdentity,
    selectedIdentities: ObservableArray<IIdentity>
  ): void {
    // TODO: improve initial hack to display images on correct domain.
    if (identity.image) {
      identity.image = 'https://dev.azure.com/' + identity.image;
    }
    selectedIdentities.push(identity);
  }

  private onIdentityRemoved(
    identity: IIdentity,
    selectedIdentities: ObservableArray<IIdentity>
  ): void {
    selectedIdentities.value = selectedIdentities.value.filter(
      (entity: IIdentity) => entity.entityId != identity.entityId
    );
  }

  private async finalise(redirectUrl?: string): Promise<void> {
    if (redirectUrl) {
      const navService = await SDK.getService<IHostNavigationService>(
        CommonServiceIds.HostNavigationService
      );
      navService.navigate(redirectUrl);
    }

    const config = SDK.getConfiguration();
    if (config.panel) {
      config.panel.close();
    }
  }
}

showRootComponent(<RepoPanelContent />);
