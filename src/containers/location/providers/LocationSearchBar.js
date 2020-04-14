// @flow

import React, {
  useCallback,
  useEffect,
  useReducer,
  useState
} from 'react';

import isPlainObject from 'lodash/isPlainObject';
import styled from 'styled-components';
import { faLocation, faLocationSlash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  Card,
  IconButton,
  Select,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import { getGeoOptions, searchLocations } from './LocationsActions';
import { STAY_AWAY_STORE_PATH } from './constants';

import { usePosition, useTimeout } from '../../../components/hooks';
import { ContentWrapper } from '../../../components/layout';
import { getRenderTextFn } from '../../../utils/AppUtils';
import { isNonEmptyString } from '../../../utils/LangUtils';
import { LABELS } from '../../../utils/constants/Labels';
import { PROVIDERS } from '../../../utils/constants/StateConstants';
import { FlexRow, ResultSegment } from '../../styled';
import {
  APP_CONTAINER_WIDTH
} from '../../../core/style/Sizes';

const MAX_HITS = 20;
const INITIAL_STATE = {
  page: 0,
  start: 0,
  selectedOption: undefined
};

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
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'selectLocation': {
      return {
        page: 0,
        selectedOption: action.payload,
        start: 0
      };
    }
    case 'page': {
      const { page, start } = action.payload;
      return { ...state, page, start };
    }
    default:
      throw new Error();
  }
};

const LocationsSearchBar = () => {

  const renderText = useSelector(getRenderTextFn);
  const optionsFetchState = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'options', 'fetchState']));
  const hasPerformedInitialSearch = useSelector((store) => store
    .getIn([...STAY_AWAY_STORE_PATH, PROVIDERS.HAS_PERFORMED_INITIAL_SEARCH]));


  const isAppInitialized = useSelector((store) => store.getIn(['app', 'initializeState']));

  const options = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'options', 'data']));
  const dispatch = useDispatch();
  const [state, stateDispatch] = useReducer(reducer, INITIAL_STATE);

  const {
    start,
    selectedOption
  } = state;
  const [address, setAddress] = useState();
  const [currentPosition] = usePosition();

  const fetchGeoOptions = useCallback(() => {
    if (isNonEmptyString(address)) {
      dispatch(getGeoOptions({ address, currentPosition }));
    }
  }, [dispatch, address]);

  useTimeout(fetchGeoOptions, 300);

  useEffect(() => {
    if (currentPosition.coords && !selectedOption) {
      const { latitude, longitude } = currentPosition.coords;
      stateDispatch({
        type: 'selectLocation',
        payload: {
          label: renderText(LABELS.CURRENT_LOCATION),
          value: `${latitude},${longitude}`,
          lat: latitude,
          lon: longitude
        }
      });
    }
  }, [
    currentPosition,
    selectedOption
  ]);

  useEffect(() => {
    const newSearchInputs = Map({
      selectedOption
    });
    const hasValues = isPlainObject(selectedOption);

    if (hasValues) {
      dispatch(searchLocations({
        searchInputs: newSearchInputs,
        start,
        maxHits: MAX_HITS
      }));
    }
  }, [dispatch, selectedOption, start]);

  const isFetchingOptions = optionsFetchState === RequestStates.PENDING;

  const filterOption = () => true;

  const handleChange = (payload) => {
    stateDispatch({ type: 'selectLocation', payload });
  };

  return (
    <Wrapper>
      <Select
          filterOption={filterOption}
          inputId="address"
          inputValue={address}
          isLoading={isFetchingOptions}
          onChange={handleChange}
          onInputChange={setAddress}
          options={options.toJS()}
          placeholder={renderText(LABELS.SEARCH_LOCATIONS)}
          value={selectedOption} />
    </Wrapper>
  );
};

export default LocationsSearchBar;
