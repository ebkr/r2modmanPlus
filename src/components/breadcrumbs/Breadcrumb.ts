export type Breadcrumb = {
    name: () => string;
    path: string;
    isActive?: boolean;
}
