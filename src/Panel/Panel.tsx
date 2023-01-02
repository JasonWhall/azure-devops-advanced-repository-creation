import "./Panel.scss";

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import { IObservableArray, ObservableArray } from "azure-devops-ui/Core/Observable";

import { PanelFooter, PanelContent } from "azure-devops-ui/Panel";

import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import { IdentityPicker, IIdentity, IPeoplePickerProvider } from "azure-devops-ui/IdentityPicker";
import { PeoplePickerProvider } from "azure-devops-extension-api/Identities";

import { Dropdown } from "azure-devops-ui/Dropdown";
import { DropdownSelection } from "azure-devops-ui/Utilities/DropdownSelection";

import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";

import { GitRestClient } from "azure-devops-extension-api/Git/GitClient";

import { showRootComponent } from "../Common";
import { CommonServiceIds, getClient, IHostNavigationService, IProjectPageService } from "azure-devops-extension-api";
import { GitRepositoryCreateOptions } from "azure-devops-extension-api/Git"

interface IPanelContentState {
    pickerProvider: IPeoplePickerProvider
    repoName: string;
}

class RepoPanelContent extends React.Component<{}, IPanelContentState> {

    private selectedIdentities: IObservableArray<IIdentity> = new ObservableArray<IIdentity>([]);
    private selection = new DropdownSelection();
    private repoClient: GitRestClient;

    constructor(props: {}) {
        super(props);
        this.state = {
            pickerProvider: new PeoplePickerProvider(),
            repoName: ""
        };

        this.selection.select(0);

        this.repoClient = getClient(GitRestClient)

    }

    public async componentDidMount() {
        SDK.init();
        SDK.ready();
    }

    public render(): JSX.Element {

        return (
            <div className="flex-column flex-grow">
                <PanelContent>
                    <div className="flex-column flex-grow rhythm-vertical-16">
                        <div className="flex-column">
                            <label className="bolt-formitem-label">Repository type</label>
                            <Dropdown
                                disabled={true}
                                items={[
                                    {
                                        id: "Git",
                                        text: "Git",
                                        iconProps: { iconName: "GitLogo" }
                                    }
                                ]}
                                selection={this.selection}
                            />
                        </div>
                        <TextField
                            value={this.state.repoName}
                            onChange={(e, newValue) => (this.setState({ repoName: newValue }))}
                            placeholder="Enter a name for your Git repository"
                            width={TextFieldWidth.auto}
                            label="Repository name *"
                        />
                        <div className="flex-column">
                            <label className="bolt-formitem-label">Maintainers</label>
                            <IdentityPicker
                                onIdentitiesRemoved={this.onIdentitiesRemove}
                                onIdentityAdded={this.onIdentityAdded}
                                onIdentityRemoved={this.onIdentityRemoved}
                                pickerProvider={this.state.pickerProvider}
                                selectedIdentities={this.selectedIdentities}
                            />
                        </div>
                        <div className="flex-column">
                            <label className="bolt-formitem-label">External Collaborators</label>
                            <IdentityPicker
                                onIdentitiesRemoved={this.onIdentitiesRemove}
                                onIdentityAdded={this.onIdentityAdded}
                                onIdentityRemoved={this.onIdentityRemoved}
                                pickerProvider={this.state.pickerProvider}
                                selectedIdentities={this.selectedIdentities}
                            />
                        </div>
                    </div>
                </PanelContent>
                <PanelFooter>
                    <ButtonGroup className="bolt-panel-footer-buttons flex-grow">
                        <Button
                            text="Cancel"
                            onClick={() => this.dismiss()}
                        />
                        <Button
                            primary={true}
                            text="Create"
                            onClick={() => this.createRepo()}
                            disabled={this.isCreateDisabled()}
                        />
                    </ButtonGroup>
                </PanelFooter>
            </div>
        );
    }

    private dismiss() {
        const config = SDK.getConfiguration();
        config.panel.close();
    }

    private isCreateDisabled(): boolean {
        if (this.state.repoName !== undefined) {
            return this.state.repoName.length < 1
        }

        return true;
    }

    private async createRepo() {
        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();

        const repos = await this.repoClient.getRepositories()

        const opts: GitRepositoryCreateOptions = { name: this.state.repoName, parentRepository: repos[0].parentRepository, project: repos[0].project }
        const result = await this.repoClient.createRepository(opts, project!.id, undefined);

        const navService = await SDK.getService<IHostNavigationService>(CommonServiceIds.HostNavigationService);

        this.dismiss();

        navService.navigate(result.url);
    }

    private onIdentitiesRemove = (identities: IIdentity[]) => {
        this.selectedIdentities.value = this.selectedIdentities.value.filter((entity: IIdentity) => {
            identities.filter((item) => item.entityId === entity.entityId).length === 0
        })
    }

    private onIdentityAdded = (identity: IIdentity) => this.selectedIdentities.push(identity)

    private onIdentityRemoved = (identity: IIdentity) => {
        this.selectedIdentities.value = this.selectedIdentities.value.filter((entity: IIdentity) => {
            console.log(entity.entityId + ":" + identity.entityId);
            entity.entityId !== identity.entityId
        })
    }

}

showRootComponent(<RepoPanelContent />);
