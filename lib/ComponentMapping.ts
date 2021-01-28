import { Entry } from "contentful";

export type ComponentMapping = Record<string, React.ComponentType<Entry<any>>>;
