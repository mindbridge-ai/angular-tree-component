var _a;
import { KEYS } from '../constants/keys';
import defaultsDeep from 'lodash/defaultsDeep';
import get from 'lodash/get';
import omit from 'lodash/omit';
import isNumber from 'lodash/isNumber';
export var TREE_ACTIONS = {
    TOGGLE_ACTIVE: function (tree, node, $event) { return node && node.toggleActivated(); },
    TOGGLE_ACTIVE_MULTI: function (tree, node, $event) { return node && node.toggleActivated(true); },
    TOGGLE_SELECTED: function (tree, node, $event) { return node && node.toggleSelected(); },
    ACTIVATE: function (tree, node, $event) { return node.setIsActive(true); },
    DEACTIVATE: function (tree, node, $event) { return node.setIsActive(false); },
    SELECT: function (tree, node, $event) { return node.setIsSelected(true); },
    DESELECT: function (tree, node, $event) { return node.setIsSelected(false); },
    FOCUS: function (tree, node, $event) { return node.focus(); },
    TOGGLE_EXPANDED: function (tree, node, $event) { return node.hasChildren && node.toggleExpanded(); },
    EXPAND: function (tree, node, $event) { return node.expand(); },
    COLLAPSE: function (tree, node, $event) { return node.collapse(); },
    DRILL_DOWN: function (tree, node, $event) { return tree.focusDrillDown(); },
    DRILL_UP: function (tree, node, $event) { return tree.focusDrillUp(); },
    NEXT_NODE: function (tree, node, $event) { return tree.focusNextNode(); },
    PREVIOUS_NODE: function (tree, node, $event) { return tree.focusPreviousNode(); },
    MOVE_NODE: function (tree, node, $event, _a) {
        var from = _a.from, to = _a.to;
        // default action assumes from = node, to = {parent, index}
        if ($event.ctrlKey) {
            tree.copyNode(from, to);
        }
        else {
            tree.moveNode(from, to);
        }
    }
};
var defaultActionMapping = {
    mouse: {
        click: TREE_ACTIONS.TOGGLE_ACTIVE,
        dblClick: null,
        contextMenu: null,
        expanderClick: TREE_ACTIONS.TOGGLE_EXPANDED,
        checkboxClick: TREE_ACTIONS.TOGGLE_SELECTED,
        drop: TREE_ACTIONS.MOVE_NODE
    },
    keys: (_a = {},
        _a[KEYS.RIGHT] = TREE_ACTIONS.DRILL_DOWN,
        _a[KEYS.LEFT] = TREE_ACTIONS.DRILL_UP,
        _a[KEYS.DOWN] = TREE_ACTIONS.NEXT_NODE,
        _a[KEYS.UP] = TREE_ACTIONS.PREVIOUS_NODE,
        _a[KEYS.SPACE] = TREE_ACTIONS.TOGGLE_ACTIVE,
        _a[KEYS.ENTER] = TREE_ACTIONS.TOGGLE_ACTIVE,
        _a)
};
var TreeOptions = /** @class */ (function () {
    function TreeOptions(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.actionMapping = defaultsDeep({}, this.options.actionMapping, defaultActionMapping);
        if (options.rtl) {
            this.actionMapping.keys[KEYS.RIGHT] = get(options, ['actionMapping', 'keys', KEYS.RIGHT]) || TREE_ACTIONS.DRILL_UP;
            this.actionMapping.keys[KEYS.LEFT] = get(options, ['actionMapping', 'keys', KEYS.LEFT]) || TREE_ACTIONS.DRILL_DOWN;
        }
    }
    Object.defineProperty(TreeOptions.prototype, "hasChildrenField", {
        get: function () { return this.options.hasChildrenField || 'hasChildren'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "childrenField", {
        get: function () { return this.options.childrenField || 'children'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "displayField", {
        get: function () { return this.options.displayField || 'name'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "idField", {
        get: function () { return this.options.idField || 'id'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "isExpandedField", {
        get: function () { return this.options.isExpandedField || 'isExpanded'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "getChildren", {
        get: function () { return this.options.getChildren; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "levelPadding", {
        get: function () { return this.options.levelPadding || 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "useVirtualScroll", {
        get: function () { return this.options.useVirtualScroll; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "animateExpand", {
        get: function () { return this.options.animateExpand; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "animateSpeed", {
        get: function () { return this.options.animateSpeed || 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "animateAcceleration", {
        get: function () { return this.options.animateAcceleration || 1.2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "scrollOnActivate", {
        get: function () { return this.options.scrollOnActivate === undefined ? true : this.options.scrollOnActivate; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "rtl", {
        get: function () { return !!this.options.rtl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "rootId", {
        get: function () { return this.options.rootId; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "useCheckbox", {
        get: function () { return this.options.useCheckbox; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "useTriState", {
        get: function () { return this.options.useTriState === undefined ? true : this.options.useTriState; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "scrollContainer", {
        get: function () { return this.options.scrollContainer; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "allowDragoverStyling", {
        get: function () { return this.options.allowDragoverStyling === undefined ? true : this.options.allowDragoverStyling; },
        enumerable: true,
        configurable: true
    });
    TreeOptions.prototype.getNodeClone = function (node) {
        if (this.options.getNodeClone) {
            return this.options.getNodeClone(node);
        }
        return omit(Object.assign({}, node.data), ['id']);
    };
    TreeOptions.prototype.allowDrop = function (element, to, $event) {
        if (this.options.allowDrop instanceof Function) {
            return this.options.allowDrop(element, to, $event);
        }
        else {
            return this.options.allowDrop === undefined ? true : this.options.allowDrop;
        }
    };
    TreeOptions.prototype.allowDrag = function (node) {
        if (this.options.allowDrag instanceof Function) {
            return this.options.allowDrag(node);
        }
        else {
            return this.options.allowDrag;
        }
    };
    TreeOptions.prototype.nodeClass = function (node) {
        return this.options.nodeClass ? this.options.nodeClass(node) : '';
    };
    TreeOptions.prototype.nodeHeight = function (node) {
        if (node.data.virtual) {
            return 0;
        }
        var nodeHeight = this.options.nodeHeight || 22;
        if (typeof nodeHeight === 'function') {
            nodeHeight = nodeHeight(node);
        }
        // account for drop slots:
        return nodeHeight + (node.index === 0 ? 2 : 1) * this.dropSlotHeight;
    };
    Object.defineProperty(TreeOptions.prototype, "dropSlotHeight", {
        get: function () {
            return isNumber(this.options.dropSlotHeight) ? this.options.dropSlotHeight : 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "lazySelect", {
        get: function () {
            return this.options.lazySelect !== undefined ? this.options.lazySelect : false;
        },
        enumerable: true,
        configurable: true
    });
    return TreeOptions;
}());
export { TreeOptions };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1vcHRpb25zLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL21vZGVscy90cmVlLW9wdGlvbnMubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUd6QyxPQUFPLFlBQVksTUFBTSxxQkFBcUIsQ0FBQztBQUMvQyxPQUFPLEdBQUcsTUFBTSxZQUFZLENBQUM7QUFDN0IsT0FBTyxJQUFJLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sUUFBUSxNQUFNLGlCQUFpQixDQUFDO0FBTXZDLE1BQU0sQ0FBQyxJQUFNLFlBQVksR0FBRztJQUMxQixhQUFhLEVBQUUsVUFBQyxJQUFlLEVBQUUsSUFBYyxFQUFFLE1BQVcsSUFBSyxPQUFBLElBQUksSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQTlCLENBQThCO0lBQy9GLG1CQUFtQixFQUFFLFVBQUMsSUFBZSxFQUFFLElBQWMsRUFBRSxNQUFXLElBQUssT0FBQSxJQUFJLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBbEMsQ0FBa0M7SUFDekcsZUFBZSxFQUFFLFVBQUMsSUFBZSxFQUFFLElBQWMsRUFBRSxNQUFXLElBQUssT0FBQSxJQUFJLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUE3QixDQUE2QjtJQUNoRyxRQUFRLEVBQUUsVUFBQyxJQUFlLEVBQUUsSUFBYyxFQUFFLE1BQVcsSUFBSyxPQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQXRCLENBQXNCO0lBQ2xGLFVBQVUsRUFBRSxVQUFDLElBQWUsRUFBRSxJQUFjLEVBQUUsTUFBVyxJQUFLLE9BQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBdkIsQ0FBdUI7SUFDckYsTUFBTSxFQUFFLFVBQUMsSUFBZSxFQUFFLElBQWMsRUFBRSxNQUFXLElBQUssT0FBQSxJQUFJ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YUFBZDtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2pGLENBQUM7OztPQUFBO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBaEZELElBZ0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJlZU5vZGUgfSBmcm9tICcuL3RyZWUtbm9kZS5tb2RlbCc7XG5pbXBvcnQgeyBUcmVlTW9kZWwgfSBmcm9tICcuL3RyZWUubW9kZWwnO1xuaW1wb3J0IHsgS0VZUyB9IGZyb20gJy4uL2NvbnN0YW50cy9rZXlzJztcbmltcG9ydCB7IElUcmVlT3B0aW9ucyB9IGZyb20gJy4uL2RlZnMvYXBpJztcblxuaW1wb3J0IGRlZmF1bHRzRGVlcCBmcm9tICdsb2Rhc2gvZGVmYXVsdHNEZWVwJztcbmltcG9ydCBnZXQgZnJvbSAnbG9kYXNoL2dldCc7XG5pbXBvcnQgb21pdCBmcm9tICdsb2Rhc2gvb21pdCc7XG5pbXBvcnQgaXNOdW1iZXIgZnJvbSAnbG9kYXNoL2lzTnVtYmVyJztcblxuZXhwb3J0IGludGVyZmFjZSBJQWN0aW9uSGFuZGxlciB7XG4gICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSwgLi4ucmVzdCk7XG59XG5cbmV4cG9ydCBjb25zdCBUUkVFX0FDVElPTlMgPSB7XG4gIFRPR0dMRV9BQ1RJVkU6ICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSkgPT4gbm9kZSAmJiBub2RlLnRvZ2dsZUFjdGl2YXRlZCgpLFxuICBUT0dHTEVfQUNUSVZFX01VTFRJOiAodHJlZTogVHJlZU1vZGVsLCBub2RlOiBUcmVlTm9kZSwgJGV2ZW50OiBhbnkpID0+IG5vZGUgJiYgbm9kZS50b2dnbGVBY3RpdmF0ZWQodHJ1ZSksXG4gIFRPR0dMRV9TRUxFQ1RFRDogKHRyZWU6IFRyZWVNb2RlbCwgbm9kZTogVHJlZU5vZGUsICRldmVudDogYW55KSA9PiBub2RlICYmIG5vZGUudG9nZ2xlU2VsZWN0ZWQoKSxcbiAgQUNUSVZBVEU6ICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSkgPT4gbm9kZS5zZXRJc0FjdGl2ZSh0cnVlKSxcbiAgREVBQ1RJVkFURTogKHRyZWU6IFRyZWVNb2RlbCwgbm9kZTogVHJlZU5vZGUsICRldmVudDogYW55KSA9PiBub2RlLnNldElzQWN0aXZlKGZhbHNlKSxcbiAgU0VMRUNUOiAodHJlZTogVHJlZU1vZGVsLCBub2RlOiBUcmVlTm9kZSwgJGV2ZW50OiBhbnkpID0+IG5vZGUuc2V0SXNTZWxlY3RlZCh0cnVlKSxcbiAgREVTRUxFQ1Q6ICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSkgPT4gbm9kZS5zZXRJc1NlbGVjdGVkKGZhbHNlKSxcbiAgRk9DVVM6ICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSkgPT4gbm9kZS5mb2N1cygpLFxuICBUT0dHTEVfRVhQQU5ERUQ6ICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSkgPT4gbm9kZS5oYXNDaGlsZHJlbiAmJiBub2RlLnRvZ2dsZUV4cGFuZGVkKCksXG4gIEVYUEFORDogKHRyZWU6IFRyZWVNb2RlbCwgbm9kZTogVHJlZU5vZGUsICRldmVudDogYW55KSA9PiBub2RlLmV4cGFuZCgpLFxuICBDT0xMQVBTRTogKHRyZWU6IFRyZWVNb2RlbCwgbm9kZTogVHJlZU5vZGUsICRldmVudDogYW55KSA9PiBub2RlLmNvbGxhcHNlKCksXG4gIERSSUxMX0RPV046ICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSkgPT4gdHJlZS5mb2N1c0RyaWxsRG93bigpLFxuICBEUklMTF9VUDogKHRyZWU6IFRyZWVNb2RlbCwgbm9kZTogVHJlZU5vZGUsICRldmVudDogYW55KSA9PiB0cmVlLmZvY3VzRHJpbGxVcCgpLFxuICBORVhUX05PREU6ICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSkgPT4gIHRyZWUuZm9jdXNOZXh0Tm9kZSgpLFxuICBQUkVWSU9VU19OT0RFOiAodHJlZTogVHJlZU1vZGVsLCBub2RlOiBUcmVlTm9kZSwgJGV2ZW50OiBhbnkpID0+ICB0cmVlLmZvY3VzUHJldmlvdXNOb2RlKCksXG4gIE1PVkVfTk9ERTogKHRyZWU6IFRyZWVNb2RlbCwgbm9kZTogVHJlZU5vZGUsICRldmVudDogYW55LCB7ZnJvbSAsIHRvfToge2Zyb206IGFueSwgdG86IGFueX0pID0+IHtcbiAgICAvLyBkZWZhdWx0IGFjdGlvbiBhc3N1bWVzIGZyb20gPSBub2RlLCB0byA9IHtwYXJlbnQsIGluZGV4fVxuICAgIGlmICgkZXZlbnQuY3RybEtleSkge1xuICAgICAgdHJlZS5jb3B5Tm9kZShmcm9tLCB0byk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyZWUubW92ZU5vZGUoZnJvbSwgdG8pO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgZGVmYXVsdEFjdGlvbk1hcHBpbmc6IElBY3Rpb25NYXBwaW5nID0ge1xuICBtb3VzZToge1xuICAgIGNsaWNrOiBUUkVFX0FDVElPTlMuVE9HR0xFX0FDVElWRSxcbiAgICBkYmxDbGljazogbnVsbCxcbiAgICBjb250ZXh0TWVudTogbnVsbCxcbiAgICBleHBhbmRlckNsaWNrOiBUUkVFX0FDVElPTlMuVE9HR0xFX0VYUEFOREVELFxuICAgIGNoZWNrYm94Q2xpY2s6IFRSRUVfQUNUSU9OUy5UT0dHTEVfU0VMRUNURUQsXG4gICAgZHJvcDogVFJFRV9BQ1RJT05TLk1PVkVfTk9ERVxuICB9LFxuICBrZXlzOiB7XG4gICAgW0tFWVMuUklHSFRdOiBUUkVFX0FDVElPTlMuRFJJTExfRE9XTixcbiAgICBbS0VZUy5MRUZUXTogVFJFRV9BQ1RJT05TLkRSSUxMX1VQLFxuICAgIFtLRVlTLkRPV05dOiBUUkVFX0FDVElPTlMuTkVYVF9OT0RFLFxuICAgIFtLRVlTLlVQXTogVFJFRV9BQ1RJT05TLlBSRVZJT1VTX05PREUsXG4gICAgW0tFWVMuU1BBQ0VdOiBUUkVFX0FDVElPTlMuVE9HR0xFX0FDVElWRSxcbiAgICBbS0VZUy5FTlRFUl06IFRSRUVfQUNUSU9OUy5UT0dHTEVfQUNUSVZFXG4gIH1cbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUFjdGlvbk1hcHBpbmcge1xuICBtb3VzZT86IHtcbiAgICBjbGljaz86IElBY3Rpb25IYW5kbGVyLFxuICAgIGRibENsaWNrPzogSUFjdGlvbkhhbmRsZXIsXG4gICAgY29udGV4dE1lbnU/OiBJQWN0aW9uSGFuZGxlcixcbiAgICBleHBhbmRlckNsaWNrPzogSUFjdGlvbkhhbmRsZXIsXG4gICAgY2hlY2tib3hDbGljaz86IElBY3Rpb25IYW5kbGVyLFxuICAgIGRyYWdTdGFydD86IElBY3Rpb25IYW5kbGVyLFxuICAgIGRyYWc/OiBJQWN0aW9uSGFuZGxlcixcbiAgICBkcmFnRW5kPzogSUFjdGlvbkhhbmRsZXIsXG4gICAgZHJhZ092ZXI/OiBJQWN0aW9uSGFuZGxlcixcbiAgICBkcmFnTGVhdmU/OiBJQWN0aW9uSGFuZGxlcixcbiAgICBkcmFnRW50ZXI/OiBJQWN0aW9uSGFuZGxlcixcbiAgICBkcm9wPzogSUFjdGlvbkhhbmRsZXJcbiAgfTtcbiAga2V5cz86IHtcbiAgICBba2V5OiBudW1iZXJdOiBJQWN0aW9uSGFuZGxlclxuICB9O1xufVxuXG5leHBvcnQgY2xhc3MgVHJlZU9wdGlvbnMge1xuICBnZXQgaGFzQ2hpbGRyZW5GaWVsZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vcHRpb25zLmhhc0NoaWxkcmVuRmllbGQgfHwgJ2hhc0NoaWxkcmVuJzsgfVxuICBnZXQgY2hpbGRyZW5GaWVsZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vcHRpb25zLmNoaWxkcmVuRmllbGQgfHwgJ2NoaWxkcmVuJzsgfVxuICBnZXQgZGlzcGxheUZpZWxkKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm9wdGlvbnMuZGlzcGxheUZpZWxkIHx8ICduYW1lJzsgfVxuICBnZXQgaWRGaWVsZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vcHRpb25zLmlkRmllbGQgfHwgJ2lkJzsgfVxuICBnZXQgaXNFeHBhbmRlZEZpZWxkKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm9wdGlvbnMuaXNFeHBhbmRlZEZpZWxkIHx8ICdpc0V4cGFuZGVkJzsgfVxuICBnZXQgZ2V0Q2hpbGRyZW4oKTogYW55IHsgcmV0dXJuIHRoaXMub3B0aW9ucy5nZXRDaGlsZHJlbjsgfVxuICBnZXQgbGV2ZWxQYWRkaW5nKCk6IG51bWJlciB7IHJldHVybiB0aGlzLm9wdGlvbnMubGV2ZWxQYWRkaW5nIHx8IDA7IH1cbiAgZ2V0IHVzZVZpcnR1YWxTY3JvbGwoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm9wdGlvbnMudXNlVmlydHVhbFNjcm9sbDsgfVxuICBnZXQgYW5pbWF0ZUV4cGFuZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMub3B0aW9ucy5hbmltYXRlRXhwYW5kOyB9XG4gIGdldCBhbmltYXRlU3BlZWQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMub3B0aW9ucy5hbmltYXRlU3BlZWQgfHwgMTsgfVxuICBnZXQgYW5pbWF0ZUFjY2VsZXJhdGlvbigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5vcHRpb25zLmFuaW1hdGVBY2NlbGVyYXRpb24gfHwgMS4yOyB9XG4gIGdldCBzY3JvbGxPbkFjdGl2YXRlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbE9uQWN0aXZhdGUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiB0aGlzLm9wdGlvbnMuc2Nyb2xsT25BY3RpdmF0ZTsgfVxuICBnZXQgcnRsKCk6IGJvb2xlYW4geyByZXR1cm4gISF0aGlzLm9wdGlvbnMucnRsOyB9XG4gIGdldCByb290SWQoKTogYW55IHtyZXR1cm4gdGhpcy5vcHRpb25zLnJvb3RJZDsgfVxuICBnZXQgdXNlQ2hlY2tib3goKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm9wdGlvbnMudXNlQ2hlY2tib3g7IH1cbiAgZ2V0IHVzZVRyaVN0YXRlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5vcHRpb25zLnVzZVRyaVN0YXRlID09PSB1bmRlZmluZWQgPyB0cnVlIDogdGhpcy5vcHRpb25zLnVzZVRyaVN0YXRlOyB9XG4gIGdldCBzY3JvbGxDb250YWluZXIoKTogSFRNTEVsZW1lbnQgeyByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbENvbnRhaW5lcjsgfVxuICBnZXQgYWxsb3dEcmFnb3ZlclN0eWxpbmcoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm9wdGlvbnMuYWxsb3dEcmFnb3ZlclN0eWxpbmcgPT09IHVuZGVmaW5lZCA/IHRydWUgOiB0aGlzLm9wdGlvbnMuYWxsb3dEcmFnb3ZlclN0eWxpbmc7IH1cbiAgYWN0aW9uTWFwcGluZzogSUFjdGlvbk1hcHBpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBJVHJlZU9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuYWN0aW9uTWFwcGluZyA9IGRlZmF1bHRzRGVlcCh7fSwgdGhpcy5vcHRpb25zLmFjdGlvbk1hcHBpbmcsIGRlZmF1bHRBY3Rpb25NYXBwaW5nKTtcbiAgICBpZiAob3B0aW9ucy5ydGwpIHtcbiAgICAgIHRoaXMuYWN0aW9uTWFwcGluZy5rZXlzW0tFWVMuUklHSFRdID0gPElBY3Rpb25IYW5kbGVyPmdldChvcHRpb25zLCBbJ2FjdGlvbk1hcHBpbmcnLCAna2V5cycsIEtFWVMuUklHSFRdKSB8fCBUUkVFX0FDVElPTlMuRFJJTExfVVA7XG4gICAgICB0aGlzLmFjdGlvbk1hcHBpbmcua2V5c1tLRVlTLkxFRlRdID0gPElBY3Rpb25IYW5kbGVyPmdldChvcHRpb25zLCBbJ2FjdGlvbk1hcHBpbmcnLCAna2V5cycsIEtFWVMuTEVGVF0pIHx8IFRSRUVfQUNUSU9OUy5EUklMTF9ET1dOO1xuICAgIH1cbiAgfVxuXG4gIGdldE5vZGVDbG9uZShub2RlOiBUcmVlTm9kZSk6IGFueSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXROb2RlQ2xvbmUpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZ2V0Tm9kZUNsb25lKG5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiBvbWl0KE9iamVjdC5hc3NpZ24oe30sIG5vZGUuZGF0YSksIFsnaWQnXSk7XG4gIH1cblxuICBhbGxvd0Ryb3AoZWxlbWVudCwgdG8sICRldmVudD8pOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmFsbG93RHJvcCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmFsbG93RHJvcChlbGVtZW50LCB0bywgJGV2ZW50KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmFsbG93RHJvcCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHRoaXMub3B0aW9ucy5hbGxvd0Ryb3A7XG4gICAgfVxuICB9XG5cbiAgYWxsb3dEcmFnKG5vZGU6IFRyZWVOb2RlKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5hbGxvd0RyYWcgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5hbGxvd0RyYWcobm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYWxsb3dEcmFnO1xuICAgIH1cbiAgfVxuXG4gIG5vZGVDbGFzcyhub2RlOiBUcmVlTm9kZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ub2RlQ2xhc3MgPyB0aGlzLm9wdGlvbnMubm9kZUNsYXNzKG5vZGUpIDogJyc7XG4gIH1cblxuICBub2RlSGVpZ2h0KG5vZGU6IFRyZWVOb2RlKTogbnVtYmVyIHtcbiAgICBpZiAobm9kZS5kYXRhLnZpcnR1YWwpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGxldCBub2RlSGVpZ2h0ID0gdGhpcy5vcHRpb25zLm5vZGVIZWlnaHQgfHwgMjI7XG5cbiAgICBpZiAodHlwZW9mIG5vZGVIZWlnaHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG5vZGVIZWlnaHQgPSBub2RlSGVpZ2h0KG5vZGUpO1xuICAgIH1cblxuICAgIC8vIGFjY291bnQgZm9yIGRyb3Agc2xvdHM6XG4gICAgcmV0dXJuIG5vZGVIZWlnaHQgKyAobm9kZS5pbmRleCA9PT0gMCA/ICAyIDogMSkgKiB0aGlzLmRyb3BTbG90SGVpZ2h0O1xuICB9XG5cbiAgZ2V0IGRyb3BTbG90SGVpZ2h0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGlzTnVtYmVyKHRoaXMub3B0aW9ucy5kcm9wU2xvdEhlaWdodCkgPyB0aGlzLm9wdGlvbnMuZHJvcFNsb3RIZWlnaHQgOiAyO1xuICB9XG5cbiAgZ2V0IGxhenlTZWxlY3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5sYXp5U2VsZWN0ICE9PSB1bmRlZmluZWQgPyB0aGlzLm9wdGlvbnMubGF6eVNlbGVjdCA6IGZhbHNlO1xuICB9XG59XG4iXX0=