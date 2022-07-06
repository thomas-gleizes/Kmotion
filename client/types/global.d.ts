declare type Component<P = {}> = React.FunctionComponent<P>

declare type Page = Component

declare type Route = {
  path: string;
  component: Page;
};

declare type Routes = {
  [key: string]: Route;
};

declare type RNode = React.ReactNode
