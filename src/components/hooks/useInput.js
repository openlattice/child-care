// @flow
import { useCallback, useState } from 'react';

const useInput = (defaultValue :any, isNumeric ? :boolean = false) => {
  const [inputValue, setValue] = useState(defaultValue);
  const setInput = useCallback((event :SyntheticEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const nextValue = isNumeric ? parseFloat(value) : value;
    setValue(nextValue);
  }, [isNumeric, setValue]);

  return [inputValue, setInput];
};

export default useInput;
