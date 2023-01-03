import React from 'react';

import { IdentityPicker, IIdentity, IPeoplePickerProvider } from 'azure-devops-ui/IdentityPicker';
import {
  IObservableArray,
  IReadonlyObservableArray,
  ObservableArray,
} from 'azure-devops-ui/Core/Observable';
import { PeoplePickerProvider } from 'azure-devops-extension-api/Identities';
import { FormItem } from 'azure-devops-ui/FormItem';

interface IRepoIdentityPickerProps {
  label: string;
  onIdentitiesRemoved: (identities: IIdentity[]) => void;
  onIdentityAdded: (tag: IIdentity) => void;
  onIdentityRemoved: (tag: IIdentity) => void;
  selectedIdentities: IIdentity[] | IReadonlyObservableArray<IIdentity>;
}

interface IRepoIdentityPickerState {
  pickerProvider: IPeoplePickerProvider;
}

export class RepoIdentityPicker extends React.Component<
  IRepoIdentityPickerProps,
  IRepoIdentityPickerState
> {
  private selectedIdentities: IObservableArray<IIdentity> = new ObservableArray<IIdentity>([]);

  constructor(props: IRepoIdentityPickerProps) {
    super(props);

    this.state = {
      pickerProvider: new PeoplePickerProvider(),
    };
  }

  public render(): JSX.Element {
    return (
      <div className='flex-column'>
        <FormItem label={this.props.label} />
        <IdentityPicker
          onIdentitiesRemoved={this.props.onIdentitiesRemoved}
          onIdentityAdded={this.props.onIdentityAdded}
          onIdentityRemoved={this.props.onIdentityRemoved}
          pickerProvider={this.state.pickerProvider}
          selectedIdentities={this.props.selectedIdentities}
        />
      </div>
    );
  }
}
