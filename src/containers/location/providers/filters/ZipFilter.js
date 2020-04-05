import React from 'react';
import styled from 'styled-components';

import StyledInput from '../../../../components/controls/StyledInput';
// import { ZIP_CODE_COORDINATES } from '../../../../utils/constants/CAZipCodeCoordinates';

const CenteredInput = styled(StyledInput)`
  text-align: center;
`;

const ZipFilter = ({ value, onChange }) => {

  const onInputChange = ({ target }) => {
    const numeric = target.value.replace(/\D/g,'');
    if (numeric.length <= 5) {
      onChange(numeric);
    }
  }

  return (
    <CenteredInput value={value} onChange={onInputChange} />
  );

};

export default ZipFilter;
