import { OnInit, OnChanges } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';
export declare class TreeNodeCheckboxComponent implements OnInit, OnChanges {
    node: TreeNode;
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
}
