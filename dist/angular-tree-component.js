import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobxAngularModule } from 'mobx-angular';
import { TREE_ACTIONS } from './models/tree-options.model';
import { KEYS } from './constants/keys';
import { TreeModel } from './models/tree.model';
import { TreeNode } from './models/tree-node.model';
import { TreeDraggedElement } from './models/tree-dragged-element.model';
import { TreeVirtualScroll } from './models/tree-virtual-scroll.model';
import { LoadingComponent } from './components/loading.component';
import { TreeComponent } from './components/tree.component';
import { TreeNodeComponent } from './components/tree-node.component';
import { TreeNodeContent } from './components/tree-node-content.component';
import { TreeNodeDropSlot } from './components/tree-node-drop-slot.component';
import { TreeNodeExpanderComponent } from './components/tree-node-expander.component';
import { TreeNodeChildrenComponent } from './components/tree-node-children.component';
import { TreeNodeCollectionComponent } from './components/tree-node-collection.component';
import { TreeNodeWrapperComponent } from './components/tree-node-wrapper.component';
import { TreeViewportComponent } from './components/tree-viewport.component';
import { TreeNodeCheckboxComponent } from './components/tree-node-checkbox.component';
import { TreeDropDirective } from './directives/tree-drop.directive';
import { TreeDragDirective } from './directives/tree-drag.directive';
import { TreeAnimateOpenDirective } from './directives/tree-animate-open.directive';
import './polyfills';
var TreeModule = /** @class */ (function () {
    function TreeModule() {
    }
    TreeModule.forRoot = function () {
        return {
            ngModule: TreeModule,
            providers: [TreeDraggedElement]
        };
    };
    TreeModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        TreeComponent,
                        TreeNodeComponent,
                        TreeNodeContent,
                        LoadingComponent,
                        TreeDropDirective,
                        TreeDragDirective,
                        TreeNodeExpanderComponent,
                        TreeNodeChildrenComponent,
                        TreeNodeDropSlot,
                        TreeNodeCollectionComponent,
                        TreeViewportComponent,
                        TreeNodeWrapperComponent,
                        TreeNodeCheckboxComponent,
                        TreeAnimateOpenDirective
                    ],
                    exports: [
                        TreeComponent,
                        TreeNodeComponent,
                        TreeNodeContent,
                        LoadingComponent,
                        TreeDropDirective,
                        TreeDragDirective,
                        TreeNodeExpanderComponent,
                        TreeNodeChildrenComponent,
                        TreeNodeDropSlot,
                        TreeNodeCollectionComponent,
                        TreeViewportComponent,
                        TreeNodeWrapperComponent,
                        TreeNodeCheckboxComponent,
                        TreeAnimateOpenDirective
                    ],
                    imports: [
                        CommonModule,
                        MobxAngularModule
                    ],
                    providers: []
                },] },
    ];
    return TreeModule;
}());
export { TreeModule };
export { TreeModel, TreeNode, TreeDraggedElement, TreeVirtualScroll, TREE_ACTIONS, KEYS, LoadingComponent, TreeAnimateOpenDirective, TreeComponent, TreeNodeComponent, TreeNodeWrapperComponent, TreeNodeContent, TreeDropDirective, TreeDragDirective, TreeNodeExpanderComponent, TreeNodeChildrenComponent, TreeNodeDropSlot, TreeNodeCollectionComponent, TreeViewportComponent, TreeNodeCheckboxComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci10cmVlLWNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9hbmd1bGFyLXRyZWUtY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFakQsT0FBTyxFQUFrQyxZQUFZLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUUzRixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDeEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQzlFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQzFGLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBRXBGLE9BQU8sYUFBYSxDQUFDO0FBRXJCO0lBQUE7SUE4Q0EsQ0FBQztJQU5RLGtCQUFPLEdBQWQ7UUFDRSxPQUFPO1lBQ0wsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLENBQUMsa0JBQWtCLENBQUM7U0FDaEMsQ0FBQztJQUNKLENBQUM7O2dCQTdDRixRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFO3dCQUNaLGFBQWE7d0JBQ2IsaUJBQWlCO3dCQUNqQixlQUFlO3dCQUNmLGdCQUFnQjt3QkFDaEIsaUJBQWlCO3dCQUNqQixpQkFBaUI7d0JBQ2pCLHlCQUF5Qjt3QkFDekIseUJBQXlCO3dCQUN6QixnQkFBZ0I7d0JBQ2hCLDJCQUEyQjt3QkFDM0IscUJBQXFCO3dCQUNyQix3QkFBd0I7d0JBQ3hCLHlCQUF5Qjt3QkFDekIsd0JBQXdCO3FCQUN6QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsYUFBYTt3QkFDYixpQkFBaUI7d0JBQ2pCLGVBQWU7d0JBQ2YsZ0JBQWdCO3dCQUNoQixpQkFBaUI7d0JBQ2pCLGlCQUFpQjt3QkFDakIseUJBQXlCO3dCQUN6Qix5QkFBeUI7d0JBQ3pCLGdCQUFnQjt3QkFDaEIsMkJBQTJCO3dCQUMzQixxQkFBcUI7d0JBQ3JCLHdCQUF3Qjt3QkFDeEIseUJBQXlCO3dCQUN6Qix3QkFBd0I7cUJBQ3pCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLGlCQUFpQjtxQkFDbEI7b0JBQ0QsU0FBUyxFQUFFLEVBQUU7aUJBQ2Q7O0lBUUQsaUJBQUM7Q0FBQSxBQTlDRCxJQThDQztTQVBZLFVBQVU7QUFTdkIsT0FBTyxFQUNMLFNBQVMsRUFDVCxRQUFRLEVBQ1Isa0JBQWtCLEVBQ2xCLGlCQUFpQixFQUVqQixZQUFZLEVBQ1osSUFBSSxFQUtKLGdCQUFnQixFQUNoQix3QkFBd0IsRUFDeEIsYUFBYSxFQUNiLGlCQUFpQixFQUNqQix3QkFBd0IsRUFDeEIsZUFBZSxFQUNmLGlCQUFpQixFQUNqQixpQkFBaUIsRUFDakIseUJBQXlCLEVBQ3pCLHlCQUF5QixFQUN6QixnQkFBZ0IsRUFDaEIsMkJBQTJCLEVBQzNCLHFCQUFxQixFQUNyQix5QkFBeUIsRUFFMUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTW9ieEFuZ3VsYXJNb2R1bGUgfSBmcm9tICdtb2J4LWFuZ3VsYXInO1xuXG5pbXBvcnQgeyBJQWN0aW9uSGFuZGxlciwgSUFjdGlvbk1hcHBpbmcsIFRSRUVfQUNUSU9OUyB9IGZyb20gJy4vbW9kZWxzL3RyZWUtb3B0aW9ucy5tb2RlbCc7XG5pbXBvcnQgeyBJQWxsb3dEcmFnRm4sIElBbGxvd0Ryb3BGbiwgSVRyZWVPcHRpb25zLCBJVHJlZVN0YXRlIH0gZnJvbSAnLi9kZWZzL2FwaSc7XG5pbXBvcnQgeyBLRVlTIH0gZnJvbSAnLi9jb25zdGFudHMva2V5cyc7XG5pbXBvcnQgeyBUcmVlTW9kZWwgfSBmcm9tICcuL21vZGVscy90cmVlLm1vZGVsJztcbmltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi9tb2RlbHMvdHJlZS1ub2RlLm1vZGVsJztcbmltcG9ydCB7IFRyZWVEcmFnZ2VkRWxlbWVudCB9IGZyb20gJy4vbW9kZWxzL3RyZWUtZHJhZ2dlZC1lbGVtZW50Lm1vZGVsJztcbmltcG9ydCB7IFRyZWVWaXJ0dWFsU2Nyb2xsIH0gZnJvbSAnLi9tb2RlbHMvdHJlZS12aXJ0dWFsLXNjcm9sbC5tb2RlbCc7XG5pbXBvcnQgeyBMb2FkaW5nQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2xvYWRpbmcuY29tcG9uZW50JztcbmltcG9ydCB7IFRyZWVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgVHJlZU5vZGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS1ub2RlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUcmVlTm9kZUNvbnRlbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS1ub2RlLWNvbnRlbnQuY29tcG9uZW50JztcbmltcG9ydCB7IFRyZWVOb2RlRHJvcFNsb3QgfSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS1ub2RlLWRyb3Atc2xvdC5jb21wb25lbnQnO1xuaW1wb3J0IHsgVHJlZU5vZGVFeHBhbmRlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90cmVlLW5vZGUtZXhwYW5kZXIuY29tcG9uZW50JztcbmltcG9ydCB7IFRyZWVOb2RlQ2hpbGRyZW5Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS1ub2RlLWNoaWxkcmVuLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUcmVlTm9kZUNvbGxlY3Rpb25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS1ub2RlLWNvbGxlY3Rpb24uY29tcG9uZW50JztcbmltcG9ydCB7IFRyZWVOb2RlV3JhcHBlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90cmVlLW5vZGUtd3JhcHBlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgVHJlZVZpZXdwb3J0Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RyZWUtdmlld3BvcnQuY29tcG9uZW50JztcbmltcG9ydCB7IFRyZWVOb2RlQ2hlY2tib3hDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS1ub2RlLWNoZWNrYm94LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUcmVlRHJvcERpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy90cmVlLWRyb3AuZGlyZWN0aXZlJztcbmltcG9ydCB7IFRyZWVEcmFnRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL3RyZWUtZHJhZy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgVHJlZUFuaW1hdGVPcGVuRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL3RyZWUtYW5pbWF0ZS1vcGVuLmRpcmVjdGl2ZSc7XG5cbmltcG9ydCAnLi9wb2x5ZmlsbHMnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBUcmVlQ29tcG9uZW50LFxuICAgIFRyZWVOb2RlQ29tcG9uZW50LFxuICAgIFRyZWVOb2RlQ29udGVudCxcbiAgICBMb2FkaW5nQ29tcG9uZW50LFxuICAgIFRyZWVEcm9wRGlyZWN0aXZlLFxuICAgIFRyZWVEcmFnRGlyZWN0aXZlLFxuICAgIFRyZWVOb2RlRXhwYW5kZXJDb21wb25lbnQsXG4gICAgVHJlZU5vZGVDaGlsZHJlbkNvbXBvbmVudCxcbiAgICBUcmVlTm9kZURyb3BTbG90LFxuICAgIFRyZWVOb2RlQ29sbGVjdGlvbkNvbXBvbmVudCxcbiAgICBUcmVlVmlld3BvcnRDb21wb25lbnQsXG4gICAgVHJlZU5vZGVXcmFwcGVyQ29tcG9uZW50LFxuICAgIFRyZWVOb2RlQ2hlY2tib3hDb21wb25lbnQsXG4gICAgVHJlZUFuaW1hdGVPcGVuRGlyZWN0aXZlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBUcmVlQ29tcG9uZW50LFxuICAgIFRyZWVOb2RlQ29tcG9uZW50LFxuICAgIFRyZWVOb2RlQ29udGVudCxcbiAgICBMb2FkaW5nQ29tcG9uZW50LFxuICAgIFRyZWVEcm9wRGlyZWN0aXZlLFxuICAgIFRyZWVEcmFnRGlyZWN0aXZlLFxuICAgIFRyZWVOb2RlRXhwYW5kZXJDb21wb25lbnQsXG4gICAgVHJlZU5vZGVDaGlsZHJlbkNvbXBvbmVudCxcbiAgICBUcmVlTm9kZURyb3BTbG90LFxuICAgIFRyZWVOb2RlQ29sbGVjdGlvbkNvbXBvbmVudCxcbiAgICBUcmVlVmlld3BvcnRDb21wb25lbnQsXG4gICAgVHJlZU5vZGVXcmFwcGVyQ29tcG9uZW50LFxuICAgIFRyZWVOb2RlQ2hlY2tib3hDb21wb25lbnQsXG4gICAgVHJlZUFuaW1hdGVPcGVuRGlyZWN0aXZlXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgTW9ieEFuZ3VsYXJNb2R1bGVcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBUcmVlTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBUcmVlTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbVHJlZURyYWdnZWRFbGVtZW50XVxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgVHJlZU1vZGVsLFxuICBUcmVlTm9kZSxcbiAgVHJlZURyYWdnZWRFbGVtZW50LFxuICBUcmVlVmlydHVhbFNjcm9sbCxcbiAgSVRyZWVPcHRpb25zLFxuICBUUkVFX0FDVElPTlMsXG4gIEtFWVMsXG4gIElBY3Rpb25NYXBwaW5nLFxuICBJQWN0aW9uSGFuZGxlcixcbiAgSUFsbG93RHJvcEZuLFxuICBJQWxsb3dEcmFnRm4sXG4gIExvYWRpbmdDb21wb25lbnQsXG4gIFRyZWVBbmltYXRlT3BlbkRpcmVjdGl2ZSxcbiAgVHJlZUNvbXBvbmVudCxcbiAgVHJlZU5vZGVDb21wb25lbnQsXG4gIFRyZWVOb2RlV3JhcHBlckNvbXBvbmVudCxcbiAgVHJlZU5vZGVDb250ZW50LFxuICBUcmVlRHJvcERpcmVjdGl2ZSxcbiAgVHJlZURyYWdEaXJlY3RpdmUsXG4gIFRyZWVOb2RlRXhwYW5kZXJDb21wb25lbnQsXG4gIFRyZWVOb2RlQ2hpbGRyZW5Db21wb25lbnQsXG4gIFRyZWVOb2RlRHJvcFNsb3QsXG4gIFRyZWVOb2RlQ29sbGVjdGlvbkNvbXBvbmVudCxcbiAgVHJlZVZpZXdwb3J0Q29tcG9uZW50LFxuICBUcmVlTm9kZUNoZWNrYm94Q29tcG9uZW50LFxuICBJVHJlZVN0YXRlXG59O1xuIl19