// @flow

import React, {
  useCallback,
  useEffect,
  useReducer,
  useState
} from 'react';
import { bindActionCreators } from 'redux';

import styled, { css } from 'styled-components';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactMapboxGl, { ScaleControl } from 'react-mapbox-gl';
import { Map, fromJS } from 'immutable';
import { Colors } from 'lattice-ui-kit';
import { connect } from 'react-redux';

import EditFilter from './EditFilter';
import { STAY_AWAY_STORE_PATH } from './constants';
import { PROVIDERS } from '../../../utils/constants/StateConstants';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { DAYS_OF_WEEK } from '../../../utils/DataConstants';
import {
  APP_CONTAINER_WIDTH,
  MEDIA_QUERY_TECH_SM,
  MEDIA_QUERY_MD,
  MEDIA_QUERY_LG,
  HEADER_HEIGHT,
  HEIGHTS
} from '../../../core/style/Sizes';
import { LABELS } from '../../../utils/constants/Labels';

import FindingLocationSplash from '../FindingLocationSplash';
import BasicButton from '../../../components/buttons/BasicButton';
import InfoButton from '../../../components/buttons/InfoButton';
import { usePosition, useTimeout } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { getRenderTextFn } from '../../../utils/AppUtils';
import { getBoundsFromPointsOfInterest, getCoordinates } from '../../map/MapUtils';
import { getValue, getValues, getDistanceBetweenCoords } from '../../../utils/DataUtils';
import { FlexRow, MapWrapper, ResultSegment } from '../../styled';
import * as LocationsActions from './LocationsActions';

const StyledContentOuterWrapper = styled(ContentOuterWrapper)`
 z-index: 1;
 position: fixed;
 top: ${HEADER_HEIGHT}px;
`;

const StyledContentWrapper = styled(ContentWrapper)`
  background-color: white;
  position: relative;

  @media only screen and (min-height: ${HEIGHTS[0]}px) {
    padding: 10px 25px;
  }

  @media only screen and (min-height: ${HEIGHTS[1]}px) {
    padding: 25px;
  }
`;

const BackButton = styled.div`
  display: flex;
  flex-direciton: row;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: ${Colors.PURPLES[1]};
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }

  span {
    margin-left: 15px;
  }

  &:hover {
    cursor: pointer
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-family: Inter;
  font-style: normal;
  color: #555E6F;

  @media only screen and (min-height: ${HEIGHTS[0]}px) {
    padding: 10px 0;
  }

  @media only screen and (min-height: ${HEIGHTS[1]}px) {
    padding: 15px 0;
  }

  div {
    @media only screen and (min-height: ${HEIGHTS[0]}px) {
      font-size: 18px;
      line-height: 14px;
    }

    @media only screen and (min-height: ${HEIGHTS[1]}px) {
      font-size: 22px;
      line-height: 27px;
    }

    font-weight: 600;
  }


  span {

    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
  }
`;

const SubHeader = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  margin: 3px 0;

  color: #555E6F;
`;

class ProviderHeaderContainer extends React.Component {

  getDistance = () => {
    const { coordinates, provider } = this.props;

    const [lon, lat] = getCoordinates(provider);
    const miles = getDistanceBetweenCoords(coordinates, [lat, lon]);

    return Math.round(miles * 10) / 10;
  }

  render() {

    const { actions, provider, renderText } = this.props;

    if (!provider) {
      return null;
    }

    const name = getValue(provider, PROPERTY_TYPES.FACILITY_NAME);
    const type = getValues(provider, PROPERTY_TYPES.FACILITY_TYPE);
    const status = getValues(provider, PROPERTY_TYPES.STATUS);
    const paymentOptions = getValues(provider, PROPERTY_TYPES.PAYMENT_OPTIONS);
    const url = getValue(provider, PROPERTY_TYPES.URL);

    const street = getValue(provider, PROPERTY_TYPES.ADDRESS);
    const city = getValue(provider, PROPERTY_TYPES.CITY);
    const zip = getValue(provider, PROPERTY_TYPES.ZIP);

    const isPopUp = getValue(provider, PROPERTY_TYPES.IS_POP_UP);

    const capacities = [];
    const yr = renderText(LABELS.YR);
    if (getValue(provider, PROPERTY_TYPES.CAPACITY_UNDER_2)) {
      capacities.push(`0 ${yr} - 1 ${yr}`);
    }
    if (getValue(provider, PROPERTY_TYPES.CAPACITY_2_to_5)) {
      capacities.push(`2 ${yr} - 5 ${yr}`);
    }
    if (getValue(provider, PROPERTY_TYPES.CAPACITY_OVER_5)) {
      capacities.push(`6 ${renderText(LABELS.YR_AND_UP)}`);
    }
    if (!capacities.length) {
      capacities.push(renderText(LABELS.UNKNOWN_AGE_LIMITATIONS));
    }

    const distance = this.getDistance();

    return (
      <StyledContentOuterWrapper>
        <StyledContentWrapper padding="25px">
          <BackButton onClick={() => actions.selectProvider(false)}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <span>{renderText(LABELS.SEARCH_RESULTS)}</span>
          </BackButton>
          <Header>
            <div>{name}</div>
            <span>{`${distance} mi`}</span>
          </Header>

          <SubHeader>{`${city}, CA`}</SubHeader>
          <SubHeader>{type}</SubHeader>
          <SubHeader>{capacities.join(', ')}</SubHeader>

        </StyledContentWrapper>
      </StyledContentOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {
  const providerState = state.getIn([...STAY_AWAY_STORE_PATH], Map());

  const lat = providerState.getIn(['selectedOption', 'lat']);
  const lon = providerState.getIn(['selectedOption', 'lon']);

  return {
    providerState: state.getIn([...STAY_AWAY_STORE_PATH], Map()),
    provider: providerState.get(PROVIDERS.SELECTED_PROVIDER),
    coordinates: [lat, lon],
    renderText: getRenderTextFn(state)
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions :{ [string] :Function } = {};

  Object.keys(LocationsActions).forEach((action :string) => {
    actions[action] = LocationsActions[action];
  });

  return {
    actions: {
      ...bindActionCreators(actions, dispatch)
    }
  };
}

export default connect<*, *, *, *, *, *>(mapStateToProps, mapDispatchToProps)(ProviderHeaderContainer);
