// @flow

import React from 'react';

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
import ProviderDetailsContainer from './ProviderDetailsContainer';
import ProviderHeaderContainer from './ProviderHeaderContainer';
import ProviderMap from './ProviderMap';
import {
  searchLocations,
  loadCurrentPosition,
  setValue
} from './LocationsActions';

import { STAY_AWAY_STORE_PATH } from './constants';

import FindingLocationSplash from '../FindingLocationSplash';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { getRenderTextFn } from '../../../utils/AppUtils';
import { LABELS } from '../../../utils/constants/Labels';
import { Button } from 'lattice-ui-kit';
import { PROVIDERS } from '../../../utils/constants/StateConstants';
import { MapWrapper } from '../../styled';

const MAX_HITS = 20;

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
  const lastSearchInputs = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'searchInputs'], Map()));
  const page = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, PROVIDERS.SEARCH_PAGE]));
  const selectedOption = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'selectedOption']));
  const currentPosition = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, PROVIDERS.CURRENT_POSITION]));
  const dispatch = useDispatch();

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

  const onLoadLocation = () => {
    dispatch(loadCurrentPosition());
  };

  const onPageChange = ({ page: newPage }) => {
    dispatch(searchLocations({
      searchInputs: lastSearchInputs,
      start: newPage
    }));
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
                <FilterButton onClick={onLoadLocation}>{renderText(LABELS.USE_CURRENT_LOCATION)}</FilterButton>
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
