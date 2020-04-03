// @flow
import { useEffect, useState } from 'react';

const usePosition = () :[Position, PositionError] => {
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  const onChange = (pos :Position) => {
    setPosition(pos);
  };

  const onError = (posError :PositionError) => {
    setError(posError);
  };

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError('Geolocation is not supported');
      return;
    }

    geo.getCurrentPosition(onChange, onError);
  }, []);

  return [position, error];
};

export default usePosition;
