// @flow

import React, {
  useCallback,
  useEffect,
  useReducer,
  useState
} from 'react';

import isPlainObject from 'lodash/isPlainObject';
import styled from 'styled-components';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-light-svg-icons';
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

const BackButton = styled.div`
  display: flex;
  flex-direciton: row;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${Colors.PURPLES[1]};
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }

  span {
    margin-left: 15px;
  }
`;

const HeaderLabel = styled.div`
  padding-top: 20px;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;

  color: #555E6F;
`;

const FilterRow = styled.div`
  color: #8E929B;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  div {

  }

  article {
    display: flex;
    flex-direction: row;
    align-items: center;

    span {
      font-weight: 600;
      color: #555E6F;
      margin-right: 15px;
    }
  }
`;


const EditFiltersContainer = () => {

  const providerState = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH], Map()));

  console.log(providerState.toJS());

  const filterOption = () => true;

  const dispatch = useDispatch();
  const backToMap = () => dispatch(setValue({ field: PROVIDERS.IS_EDITING_FILTERS, value: false }));

  const editFilter = (value) => dispatch(setValue({ field: PROVIDERS.FILTER_PAGE, value }));

  const getListValue = (field, mappingFn) => providerState.get(field, List())
    .map(v => (mappingFn ? mappingFn(v) : v))
    .join(', ') || 'Any';

  const renderRow = (field, value, label) => (
    <FilterRow onClick={() => editFilter(field)}>
      <div>{label}</div>
      <article>
        <span>{value}</span>
        <FontAwesomeIcon icon={faChevronRight} />
      </article>
    </FilterRow>
  );

  return (
    <ContentOuterWrapper>
      <ContentWrapper padding="25px">
        <BackButton onClick={backToMap}>
          <FontAwesomeIcon icon={faChevronLeft} />
          <span>Back to search results</span>
        </BackButton>
        <HeaderLabel>Provider</HeaderLabel>
        {renderRow(PROVIDERS.TYPE_OF_CARE, getListValue(PROVIDERS.TYPE_OF_CARE), 'Type of Care')}
        {renderRow(PROVIDERS.ZIP, providerState.get(PROVIDERS.ZIP) || 'Any', 'Zip Code')}
        {renderRow(PROVIDERS.RADIUS, `${providerState.get(PROVIDERS.RADIUS, 0)} miles`, 'Search Radius')}
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default EditFiltersContainer;
