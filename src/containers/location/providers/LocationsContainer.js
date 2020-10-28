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
  setValue,
  loadCurrentPosition
} from '../LocationsActions';

import FindingLocationSplash from '../FindingLocationSplash';
import WelcomeSplash from '../WelcomeSplash';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { getRenderTextFn } from '../../../utils/AppUtils';
import { LABELS } from '../../../utils/constants/Labels';
import { STATE, PROVIDERS } from '../../../utils/constants/StateConstants';
import { MapWrapper } from '../../styled';

const MAX_HITS = 20;

const StyledContentWrapper = styled(ContentWrapper)`
  justify-content: space-between;
`;

const StyledSearchResults = styled(SearchResults)``;

const FilterRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 30px 0 30px;
`;

const FilterButton = styled.div`
  color: ${Colors.PURPLES[1]};
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const LocationsContainer = () => {

  const isEditingFilters = useSelector((store) => store.getIn(
    [STATE.LOCATIONS, PROVIDERS.IS_EDITING_FILTERS],
    false
  ));

  const renderText = useSelector(getRenderTextFn);
  const selectedProvider = useSelector((store) => store.getIn([STATE.LOCATIONS, PROVIDERS.SELECTED_PROVIDER]));
  const searchResults = useSelector((store) => store.getIn([STATE.LOCATIONS, 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn([STATE.LOCATIONS, 'totalHits'], 0));
  const fetchState = useSelector((store) => store.getIn([STATE.LOCATIONS, 'fetchState']));
  const lastSearchInputs = useSelector((store) => store.getIn([STATE.LOCATIONS, 'searchInputs'], Map()));
  const page = useSelector((store) => store.getIn([STATE.LOCATIONS, PROVIDERS.SEARCH_PAGE]));
  const selectedOption = useSelector((store) => store.getIn([STATE.LOCATIONS, 'selectedOption']));
  const currentPosition = useSelector((store) => store.getIn([STATE.LOCATIONS, PROVIDERS.CURRENT_POSITION]));
  const geoLocationUnavailable = useSelector((store) => store
    .getIn([STATE.LOCATIONS, PROVIDERS.GEO_LOCATION_UNAVAILABLE]));
  const lastSearchType = useSelector((store) => store.getIn([STATE.LOCATIONS, PROVIDERS.LAST_SEARCH_TYPE]));
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
  const wasGeoSearch = lastSearchType === 'geo';

  const editFilters = () => dispatch(setValue({ field: PROVIDERS.IS_EDITING_FILTERS, value: true }));

  const renderSearchResults = () => {
    if (!hasSearched) {
      return <WelcomeSplash getCurrentPosition={() => dispatch(loadCurrentPosition())} />;
    }
    if (geoLocationUnavailable && wasGeoSearch) {
      return <FindingLocationSplash />;
    }
    return (
      <StyledSearchResults
          hasSearched={hasSearched}
          isLoading={isLoading}
          resultComponent={LocationResult}
          results={searchResults} />
    );
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
                <div>
                  {renderText(LABELS.SORT_BY)}
                </div>
                <FilterButton onClick={editFilters}>{renderText(LABELS.REFINE_SEARCH)}</FilterButton>
              </FilterRow>

              <StyledContentWrapper>
                { renderSearchResults() }
                {
                  hasSearched
                    && (
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
