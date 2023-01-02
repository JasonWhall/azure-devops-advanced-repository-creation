import ReactDOM from 'react-dom';

// Required import to inherit styling to azure-devops-ui components
import 'azure-devops-ui/Core/override.css';

/**
 * Helper function to render react component
 * @param component React component to render
 */
export function showRootComponent(component: React.ReactElement<unknown>) {
  ReactDOM.render(component, document.getElementById('root'));
}
