var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { observable, computed, reaction, action } from 'mobx';
import { TREE_EVENTS } from '../constants/events';
import first from 'lodash/first';
import last from 'lodash/last';
import some from 'lodash/some';
import every from 'lodash/every';
var TreeNode = /** @class */ (function () {
    function TreeNode(data, parent, treeModel, index) {
        var _this = this;
        this.data = data;
        this.parent = parent;
        this.treeModel = treeModel;
        this._someChildrenSelected = false;
        this._allChildrenSelected = false;
        this.internalSelectState = false;
        this.position = 0;
        this.allowDrop = function (element, $event) {
            return _this.options.allowDrop(element, { parent: _this, index: 0 }, $event);
        };
        this.allowDragoverStyling = function () {
            return _this.options.allowDragoverStyling;
        };
        if (this.id === undefined || this.id === null) {
            this.id = uuid();
        } // Make sure there's a unique id without overriding existing ids to work with immutable data structures
        this.index = index;
        if (this.getField('children')) {
            this._initChildren();
        }
        this.autoLoadChildren();
        this.updateChildrenSelectionStatus();
    }
    Object.defineProperty(TreeNode.prototype, "isHidden", {
        get: function () {
            return this.treeModel.isHidden(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "isExpanded", {
        get: function () {
            return this.treeModel.isExpanded(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "isActive", {
        get: function () {
            return this.treeModel.isActive(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "isFocused", {
        get: function () {
            return this.treeModel.isNodeFocused(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "isSelected", {
        get: function () {
            if (this.isSelectable()) {
                return this.treeModel.isSelected(this);
            }
            else if (this.options.lazySelect) {
                return this.someChildrenSelected();
            }
            else {
                return some(this.children, function (node) { return node.isSelected; });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "isPartiallySelected", {
        get: function () {
            // evaluates to this._someChildrenSelected && !this._allChildrenSelected;
            return this.isSelected && !this.isAllSelected();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "level", {
        get: function () {
            return this.parent ? this.parent.level + 1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "path", {
        get: function () {
            return this.parent ? this.parent.path.concat([this.id]) : [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "elementRef", {
        get: function () {
            throw "Element Ref is no longer supported since introducing virtual scroll\n\n      You may use a template to obtain a reference to the element";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "originalNode", {
        get: function () {
            return this._originalNode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "hasChildren", {
        // helper get functions:
        get: function () {
            return !!(this.getField('hasChildren') ||
                (this.children && this.children.length > 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "isCollapsed", {
        get: function () {
            return !this.isExpanded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "isLeaf", {
        get: function () {
            return !this.hasChildren;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "isRoot", {
        get: function () {
            return this.parent.data.virtual;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "realParent", {
        get: function () {
            return this.isRoot ? null : this.parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "options", {
        // proxy functions:
        get: function () {
            return this.treeModel.options;
        },
        enumerable: true,
        configurable: true
    });
    TreeNode.prototype.fireEvent = function (event) {
        this.treeModel.fireEvent(event);
    };
    Object.defineProperty(TreeNode.prototype, "displayField", {
        // field accessors:
        get: function () {
            return this.getField('display');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "id", {
        get: function () {
            return this.getField('id');
        },
        set: function (value) {
            this.setField('id', value);
        },
        enumerable: true,
        configurable: true
    });
    TreeNode.prototype.getField = function (key) {
        return this.data[this.options[key + "Field"]];
    };
    TreeNode.prototype.setField = function (key, value) {
        this.data[this.options[key + "Field"]] = value;
    };
    // traversing:
    TreeNode.prototype._findAdjacentSibling = function (steps, skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        var siblings = this._getParentsChildren(skipHidden);
        var index = siblings.indexOf(this);
        return siblings.length > index + steps ? siblings[index + steps] : null;
    };
    TreeNode.prototype.findNextSibling = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        return this._findAdjacentSibling(+1, skipHidden);
    };
    TreeNode.prototype.findPreviousSibling = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        return this._findAdjacentSibling(-1, skipHidden);
    };
    TreeNode.prototype.getVisibleChildren = function () {
        return this.visibleChildren;
    };
    Object.defineProperty(TreeNode.prototype, "visibleChildren", {
        get: function () {
            return (this.children || []).filter(function (node) { return !node.isHidden; });
        },
        enumerable: true,
        configurable: true
    });
    TreeNode.prototype.getFirstChild = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        var children = skipHidden ? this.visibleChildren : this.children;
        return first(children || []);
    };
    TreeNode.prototype.getLastChild = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        var children = skipHidden ? this.visibleChildren : this.children;
        return last(children || []);
    };
    TreeNode.prototype.findNextNode = function (goInside, skipHidden) {
        if (goInside === void 0) { goInside = true; }
        if (skipHidden === void 0) { skipHidden = false; }
        return ((goInside && this.isExpanded && this.getFirstChild(skipHidden)) ||
            this.findNextSibling(skipHidden) ||
            (this.parent && this.parent.findNextNode(false, skipHidden)));
    };
    TreeNode.prototype.findPreviousNode = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        var previousSibling = this.findPreviousSibling(skipHidden);
        if (!previousSibling) {
            return this.realParent;
        }
        return previousSibling._getLastOpenDescendant(skipHidden);
    };
    TreeNode.prototype._getLastOpenDescendant = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        var lastChild = this.getLastChild(skipHidden);
        return this.isCollapsed || !lastChild
            ? this
            : lastChild._getLastOpenDescendant(skipHidden);
    };
    TreeNode.prototype._getParentsChildren = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        var children = this.parent &&
            (skipHidden ? this.parent.getVisibleChildren() : this.parent.children);
        return children || [];
    };
    TreeNode.prototype.getIndexInParent = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        return this._getParentsChildren(skipHidden).indexOf(this);
    };
    TreeNode.prototype.isDescendantOf = function (node) {
        if (this === node)
            return true;
        else
            return this.parent && this.parent.isDescendantOf(node);
    };
    TreeNode.prototype.getNodePadding = function () {
        return this.options.levelPadding * (this.level - 1) + 'px';
    };
    TreeNode.prototype.getClass = function () {
        return [this.options.nodeClass(this), "tree-node-level-" + this.level].join(' ');
    };
    TreeNode.prototype.onDrop = function ($event) {
        this.mouseAction('drop', $event.event, {
            from: $event.element,
            to: { parent: this, index: 0, dropOnNode: true }
        });
    };
    TreeNode.prototype.allowDrag = function () {
        return this.options.allowDrag(this);
    };
    // helper methods:
    TreeNode.prototype.loadNodeChildren = function () {
        var _this = this;
        if (!this.options.getChildren) {
            return Promise.resolve(); // Not getChildren method - for using redux
        }
        return Promise.resolve(this.options.getChildren(this))
            .then(function (children) {
            if (children) {
                _this.setField('children', children);
                _this._initChildren();
                if (_this.options.useTriState && _this.treeModel.isSelected(_this)) {
                    _this.setIsSelected(true);
                }
                _this.children.forEach(function (child) {
                    if (child.getField('isExpanded') && child.hasChildren) {
                        child.expand();
                    }
                });
            }
        })
            .then(function () {
            _this.fireEvent({
                eventName: TREE_EVENTS.loadNodeChildren,
                node: _this
            });
        });
    };
    TreeNode.prototype.expand = function () {
        if (!this.isExpanded) {
            this.toggleExpanded();
            if (this.options.lazySelect && this._allChildrenSelected) {
                this.visibleChildren.forEach(function (child) {
                    child.setIsSelected(true);
                });
            }
        }
        return this;
    };
    TreeNode.prototype.collapse = function () {
        if (this.isExpanded) {
            this.toggleExpanded();
        }
        return this;
    };
    TreeNode.prototype.doForAll = function (fn) {
        var _this = this;
        Promise.resolve(fn(this)).then(function () {
            if (_this.children) {
                _this.children.forEach(function (child) { return child.doForAll(fn); });
            }
        });
    };
    TreeNode.prototype.expandAll = function () {
        this.doForAll(function (node) { return node.expand(); });
    };
    TreeNode.prototype.collapseAll = function () {
        this.doForAll(function (node) { return node.collapse(); });
    };
    TreeNode.prototype.ensureVisible = function () {
        if (this.realParent) {
            this.realParent.expand();
            this.realParent.ensureVisible();
        }
        return this;
    };
    TreeNode.prototype.toggleExpanded = function () {
        this.setIsExpanded(!this.isExpanded);
        return this;
    };
    TreeNode.prototype.setIsExpanded = function (value) {
        if (this.hasChildren) {
            this.treeModel.setExpandedNode(this, value);
        }
        return this;
    };
    TreeNode.prototype.autoLoadChildren = function () {
        var _this = this;
        this.handler = reaction(function () { return _this.isExpanded; }, function (isExpanded) {
            if (!_this.children && _this.hasChildren && isExpanded) {
                _this.loadNodeChildren();
            }
        }, { fireImmediately: true });
    };
    TreeNode.prototype.dispose = function () {
        if (this.children) {
            this.children.forEach(function (child) { return child.dispose(); });
        }
        if (this.handler) {
            this.handler();
        }
        this.parent = null;
        this.children = null;
    };
    TreeNode.prototype.setIsActive = function (value, multi) {
        if (multi === void 0) { multi = false; }
        this.treeModel.setActiveNode(this, value, multi);
        if (value) {
            this.focus(this.options.scrollOnActivate);
        }
        return this;
    };
    TreeNode.prototype.isSelectable = function () {
        return this.isLeaf || !this.children || !this.options.useTriState;
    };
    TreeNode.prototype.setIsSelected = function (value) {
        /*
        * All children should be selected/deselected by default
        */
        this._allChildrenSelected = value;
        this._someChildrenSelected = value;
        /*  And hidden indicator that this node has been selected/deselected. */
        this.internalSelectState = value;
        if (this.isSelectable()) {
            this.treeModel.setSelectedNode(this, value);
        }
        return this;
    };
    TreeNode.prototype.toggleSelected = function () {
        var currentStatus = this.internalSelectState;
        this.setIsSelected(!currentStatus);
        if (this.parent) {
            /* We don't wanna update our local copy of children's statuses
            * (because we get that from user action), but ask parent to compute its
            *  children's statuses.
            */
            this.parent.propagateStatusToParents();
        }
        this.propogateStatusDownwards();
        this.emitSelectStatusChange(this, !currentStatus);
        return this;
    };
    TreeNode.prototype.toggleActivated = function (multi) {
        if (multi === void 0) { multi = false; }
        this.setIsActive(!this.isActive, multi);
        return this;
    };
    TreeNode.prototype.setActiveAndVisible = function (multi) {
        if (multi === void 0) { multi = false; }
        this.setIsActive(true, multi).ensureVisible();
        setTimeout(this.scrollIntoView.bind(this));
        return this;
    };
    TreeNode.prototype.scrollIntoView = function (force) {
        if (force === void 0) { force = false; }
        this.treeModel.virtualScroll.scrollIntoView(this, force);
    };
    TreeNode.prototype.focus = function (scroll) {
        if (scroll === void 0) { scroll = true; }
        var previousNode = this.treeModel.getFocusedNode();
        this.treeModel.setFocusedNode(this);
        if (scroll) {
            this.scrollIntoView();
        }
        if (previousNode) {
            this.fireEvent({ eventName: TREE_EVENTS.blur, node: previousNode });
        }
        this.fireEvent({ eventName: TREE_EVENTS.focus, node: this });
        return this;
    };
    TreeNode.prototype.blur = function () {
        var previousNode = this.treeModel.getFocusedNode();
        this.treeModel.setFocusedNode(null);
        if (previousNode) {
            this.fireEvent({ eventName: TREE_EVENTS.blur, node: this });
        }
        return this;
    };
    TreeNode.prototype.setIsHidden = function (value) {
        this.treeModel.setIsHidden(this, value);
    };
    TreeNode.prototype.hide = function () {
        this.setIsHidden(true);
    };
    TreeNode.prototype.show = function () {
        this.setIsHidden(false);
    };
    TreeNode.prototype.mouseAction = function (actionName, $event, data) {
        if (data === void 0) { data = null; }
        this.treeModel.setFocus(true);
        var actionMapping = this.options.actionMapping.mouse;
        var action = actionMapping[actionName];
        if (action) {
            action(this.treeModel, this, $event, data);
        }
    };
    TreeNode.prototype.getSelfHeight = function () {
        return this.options.nodeHeight(this);
    };
    TreeNode.prototype._initChildren = function () {
        var _this = this;
        this.children = this.getField('children').map(function (c, index) { return new TreeNode(c, _this, _this.treeModel, index); });
    };
    TreeNode.prototype.updatePendingChildStatus = function (status) {
        var _this = this;
        if (this.options.lazySelect) {
            this.visibleChildren.forEach(function (child) {
                child.setIsSelected(status);
                _this.treeModel.setSelectedNode(child, status);
            });
        }
    };
    /**
     *  All nodes ancestors except the node which have been selected/deselect
     *  1. Update children selection status locally (all, some flags, i.e., node's local copies)
     *  2. Push parent to update its own copy of its children's statuses
     */
    TreeNode.prototype.propagateStatusToParents = function () {
        /* Select propogates downward and deselect propogates upward */
        if (this.options.lazySelect) {
            this.updateChildrenSelectionStatus();
            if (this.parent) {
                this.parent.propagateStatusToParents();
            }
        }
    };
    /**
     * For all node descendants except the node itself:
     * 1. Update children selection status (not local copies, actual push)
     * 2. Push child to update its children's statuses
     */
    TreeNode.prototype.propogateStatusDownwards = function () {
        /** If nodes are visible we need to update them*/
        if (this.options.lazySelect && this.isExpanded) {
            /**Either all children are selected, or None */
            if (this._allChildrenSelected || !this._someChildrenSelected) {
                var childStatus_1 = this._allChildrenSelected;
                this.children.forEach(function (child) {
                    if (childStatus_1 !== child.isSelected) {
                        child.setIsSelected(childStatus_1);
                        child.propogateStatusDownwards();
                    }
                });
            }
        }
    };
    TreeNode.prototype.emitSelectStatusChange = function (node, status) {
        this.treeModel.setSelectedNode(node, status);
    };
    TreeNode.prototype.updateChildrenSelectionStatus = function () {
        var _this = this;
        this._someChildrenSelected = false;
        this.visibleChildren.forEach(function (child) {
            _this._someChildrenSelected =
                _this._someChildrenSelected || child.someChildrenSelected();
            _this._allChildrenSelected =
                _this._allChildrenSelected && child.allChildrenSelected();
        });
        this.internalSelectState = this._someChildrenSelected;
    };
    TreeNode.prototype.isAllSelected = function () {
        if (this.isSelectable()) {
            return this.treeModel.isSelected(this);
        }
        else if (this.options.lazySelect) {
            return this._allChildrenSelected;
        }
        else {
            return every(this.children, function (node) { return node.isAllSelected; });
        }
    };
    TreeNode.prototype.someChildrenSelected = function () {
        return this.options.lazySelect ? this._someChildrenSelected : this.isSelected;
    };
    TreeNode.prototype.allChildrenSelected = function () {
        return this.options.lazySelect ? this._allChildrenSelected : this.isAllSelected();
    };
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], TreeNode.prototype, "isHidden", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], TreeNode.prototype, "isExpanded", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], TreeNode.prototype, "isActive", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], TreeNode.prototype, "isFocused", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], TreeNode.prototype, "isSelected", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], TreeNode.prototype, "isPartiallySelected", null);
    __decorate([
        observable,
        __metadata("design:type", Array)
    ], TreeNode.prototype, "children", void 0);
    __decorate([
        observable,
        __metadata("design:type", Number)
    ], TreeNode.prototype, "index", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], TreeNode.prototype, "position", void 0);
    __decorate([
        observable,
        __metadata("design:type", Number)
    ], TreeNode.prototype, "height", void 0);
    __decorate([
        computed,
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [])
    ], TreeNode.prototype, "level", null);
    __decorate([
        computed,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], TreeNode.prototype, "path", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], TreeNode.prototype, "visibleChildren", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TreeNode.prototype, "setIsSelected", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TreeNode.prototype, "_initChildren", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Boolean]),
        __metadata("design:returntype", void 0)
    ], TreeNode.prototype, "updatePendingChildStatus", null);
    return TreeNode;
}());
export { TreeNode };
function uuid() {
    return Math.floor(Math.random() * 10000000000000);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ub2RlLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL21vZGVscy90cmVlLW5vZGUubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBcUIsTUFBTSxNQUFNLENBQUM7QUFJakYsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRWxELE9BQU8sS0FBSyxNQUFNLGNBQWMsQ0FBQztBQUNqQyxPQUFPLElBQUksTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxJQUFJLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sS0FBSyxNQUFNLGNBQWMsQ0FBQztBQUVqQztJQXdERSxrQkFDUyxJQUFTLEVBQ1QsTUFBZ0IsRUFDaEIsU0FBb0IsRUFDM0IsS0FBYTtRQUpmLGlCQWdCQztRQWZRLFNBQUksR0FBSixJQUFJLENBQUs7UUFDVCxXQUFNLEdBQU4sTUFBTSxDQUFVO1FBQ2hCLGNBQVMsR0FBVCxTQUFTLENBQVc7UUF6RHJCLDBCQUFxQixHQUFHLEtBQUssQ0FBQztRQUM5Qix5QkFBb0IsR0FBRyxLQUFLLENBQUM7UUFDN0Isd0JBQW1CLEdBQUcsS0FBSyxDQUFDO1FBZ0N4QixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBb0x6QixjQUFTLEdBQUcsVUFBQyxPQUFPLEVBQUUsTUFBTztZQUMzQixPQUFPLEtBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdFLENBQUMsQ0FBQTtRQUVELHlCQUFvQixHQUFHO1lBQ3JCLE9BQU8sS0FBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztRQUMzQyxDQUFDLENBQUE7UUFoS0MsSUFBSSxJQUFJLENBQUMs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LENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNwRixDQUFDO0lBNWdCUztRQUFULFFBQVE7Ozs0Q0FFUjtJQUNTO1FBQVQsUUFBUTs7OzhDQUVSO0lBQ1M7UUFBVCxRQUFROzs7NENBRVI7SUFDUztRQUFULFFBQVE7Ozs2Q0FFUjtJQUNTO1FBQVQsUUFBUTs7OzhDQVFSO0lBR1M7UUFBVCxRQUFROzs7dURBR1I7SUFFVztRQUFYLFVBQVU7OzhDQUFzQjtJQUNyQjtRQUFYLFVBQVU7OzJDQUFlO0lBQ2Q7UUFBWCxVQUFVOzs4Q0FBYztJQUNiO1FBQVgsVUFBVTs7NENBQWdCO0lBQ2pCO1FBQVQsUUFBUTs7O3lDQUVSO0lBQ1M7UUFBVCxRQUFROzs7d0NBRVI7SUFvR1M7UUFBVCxRQUFROzs7bURBRVI7SUE2TU87UUFBUCxNQUFNOzs7O2lEQVlOO0lBc0ZPO1FBQVAsTUFBTTs7OztpREFJTjtJQUVPO1FBQVAsTUFBTTs7Ozs0REFPTjtJQXNFSCxlQUFDO0NBQUEsQUFuaEJELElBbWhCQztTQW5oQlksUUFBUTtBQXFoQnJCO0lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxjQUFjLENBQUMsQ0FBQztBQUNwRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgb2JzZXJ2YWJsZSwgY29tcHV0ZWQsIHJlYWN0aW9uLCBhY3Rpb24sIElSZWFjdGlvbkRpc3Bvc2VyIH0gZnJvbSAnbW9ieCc7XG5pbXBvcnQgeyBUcmVlTW9kZWwgfSBmcm9tICcuL3RyZWUubW9kZWwnO1xuaW1wb3J0IHsgVHJlZU9wdGlvbnMgfSBmcm9tICcuL3RyZWUtb3B0aW9ucy5tb2RlbCc7XG5pbXBvcnQgeyBJVHJlZU5vZGUgfSBmcm9tICcuLi9kZWZzL2FwaSc7XG5pbXBvcnQgeyBUUkVFX0VWRU5UUyB9IGZyb20gJy4uL2NvbnN0YW50cy9ldmVudHMnO1xuXG5pbXBvcnQgZmlyc3QgZnJvbSAnbG9kYXNoL2ZpcnN0JztcbmltcG9ydCBsYXN0IGZyb20gJ2xvZGFzaC9sYXN0JztcbmltcG9ydCBzb21lIGZyb20gJ2xvZGFzaC9zb21lJztcbmltcG9ydCBldmVyeSBmcm9tICdsb2Rhc2gvZXZlcnknO1xuXG5leHBvcnQgY2xhc3MgVHJlZU5vZGUgaW1wbGVtZW50cyBJVHJlZU5vZGUge1xuICBwcml2YXRlIGhhbmRsZXI6IElSZWFjdGlvbkRpc3Bvc2VyO1xuICBwcml2YXRlIF9zb21lQ2hpbGRyZW5TZWxlY3RlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9hbGxDaGlsZHJlblNlbGVjdGVkID0gZmFsc2U7XG4gIHByaXZhdGUgaW50ZXJuYWxTZWxlY3RTdGF0ZSA9IGZhbHNlO1xuXG4gIEBjb21wdXRlZCBnZXQgaXNIaWRkZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMudHJlZU1vZGVsLmlzSGlkZGVuKHRoaXMpO1xuICB9XG4gIEBjb21wdXRlZCBnZXQgaXNFeHBhbmRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy50cmVlTW9kZWwuaXNFeHBhbmRlZCh0aGlzKTtcbiAgfVxuICBAY29tcHV0ZWQgZ2V0IGlzQWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLnRyZWVNb2RlbC5pc0FjdGl2ZSh0aGlzKTtcbiAgfVxuICBAY29tcHV0ZWQgZ2V0IGlzRm9jdXNlZCgpIHtcbiAgICByZXR1cm4gdGhpcy50cmVlTW9kZWwuaXNOb2RlRm9jdXNlZCh0aGlzKTtcbiAgfVxuICBAY29tcHV0ZWQgZ2V0IGlzU2VsZWN0ZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNTZWxlY3RhYmxlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRyZWVNb2RlbC5pc1NlbGVjdGVkKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmxhenlTZWxlY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLnNvbWVDaGlsZHJlblNlbGVjdGVkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzb21lKHRoaXMuY2hpbGRyZW4sIChub2RlOiBUcmVlTm9kZSkgPT4gbm9kZS5pc1NlbGVjdGVkKTtcbiAgICB9XG4gIH1cblxuXG4gIEBjb21wdXRlZCBnZXQgaXNQYXJ0aWFsbHlTZWxlY3RlZCgpIHtcbiAgICAvLyBldmFsdWF0ZXMgdG8gdGhpcy5fc29tZUNoaWxkcmVuU2VsZWN0ZWQgJiYgIXRoaXMuX2FsbENoaWxkcmVuU2VsZWN0ZWQ7XG4gICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZCAmJiAhdGhpcy5pc0FsbFNlbGVjdGVkKCk7XG4gIH1cblxuICBAb2JzZXJ2YWJsZSBjaGlsZHJlbjogVHJlZU5vZGVbXTtcbiAgQG9ic2VydmFibGUgaW5kZXg6IG51bWJlcjtcbiAgQG9ic2VydmFibGUgcG9zaXRpb24gPSAwO1xuICBAb2JzZXJ2YWJsZSBoZWlnaHQ6IG51bWJlcjtcbiAgQGNvbXB1dGVkIGdldCBsZXZlbCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmxldmVsICsgMSA6IDA7XG4gIH1cbiAgQGNvbXB1dGVkIGdldCBwYXRoKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQgPyBbLi4udGhpcy5wYXJlbnQucGF0aCwgdGhpcy5pZF0gOiBbXTtcbiAgfVxuXG5cbiAgZ2V0IGVsZW1lbnRSZWYoKTogYW55IHtcbiAgICB0aHJvdyBgRWxlbWVudCBSZWYgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCBzaW5jZSBpbnRyb2R1Y2luZyB2aXJ0dWFsIHNjcm9sbFxcblxuICAgICAgWW91IG1heSB1c2UgYSB0ZW1wbGF0ZSB0byBvYnRhaW4gYSByZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnRgO1xuICB9XG5cbiAgcHJpdmF0ZSBfb3JpZ2luYWxOb2RlOiBhbnk7XG4gIGdldCBvcmlnaW5hbE5vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsTm9kZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBkYXRhOiBhbnksXG4gICAgcHVibGljIHBhcmVudDogVHJlZU5vZGUsXG4gICAgcHVibGljIHRyZWVNb2RlbDogVHJlZU1vZGVsLFxuICAgIGluZGV4OiBudW1iZXJcbiAgKSB7XG4gICAgaWYgKHRoaXMuaWQgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmlkID09PSBudWxsKSB7XG4gICAgICB0aGlzLmlkID0gdXVpZCgpO1xuICAgIH0gLy8gTWFrZSBzdXJlIHRoZXJlJ3MgYSB1bmlxdWUgaWQgd2l0aG91dCBvdmVycmlkaW5nIGV4aXN0aW5nIGlkcyB0byB3b3JrIHdpdGggaW1tdXRhYmxlIGRhdGEgc3RydWN0dXJlc1xuICAgIHRoaXMuaW5kZXggPSBpbmRleDtcblxuICAgIGlmICh0aGlzLmdldEZpZWxkKCdjaGlsZHJlbicpKSB7XG4gICAgICB0aGlzLl9pbml0Q2hpbGRyZW4oKTtcbiAgICB9XG4gICAgdGhpcy5hdXRvTG9hZENoaWxkcmVuKCk7XG4gICAgdGhpcy51cGRhdGVDaGlsZHJlblNlbGVjdGlvblN0YXR1cygpO1xuICB9XG5cbiAgLy8gaGVscGVyIGdldCBmdW5jdGlvbnM6XG4gIGdldCBoYXNDaGlsZHJlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISEoXG4gICAgICB0aGlzLmdldEZpZWxkKCdoYXNDaGlsZHJlbicpIHx8XG4gICAgICAodGhpcy5jaGlsZHJlbiAmJiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDApXG4gICAgKTtcbiAgfVxuICBnZXQgaXNDb2xsYXBzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmlzRXhwYW5kZWQ7XG4gIH1cbiAgZ2V0IGlzTGVhZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuaGFzQ2hpbGRyZW47XG4gIH1cbiAgZ2V0IGlzUm9vdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZGF0YS52aXJ0dWFsO1xuICB9XG4gIGdldCByZWFsUGFyZW50KCk6IFRyZWVOb2RlIHtcbiAgICByZXR1cm4gdGhpcy5pc1Jvb3QgPyBudWxsIDogdGhpcy5wYXJlbnQ7XG4gIH1cblxuICAvLyBwcm94eSBmdW5jdGlvbnM6XG4gIGdldCBvcHRpb25zKCk6IFRyZWVPcHRpb25zIHtcbiAgICByZXR1cm4gdGhpcy50cmVlTW9kZWwub3B0aW9ucztcbiAgfVxuICBmaXJlRXZlbnQoZXZlbnQpIHtcbiAgICB0aGlzLnRyZWVNb2RlbC5maXJlRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgLy8gZmllbGQgYWNjZXNzb3JzOlxuICBnZXQgZGlzcGxheUZpZWxkKCkge1xuICAgIHJldHVybiB0aGlzLmdldEZpZWxkKCdkaXNwbGF5Jyk7XG4gIH1cblxuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RmllbGQoJ2lkJyk7XG4gIH1cblxuICBzZXQgaWQodmFsdWUpIHtcbiAgICB0aGlzLnNldEZpZWxkKCdpZCcsIHZhbHVlKTtcbiAgfVxuXG4gIGdldEZpZWxkKGtleSkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5vcHRpb25zW2Ake2tleX1GaWVsZGBdXTtcbiAgfVxuXG4gIHNldEZpZWxkKGtleSwgdmFsdWUpIHtcbiAgICB0aGlzLmRhdGFbdGhpcy5vcHRpb25zW2Ake2tleX1GaWVsZGBdXSA9IHZhbHVlO1xuICB9XG5cbiAgLy8gdHJhdmVyc2luZzpcbiAgX2ZpbmRBZGphY2VudFNpYmxpbmcoc3RlcHMsIHNraXBIaWRkZW4gPSBmYWxzZSkge1xuICAgIGNvbnN0IHNpYmxpbmdzID0gdGhpcy5fZ2V0UGFyZW50c0NoaWxkcmVuKHNraXBIaWRkZW4pO1xuICAgIGNvbnN0IGluZGV4ID0gc2libGluZ3MuaW5kZXhPZih0aGlzKTtcblxuICAgIHJldHVybiBzaWJsaW5ncy5sZW5ndGggPiBpbmRleCArIHN0ZXBzID8gc2libGluZ3NbaW5kZXggKyBzdGVwc10gOiBudWxsO1xuICB9XG5cbiAgZmluZE5leHRTaWJsaW5nKHNraXBIaWRkZW4gPSBmYWxzZSkge1xuICAgIHJldHVybiB0aGlzLl9maW5kQWRqYWNlbnRTaWJsaW5nKCsxLCBza2lwSGlkZGVuKTtcbiAgfVxuXG4gIGZpbmRQcmV2aW91c1NpYmxpbmcoc2tpcEhpZGRlbiA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpbmRBZGphY2VudFNpYmxpbmcoLTEsIHNraXBIaWRkZW4pO1xuICB9XG5cbiAgZ2V0VmlzaWJsZUNoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLnZpc2libGVDaGlsZHJlbjtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgdmlzaWJsZUNoaWxkcmVuKCkge1xuICAgIHJldHVybiAodGhpcy5jaGlsZHJlbiB8fCBbXSkuZmlsdGVyKG5vZGUgPT4gIW5vZGUuaXNIaWRkZW4pO1xuICB9XG5cbiAgZ2V0Rmlyc3RDaGlsZChza2lwSGlkZGVuID0gZmFsc2UpIHtcbiAgICBsZXQgY2hpbGRyZW4gPSBza2lwSGlkZGVuID8gdGhpcy52aXNpYmxlQ2hpbGRyZW4gOiB0aGlzLmNoaWxkcmVuO1xuXG4gICAgcmV0dXJuIGZpcnN0KGNoaWxkcmVuIHx8IFtdKTtcbiAgfVxuXG4gIGdldExhc3RDaGlsZChza2lwSGlkZGVuID0gZmFsc2UpIHtcbiAgICBsZXQgY2hpbGRyZW4gPSBza2lwSGlkZGVuID8gdGhpcy52aXNpYmxlQ2hpbGRyZW4gOiB0aGlzLmNoaWxkcmVuO1xuXG4gICAgcmV0dXJuIGxhc3QoY2hpbGRyZW4gfHwgW10pO1xuICB9XG5cbiAgZmluZE5leHROb2RlKGdvSW5zaWRlID0gdHJ1ZSwgc2tpcEhpZGRlbiA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIChnb0luc2lkZSAmJiB0aGlzLmlzRXhwYW5kZWQgJiYgdGhpcy5nZXRGaXJzdENoaWxkKHNraXBIaWRkZW4pKSB8fFxuICAgICAgdGhpcy5maW5kTmV4dFNpYmxpbmcoc2tpcEhpZGRlbikgfHxcbiAgICAgICh0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5maW5kTmV4dE5vZGUoZmFsc2UsIHNraXBIaWRkZW4pKVxuICAgICk7XG4gIH1cblxuICBmaW5kUHJldmlvdXNOb2RlKHNraXBIaWRkZW4gPSBmYWxzZSkge1xuICAgIGxldCBwcmV2aW91c1NpYmxpbmcgPSB0aGlzLmZpbmRQcmV2aW91c1NpYmxpbmcoc2tpcEhpZGRlbik7XG4gICAgaWYgKCFwcmV2aW91c1NpYmxpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWxQYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBwcmV2aW91c1NpYmxpbmcuX2dldExhc3RPcGVuRGVzY2VuZGFudChza2lwSGlkZGVuKTtcbiAgfVxuXG4gIF9nZXRMYXN0T3BlbkRlc2NlbmRhbnQoc2tpcEhpZGRlbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgbGFzdENoaWxkID0gdGhpcy5nZXRMYXN0Q2hpbGQoc2tpcEhpZGRlbik7XG4gICAgcmV0dXJuIHRoaXMuaXNDb2xsYXBzZWQgfHwgIWxhc3RDaGlsZFxuICAgICAgPyB0aGlzXG4gICAgICA6IGxhc3RDaGlsZC5fZ2V0TGFzdE9wZW5EZXNjZW5kYW50KHNraXBIaWRkZW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UGFyZW50c0NoaWxkcmVuKHNraXBIaWRkZW4gPSBmYWxzZSk6IGFueVtdIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9XG4gICAgICB0aGlzLnBhcmVudCAmJlxuICAgICAgKHNraXBIaWRkZW4gPyB0aGlzLnBhcmVudC5nZXRWaXNpYmxlQ2hpbGRyZW4oKSA6IHRoaXMucGFyZW50LmNoaWxkcmVuKTtcblxuICAgIHJldHVybiBjaGlsZHJlbiB8fCBbXTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0SW5kZXhJblBhcmVudChza2lwSGlkZGVuID0gZmFsc2UpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0UGFyZW50c0NoaWxkcmVuKHNraXBIaWRkZW4pLmluZGV4T2YodGhpcyk7XG4gIH1cblxuICBpc0Rlc2NlbmRhbnRPZihub2RlOiBUcmVlTm9kZSkge1xuICAgIGlmICh0aGlzID09PSBub2RlKSByZXR1cm4gdHJ1ZTtcbiAgICBlbHNlIHJldHVybiB0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5pc0Rlc2NlbmRhbnRPZihub2RlKTtcbiAgfVxuXG4gIGdldE5vZGVQYWRkaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5sZXZlbFBhZGRpbmcgKiAodGhpcy5sZXZlbCAtIDEpICsgJ3B4JztcbiAgfVxuXG4gIGdldENsYXNzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFt0aGlzLm9wdGlvbnMubm9kZUNsYXNzKHRoaXMpLCBgdHJlZS1ub2RlLWxldmVsLSR7dGhpcy5sZXZlbH1gXS5qb2luKFxuICAgICAgJyAnXG4gICAgKTtcbiAgfVxuXG4gIG9uRHJvcCgkZXZlbnQpIHtcbiAgICB0aGlzLm1vdXNlQWN0aW9uKCdkcm9wJywgJGV2ZW50LmV2ZW50LCB7XG4gICAgICBmcm9tOiAkZXZlbnQuZWxlbWVudCxcbiAgICAgIHRvOiB7IHBhcmVudDogdGhpcywgaW5kZXg6IDAsIGRyb3BPbk5vZGU6IHRydWUgfVxuICAgIH0pO1xuICB9XG5cbiAgYWxsb3dEcm9wID0gKGVsZW1lbnQsICRldmVudD8pID0+IHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmFsbG93RHJvcChlbGVtZW50LCB7IHBhcmVudDogdGhpcywgaW5kZXg6IDAgfSwgJGV2ZW50KTtcbiAgfVxuXG4gIGFsbG93RHJhZ292ZXJTdHlsaW5nID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYWxsb3dEcmFnb3ZlclN0eWxpbmc7XG4gIH1cblxuICBhbGxvd0RyYWcoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5hbGxvd0RyYWcodGhpcyk7XG4gIH1cblxuICAvLyBoZWxwZXIgbWV0aG9kczpcbiAgbG9hZE5vZGVDaGlsZHJlbigpIHtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5nZXRDaGlsZHJlbikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpOyAvLyBOb3QgZ2V0Q2hpbGRyZW4gbWV0aG9kIC0gZm9yIHVzaW5nIHJlZHV4XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5vcHRpb25zLmdldENoaWxkcmVuKHRoaXMpKVxuICAgICAgLnRoZW4oY2hpbGRyZW4gPT4ge1xuICAgICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICB0aGlzLnNldEZpZWxkKCdjaGlsZHJlbicsIGNoaWxkcmVuKTtcbiAgICAgICAgICB0aGlzLl9pbml0Q2hpbGRyZW4oKTtcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnVzZVRyaVN0YXRlICYmIHRoaXMudHJlZU1vZGVsLmlzU2VsZWN0ZWQodGhpcykpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0SXNTZWxlY3RlZCh0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgIGlmIChjaGlsZC5nZXRGaWVsZCgnaXNFeHBhbmRlZCcpICYmIGNoaWxkLmhhc0NoaWxkcmVuKSB7XG4gICAgICAgICAgICAgIGNoaWxkLmV4cGFuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmZpcmVFdmVudCh7XG4gICAgICAgICAgZXZlbnROYW1lOiBUUkVFX0VWRU5UUy5sb2FkTm9kZUNoaWxkcmVuLFxuICAgICAgICAgIG5vZGU6IHRoaXNcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGV4cGFuZCgpIHtcbiAgICBpZiAoIXRoaXMuaXNFeHBhbmRlZCkge1xuICAgICAgdGhpcy50b2dnbGVFeHBhbmRlZCgpO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYXp5U2VsZWN0ICYmIHRoaXMuX2FsbENoaWxkcmVuU2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlQ2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IFRyZWVOb2RlKSA9PiB7XG4gICAgICAgICAgY2hpbGQuc2V0SXNTZWxlY3RlZCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY29sbGFwc2UoKSB7XG4gICAgaWYgKHRoaXMuaXNFeHBhbmRlZCkge1xuICAgICAgdGhpcy50b2dnbGVFeHBhbmRlZCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZG9Gb3JBbGwoZm46IChub2RlOiBJVHJlZU5vZGUpID0+IGFueSkge1xuICAgIFByb21pc2UucmVzb2x2ZShmbih0aGlzKSkudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jaGlsZHJlbikge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gY2hpbGQuZG9Gb3JBbGwoZm4pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGV4cGFuZEFsbCgpIHtcbiAgICB0aGlzLmRvRm9yQWxsKG5vZGUgPT4gbm9kZS5leHBhbmQoKSk7XG4gIH1cblxuICBjb2xsYXBzZUFsbCgpIHtcbiAgICB0aGlzLmRvRm9yQWxsKG5vZGUgPT4gbm9kZS5jb2xsYXBzZSgpKTtcbiAgfVxuXG4gIGVuc3VyZVZpc2libGUoKSB7XG4gICAgaWYgKHRoaXMucmVhbFBhcmVudCkge1xuICAgICAgdGhpcy5yZWFsUGFyZW50LmV4cGFuZCgpO1xuICAgICAgdGhpcy5yZWFsUGFyZW50LmVuc3VyZVZpc2libGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHRvZ2dsZUV4cGFuZGVkKCkge1xuICAgIHRoaXMuc2V0SXNFeHBhbmRlZCghdGhpcy5pc0V4cGFuZGVkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldElzRXhwYW5kZWQodmFsdWUpIHtcbiAgICBpZiAodGhpcy5oYXNDaGlsZHJlbikge1xuICAgICAgdGhpcy50cmVlTW9kZWwuc2V0RXhwYW5kZWROb2RlKHRoaXMsIHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGF1dG9Mb2FkQ2hpbGRyZW4oKSB7XG4gICAgdGhpcy5oYW5kbGVyID0gcmVhY3Rpb24oXG4gICAgICAoKSA9PiB0aGlzLmlzRXhwYW5kZWQsXG4gICAgICBpc0V4cGFuZGVkID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmNoaWxkcmVuICYmIHRoaXMuaGFzQ2hpbGRyZW4gJiYgaXNFeHBhbmRlZCkge1xuICAgICAgICAgIHRoaXMubG9hZE5vZGVDaGlsZHJlbigpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgeyBmaXJlSW1tZWRpYXRlbHk6IHRydWUgfVxuICAgICk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIGlmICh0aGlzLmNoaWxkcmVuKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gY2hpbGQuZGlzcG9zZSgpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGFuZGxlcikge1xuICAgICAgdGhpcy5oYW5kbGVyKCk7XG4gICAgfVxuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLmNoaWxkcmVuID0gbnVsbDtcbiAgfVxuXG4gIHNldElzQWN0aXZlKHZhbHVlLCBtdWx0aSA9IGZhbHNlKSB7XG4gICAgdGhpcy50cmVlTW9kZWwuc2V0QWN0aXZlTm9kZSh0aGlzLCB2YWx1ZSwgbXVsdGkpO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5mb2N1cyh0aGlzLm9wdGlvbnMuc2Nyb2xsT25BY3RpdmF0ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpc1NlbGVjdGFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNMZWFmIHx8ICF0aGlzLmNoaWxkcmVuIHx8ICF0aGlzLm9wdGlvbnMudXNlVHJpU3RhdGU7XG4gIH1cblxuICBAYWN0aW9uIHNldElzU2VsZWN0ZWQodmFsdWUpIHtcbiAgICAvKlxuICAgICogQWxsIGNoaWxkcmVuIHNob3VsZCBiZSBzZWxlY3RlZC9kZXNlbGVjdGVkIGJ5IGRlZmF1bHRcbiAgICAqL1xuICAgIHRoaXMuX2FsbENoaWxkcmVuU2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICB0aGlzLl9zb21lQ2hpbGRyZW5TZWxlY3RlZCA9IHZhbHVlO1xuICAgIC8qICBBbmQgaGlkZGVuIGluZGljYXRvciB0aGF0IHRoaXMgbm9kZSBoYXMgYmVlbiBzZWxlY3RlZC9kZXNlbGVjdGVkLiAqL1xuICAgIHRoaXMuaW50ZXJuYWxTZWxlY3RTdGF0ZSA9IHZhbHVlO1xuICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XG4gICAgICB0aGlzLnRyZWVNb2RlbC5zZXRTZWxlY3RlZE5vZGUodGhpcywgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHRvZ2dsZVNlbGVjdGVkKCkge1xuICAgIGNvbnN0IGN1cnJlbnRTdGF0dXMgPSB0aGlzLmludGVybmFsU2VsZWN0U3RhdGU7XG4gICAgdGhpcy5zZXRJc1NlbGVjdGVkKCFjdXJyZW50U3RhdHVzKTtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIC8qIFdlIGRvbid0IHdhbm5hIHVwZGF0ZSBvdXIgbG9jYWwgY29weSBvZiBjaGlsZHJlbidzIHN0YXR1c2VzXG4gICAgICAqIChiZWNhdXNlIHdlIGdldCB0aGF0IGZyb20gdXNlciBhY3Rpb24pLCBidXQgYXNrIHBhcmVudCB0byBjb21wdXRlIGl0c1xuICAgICAgKiAgY2hpbGRyZW4ncyBzdGF0dXNlcy5cbiAgICAgICovXG4gICAgICB0aGlzLnBhcmVudC5wcm9wYWdhdGVTdGF0dXNUb1BhcmVudHMoKTtcbiAgICB9XG4gICAgdGhpcy5wcm9wb2dhdGVTdGF0dXNEb3dud2FyZHMoKTtcbiAgICB0aGlzLmVtaXRTZWxlY3RTdGF0dXNDaGFuZ2UodGhpcywgIWN1cnJlbnRTdGF0dXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdG9nZ2xlQWN0aXZhdGVkKG11bHRpID0gZmFsc2UpIHtcbiAgICB0aGlzLnNldElzQWN0aXZlKCF0aGlzLmlzQWN0aXZlLCBtdWx0aSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldEFjdGl2ZUFuZFZpc2libGUobXVsdGkgPSBmYWxzZSkge1xuICAgIHRoaXMuc2V0SXNBY3RpdmUodHJ1ZSwgbXVsdGkpLmVuc3VyZVZpc2libGUoKTtcblxuICAgIHNldFRpbWVvdXQodGhpcy5zY3JvbGxJbnRvVmlldy5iaW5kKHRoaXMpKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2Nyb2xsSW50b1ZpZXcoZm9yY2UgPSBmYWxzZSkge1xuICAgIHRoaXMudHJlZU1vZGVsLnZpcnR1YWxTY3JvbGwuc2Nyb2xsSW50b1ZpZXcodGhpcywgZm9yY2UpO1xuICB9XG5cbiAgZm9jdXMoc2Nyb2xsID0gdHJ1ZSkge1xuICAgIGxldCBwcmV2aW91c05vZGUgPSB0aGlzLnRyZWVNb2RlbC5nZXRGb2N1c2VkTm9kZSgpO1xuICAgIHRoaXMudHJlZU1vZGVsLnNldEZvY3VzZWROb2RlKHRoaXMpO1xuICAgIGlmIChzY3JvbGwpIHtcbiAgICAgIHRoaXMuc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICB9XG4gICAgaWYgKHByZXZpb3VzTm9kZSkge1xuICAgICAgdGhpcy5maXJlRXZlbnQoeyBldmVudE5hbWU6IFRSRUVfRVZFTlRTLmJsdXIsIG5vZGU6IHByZXZpb3VzTm9kZSB9KTtcbiAgICB9XG4gICAgdGhpcy5maXJlRXZlbnQoeyBldmVudE5hbWU6IFRSRUVfRVZFTlRTLmZvY3VzLCBub2RlOiB0aGlzIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBibHVyKCkge1xuICAgIGxldCBwcmV2aW91c05vZGUgPSB0aGlzLnRyZWVNb2RlbC5nZXRGb2N1c2VkTm9kZSgpO1xuICAgIHRoaXMudHJlZU1vZGVsLnNldEZvY3VzZWROb2RlKG51bGwpO1xuICAgIGlmIChwcmV2aW91c05vZGUpIHtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KHsgZXZlbnROYW1lOiBUUkVFX0VWRU5UUy5ibHVyLCBub2RlOiB0aGlzIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0SXNIaWRkZW4odmFsdWUpIHtcbiAgICB0aGlzLnRyZWVNb2RlbC5zZXRJc0hpZGRlbih0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICBoaWRlKCkge1xuICAgIHRoaXMuc2V0SXNIaWRkZW4odHJ1ZSk7XG4gIH1cblxuICBzaG93KCkge1xuICAgIHRoaXMuc2V0SXNIaWRkZW4oZmFsc2UpO1xuICB9XG5cbiAgbW91c2VBY3Rpb24oYWN0aW9uTmFtZTogc3RyaW5nLCAkZXZlbnQsIGRhdGE6IGFueSA9IG51bGwpIHtcbiAgICB0aGlzLnRyZWVNb2RlbC5zZXRGb2N1cyh0cnVlKTtcblxuICAgIGNvbnN0IGFjdGlvbk1hcHBpbmcgPSB0aGlzLm9wdGlvbnMuYWN0aW9uTWFwcGluZy5tb3VzZTtcbiAgICBjb25zdCBhY3Rpb24gPSBhY3Rpb25NYXBwaW5nW2FjdGlvbk5hbWVdO1xuXG4gICAgaWYgKGFjdGlvbikge1xuICAgICAgYWN0aW9uKHRoaXMudHJlZU1vZGVsLCB0aGlzLCAkZXZlbnQsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIGdldFNlbGZIZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ub2RlSGVpZ2h0KHRoaXMpO1xuICB9XG5cbiAgQGFjdGlvbiBfaW5pdENoaWxkcmVuKCkge1xuICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLmdldEZpZWxkKCdjaGlsZHJlbicpLm1hcChcbiAgICAgIChjLCBpbmRleCkgPT4gbmV3IFRyZWVOb2RlKGMsIHRoaXMsIHRoaXMudHJlZU1vZGVsLCBpbmRleClcbiAgICApO1xuICB9XG5cbiAgQGFjdGlvbiBwdWJsaWMgdXBkYXRlUGVuZGluZ0NoaWxkU3RhdHVzKHN0YXR1czogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0aGlzLm9wdGlvbnMubGF6eVNlbGVjdCkge1xuICAgICAgdGhpcy52aXNpYmxlQ2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgIGNoaWxkLnNldElzU2VsZWN0ZWQoc3RhdHVzKTtcbiAgICAgICAgdGhpcy50cmVlTW9kZWwuc2V0U2VsZWN0ZWROb2RlKGNoaWxkLCBzdGF0dXMpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBBbGwgbm9kZXMgYW5jZXN0b3JzIGV4Y2VwdCB0aGUgbm9kZSB3aGljaCBoYXZlIGJlZW4gc2VsZWN0ZWQvZGVzZWxlY3RcbiAgICogIDEuIFVwZGF0ZSBjaGlsZHJlbiBzZWxlY3Rpb24gc3RhdHVzIGxvY2FsbHkgKGFsbCwgc29tZSBmbGFncywgaS5lLiwgbm9kZSdzIGxvY2FsIGNvcGllcylcbiAgICogIDIuIFB1c2ggcGFyZW50IHRvIHVwZGF0ZSBpdHMgb3duIGNvcHkgb2YgaXRzIGNoaWxkcmVuJ3Mgc3RhdHVzZXNcbiAgICovXG4gIHB1YmxpYyBwcm9wYWdhdGVTdGF0dXNUb1BhcmVudHMoKTogdm9pZCB7XG4gICAgLyogU2VsZWN0IHByb3BvZ2F0ZXMgZG93bndhcmQgYW5kIGRlc2VsZWN0IHByb3BvZ2F0ZXMgdXB3YXJkICovXG4gICAgaWYgKHRoaXMub3B0aW9ucy5sYXp5U2VsZWN0KSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoaWxkcmVuU2VsZWN0aW9uU3RhdHVzKCk7XG4gICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQucHJvcGFnYXRlU3RhdHVzVG9QYXJlbnRzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvciBhbGwgbm9kZSBkZXNjZW5kYW50cyBleGNlcHQgdGhlIG5vZGUgaXRzZWxmOlxuICAgKiAxLiBVcGRhdGUgY2hpbGRyZW4gc2VsZWN0aW9uIHN0YXR1cyAobm90IGxvY2FsIGNvcGllcywgYWN0dWFsIHB1c2gpXG4gICAqIDIuIFB1c2ggY2hpbGQgdG8gdXBkYXRlIGl0cyBjaGlsZHJlbidzIHN0YXR1c2VzXG4gICAqL1xuICBwdWJsaWMgcHJvcG9nYXRlU3RhdHVzRG93bndhcmRzKCk6IHZvaWQge1xuICAgIC8qKiBJZiBub2RlcyBhcmUgdmlzaWJsZSB3ZSBuZWVkIHRvIHVwZGF0ZSB0aGVtKi9cbiAgICBpZiAodGhpcy5vcHRpb25zLmxhenlTZWxlY3QgJiYgdGhpcy5pc0V4cGFuZGVkKSB7XG4gICAgICAvKipFaXRoZXIgYWxsIGNoaWxkcmVuIGFyZSBzZWxlY3RlZCwgb3IgTm9uZSAqL1xuICAgICAgaWYgKHRoaXMuX2FsbENoaWxkcmVuU2VsZWN0ZWQgfHwgIXRoaXMuX3NvbWVDaGlsZHJlblNlbGVjdGVkKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkU3RhdHVzID0gdGhpcy5fYWxsQ2hpbGRyZW5TZWxlY3RlZDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICBpZiAoY2hpbGRTdGF0dXMgIT09IGNoaWxkLmlzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIGNoaWxkLnNldElzU2VsZWN0ZWQoY2hpbGRTdGF0dXMpO1xuICAgICAgICAgICAgY2hpbGQucHJvcG9nYXRlU3RhdHVzRG93bndhcmRzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGVtaXRTZWxlY3RTdGF0dXNDaGFuZ2Uobm9kZTogVHJlZU5vZGUsIHN0YXR1czogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMudHJlZU1vZGVsLnNldFNlbGVjdGVkTm9kZShub2RlLCBzdGF0dXMpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVDaGlsZHJlblNlbGVjdGlvblN0YXR1cygpOiB2b2lkIHtcbiAgICB0aGlzLl9zb21lQ2hpbGRyZW5TZWxlY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMudmlzaWJsZUNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgdGhpcy5fc29tZUNoaWxkcmVuU2VsZWN0ZWQgPVxuICAgICAgICB0aGlzLl9zb21lQ2hpbGRyZW5TZWxlY3RlZCB8fCBjaGlsZC5zb21lQ2hpbGRyZW5TZWxlY3RlZCgpO1xuICAgICAgdGhpcy5fYWxsQ2hpbGRyZW5TZWxlY3RlZCA9XG4gICAgICAgIHRoaXMuX2FsbENoaWxkcmVuU2VsZWN0ZWQgJiYgY2hpbGQuYWxsQ2hpbGRyZW5TZWxlY3RlZCgpO1xuICAgIH0pO1xuICAgIHRoaXMuaW50ZXJuYWxTZWxlY3RTdGF0ZSA9IHRoaXMuX3NvbWVDaGlsZHJlblNlbGVjdGVkO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0FsbFNlbGVjdGVkKCkge1xuICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmVlTW9kZWwuaXNTZWxlY3RlZCh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5sYXp5U2VsZWN0KSB7XG4gICAgICByZXR1cm4gdGhpcy5fYWxsQ2hpbGRyZW5TZWxlY3RlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGV2ZXJ5KHRoaXMuY2hpbGRyZW4sIChub2RlOiBUcmVlTm9kZSkgPT4gbm9kZS5pc0FsbFNlbGVjdGVkKTtcbiAgICB9XG4gIH1cblxuICBzb21lQ2hpbGRyZW5TZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxhenlTZWxlY3QgPyB0aGlzLl9zb21lQ2hpbGRyZW5TZWxlY3RlZCA6IHRoaXMuaXNTZWxlY3RlZDtcbiAgfVxuXG4gIGFsbENoaWxkcmVuU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5sYXp5U2VsZWN0ID8gdGhpcy5fYWxsQ2hpbGRyZW5TZWxlY3RlZCA6IHRoaXMuaXNBbGxTZWxlY3RlZCgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHV1aWQoKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMDAwMDAwMCk7XG59XG4iXX0=