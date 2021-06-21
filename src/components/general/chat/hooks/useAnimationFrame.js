import { animationInterval } from "../../../../utils";
import { useRef, useEffect } from "react";

export default (ms, callback) => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const controller = new AbortController();
    animationInterval(ms, controller.signal, callbackRef.current);
    return () => controller.abort();
  }, [ms]);
};
