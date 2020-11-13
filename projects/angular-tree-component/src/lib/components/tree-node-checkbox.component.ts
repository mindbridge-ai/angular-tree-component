import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  SimpleChanges
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
        [checked]="node.someChildrenSelected()"
        [indeterminate]="
          node.someChildrenSelected() && !node.allChildrenSelected()
        "
      />
    </ng-container>
  `
})
export class TreeNodeCheckboxComponent implements OnInit, OnChanges {
  @Input()
  public node: TreeNode;
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

  public ngOnChanges(changes: SimpleChanges): void {
    const { node } = changes;
    if (node) {
      const { currentValue } = node;
      this.node = currentValue;
      this.checked = currentValue.someChildrenSelected();
      this.indeterminate =
        currentValue.someChildrenSelected() &&
        !currentValue.allChildrenSelected();
    }
  }
}
