/// <reference types="vite/client" />

import * as React from 'react';

type SvgComponent = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string;
  }
>;

// SVG as React Component
declare module '*.svg?react' {
  const ReactComponent: SvgComponent;

  export default ReactComponent;
}

declare module '*.svg' {
  const ReactComponent: SvgComponent;

  export { ReactComponent };

  const src: string;
  export default src;
}
