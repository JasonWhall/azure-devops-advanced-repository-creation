import React from 'react';

import { GitIgnoreOptions } from '../Data';

import { Dropdown, DropdownExpandableButton } from 'azure-devops-ui/Dropdown';
import { DropdownSelection } from 'azure-devops-ui/Utilities/DropdownSelection';
import { IListBoxItem } from 'azure-devops-ui/ListBox';
import { IListSelection } from 'azure-devops-ui/List';

interface IGitignoreDropdownProps {
  onSelect: (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem) => void;
}

export class GitignoreDropdown extends React.Component<IGitignoreDropdownProps, {}> {
  private selection = new DropdownSelection();

  constructor(props: IGitignoreDropdownProps) {
    super(props);

    this.selection.select(0);
  }

  public render(): JSX.Element {
    return (
      <Dropdown
        items={GitIgnoreOptions}
        selection={this.selection}
        renderSelectedItems={this.createPrefix}
        renderExpandable={(props) => <DropdownExpandableButton {...props} />}
        onSelect={this.props.onSelect}
        showFilterBox={true}
      />
    );
  }

  /**
   * This is used to inject the prefix into the button.
   * This could be achieved using renderExpandable iconProps in the Dropdown
   * but does not set correctly any spacing so we use this method instead
   *
   * Will display as: `Add a .gitignore: "selectedItem"`
   *
   * @param selection The selected item from the dropdown
   * @param items The available items in the dropdown
   * @returns a span containing the prefix text, following by the selected item
   */
  private createPrefix(selection: IListSelection, items: IListBoxItem[]): JSX.Element {
    const item = items[selection.value[0].beginIndex].text || 'None';

    return (
      <>
        <span className='secondary-text'>Add a .gitignore: </span>
        {item}
      </>
    );
  }
}
