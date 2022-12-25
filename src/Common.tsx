import ReactDOM from "react-dom";
import 'azure-devops-ui/Core/override.css';

export function showRootComponent(component: React.ReactElement<any>) {
    ReactDOM.render(component, document.getElementById('root'));
}