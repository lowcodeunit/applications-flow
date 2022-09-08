export class TreeNode {
    description?: string;
    name: string;
    url: string;
    lookup?: string;
    routerLink?: any;
    children?: TreeNode[];
}

export class FlatNode {
    expandable: boolean;
    name: string;
    url: string;
    lookup?: string;
    description?: string;
    routerLink: string;
    level: number;
}
