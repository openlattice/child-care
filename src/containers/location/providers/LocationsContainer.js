// @flow

import React, {
  useCallback,
  useEffect,
  useReducer,
  useState
} from 'react';

import isPlainObject from 'lodash/isPlainObject';
import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Colors,
  PaginationToolbar,
  SearchResults,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import EditFiltersContainer from './EditFiltersContainer';
import LocationResult from './LocationResult';
import LocationSearchBar from './LocationSearchBar';
import ProviderDetailsContainer from './ProviderDetailsContainer';
import ProviderHeaderContainer from './ProviderHeaderContainer';
import ProviderMap from './ProviderMap';
import { getGeoOptions, searchLocations, setValue } from './LocationsActions';
import { STAY_AWAY_STORE_PATH } from './constants';

import FindingLocationSplash from '../FindingLocationSplash';
import { usePosition, useTimeout } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { getRenderTextFn } from '../../../utils/AppUtils';
import { isNonEmptyString } from '../../../utils/LangUtils';
import { LABELS } from '../../../utils/constants/Labels';
import { PROVIDERS } from '../../../utils/constants/StateConstants';
import { MapWrapper } from '../../styled';

const MAX_HITS = 20;
const INITIAL_STATE = {
  page: 0,
  start: 0,
  selectedOption: undefined
};

const StyledContentWrapper = styled(ContentWrapper)`
  justify-content: space-between;
`;

const StyledSearchResults = styled(SearchResults)`
  margin: auto;
`;

const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px 0 30px;
`;

const FilterButton = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${Colors.PURPLES[1]};
  text-decoration: none;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const SortOption = styled.div`

`;


const reducer = (state, action) => {
  switch (action.type) {
    case 'page': {
      const { page, start } = action.payload;
      return { ...state, page, start };
    }
    default:
      throw new Error();
  }
};

const LocationsContainer = () => {

  const isEditingFilters = useSelector((store) => store.getIn(
    [...STAY_AWAY_STORE_PATH, PROVIDERS.IS_EDITING_FILTERS],
    false
  ));


  const renderText = useSelector(getRenderTextFn);
  const selectedProvider = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, PROVIDERS.SELECTED_PROVIDER]));
  const searchResults = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'totalHits'], 0));
  const fetchState = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'fetchState']));
  const dispatch = useDispatch();
  const [state, stateDispatch] = useReducer(reducer, INITIAL_STATE);

  const {
    page,
    start,
    selectedOption
  } = state;
  const [address] = useState();
  const [currentPosition] = usePosition();

  const fetchGeoOptions = useCallback(() => {
    if (isNonEmptyString(address)) {
      dispatch(getGeoOptions({ address, currentPosition }));
    }
  }, [dispatch, address]);

  useTimeout(fetchGeoOptions, 300);

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


  let editFiltersContent = null;
  let providerHeader = null;
  let providerDetails = null;

  if (isEditingFilters) {
    editFiltersContent = <EditFiltersContainer />;
  }
  else if (selectedProvider) {
    providerHeader = <ProviderHeaderContainer />;
    providerDetails = <ProviderDetailsContainer />;
  }

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;
  const hasPosition = !!currentPosition.coords;

  const editFilters = () => dispatch(setValue({ field: PROVIDERS.IS_EDITING_FILTERS, value: true }));

  const onPageChange = ({ page: newPage, start: startRow }) => {
    stateDispatch({
      type: 'page',
      payload: { page: newPage, start: startRow }
    });
  };
  return (
    <ContentOuterWrapper>
      <ContentWrapper padding="none">
        {editFiltersContent}
        {providerHeader}
        <MapWrapper>
          <ProviderMap
              currentPosition={currentPosition}
              selectedOption={selectedOption}
              searchResults={searchResults} />
        </MapWrapper>

        {
          providerDetails || (
            <>
              <FilterRow>
                <SortOption>
                  {renderText(LABELS.SORT_BY)}
                </SortOption>
                <FilterButton onClick={editFilters}>{renderText(LABELS.REFINE_SEARCH)}</FilterButton>
              </FilterRow>

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
            </>
          )
        }
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default LocationsContainer;
