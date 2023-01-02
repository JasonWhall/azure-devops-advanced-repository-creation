import "./Panel.scss";
import { showRootComponent } from "../Common";
import {
    LoadingSpinner,
    GitRepoDropdown,
    RepoIdentityPicker,
    GitignoreDropdown
} from "../Components";

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

// Panel Layout components
import { PanelFooter, PanelContent } from "azure-devops-ui/Panel";

// Text Fields for inputs
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";

import { Checkbox } from "azure-devops-ui/Checkbox"

// Buttons for create/cancel
import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";

// Used to display Error message on failures
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";

import { GitRestClient } from "azure-devops-extension-api/Git/GitClient";
import { GitRepositoryCreateOptions } from "azure-devops-extension-api/Git"

import {
    CommonServiceIds,
    getClient,
    IHostNavigationService,
    IProjectPageService
} from "azure-devops-extension-api";

interface IPanelContentState {
    repoName: string;
    loading: boolean; // Used to display spinner and lock submission
    errorOnCreate: boolean;
    errorMessage?: string;
    createReadme: boolean;
}

class RepoPanelContent extends React.Component<{}, IPanelContentState> {

    private repoClient: GitRestClient;

    constructor(props: {}) {
        super(props);
        this.state = {
            repoName: "",
            loading: false,
            errorOnCreate: false,
            createReadme: true,
        };

        this.repoClient = getClient(GitRestClient)
    }

    public async componentDidMount() {
        SDK.init();

        SDK.ready();
    }

    public render(): JSX.Element {

        return (
            <div className="flex-column flex-grow">
                {this.state.loading && <LoadingSpinner label="Repository creation in progress ..." />}
                {this.state.errorOnCreate &&
                    // @ts-expect-error MessageCardProps type incorrectly does not allow children
                    <MessageCard severity={MessageCardSeverity.Error} onDismiss={() => this.dismissMessageCard()}>
                        {this.state.errorMessage}
                    </MessageCard>
                }
                <PanelContent>
                    <div className="flex-column flex-grow rhythm-vertical-16">
                        <GitRepoDropdown label="Repository type" />
                        <TextField
                            value={this.state.repoName}
                            onChange={(e, newValue) => (this.setState({ repoName: newValue }))}
                            placeholder="Enter a name for your Git repository"
                            width={TextFieldWidth.auto}
                            label="Repository name *"
                        />
                        <Checkbox
                            label="Add a README"
                            checked={this.state.createReadme}
                            disabled={this.state.loading}
                            onChange={(e, checked) => (this.setState({ createReadme: checked }))}
                        />
                        <GitignoreDropdown />

                        {/* TODO: Wire up */}
                        <RepoIdentityPicker label="Maintainers" />
                        <RepoIdentityPicker label="External Collaborators" />
                    </div>
                </PanelContent>
                <PanelFooter>
                    <ButtonGroup className="bolt-panel-footer-buttons flex-grow">
                        <Button
                            text="Cancel"
                            onClick={() => this.finalise()}
                        />
                        <Button
                            primary={true}
                            text="Create"
                            onClick={() => this.createRepo()}
                            disabled={this.state.repoName.length < 1 || this.state.loading}
                        />
                    </ButtonGroup>
                </PanelFooter>
            </div>
        );
    }

    private async createRepo(): Promise<void> {
        this.setState({ loading: true });
        const createOptions = await this.getRepoCreateOptions(this.state.repoName);

        try {
            const repositoryResult = await this.repoClient.createRepository(createOptions, createOptions.project.id);
            this.setState({ loading: false });
            await this.finalise(repositoryResult.webUrl);
        }
        catch (err) {
            let message = "Unable to create repository";

            if (err instanceof Error) message = err.message;

            this.setState({
                errorOnCreate: true,
                loading: false,
                errorMessage: message
            })
        }
    }

    private async createInitialCommit(createReadme: boolean, gitignoreTemplate?: string): Promise<void> {
        //TODO: Create README and .gitignore initial commit from template
    }

    private async getRepoCreateOptions(repoName: string): Promise<GitRepositoryCreateOptions> {

        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();

        /**
         * Get an existing repo within the project for repository creation supplemental info,
         * this is required for GitRepositoryCreateOptions interface even though it is not strictly necessary for the API call.
         */
        const repos = await this.repoClient.getRepositories(project?.id) // Always returns at least 1 repo as is a requirement in a project
        return {
            name: repoName,
            parentRepository: repos[0].parentRepository,
            project: repos[0].project
        } as GitRepositoryCreateOptions;
    }

    private dismissMessageCard(): void {
        this.setState({ errorOnCreate: false })
    };

    private async finalise(redirectUrl?: string): Promise<void> {
        if (redirectUrl) {
            const navService = await SDK.getService<IHostNavigationService>(CommonServiceIds.HostNavigationService);
            navService.navigate(redirectUrl);
        }

        const config = SDK.getConfiguration();
        if (config.panel) {
            config.panel.close();
        }
    }
}

showRootComponent(<RepoPanelContent />);
