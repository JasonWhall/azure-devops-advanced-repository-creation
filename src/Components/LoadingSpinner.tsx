import React from "react";
import { Spinner } from "azure-devops-ui/Spinner";

interface ILoadingSpinnerProps {
    label: string
}

export class LoadingSpinner extends React.Component<ILoadingSpinnerProps, {}> {

    public render(): JSX.Element {
        return (
            <div className="absolute-fill flex-column flex-center justify-center sub-layer">
                <Spinner label={this.props.label}/>
            </div>
        )
    }
}
