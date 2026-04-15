export type RouteType = {
  route: string;
  title?: string;
  template?: string;
  styles?: string;
  useLayout: string|false;
  load(): void;
};
