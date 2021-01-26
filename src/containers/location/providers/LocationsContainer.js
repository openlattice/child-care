// @flow

import React, { useEffect } from 'react';

import styled from 'styled-components';
import { List, Map, get } from 'immutable';
import {
  Colors,
  PaginationToolbar,
  SearchResults,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';

import EditFiltersContainer from './EditFiltersContainer';
import LocationResult from './LocationResult';
import NoResults from './NoResults';
import ProviderDetailsContainer from './ProviderDetailsContainer';
import ProviderHeaderContainer from './ProviderHeaderContainer';
import ProviderMap from './ProviderMap';
import LocationSearchBar from './LocationSearchBar';
import ReferralAgencyDetailsContainer from './ReferralAgencyDetailsContainer';
import ReferralAgencyHeaderContainer from './ReferralAgencyHeaderContainer';

import WelcomeSplash from '../WelcomeSplash';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import {
  HITS,
  PAGE,
  REQUEST_STATE,
  TOTAL_HITS
} from '../../../core/redux/constants';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { LABELS } from '../../../utils/constants/labels';
import { MapWrapper } from '../../styled';
import {
  GEOCODE_PLACE,
  LOAD_CURRENT_POSITION,
  SEARCH_LOCATIONS,
  SEARCH_REFERRAL_AGENCIES,
  loadCurrentPosition,
  searchLocations,
  searchReferralAgencies,
  setValue
} from '../LocationsActions';

const {
  isPending,
  isStandby,
  isSuccess,
  reduceRequestStates
} = ReduxUtils;

const {
  CURRENT_POSITION,
  IS_EDITING_FILTERS,
  LAT,
  LON,
  SELECTED_PROVIDER,
  SELECTED_REFERRAL_AGENCY,
  SEARCH_INPUTS,
  SELECTED_OPTION,
} = PROVIDERS;

const { LOCATIONS } = STATE;
const { BLUE } = Colors;

const MAX_HITS = 20;

const StyledContentWrapper = styled(ContentWrapper)`
  justify-content: space-between;
  margin-bottom: 15px;
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
  color: ${BLUE.B400};
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
    [LOCATIONS, IS_EDITING_FILTERS],
    false
  ));
  const getText = useSelector(getTextFnFromState);
  const geocodePlaceRS = useSelector((store) => store.getIn(
    [LOCATIONS, GEOCODE_PLACE, REQUEST_STATE]
  ));
  const searchLocationsRS = useSelector((store) => store.getIn(
    [LOCATIONS, SEARCH_LOCATIONS, REQUEST_STATE]
  ));
  const searchReferralAgenciesRS = useSelector((store) => store.getIn(
    [LOCATIONS, SEARCH_REFERRAL_AGENCIES, REQUEST_STATE]
  ));
  const selectedProvider = useSelector((store) => store.getIn([LOCATIONS, SELECTED_PROVIDER]));
  const selectedReferralAgency = useSelector((store) => store.getIn([LOCATIONS, SELECTED_REFERRAL_AGENCY]));
  const searchResults = useSelector((store) => store.getIn([LOCATIONS, HITS]));
  const totalHits = useSelector((store) => store.getIn([LOCATIONS, TOTAL_HITS], 0));
  const lastSearchInputs = useSelector((store) => store.getIn([LOCATIONS, SEARCH_INPUTS], Map()));
  const page = useSelector((store) => store.getIn([LOCATIONS, PAGE]));
  const selectedOption = useSelector((store) => store.getIn([LOCATIONS, SELECTED_OPTION]));
  const currentPosition = useSelector((store) => store.getIn([LOCATIONS, CURRENT_POSITION]));
  const dispatch = useDispatch();

  let editFiltersContent = null;
  let providerHeader = null;
  let providerDetails = null;

  if (isEditingFilters) {
    editFiltersContent = <EditFiltersContainer />;
  }
  else if (selectedReferralAgency) {
    providerHeader = <ReferralAgencyHeaderContainer />;
    providerDetails = <ReferralAgencyDetailsContainer />;
  }
  else if (selectedProvider) {
    providerHeader = <ProviderHeaderContainer />;
    providerDetails = <ProviderDetailsContainer />;
  }

  const shouldDisplaySearchBar = !(isEditingFilters || selectedReferralAgency || selectedProvider);

  const lat = get(selectedOption, LAT);
  const lon = get(selectedOption, LON);

  const hasSearched = !isStandby(searchLocationsRS);
  const isLoading = isPending(reduceRequestStates([
    geocodePlaceRS,
    searchLocationsRS,
    searchReferralAgenciesRS
  ]));

  useEffect(() => {
    if (
      isSuccess(searchLocationsRS)
      && searchResults.isEmpty()
      && lat
      && lon
    ) {
      dispatch(searchReferralAgencies({ searchInputs: selectedOption }));
    }
  }, [
    dispatch,
    lat,
    lon,
    searchLocationsRS,
    searchResults,
    selectedOption
  ]);

  const editFilters = () => dispatch(setValue({ field: IS_EDITING_FILTERS, value: true }));

  const renderSearchResults = () => {
    if (!hasSearched) {
      return <WelcomeSplash getCurrentPosition={() => dispatch(loadCurrentPosition())} />;
    }
    return (
      <StyledSearchResults
          hasSearched={hasSearched}
          isLoading={isLoading}
          noResults={NoResults}
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
        { shouldDisplaySearchBar && <LocationSearchBar /> }
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
                  {getText(LABELS.SORT_BY)}
                </div>
                <FilterButton onClick={editFilters}>{getText(LABELS.REFINE_SEARCH)}</FilterButton>
              </FilterRow>

              <StyledContentWrapper>
                { renderSearchResults() }
                {
                  hasSearched
                    && (
                      <PaginationToolbar
                          page={page + 1}
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
