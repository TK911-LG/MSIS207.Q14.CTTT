/** @jsx createElement */
import { createElement, mount, setRootRender, resetStateIndex } from './jsx-runtime';
import { Dashboard } from './dashboard.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  const renderApp = () => {
    resetStateIndex();
    const appVNode = createElement(Dashboard, null);
    mount(appVNode, rootElement);
  };

  setRootRender(renderApp);
  renderApp();
} else {
  console.error('Root element not found!');
}
