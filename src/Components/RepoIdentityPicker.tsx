import React from "react";

import { IdentityPicker, IIdentity, IPeoplePickerProvider } from "azure-devops-ui/IdentityPicker";
import { IObservableArray, ObservableArray } from "azure-devops-ui/Core/Observable";
import { PeoplePickerProvider } from "azure-devops-extension-api/Identities";

interface IRepoIdentityPickerProps {
    label: string
}

interface IRepoIdentityPickerState {
    pickerProvider: IPeoplePickerProvider;
}

export class RepoIdentityPicker extends React.Component<IRepoIdentityPickerProps, IRepoIdentityPickerState> {

    private selectedIdentities: IObservableArray<IIdentity> = new ObservableArray<IIdentity>([]);

    constructor(props: IRepoIdentityPickerProps) {
        super(props);

        this.state = {
            pickerProvider: new PeoplePickerProvider(),
        }
    }

    public render(): JSX.Element {
        return (
            <div className="flex-column">
                <label className="bolt-formitem-label">{this.props.label}</label>
                <IdentityPicker
                    onIdentitiesRemoved={this.onIdentitiesRemove}
                    onIdentityAdded={this.onIdentityAdded}
                    onIdentityRemoved={this.onIdentityRemoved}
                    pickerProvider={this.state.pickerProvider}
                    selectedIdentities={this.selectedIdentities}
                />
            </div>
        )
    }

    private onIdentitiesRemove = (identities: IIdentity[]) => {
        this.selectedIdentities.value = this.selectedIdentities.value.filter((entity: IIdentity) => {
            identities.filter((item) => item.entityId === entity.entityId).length === 0
        })
    }

    private onIdentityAdded = (identity: IIdentity) => {
        // TODO: improve initial hack to display images on correct domain.
        if (identity.image) {
          identity.image = "https://dev.azure.com/" + identity.image
        }
        this.selectedIdentities.push(identity)
    }

    // TODO: Remove only single identity, not all
    private onIdentityRemoved = (identity: IIdentity) => {
        const filteredIdentities = this.selectedIdentities.value.filter((entity: IIdentity) => {
            entity.entityId != identity.entityId
        })

        this.selectedIdentities.value = filteredIdentities;
    }

}
