import { useEffect, RefObject } from "react";

type AnyEvent = MouseEvent | TouchEvent;

//Description
// The "useClickOutside" hook is used to detect when a clicks outside of a specified element.
//Parameters
// "ref: Ref<T>" - A reference to the element that should be tracked.
// "callback: (event: MouseEvent | TouchEvent) => void" -A callback function that will be executed when the user clicks outside of the element.
//Return Value
// The hook does not return any value.
//Example Usage
// useClickOutside(dropdownRef, () => setIsOpen(false));

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: AnyEvent) => void
) {
  useEffect(() => {
    const listener = (event: AnyEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}