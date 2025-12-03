import { useState, useCallback } from "react";

function setDeepValue(obj: any, path: string, value: any) {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  let current = obj;
  for (const key of keys) {
    if (!(key in current)) current[key] = {};
    current = current[key];
  }
  current[lastKey] = value;
}

export function useDeepState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);

  const update = useCallback((path: string, value: any) => {
    setState((prev) => {
      // Deep clone the data
      const cloned = structuredClone(prev);

      // If prev was an instance of a class (not plain Object), recreate that instance
      if (
        prev !== null &&
        typeof prev === "object" &&
        (prev as any).constructor &&
        (prev as any).constructor !== Object
      ) {
        // create a new instance using the same constructor and copy cloned data onto it
        const instance = new (prev as any).constructor();
        Object.assign(instance, cloned);
        setDeepValue(instance, path, value);
        return instance;
      } else {
        // plain object: just set the deep value on the clone
        setDeepValue(cloned, path, value);
        return cloned;
      }
    });
  }, []);

  return [state, update] as const;
}
