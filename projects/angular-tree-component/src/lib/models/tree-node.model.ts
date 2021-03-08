import { observable, computed, reaction, action, IReactionDisposer } from 'mobx';
import { TreeModel } from './tree.model';
import { TreeOptions } from './tree-options.model';
import { ITreeNode } from '../defs/api';
import { TREE_EVENTS } from '../constants/events';

import { first, last, some, every } from 'lodash-es';

export class TreeNode implements ITreeNode {
  private handler: IReactionDisposer;
  private _someChildrenSelected = false;
  private _allChildrenSelected = false;
  private internalSelectState = false;

  @computed get isHidden() {
    return this.treeModel.isHidden(this);
  }
  @computed get isExpanded() {
    return this.treeModel.isExpanded(this);
  }
  @computed get isActive() {
    return this.treeModel.isActive(this);
  }
  @computed get isFocused() {
    return this.treeModel.isNodeFocused(this);
  }
  @computed get isSelected() {
    if (this.isSelectable()) {
      return this.treeModel.isSelected(this);
    } else if (this.options.lazySelect) {
      return this.someChildrenSelected();
    } else {
      return some(this.children, (node: TreeNode) => node.isSelected);
    }
  }


  @computed get isPartiallySelected() {
    // evaluates to this._someChildrenSelected && !this._allChildrenSelected;
    return this.isSelected && !this.isAllSelected();
  }

  @observable children: TreeNode[];
  @observable index: number;
  @observable position = 0;
  @observable height: number;
  @computed get level(): number {
    return this.parent ? this.parent.level + 1 : 0;
  }
  @computed get path(): string[] {
    return this.parent ? [...this.parent.path, this.id] : [];
  }


  get elementRef(): any {
    throw `Element Ref is no longer supported since introducing virtual scroll\n
      You may use a template to obtain a reference to the element`;
  }

  private _originalNode: any;
  get originalNode() {
    return this._originalNode;
  }

  constructor(
    public data: any,
    public parent: TreeNode,
    public treeModel: TreeModel,
    index: number
  ) {
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

  // helper get functions:
  get hasChildren(): boolean {
    return !!(
      this.getField('hasChildren') ||
      (this.children && this.children.length > 0)
    );
  }
  get isCollapsed(): boolean {
    return !this.isExpanded;
  }
  get isLeaf(): boolean {
    return !this.hasChildren;
  }
  get isRoot(): boolean {
    return this.parent.data.virtual;
  }
  get realParent(): TreeNode {
    return this.isRoot ? null : this.parent;
  }

  // proxy functions:
  get options(): TreeOptions {
    return this.treeModel.options;
  }
  fireEvent(event) {
    this.treeModel.fireEvent(event);
  }

  // field accessors:
  get displayField() {
    return this.getField('display');
  }

  get id() {
    return this.getField('id');
  }

  set id(value) {
    this.setField('id', value);
  }

  getField(key) {
    return this.data[this.options[`${key}Field`]];
  }

  setField(key, value) {
    this.data[this.options[`${key}Field`]] = value;
  }

  // traversing:
  _findAdjacentSibling(steps, skipHidden = false) {
    const siblings = this._getParentsChildren(skipHidden);
    const index = siblings.indexOf(this);

    return siblings.length > index + steps ? siblings[index + steps] : null;
  }

  findNextSibling(skipHidden = false) {
    return this._findAdjacentSibling(+1, skipHidden);
  }

  findPreviousSibling(skipHidden = false) {
    return this._findAdjacentSibling(-1, skipHidden);
  }

  getVisibleChildren() {
    return this.visibleChildren;
  }

  @computed get visibleChildren() {
    return (this.children || []).filter(node => !node.isHidden);
  }

  getFirstChild(skipHidden = false) {
    let children = skipHidden ? this.visibleChildren : this.children;

    return first(children || []);
  }

  getLastChild(skipHidden = false) {
    let children = skipHidden ? this.visibleChildren : this.children;

    return last(children || []);
  }

  findNextNode(goInside = true, skipHidden = false) {
    return (
      (goInside && this.isExpanded && this.getFirstChild(skipHidden)) ||
      this.findNextSibling(skipHidden) ||
      (this.parent && this.parent.findNextNode(false, skipHidden))
    );
  }

  findPreviousNode(skipHidden = false) {
    let previousSibling = this.findPreviousSibling(skipHidden);
    if (!previousSibling) {
      return this.realParent;
    }
    return previousSibling._getLastOpenDescendant(skipHidden);
  }

  _getLastOpenDescendant(skipHidden = false) {
    const lastChild = this.getLastChild(skipHidden);
    return this.isCollapsed || !lastChild
      ? this
      : lastChild._getLastOpenDescendant(skipHidden);
  }

  private _getParentsChildren(skipHidden = false): any[] {
    const children =
      this.parent &&
      (skipHidden ? this.parent.getVisibleChildren() : this.parent.children);

    return children || [];
  }

  private getIndexInParent(skipHidden = false) {
    return this._getParentsChildren(skipHidden).indexOf(this);
  }

  isDescendantOf(node: TreeNode) {
    if (this === node) return true;
    else return this.parent && this.parent.isDescendantOf(node);
  }

  getNodePadding(): string {
    return this.options.levelPadding * (this.level - 1) + 'px';
  }

  getClass(): string {
    return [this.options.nodeClass(this), `tree-node-level-${this.level}`].join(
      ' '
    );
  }

  onDrop($event) {
    this.mouseAction('drop', $event.event, {
      from: $event.element,
      to: { parent: this, index: 0, dropOnNode: true }
    });
  }

  allowDrop = (element, $event?) => {
    return this.options.allowDrop(element, { parent: this, index: 0 }, $event);
  }

  allowDragoverStyling = () => {
    return this.options.allowDragoverStyling;
  }

  allowDrag() {
    return this.options.allowDrag(this);
  }

  // helper methods:
  loadNodeChildren() {
    if (!this.options.getChildren) {
      return Promise.resolve(); // Not getChildren method - for using redux
    }
    return Promise.resolve(this.options.getChildren(this))
      .then(children => {
        if (children) {
          this.setField('children', children);
          this._initChildren();
          if (this.options.useTriState && this.treeModel.isSelected(this)) {
            this.setIsSelected(true, false);
          }
          this.children.forEach(child => {
            if (child.getField('isExpanded') && child.hasChildren) {
              child.expand();
            }
          });
        }
      })
      .then(() => {
        this.fireEvent({
          eventName: TREE_EVENTS.loadNodeChildren,
          node: this
        });
      });
  }

  expand() {
    if (!this.isExpanded) {
      this.toggleExpanded();
      if (this.options.lazySelect && this._allChildrenSelected) {
        this.visibleChildren.forEach((child: TreeNode) => {
          child.setIsSelected(true, false);
        });
      }
    }
    return this;
  }

  collapse() {
    if (this.isExpanded) {
      this.toggleExpanded();
    }

    return this;
  }

  doForAll(fn: (node: ITreeNode) => any) {
    Promise.resolve(fn(this)).then(() => {
      if (this.children) {
        this.children.forEach(child => child.doForAll(fn));
      }
    });
  }

  expandAll() {
    this.doForAll(node => node.expand());
  }

  collapseAll() {
    this.doForAll(node => node.collapse());
  }

  ensureVisible() {
    if (this.realParent) {
      this.realParent.expand();
      this.realParent.ensureVisible();
    }

    return this;
  }

  toggleExpanded() {
    this.setIsExpanded(!this.isExpanded);
    return this;
  }

  setIsExpanded(value) {
    if (this.hasChildren) {
      this.treeModel.setExpandedNode(this, value);
    }

    return this;
  }

  autoLoadChildren() {
    this.handler = reaction(
      () => this.isExpanded,
      isExpanded => {
        if (!this.children && this.hasChildren && isExpanded) {
          this.loadNodeChildren();
        }
      },
      { fireImmediately: true }
    );
  }

  dispose() {
    if (this.children) {
      this.children.forEach(child => child.dispose());
    }
    if (this.handler) {
      this.handler();
    }
    this.parent = null;
    this.children = null;
  }

  setIsActive(value, multi = false) {
    this.treeModel.setActiveNode(this, value, multi);
    if (value) {
      this.focus(this.options.scrollOnActivate);
    }

    return this;
  }

  isSelectable() {
    return this.isLeaf || !this.children || !this.options.useTriState;
  }

  @action setIsSelected(value, fromUserAction: boolean) {
    /*
    * All children should be selected/deselected by default
    */
    this._allChildrenSelected = value;
    this._someChildrenSelected = value;
    /*  And hidden indicator that this node has been selected/deselected. */
    this.internalSelectState = value;
    if (this.isSelectable()) {
      this.treeModel.setSelectedNode(this, value, fromUserAction);
    }
    return this;
  }

  toggleSelected() {
    const currentStatus = this.internalSelectState;
    this.setIsSelected(!currentStatus, true);

    // 
    // A selection event won't be sent (above) for non-leaf nodes. We need that (explicit user)
    // event to manage state properly in mb-tree.
    //
    if (!this.isSelectable()) {
      if (!currentStatus || !this.options.useCheckbox) {
        this.fireEvent({ eventName: TREE_EVENTS.select, node: this, fromUserAction: true });
      } else {
        this.fireEvent({ eventName: TREE_EVENTS.deselect, node: this, fromUserAction: true });
      } 
    }

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
  }

  toggleActivated(multi = false) {
    this.setIsActive(!this.isActive, multi);

    return this;
  }

  setActiveAndVisible(multi = false) {
    this.setIsActive(true, multi).ensureVisible();

    setTimeout(this.scrollIntoView.bind(this));

    return this;
  }

  scrollIntoView(force = false) {
    this.treeModel.virtualScroll.scrollIntoView(this, force);
  }

  focus(scroll = true) {
    let previousNode = this.treeModel.getFocusedNode();
    this.treeModel.setFocusedNode(this);
    if (scroll) {
      this.scrollIntoView();
    }
    if (previousNode) {
      this.fireEvent({ eventName: TREE_EVENTS.blur, node: previousNode });
    }
    this.fireEvent({ eventName: TREE_EVENTS.focus, node: this });

    return this;
  }

  blur() {
    let previousNode = this.treeModel.getFocusedNode();
    this.treeModel.setFocusedNode(null);
    if (previousNode) {
      this.fireEvent({ eventName: TREE_EVENTS.blur, node: this });
    }

    return this;
  }

  setIsHidden(value) {
    this.treeModel.setIsHidden(this, value);
  }

  hide() {
    this.setIsHidden(true);
  }

  show() {
    this.setIsHidden(false);
  }

  mouseAction(actionName: string, $event, data: any = null) {
    this.treeModel.setFocus(true);

    const actionMapping = this.options.actionMapping.mouse;
    const action = actionMapping[actionName];

    if (action) {
      action(this.treeModel, this, $event, data);
    }
  }

  getSelfHeight() {
    return this.options.nodeHeight(this);
  }

  @action _initChildren() {
    this.children = this.getField('children').map(
      (c, index) => new TreeNode(c, this, this.treeModel, index)
    );
  }

  @action public updatePendingChildStatus(status: boolean): void {
    if (this.options.lazySelect) {
      this.visibleChildren.forEach(child => {
        child.setIsSelected(status, false);
        this.treeModel.setSelectedNode(child, status, false);
      });
    }
  }

  /**
   *  All nodes ancestors except the node which have been selected/deselect
   *  1. Update children selection status locally (all, some flags, i.e., node's local copies)
   *  2. Push parent to update its own copy of its children's statuses
   */
  public propagateStatusToParents(): void {
    /* Select propogates downward and deselect propogates upward */
    if (this.options.lazySelect) {
      this.updateChildrenSelectionStatus();
      if (this.parent) {
        this.parent.propagateStatusToParents();
      }
    }
  }

  /**
   * For all node descendants except the node itself:
   * 1. Update children selection status (not local copies, actual push)
   * 2. Push child to update its children's statuses
   */
  public propogateStatusDownwards(): void {
    /** If nodes are visible we need to update them*/
    if (this.options.lazySelect && this.isExpanded) {
      /**Either all children are selected, or None */
      if (this._allChildrenSelected || !this._someChildrenSelected) {
        const childStatus = this._allChildrenSelected;
        this.children.forEach(child => {
          if (childStatus !== child.isSelected) {
            child.setIsSelected(childStatus, false);
            child.propogateStatusDownwards();
          }
        });
      }
    }
  }

  private emitSelectStatusChange(node: TreeNode, status: boolean): void {
    this.treeModel.setSelectedNode(node, status, false);
  }

  private updateChildrenSelectionStatus(): void {
    this._someChildrenSelected = false;
    this.visibleChildren.forEach(child => {
      this._someChildrenSelected =
        this._someChildrenSelected || child.someChildrenSelected();
      this._allChildrenSelected =
        this._allChildrenSelected && child.allChildrenSelected();
    });
    this.internalSelectState = this._someChildrenSelected;
  }

  private isAllSelected() {
    if (this.isSelectable()) {
      return this.treeModel.isSelected(this);
    } else if (this.options.lazySelect) {
      return this._allChildrenSelected;
    } else {
      return every(this.children, (node: TreeNode) => node.isAllSelected);
    }
  }

  someChildrenSelected(): boolean {
    return this.options.lazySelect ? this._someChildrenSelected : this.isSelected;
  }

  allChildrenSelected(): boolean {
    return this.options.lazySelect ? this._allChildrenSelected : this.isAllSelected();
  }
}

function uuid() {
  return Math.floor(Math.random() * 10000000000000);
}
