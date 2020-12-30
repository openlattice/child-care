// @flow

import React from 'react';

import { faChevronLeft } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import { Typography } from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BackButton from '../../../components/controls/BackButton';
import * as LocationsActions from '../LocationsActions';
import { Body3, OpenClosedTag } from '../../../components/layout';
import { VACANCY_COLORS } from '../../../shared/Colors';
import { getTextFnFromState } from '../../../utils/AppUtils';
import {
  getAgesServedFromEntity,
  getDistanceBetweenCoords,
  getValue,
  isProviderActive,
  renderFacilityName
} from '../../../utils/DataUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { FACILITY_TYPE_LABELS, LABELS } from '../../../utils/constants/labels';
import { getCoordinates } from '../../map/MapUtils';
import {
  Header,
  StyledHeaderOuterWrapper,
  StyledHeaderWrapper,
  SubHeader
} from '../../styled';
import type { Translation } from '../../../types';

const { formatAsRelative } = DateTimeUtils;
const { LAT, LON, SELECTED_OPTION } = PROVIDERS;

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
    const isActive = isProviderActive(provider);
    const statusLabel = isActive ? LABELS.OPEN : LABELS.CLOSED;
    const statusColor = isActive ? VACANCY_COLORS.OPEN : VACANCY_COLORS.CLOSED;

    const lastModified = getValue(provider, PROPERTY_TYPES.LAST_MODIFIED);
    const lastModifiedLabel = formatAsRelative(lastModified, getText(LABELS.UNKNOWN));

    const distance = this.getDistance();

    return (
      <StyledHeaderOuterWrapper>
        <StyledHeaderWrapper padding="25px">
          <BackButton onClick={() => actions.selectProvider(false)}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <span>{getText(LABELS.SEARCH_RESULTS)}</span>
          </BackButton>
          <Header>
            <Typography variant="h3">{name}</Typography>
            <Body3>{`${distance} mi`}</Body3>
          </Header>

          <Body3>{`${city}, CA`}</Body3>
          <Body3>{type}</Body3>
          <Body3>{ages}</Body3>
          <SubHeader>
            <OpenClosedTag color={statusColor}>
              {getText(statusLabel)}
            </OpenClosedTag>
            <Body3>{`${getText(LABELS.LAST_UPDATED)} ${lastModifiedLabel}`}</Body3>
          </SubHeader>
        </StyledHeaderWrapper>
      </StyledHeaderOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {
  const providerState = state.get(STATE.LOCATIONS, Map());

  const lat = providerState.getIn([SELECTED_OPTION, LAT]);
  const lon = providerState.getIn([SELECTED_OPTION, LON]);

  return {
    providerState,
    provider: providerState.get(PROVIDERS.SELECTED_PROVIDER),
    coordinates: [lat, lon],
    getText: getTextFnFromState(state)
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
