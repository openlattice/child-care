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
  getAgesServedFromEntity,
  getDistanceBetweenCoords,
  getValue,
  renderFacilityName
} from '../../../utils/DataUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { FACILITY_TYPE_LABELS, LABELS } from '../../../utils/constants/Labels';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { getCoordinates } from '../../map/MapUtils';
import type { Translation } from '../../../types';

const { NEUTRAL, PURPLE } = Colors;

const StyledContentOuterWrapper = styled(ContentOuterWrapper)`
  position: fixed;
  top: ${HEADER_HEIGHT}px;
  z-index: 1;
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
  align-items: center;
  color: ${PURPLE.P300};
  display: flex;
  flex-direction: row;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }

  span {
    margin-left: 15px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const Header = styled.div`
  align-items: center;
  color: ${NEUTRAL.N700};
  display: flex;
  flex-direction: row;
  font-style: normal;
  justify-content: space-between;

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
    font-size: 14px;
    font-weight: normal;
    line-height: 17px;
    min-width: fit-content;
  }
`;

const SubHeader = styled.div`
  color: ${NEUTRAL.N700};
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  line-height: 17px;
  margin: 3px 0;
`;

type Props = {
  actions :{
    selectProvider :(bool :boolean) => void;
  };
  coordinates :number[];
  provider :Map;
  getText :(translation :Translation) => string;
};

class ProviderHeaderContainer extends React.Component<Props> {

  getDistance = () => {
    const { coordinates, provider } = this.props;

    const [lon, lat] = getCoordinates(provider);
    const miles = getDistanceBetweenCoords(coordinates, [lat, lon]);

    return Math.round(miles * 10) / 10;
  }

  render() {

    const { actions, provider, getText } = this.props;

    if (!provider) {
      return null;
    }

    const name = renderFacilityName(provider, getText);
    const type = provider.get(PROPERTY_TYPES.FACILITY_TYPE, List())
      .map((v) => getText(FACILITY_TYPE_LABELS[v]));

    const city = getValue(provider, PROPERTY_TYPES.CITY);

    const ages = getAgesServedFromEntity(provider, getText);

    const distance = this.getDistance();

    return (
      <StyledContentOuterWrapper>
        <StyledContentWrapper padding="25px">
          <BackButton onClick={() => actions.selectProvider(false)}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <span>{getText(LABELS.SEARCH_RESULTS)}</span>
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
    getText: getRenderTextFn(state)
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
