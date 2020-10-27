import React from 'react';
import styled from 'styled-components';
import { Colors, Select } from 'lattice-ui-kit';

import { isMobile } from '../../../../utils/AppUtils';
import { LABELS } from '../../../../utils/constants/Labels';

const { NEUTRAL, PURPLE } = Colors;

const BasicSelect = styled.select`
  background-color: ${NEUTRAL.N00};
  border: solid 1px ${NEUTRAL.N100};
  borderRadius: 3px;
  box-shadow: none;
  font-size: 12px;
  line-height: normal;
  min-height: 30px;
  text-align: center;

  &:focus {
    background-color: white;
    border: solid 1px ${PURPLE.P300};
  }
`;

export default class RadiusFilter extends React.Component {

  componentDidMount() {
    const { setIsValid } = this.props;
    setIsValid(true);
  }

  render() {
    const { value, onChange, renderText } = this.props;

    const renderMiles = (miles) => `${miles} ${renderText(LABELS.MILE)}${miles === 1 ? '' : 's'}`;

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
          value={selectedOption}
          isClearable={false}
          isSearchable={false}
          isMulti={false}
          onChange={handleOnChange}
          options={RADIUS_OPTIONS}
          placeholder={renderText(LABELS.SELECT)} />
    );
  }

}
