import React from "react";

import { Dropdown } from "azure-devops-ui/Dropdown";
import { DropdownSelection } from "azure-devops-ui/Utilities/DropdownSelection";


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
            <div className="flex-column">
                <label className="bolt-formitem-label">{this.props.label}</label>
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
        )
    }
}
