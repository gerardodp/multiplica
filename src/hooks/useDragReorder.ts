"use client";

import { useRef, useCallback, useState } from "react";

export interface DragInfo {
  /** Index of the item currently being dragged, or null */
  activeIndex: number | null;
  /** Current Y offset (px) of the dragged item from its original position */
  offsetY: number;
}

/**
 * Touch-friendly drag-to-reorder hook using pointer events.
 *
 * How it works:
 * - pointerdown on an item records its index and starting Y.
 * - pointermove updates offsetY (used to translate the dragged item visually).
 *   When the pointer crosses the midpoint of a neighbor, the items array is
 *   reordered in-place via onReorder and the "active" index is updated so the
 *   dragged element keeps following the finger seamlessly.
 * - pointerup / pointercancel resets everything.
 *
 * All events are attached to the **container** div (via the returned props
 * object) so there is no need for setPointerCapture.
 */
export function useDragReorder<T>(
  items: T[],
  onReorder: (newItems: T[]) => void
) {
  const [drag, setDrag] = useState<DragInfo>({ activeIndex: null, offsetY: 0 });

  // Refs survive re-renders without triggering them
  const activeIndexRef = useRef<number | null>(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const itemEls = useRef<(HTMLElement | null)[]>([]);
  // Height of a single item (captured once on drag start)
  const itemHeightRef = useRef(0);

  /** Call this as a ref-callback on each item: `ref={el => setItemRef(i, el)}` */
  const setItemRef = useCallback(
    (index: number, el: HTMLElement | null) => {
      itemEls.current[index] = el;
    },
    []
  );

  const handlePointerDown = useCallback(
    (index: number, e: React.PointerEvent) => {
      // Only primary button / single touch
      if (e.button !== 0) return;
      e.preventDefault();

      const el = itemEls.current[index];
      if (el) {
        const rect = el.getBoundingClientRect();
        itemHeightRef.current = rect.height;
      }

      activeIndexRef.current = index;
      startYRef.current = e.clientY;
      currentYRef.current = e.clientY;
      setDrag({ activeIndex: index, offsetY: 0 });
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (activeIndexRef.current === null) return;
      e.preventDefault();
      currentYRef.current = e.clientY;
      const offsetY = currentYRef.current - startYRef.current;
      const idx = activeIndexRef.current;

      // Threshold = half item height + gap (12px gap-3)
      const threshold = (itemHeightRef.current + 12) / 2;

      // Move down
      if (offsetY > threshold && idx < items.length - 1) {
        const newItems = [...items];
        [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
        onReorder(newItems);
        activeIndexRef.current = idx + 1;
        // Reset start so the next threshold is relative to the new position
        startYRef.current += itemHeightRef.current + 12;
        setDrag({ activeIndex: idx + 1, offsetY: currentYRef.current - startYRef.current });
        return;
      }

      // Move up
      if (offsetY < -threshold && idx > 0) {
        const newItems = [...items];
        [newItems[idx], newItems[idx - 1]] = [newItems[idx - 1], newItems[idx]];
        onReorder(newItems);
        activeIndexRef.current = idx - 1;
        startYRef.current -= itemHeightRef.current + 12;
        setDrag({ activeIndex: idx - 1, offsetY: currentYRef.current - startYRef.current });
        return;
      }

      setDrag({ activeIndex: idx, offsetY });
    },
    [items, onReorder]
  );

  const handlePointerUp = useCallback(() => {
    activeIndexRef.current = null;
    setDrag({ activeIndex: null, offsetY: 0 });
  }, []);

  const handlePointerCancel = useCallback(() => {
    activeIndexRef.current = null;
    setDrag({ activeIndex: null, offsetY: 0 });
  }, []);

  /** Spread these onto the container div */
  const containerProps = {
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerLeave: handlePointerUp,
    onPointerCancel: handlePointerCancel,
  };

  return {
    drag,
    setItemRef,
    handlePointerDown,
    containerProps,
  };
}
