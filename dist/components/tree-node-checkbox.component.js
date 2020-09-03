import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';
var TreeNodeCheckboxComponent = /** @class */ (function () {
    function TreeNodeCheckboxComponent() {
    }
    TreeNodeCheckboxComponent.prototype.ngOnInit = function () {
        /* Set on Query */
        if (this.node.parent && this.node.options.lazySelect && this.node.parent.allChildrenSelected()) {
            this.node.setIsSelected(this.node.parent.allChildrenSelected());
        }
    };
    TreeNodeCheckboxComponent.prototype.ngOnChanges = function (changes) {
        var node = changes.node;
        if (node) {
            this.node = node.currentValue;
        }
    };
    TreeNodeCheckboxComponent.decorators = [
        { type: Component, args: [{
                    selector: 'tree-node-checkbox',
                    encapsulation: ViewEncapsulation.None,
                    styles: [],
                    template: "\n    <ng-container *mobxAutorun=\"{dontDetach: true}\">\n      <input\n        class=\"tree-node-checkbox\"\n        type=\"checkbox\"\n        (click)=\"node.mouseAction('checkboxClick', $event)\"\n        [checked]=\"node.someChildrenSelected()\"\n        [indeterminate]=\"node.someChildrenSelected() && !node.allChildrenSelected()\"/>\n    </ng-container>\n  "
                },] },
    ];
    TreeNodeCheckboxComponent.propDecorators = {
        node: [{ type: Input }]
    };
    return TreeNodeCheckboxComponent;
}());
export { TreeNodeCheckboxComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ub2RlLWNoZWNrYm94LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL3RyZWUtbm9kZS1jaGVja2JveC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVyRDtJQUFBO0lBZ0NBLENBQUM7SUFkUSw0Q0FBUSxHQUFmO1FBQ0Usa0JBQWtCO1FBQ2xCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLEVBQUU7WUFDNUYsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO1NBQ25FO0lBQ0gsQ0FBQztJQUVNLCtDQUFXLEdBQWxCLFVBQW1CLE9BQU87UUFDaEIsSUFBQSxtQkFBSSxDQUFhO1FBQ3pCLElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQy9CO0lBQ0gsQ0FBQzs7Z0JBOUJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsTUFBTSxFQUFFLEVBQUU7b0JBQ1YsUUFBUSxFQUFFLDhXQVNUO2lCQUNGOzs7dUJBRUUsS0FBSzs7SUFnQlIsZ0NBQUM7Q0FBQSxBQWhDRCxJQWdDQztTQWpCWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBWaWV3RW5jYXBzdWxhdGlvbiwgT25Jbml0LCBPbkNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUtbm9kZS5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3RyZWUtbm9kZS1jaGVja2JveCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHN0eWxlczogW10sXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRhaW5lciAqbW9ieEF1dG9ydW49XCJ7ZG9udERldGFjaDogdHJ1ZX1cIj5cbiAgICAgIDxpbnB1dFxuICAgICAgICBjbGFzcz1cInRyZWUtbm9kZS1jaGVja2JveFwiXG4gICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgIChjbGljayk9XCJub2RlLm1vdXNlQWN0aW9uKCdjaGVja2JveENsaWNrJywgJGV2ZW50KVwiXG4gICAgICAgIFtjaGVja2VkXT1cIm5vZGUuc29tZUNoaWxkcmVuU2VsZWN0ZWQoKVwiXG4gICAgICAgIFtpbmRldGVybWluYXRlXT1cIm5vZGUuc29tZUNoaWxkcmVuU2VsZWN0ZWQoKSAmJiAhbm9kZS5hbGxDaGlsZHJlblNlbGVjdGVkKClcIi8+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgVHJlZU5vZGVDaGVja2JveENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgbm9kZTogVHJlZU5vZGU7XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIC8qIFNldCBvbiBRdWVyeSAqL1xuICAgIGlmICh0aGlzLm5vZGUucGFyZW50ICYmIHRoaXMubm9kZS5vcHRpb25zLmxhenlTZWxlY3QgJiYgdGhpcy5ub2RlLnBhcmVudC5hbGxDaGlsZHJlblNlbGVjdGVkKCkpIHtcbiAgICAgICAgdGhpcy5ub2RlLnNldElzU2VsZWN0ZWQodGhpcy5ub2RlLnBhcmVudC5hbGxDaGlsZHJlblNlbGVjdGVkKCkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3QgeyBub2RlIH0gPSBjaGFuZ2VzO1xuICAgIGlmIChub2RlKSB7XG4gICAgICB0aGlzLm5vZGUgPSBub2RlLmN1cnJlbnRWYWx1ZTtcbiAgICB9XG4gIH1cblxufVxuIl19