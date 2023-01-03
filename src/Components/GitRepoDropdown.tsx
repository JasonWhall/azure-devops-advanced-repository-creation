import React from 'react';

import { Dropdown } from 'azure-devops-ui/Dropdown';
import { DropdownSelection } from 'azure-devops-ui/Utilities/DropdownSelection';
import { FormItem } from 'azure-devops-ui/FormItem';

interface IGitRepoDropdownProps {
  label: string;
}

export class GitRepoDropdown extends React.Component<IGitRepoDropdownProps, {}> {
  private selection = new DropdownSelection();

  constructor(props: IGitRepoDropdownProps) {
    super(props);

    // Selects the first item in the dropdown list as the default
    this.selection.select(0);
  }

  public render(): JSX.Element {
    return (
      <div className='flex-column'>
        <FormItem label={this.props.label} />
        <Dropdown
          disabled={true}
          items={[
            {
              id: 'Git',
              text: 'Git',
              iconProps: { iconName: 'GitLogo' },
            },
          ]}
          selection={this.selection}
        />
      </div>
    );
  }
}
