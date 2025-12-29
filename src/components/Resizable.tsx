import { ReactNode, useCallback, useEffect, useState } from "react";
/**
 * A React component that provides resizable functionality to its child element.
 * The child element should be a function that accepts a `ref` object.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.children - A function that renders the child element and accepts a `ref` object.
 * @returns {ReactNode} The rendered child element with resizable functionality.
 *
 * @example
 * <Resizable>
 *   {({ ref }) => (
 *     <div ref={ref}>
 *       Resizable content
 *     </div>
 *   )}
 * </Resizable>
 */
const Resizable = ({
  resizable = true,
  updateColumnWidth,
  children,
}: {
  resizable?: boolean;
  updateColumnWidth: (field: string, newWidth: number) => void;
  children: ({ ref }: { ref: (nodeEle: HTMLElement) => void }) => ReactNode;
}): ReactNode => {
  const [node, setNode] = useState<HTMLElement | null>(null);

  const ref = useCallback((nodeEle: HTMLElement) => setNode(nodeEle), []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!node) {
        return;
      }

      const parent = node.closest("th");

      if (!parent) return;

      const startPos = {
        x: e.clientX,
      };

      const startWidth = parent.offsetWidth;

      const handleMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startPos.x;
        const newWidth = startWidth + dx;
        parent.style.width = `${newWidth}px`;
        parent.style.minWidth = `${newWidth}px`;

        const field = parent.getAttribute("data-field");
        if (field) updateColumnWidth(field, newWidth);

        updateCursor();
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        resetCursor();
      };

      document.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      document.addEventListener("mouseup", handleMouseUp, { passive: true });
    },
    [node, updateColumnWidth]
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!node) {
        return;
      }

      const parent = node.closest("th");
      const touch = e.touches[0];

      if (!parent) return;

      const startPos = {
        x: touch.clientX,
      };

      const startWidth = parent.offsetWidth;

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const dx = touch.clientX - startPos.x;
        const newWidth = startWidth + dx;
        parent.style.width = `${newWidth}px`;
        parent.style.minWidth = `${newWidth}px`;

        updateCursor();
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("mouseup", handleTouchEnd);
        resetCursor();
      };

      document.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      document.addEventListener("touchend", handleTouchEnd, { passive: true });
    },
    [node]
  );

  const updateCursor = () => {
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const resetCursor = () => {
    document.body.style.removeProperty("cursor");
    document.body.style.removeProperty("user-select");
  };

  useEffect(() => {
    if (!node || !resizable) {
      return;
    }

    node.addEventListener("mousedown", handleMouseDown, { passive: true });
    node.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      node.removeEventListener("mousedown", handleMouseDown);
      node.removeEventListener("touchstart", handleTouchStart);
    };
  }, [handleMouseDown, handleTouchStart, node, resizable]);

  return children({ ref });
};

export default Resizable;
