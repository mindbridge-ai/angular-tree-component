import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit,
  OnChanges
} from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'tree-node-checkbox',
  encapsulation: ViewEncapsulation.None,
  styles: [],
  template: `
    <ng-container *treeMobxAutorun="{ dontDetach: true }">
      <input
        class="tree-node-checkbox"
        type="checkbox"
        (click)="node.mouseAction('checkboxClick', $event)"
        [checked]="checked"
        [indeterminate]="indeterminate"
      />
    </ng-container>
  `
})
export class TreeNodeCheckboxComponent implements OnInit, OnChanges {
  @Input()
  node: TreeNode;

  public checked = false;
  public indeterminate = false;

  public ngOnInit(): void {
    /* Set on Query */
    if (
      this.node.parent &&
      this.node.options.lazySelect &&
      this.node.parent.allChildrenSelected()
    ) {
      this.node.setIsSelected(this.node.parent.allChildrenSelected());
    }
  }

  public ngOnChanges(changes): void {
    const { node } = changes;
    if (node) {
      this.node = node.currentValue;
      this.checked = node.someChildrenSelected();
      this.indeterminate =
        node.someChildrenSelected() && !node.allChildrenSelected();
    }
  }
}
