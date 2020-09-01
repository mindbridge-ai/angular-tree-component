import { Component, Input, ViewEncapsulation, OnInit, OnChanges } from '@angular/core';
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
<<<<<<< HEAD:projects/angular-tree-component/src/lib/components/tree-node-checkbox.component.ts
        [checked]="node.isSelected"
        [indeterminate]="node.isPartiallySelected"
      />
=======
        [checked]="node.someChildrenSelected()"
        [indeterminate]="node.someChildrenSelected() && !node.allChildrenSelected()"/>
>>>>>>> 40d3018... Node state changes after testing and by passing isSelected property:lib/components/tree-node-checkbox.component.ts
    </ng-container>
  `
})
export class TreeNodeCheckboxComponent implements OnInit, OnChanges {
  @Input() node: TreeNode;

  public ngOnInit(): void {
    /* Set on Query */
    if (this.node.parent && this.node.options.lazySelect && this.node.parent.allChildrenSelected()) {
        this.node.setIsSelected(this.node.parent.allChildrenSelected());
    }
  }

  public ngOnChanges(changes): void {
    const { node } = changes;
    if (node) {
      this.node = node.currentValue;
    }
  }

}
