// @flow
import { useEffect } from 'react';

const useTimeout = (callback :() => any, delay :number) => {

  // Set up the Timeout.
  useEffect(() => {
    const tick = () => {
      callback();
    };

    const id = setTimeout(tick, delay);
    return () => clearTimeout(id);
  }, [callback, delay]);
};

export default useTimeout;
