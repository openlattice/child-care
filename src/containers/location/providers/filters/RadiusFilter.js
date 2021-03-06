import React from 'react';
import styled from 'styled-components';
import { Colors, Select } from 'lattice-ui-kit';

import { isMobile } from '../../../../utils/AppUtils';
import { LABELS } from '../../../../utils/constants/labels';

const { NEUTRAL, BLUE } = Colors;

const BasicSelect = styled.select`
  background-color: ${NEUTRAL.N00};
  border: solid 1px ${NEUTRAL.N100};
  border-radius: 3px;
  box-shadow: none;
  font-size: 12px;
  line-height: normal;
  min-height: 30px;
  text-align: center;

  &:focus {
    background-color: white;
    border: solid 1px ${BLUE.B400};
  }
`;

export default class RadiusFilter extends React.Component {

  componentDidMount() {
    const { setIsValid } = this.props;
    setIsValid(true);
  }

  render() {
    const { value, onChange, getText } = this.props;

    const renderMiles = (miles) => `${miles} ${getText(LABELS.MILE)}${miles === 1 ? '' : 's'}`;

    const RADIUS_OPTIONS = [
      1,
      5,
      10,
      25,
      50
    ].map((d) => ({
      value: d,
      label: renderMiles(d)
    }));

    const handleOnChange = (payload) => {
      onChange(payload.value);
    };

    const onBasicSelectChange = ({ target }) => {
      const { selectedIndex } = target;
      handleOnChange(RADIUS_OPTIONS[selectedIndex]);
    };

    const selectedOption = RADIUS_OPTIONS.find((option) => option.value === value);

    if (isMobile()) {
      return (
        <BasicSelect value={selectedOption.value} onChange={onBasicSelectChange}>
          {RADIUS_OPTIONS.map((option) => (
            <option
                key={option.value}
                label={option.label}
                value={option.value}>
              {renderMiles(option.value)}
            </option>
          ))}
        </BasicSelect>
      );
    }

    return (
      <Select
          isClearable={false}
          isSearchable={false}
          isMulti={false}
          onChange={handleOnChange}
          options={RADIUS_OPTIONS}
          placeholder={getText(LABELS.SELECT)}
          value={selectedOption} />
    );
  }

}
