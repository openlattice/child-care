// @flow

import React, {
  useCallback,
  useEffect,
  useState
} from 'react';

import isPlainObject from 'lodash/isPlainObject';
import styled from 'styled-components';
import { faSearch } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  Select,
  StyleUtils,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import { getGeoOptions, loadCurrentPosition, searchLocations } from './LocationsActions';
import { STAY_AWAY_STORE_PATH } from './constants';

import { useTimeout } from '../../../components/hooks';
import {
  APP_CONTAINER_WIDTH
} from '../../../core/style/Sizes';
import { getRenderTextFn } from '../../../utils/AppUtils';
import { isNonEmptyString } from '../../../utils/LangUtils';
import { LABELS } from '../../../utils/constants/Labels';
import { PROVIDERS } from '../../../utils/constants/StateConstants';

const { media } = StyleUtils;

const Wrapper = styled.div`
  width: 100%;
  top: 0;
  padding: 8px 0;
  margin: 0 auto;
  position: fixed;
  top: 0;
  z-index: 1000;
  max-width: min(${APP_CONTAINER_WIDTH}px, calc(100vw - 100px));
  left: 50%;
  transform: translate(-50%, 0);

  /* fill right side gap for screens smaller than desktop cutoff */
  ${media.desktop`
    max-width: min(${APP_CONTAINER_WIDTH}px, calc(100vw - 60px));
    left: calc(50% + 20px);
  `}
`;

const GroupHeading = () => (<div style={{ borderBottom: '1px solid lightgrey' }} />);
const SearchIcon = <FontAwesomeIcon icon={faSearch} fixedWidth />;

const LocationsSearchBar = () => {

  const renderText = useSelector(getRenderTextFn);
  const currentLocationText = renderText(LABELS.CURRENT_LOCATION);
  const optionsFetchState = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'options', 'fetchState']));
  const currentPosition = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, PROVIDERS.CURRENT_POSITION]));

  const options = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'options', 'data']));
  const dispatch = useDispatch();

  const [address, setAddress] = useState();
  const [selectedOption, setSelectedOption] = useState();

  const fetchGeoOptions = useCallback(() => {
    if (isNonEmptyString(address)) {
      dispatch(getGeoOptions({ address, currentPosition }));
    }
  }, [dispatch, address, currentPosition]);

  useTimeout(fetchGeoOptions, 300);

  useEffect(() => {
    if (currentPosition.coords && !selectedOption) {
      const { latitude, longitude } = currentPosition.coords;
      setSelectedOption({
        label: currentLocationText,
        value: `${latitude},${longitude}`,
        lat: latitude,
        lon: longitude
      });
    }
  }, [
    currentLocationText,
    currentPosition,
    selectedOption
  ]);

  const isFetchingOptions = optionsFetchState === RequestStates.PENDING;

  const filterOption = () => true;

  const handleChange = (payload) => {
    const newSearchInputs = Map({
      selectedOption: payload
    });
    const hasValues = isPlainObject(payload);

    if (hasValues) {

      if (payload.value === currentLocationText) {
        dispatch(loadCurrentPosition());
      }
      else {
        dispatch(searchLocations({
          searchInputs: newSearchInputs,
        }));
      }
    }
    setSelectedOption(payload);
  };

  const optionsWithMyLocation = options.toJS();
  optionsWithMyLocation.push({
    options: [
      { label: currentLocationText, value: currentLocationText }
    ]
  });

  return (
    <Wrapper>
      <Select
          components={{ GroupHeading }}
          filterOption={filterOption}
          hideDropdownIcon
          inputIcon={SearchIcon}
          inputId="address"
          inputValue={address}
          isClearable
          isLoading={isFetchingOptions}
          onChange={handleChange}
          onInputChange={setAddress}
          options={optionsWithMyLocation}
          placeholder={renderText(LABELS.SEARCH_LOCATIONS)}
          value={selectedOption} />
    </Wrapper>
  );
};

export default LocationsSearchBar;
