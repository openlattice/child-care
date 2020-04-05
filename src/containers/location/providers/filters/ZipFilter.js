import React from 'react';
import styled from 'styled-components';
import { List, Map, fromJS } from 'immutable'

import StyledInput from '../../../../components/controls/StyledInput';
import { ZIP_CODE_COORDINATES } from '../../../../utils/constants/CAZipCodeCoordinates';

const CenteredInput = styled(StyledInput)`
  text-align: center;
`;

export default class ZipFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inputStr: props.value.get(0)
    };
  }


  render() {
    const { value, onChange } = this.props;
    const { inputStr } = this.state;

    const onInputChange = ({ target }) => {
      const numeric = target.value.replace(/\D/g,'');
      if (numeric.length <= 5) {
        this.setState({ inputStr: numeric });
      }

      if (numeric.length === 5 && ZIP_CODE_COORDINATES[numeric]) {
        const [lat, lon] = ZIP_CODE_COORDINATES[numeric];

        const searchInput = {
          label: numeric,
          value: `${lat},${lon}`,
          lat,
          lon
        };

        onChange(fromJS([numeric, searchInput]));
      }
    }

    return (
      <CenteredInput value={inputStr} onChange={onInputChange} />
    );

  }
}
