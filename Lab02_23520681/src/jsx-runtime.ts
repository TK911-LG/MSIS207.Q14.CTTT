export interface VNode {
  type: string | ComponentFunction | typeof Fragment;
  props: Record<string, any>;
  children: (VNode | string | number)[];
}

export const Fragment = Symbol('Fragment');

export interface ComponentProps {
  children?: (VNode | string | number)[] | VNode | string | number;
  [key: string]: any;
}

export type ComponentFunction = (props: ComponentProps) => VNode;

export function createElement(
    type: string | ComponentFunction | typeof Fragment,
    props: Record<string, any> | null,
    ...children: any[]
): VNode {
  const nodeProps = props || {};
  const flattenedChildren = children
      .flat(Infinity)
      .filter((child) => child !== null && child !== undefined && child !== false);

  return {
    type,
    props: {
      ...nodeProps,
      children: flattenedChildren,
    },
    children: flattenedChildren,
  };
}

export function createFragment(
    props: Record<string, any> | null,
    ...children: any[]
): VNode {
  return createElement(Fragment, props, ...children);
}

export function renderToDOM(vnode: VNode | string | number): Node {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  if (vnode.type === Fragment) {
    const fragment = document.createDocumentFragment();
    vnode.children.forEach((child) => {
      fragment.appendChild(renderToDOM(child));
    });
    return fragment;
  }

  if (typeof vnode.type === 'function') {
    const componentProps = {
      ...vnode.props,
      children: vnode.children,
    };
    const componentVNode = vnode.type(componentProps);
    return renderToDOM(componentVNode);
  }

  const element = document.createElement(vnode.type as string);

  Object.entries(vnode.props).forEach(([key, value]) => {
    if (key === 'children') {
      return;
    }

    if (key === 'ref' && typeof value === 'function') {
      value(element);
    } else if (key === 'className') {
      element.className = value;
    } else if (key === 'style') {
      if (typeof value === 'string') {
        element.setAttribute('style', value);
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([styleProp, styleValue]) => {
          (element.style as any)[styleProp] = styleValue;
        });
      }
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key === 'value' || key === 'checked' || key === 'selected') {
      (element as any)[key] = value;
    } else if (typeof value === 'boolean') {
      if (value) {
        element.setAttribute(key, '');
      }
    } else if (value !== null && value !== undefined) {
      element.setAttribute(key, String(value));
    }
  });

  vnode.children.forEach((child) => {
    element.appendChild(renderToDOM(child));
  });

  return element;
}

export function mount(vnode: VNode, container: HTMLElement): void {
  const domNode = renderToDOM(vnode);
  container.innerHTML = '';
  container.appendChild(domNode);
}

let states: any[] = [];
let stateIndex = 0;
let rootRenderFunction: () => void = () => {
  console.error("No root render function set!");
};

export function setRootRender(renderFn: () => void) {
  rootRenderFunction = renderFn;
}

export function resetStateIndex() {
  stateIndex = 0;
}

export function useState<T>(
    initialValue: T
): [() => T, (newValue: T | ((prev: T) => T)) => void] {
  const localIndex = stateIndex;
  stateIndex++;

  if (states[localIndex] === undefined) {
    states[localIndex] = initialValue;
  }

  const getValue = (): T => {
    return states[localIndex];
  };

  const setValue = (newValue: T | ((prev: T) => T)): void => {
    const oldValue = states[localIndex];

    const value = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(oldValue)
        : newValue;

    if (oldValue !== value) {
      states[localIndex] = value;
      rootRenderFunction();
    }
  };

  return [getValue, setValue];
}