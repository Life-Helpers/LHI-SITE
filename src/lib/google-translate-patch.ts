"use client";

/**
 * Monkey-patches Node.prototype methods to prevent React reconciliation crashes
 * (removeChild / insertBefore) caused when Google Translate wraps text nodes in <font> elements.
 */
export function applyGoogleTranslatePatch(): void {
  if (typeof window === "undefined" || typeof Node === "undefined") return;

  // Prevent multiple patch applications
  if ((window as unknown as { __gt_patched?: boolean }).__gt_patched) return;
  (window as unknown as { __gt_patched?: boolean }).__gt_patched = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.apply(this, [child]) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    newNode: T,
    referenceNode: Node | null
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.apply(this, [newNode, referenceNode]) as T;
  };
}
