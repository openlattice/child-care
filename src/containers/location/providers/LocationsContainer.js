// @flow

import React, { useEffect } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Colors,
  PaginationToolbar,
  SearchResults,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';

import NoResults from './NoResults';
import EditFiltersContainer from './EditFiltersContainer';
import LocationResult from './LocationResult';
import ProviderDetailsContainer from './ProviderDetailsContainer';
import ProviderHeaderContainer from './ProviderHeaderContainer';
import ProviderMap from './ProviderMap';
import ReferralAgencyDetailsContainer from './ReferralAgencyDetailsContainer';
import ReferralAgencyHeaderContainer from './ReferralAgencyHeaderContainer';

import FindingLocationSplash from '../FindingLocationSplash';
import WelcomeSplash from '../WelcomeSplash';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import {
  HITS,
  PAGE,
  REQUEST_STATE,
  TOTAL_HITS
} from '../../../core/redux/constants';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { LABELS } from '../../../utils/constants/labels';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { MapWrapper } from '../../styled';
import {
  GEOCODE_PLACE,
  LOAD_CURRENT_POSITION,
  SEARCH_LOCATIONS,
  loadCurrentPosition,
  searchLocations,
  searchReferralAgencies,
  setValue
} from '../LocationsActions';

const {
  isFailure,
  isPending,
  isStandby,
  isSuccess,
  reduceRequestStates
} = ReduxUtils;

const {
  CURRENT_POSITION,
  IS_EDITING_FILTERS,
  SELECTED_PROVIDER,
  SELECTED_REFERRAL_AGENCY,
  SEARCH_INPUTS,
  SELECTED_OPTION,
} = PROVIDERS;

const { LOCATIONS } = STATE;

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
    [LOCATIONS, IS_EDITING_FILTERS],
    false
  ));
  const getText = useSelector(getTextFnFromState);
  const geocodePlaceRS = useSelector((store) => store.getIn(
    [LOCATIONS, GEOCODE_PLACE, REQUEST_STATE]
  ));
  const loadCurrentPositionRS = useSelector((store) => store.getIn(
    [LOCATIONS, LOAD_CURRENT_POSITION, REQUEST_STATE]
  ));
  const searchLocationsRS = useSelector((store) => store.getIn(
    [LOCATIONS, SEARCH_LOCATIONS, REQUEST_STATE]
  ));
  const selectedProvider = useSelector((store) => store.getIn([LOCATIONS, SELECTED_PROVIDER]));
  const selectedReferralAgency = useSelector((store) => store.getIn([LOCATIONS, SELECTED_REFERRAL_AGENCY]));
  const searchResults = useSelector((store) => store.getIn([LOCATIONS, HITS], List()));
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

  const hasSearched = !isStandby(searchLocationsRS);
  const isLoading = isPending(reduceRequestStates([geocodePlaceRS, searchLocationsRS, loadCurrentPositionRS]));
  const geoSearchFailed = isFailure(loadCurrentPositionRS);

  useEffect(() => {
    if (
      isSuccess(searchLocationsRS)
      && searchResults.isEmpty()
      && selectedOption.lat
      && selectedOption.lon
    ) {
      dispatch(searchReferralAgencies({ selectedOption }));
    }
  }, [
    dispatch,
    searchLocationsRS,
    searchResults,
    selectedOption
  ]);

  const editFilters = () => dispatch(setValue({ field: IS_EDITING_FILTERS, value: true }));

  const renderSearchResults = () => {
    if (!hasSearched) {
      return <WelcomeSplash getCurrentPosition={() => dispatch(loadCurrentPosition())} />;
    }
    if (geoSearchFailed) {
      return <FindingLocationSplash />;
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
