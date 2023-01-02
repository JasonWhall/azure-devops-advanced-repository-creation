import "./Panel.scss";
import { showRootComponent } from "../Common";
import { createRepository, initializeRepository } from "../Services";

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

import {
    CommonServiceIds,
    IHostNavigationService,
} from "azure-devops-extension-api";

import { IListBoxItem } from "azure-devops-ui/ListBox";
import { Icon } from "azure-devops-ui/Icon";

interface IPanelContentState {
    repoName: string;
    loading: boolean; // Used to display spinner and lock submission
    errorOnCreate: boolean;
    errorMessage?: string;
    createReadme: boolean;
    gitIgnoreSelection: string;
    defaultBranch: string;
}

class RepoPanelContent extends React.Component<{}, IPanelContentState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            repoName: "",
            loading: false,
            errorOnCreate: false,
            createReadme: true,
            gitIgnoreSelection: "",
            defaultBranch: "main" // TODO: Determine from project settings
        };
    }

    public async componentDidMount() {
        SDK.init();
    }

    public render(): JSX.Element {

        return (
            <div className="flex-column flex-grow">
                {this.state.loading && <LoadingSpinner label="Repository creation in progress ..." />}
                {this.state.errorOnCreate &&
                    // @ts-expect-error MessageCardProps type incorrectly does not allow children
                    <MessageCard
                        severity={MessageCardSeverity.Error}
                        onDismiss={() => this.setState({ errorOnCreate: false })}
                    >
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
                        <GitignoreDropdown
                            onSelect={(e, item) => this.setGitignoreSelection(item)}
                        />
                        {/* TODO: Wire up */}
                        <RepoIdentityPicker label="Maintainers" />
                        <RepoIdentityPicker label="External Collaborators" />
                        {
                            (this.state.createReadme || this.state.gitIgnoreSelection) &&
                            <span className="margin-16">
                                Your repository will be initialized with a <Icon iconName="OpenSource"></Icon><code>{this.state.defaultBranch}</code> branch.
                            </span>

                        }
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

        try {
            const repository = await createRepository(this.state.repoName);
            await initializeRepository(repository, this.state.createReadme, this.state.gitIgnoreSelection)

            this.setState({ loading: false });
            await this.finalise(repository.webUrl);
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

    private setGitignoreSelection(item: IListBoxItem<{}>): void {
        let gitIgnore = "";

        if (item.text != "None") {
            gitIgnore = item.text || "";
        }

        this.setState({ gitIgnoreSelection: gitIgnore })
    }

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
