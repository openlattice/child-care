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
import { List, Map } from 'immutable';
import {
  Card,
  Colors,
  IconButton,
  PaginationToolbar,
  SearchResults,
  Select,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import LocationResult from './LocationResult';
import EditFiltersContainer from './EditFiltersContainer';
import ProviderMap from './ProviderMap';
import { getGeoOptions, searchLocations, setValue } from './LocationsActions';
import { STAY_AWAY_STORE_PATH } from './constants';
import { PROVIDERS } from '../../../utils/constants/StateConstants';

import FindingLocationSplash from '../FindingLocationSplash';
import { usePosition, useTimeout } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { isNonEmptyString } from '../../../utils/LangUtils';
import { FlexRow, MapWrapper, ResultSegment } from '../../styled';

const MAX_HITS = 20;
const INITIAL_STATE = {
  page: 0,
  start: 0,
  selectedOption: undefined
};

const PositionIcon = <FontAwesomeIcon icon={faLocation} fixedWidth />;
const noPositionIcon = <FontAwesomeIcon icon={faLocationSlash} fixedWidth />;
const MarginButton = styled(IconButton)`
  margin-left: 5px;
`;

const StyledContentWrapper = styled(ContentWrapper)`
  justify-content: space-between;
`;

const StyledSearchResults = styled(SearchResults)`
  margin: auto;
`;

const AbsoluteWrapper = styled.div`
  position: absolute;
  top: 0;
`;

const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px 0 30px;
`;

const FilterButton = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${Colors.PURPLES[1]};
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const SortOption = styled.div`

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

const LocationContainer = () => {

  const isEditingFilters = useSelector((store) => store.getIn(
    [...STAY_AWAY_STORE_PATH, PROVIDERS.IS_EDITING_FILTERS],
    false
  ));

  const searchResults = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'totalHits'], 0));
  const fetchState = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'fetchState']));
  const optionsFetchState = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'options', 'fetchState']));
  const options = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'options', 'data']));
  const dispatch = useDispatch();
  const [state, stateDispatch] = useReducer(reducer, INITIAL_STATE);

  const {
    page,
    start,
    selectedOption
  } = state;
  const [address, setAddress] = useState();
  const [currentPosition] = usePosition();

  const fetchGeoOptions = useCallback(() => {
    if (isNonEmptyString(address)) {
      dispatch(getGeoOptions(address));
    }
  }, [dispatch, address]);

  useTimeout(fetchGeoOptions, 300);

  useEffect(() => {
    if (currentPosition.coords && !selectedOption) {
      const { latitude, longitude } = currentPosition.coords;
      stateDispatch({
        type: 'selectLocation',
        payload: {
          label: 'Current Location',
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

  if (isEditingFilters) {
    return <EditFiltersContainer />;
  }

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;
  const isFetchingOptions = optionsFetchState === RequestStates.PENDING;
  const hasPosition = !!currentPosition.coords;

  const filterOption = () => true;

  const editFilters = () => dispatch(setValue({ field: PROVIDERS.IS_EDITING_FILTERS, value: true }));

  const handleCurrentPositionClick = () => {
    if (currentPosition.coords) {
      const { latitude, longitude } = currentPosition.coords;
      stateDispatch({
        type: 'selectLocation',
        payload: {
          label: 'Current Location',
          value: `${latitude},${longitude}`,
          lat: latitude,
          lon: longitude
        }
      });
    }
  };

  const handleChange = (payload) => {
    stateDispatch({ type: 'selectLocation', payload });
  };

  const onPageChange = ({ page: newPage, start: startRow }) => {
    stateDispatch({
      type: 'page',
      payload: { page: newPage, start: startRow }
    });
  };
  return (
    <ContentOuterWrapper>
      <ContentWrapper padding="none">
        <MapWrapper>
          <ProviderMap
              currentPosition={currentPosition}
              selectedOption={selectedOption}
              searchResults={searchResults} />
        </MapWrapper>
        <FilterRow>
          <SortOption>
            Sort by relevance
          </SortOption>
          <FilterButton onClick={editFilters}>Refine Search</FilterButton>
        </FilterRow>
        <AbsoluteWrapper>
          <ContentWrapper>
            <Card>
              <ResultSegment vertical>
                <form>
                  <div>
                    <FlexRow>
                      <Select
                          autoFocus
                          filterOption={filterOption}
                          inputId="address"
                          inputValue={address}
                          isLoading={isFetchingOptions}
                          onChange={handleChange}
                          onInputChange={setAddress}
                          options={options.toJS()}
                          placeholder="Search Locations"
                          value={selectedOption} />
                      <MarginButton
                          disabled={!hasPosition}
                          icon={hasPosition ? PositionIcon : noPositionIcon}
                          onClick={handleCurrentPositionClick} />
                    </FlexRow>
                  </div>
                </form>
              </ResultSegment>
            </Card>
          </ContentWrapper>
        </AbsoluteWrapper>
        <StyledContentWrapper>
          {
            (!hasPosition && !hasSearched) && (
              <FindingLocationSplash />
            )
          }
          <StyledSearchResults
              hasSearched={hasSearched}
              isLoading={isLoading}
              resultComponent={LocationResult}
              results={searchResults} />
          {
            hasSearched && (
              <PaginationToolbar
                  page={page}
                  count={totalHits}
                  onPageChange={onPageChange}
                  rowsPerPage={MAX_HITS} />
            )
          }
        </StyledContentWrapper>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default LocationContainer;
