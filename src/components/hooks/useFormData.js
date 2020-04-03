// @flow
import { Map } from 'immutable';
import { useCallback, useEffect, useState } from 'react';

const useFormData = (defaultFormData :Map) => {
  const [data, setValue] = useState(defaultFormData.toJS());

  useEffect(() => {
    setValue(defaultFormData.toJS());
  }, [defaultFormData]);

  const setFormData = useCallback(({ formData } :any) => {
    setValue(formData);
  }, [setValue]);

  return [data, setFormData];
};

export default useFormData;
