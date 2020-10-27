// @flow

import React from 'react';

import styled from 'styled-components';
import { faChevronLeft } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import { Colors } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as LocationsActions from '../LocationsActions';

import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import {
  HEADER_HEIGHT,
  HEIGHTS,
} from '../../../core/style/Sizes';
import { getRenderTextFn } from '../../../utils/AppUtils';
import {
  getDistanceBetweenCoords,
  getValue,
  getValues,
  getAgesServedFromEntity,
  renderFacilityName
} from '../../../utils/DataUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { LABELS, FACILITY_TYPE_LABELS } from '../../../utils/constants/Labels';
import { STATE, PROVIDERS } from '../../../utils/constants/StateConstants';
import { getCoordinates } from '../../map/MapUtils';

const { NEUTRAL, PURPLE } = Colors;

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
  color: ${PURPLE.P300};
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
  color: ${NEUTRAL.N700};

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
    min-width: fit-content;
  }
`;

const SubHeader = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  margin: 3px 0;

  color: ${NEUTRAL.N700};
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

    const name = renderFacilityName(provider, renderText);
    const type = provider.get(PROPERTY_TYPES.FACILITY_TYPE, List())
      .map((v) => renderText(FACILITY_TYPE_LABELS[v]));

    const city = getValue(provider, PROPERTY_TYPES.CITY);

    // const status = getValues(provider, PROPERTY_TYPES.STATUS);
    // const paymentOptions = getValues(provider, PROPERTY_TYPES.PAYMENT_OPTIONS);
    // const url = getValue(provider, PROPERTY_TYPES.URL);
    // const street = getValue(provider, PROPERTY_TYPES.ADDRESS);
    // const zip = getValue(provider, PROPERTY_TYPES.ZIP);
    // const isPopUp = getValue(provider, PROPERTY_TYPES.IS_POP_UP);

    const ages = getAgesServedFromEntity(provider, renderText);

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
          <SubHeader>{ages}</SubHeader>

        </StyledContentWrapper>
      </StyledContentOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {
  const providerState = state.get(STATE.LOCATIONS, Map());

  const lat = providerState.getIn(['selectedOption', 'lat']);
  const lon = providerState.getIn(['selectedOption', 'lon']);

  return {
    providerState,
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
