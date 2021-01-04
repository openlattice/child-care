// @flow

import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

import isPlainObject from 'lodash/isPlainObject';
import styled from 'styled-components';
import { faSearch } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map, isImmutable } from 'immutable';
import {
  Colors,
  Select,
  StyleUtils,
} from 'lattice-ui-kit';
import { LangUtils, ReduxUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';

import { useTimeout } from '../../../components/hooks';
import { REQUEST_STATE } from '../../../core/redux/constants';
import { APP_CONTAINER_WIDTH } from '../../../core/style/Sizes';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { LABELS } from '../../../utils/constants/labels';
import {
  GET_GEO_OPTIONS,
  LOAD_CURRENT_POSITION,
  geocodePlace,
  getGeoOptions,
  loadCurrentPosition,
  selectLocationOption,
  setValues
} from '../LocationsActions';

const { LOCATIONS } = STATE;
const {
  CURRENT_POSITION,
  SELECTED_OPTION,
  IS_EDITING_FILTERS,
  FILTER_PAGE,
  SELECTED_PROVIDER,
  SELECTED_REFERRAL_AGENCY
} = PROVIDERS;
const { NEUTRAL } = Colors;
const { media } = StyleUtils;
const { isNonEmptyString } = LangUtils;
const { isFailure, isPending } = ReduxUtils;

/* placeholder color needs to be darker to provide more contrast between text and background */
const getTheme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    neutral50: NEUTRAL.N700
  },
});

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    border: `1px solid ${NEUTRAL.N100}`
  })
};

const Wrapper = styled.div`
  left: 50%;
  margin: 0 auto;
  max-width: min(${APP_CONTAINER_WIDTH}px, calc(100vw - 100px));
  padding: 8px 0;
  top: 0;
  width: 100%;
  z-index: 1000;

  /* fill right side gap for screens smaller than desktop cutoff */
  ${media.desktop`
    max-width: min(${APP_CONTAINER_WIDTH}px, calc(100vw - 60px));
    left: calc(50% + 20px);
  `}
  ${media.phone`
    position: fixed;
    transform: translate(-50%, 0);
  `}
  ${media.tablet`
    position: fixed;
    transform: translate(-50%, 0);
  `}
`;

const GroupHeading = () => (<div style={{ borderBottom: `1px solid ${NEUTRAL.N100}` }} />);
const SearchIcon = <FontAwesomeIcon icon={faSearch} fixedWidth />;

const LocationsSearchBar = () => {

  /* 'aria-autocomplete' should be set to none because it is not a valid label for Role 'textbox' */
  const refInput = useRef(null);
  useEffect(() => {
    if (refInput.current) {
      const inputElement :HTMLInputElement = refInput.current.querySelector('input');
      if (inputElement && inputElement.hasAttribute('aria-autocomplete')) {
        inputElement.removeAttribute('aria-autocomplete');
      }
    }
  }, []);

  const getText = useSelector(getTextFnFromState);
  const currentLocationText = getText(LABELS.CURRENT_LOCATION);
  const locationServicesDenied = getText(LABELS.LOCATION_SERVICES_DISABLED);
  const getGeoOptionsRS = useSelector((store) => store.getIn([LOCATIONS, GET_GEO_OPTIONS, REQUEST_STATE]));
  const loadCurrentPositionRS = useSelector((store) => store.getIn([LOCATIONS, LOAD_CURRENT_POSITION, REQUEST_STATE]));
  const currentPosition = useSelector((store) => store.getIn([LOCATIONS, CURRENT_POSITION]));
  const storedOption = useSelector((store) => store.getIn([LOCATIONS, SELECTED_OPTION]));
  const geoSearchFailed = isFailure(loadCurrentPositionRS);

  let selectedOption = storedOption;
  if (Map.isMap(storedOption)) {
    selectedOption = storedOption.toJS();
  }

  const options = useSelector((store) => store.getIn([LOCATIONS, 'options', 'data']));
  const dispatch = useDispatch();

  const [address, setAddress] = useState();

  const fetchGeoOptions = useCallback(() => {
    if (isNonEmptyString(address)) {
      dispatch(getGeoOptions({ address, currentPosition }));
    }
  }, [dispatch, address, currentPosition]);

  useTimeout(fetchGeoOptions, 300);

  const isFetchingOptions = isPending(getGeoOptionsRS);

  const filterOption = () => true;

  const handleChange = (payload) => {
    const hasValues = isPlainObject(payload);

    dispatch(setValues({
      [FILTER_PAGE]: null,
      [IS_EDITING_FILTERS]: false,
      [SELECTED_PROVIDER]: null,
      [SELECTED_REFERRAL_AGENCY]: null,
    }));

    if (hasValues) {

      if (payload.value === currentLocationText) {
        dispatch(loadCurrentPosition());
      }
      else {
        dispatch(geocodePlace(payload));
      }
    }
    dispatch(selectLocationOption(payload));
  };

  const optionsWithMyLocation = options.toJS();
  const currentLocationLabel = geoSearchFailed
    ? `${currentLocationText} (${locationServicesDenied})` : currentLocationText;
  optionsWithMyLocation.push({
    options: [
      { label: currentLocationLabel, value: currentLocationLabel, isDisabled: geoSearchFailed }
    ]
  });

  let value = null;
  if (selectedOption) {
    const label = isImmutable(selectedOption) ? selectedOption.get('label') : selectedOption.label;
    if (label) {
      value = selectedOption;
    }
  }

  return (
    <Wrapper ref={refInput}>
      <Select
          aria-label="address"
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
          placeholder={getText(LABELS.ENTER_NAME_ADDRESS_ZIP)}
          styles={customStyles}
          theme={getTheme}
          value={value} />
    </Wrapper>
  );
};

export default LocationsSearchBar;
