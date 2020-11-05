// @flow
/* eslint-disable react/jsx-no-target-blank */
import React, { Fragment } from 'react';

import moment from 'moment';
import styled, { css } from 'styled-components';
import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import { Colors, Tooltip } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ExpandableSection from './ExpandableSection';

import * as LocationsActions from '../LocationsActions';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { HEIGHTS } from '../../../core/style/Sizes';
import { trackLinkClick } from '../../../utils/AnalyticsUtils';
import { getRenderTextFn } from '../../../utils/AppUtils';
import { DAYS_OF_WEEK, DAY_PTS } from '../../../utils/DataConstants';
import {
  getEntityKeyId,
  isProviderActive,
  shouldHideContact,
  shouldHideLocation
} from '../../../utils/DataUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { LABELS } from '../../../utils/constants/Labels';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { getCoordinates } from '../../map/MapUtils';
import type { Translation } from '../../../types';

const { getPropertyValue } = DataUtils;

const InfoIcon = React.forwardRef((props, ref) => (
  // https://material-ui.com/components/tooltips/#custom-child-element
  /* eslint-disable-next-line */
  <span {...props} ref={ref}>
    <FontAwesomeIcon icon={faInfoCircle} size="sm" />
  </span>
));

const { NEUTRAL, PURPLE } = Colors;

const PADDING = 25;

const MarginWrapper = styled.span`
  margin-left: 5px;
`;

const FlexContainer = styled.div`
  display: flex;
`;

const StyledContentOuterWrapper = styled(ContentOuterWrapper)`
  z-index: 1;

  @media only screen and (min-height: ${HEIGHTS[0]}px) {
    min-height: ${HEIGHTS[0] / 3}px;
  }

  @media only screen and (min-height: 639px) {
    min-height: 270px;
  }

  @media only screen and (min-height: ${HEIGHTS[1]}px) {
    min-height: 350px;
  }

  @media only screen and (min-height: ${HEIGHTS[2]}px) {
    min-height: 350px;
  }

  @media only screen and (min-height: ${HEIGHTS[3]}px) {
    min-height: 460px;
  }

  @media only screen and (min-height: ${HEIGHTS[4]}px) {
    min-height: 630px;
  }
`;

const StyledContentWrapper = styled(ContentWrapper)`
  background-color: white;
  position: relative;
  padding: 0 ${PADDING}px ${PADDING}px ${PADDING}px !important;
`;

const Row = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  justify-content: space-between;
  line-height: 19px;
  margin: 8px 0;

  div {
    color: ${NEUTRAL.N700};
    max-width: 65%;
  }

  a {
    color: ${PURPLE.P300};
    text-decoration: underline;
    max-width: 65%;
  }
`;

const DataRows = styled.div`
  display: flex;
  flex-direction: column;
  ${(props) => (props.maxWidth ? css` max-width: ${props.maxWidth} !important; ` : '')}

  span {
    color: ${NEUTRAL.N600};
    text-align: right;
  }

  a {
    min-width: fit-content;
    text-align: right;
    ${(props) => (props.alignEnd ? css` align-self: flex-end; ` : '')}
  }
`;

const TitleRow = styled.div`
  align-items: center;
  color: ${NEUTRAL.N600};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 0;
  width: 100%;

  span {
    color: ${NEUTRAL.N700};
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 17px;

    :last-child {
      font-weight: normal;
    }
  }
`;

const DateRow = styled.article`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  span {
    color: ${NEUTRAL.N600};
  }

  span:first-child {
    margin-right: 10px;
    text-align: left;
  }

  span:last-child {
    text-align: right;
  }
`;

const Line = styled.div`
  background-color: ${NEUTRAL.N100};
  height: 1px;
  margin: ${(props) => props.paddingTop || 0}px -${PADDING}px 0 -${PADDING}px;
`;

const InfoText = styled.div`
  color: ${NEUTRAL.N600};
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  line-height: 19px;
`;

type Props = {
  hospital :Map;
  provider :Map;
  getText :(translation :Translation) => string;
  rrs :Map;
};

class ProviderDetailsContainer extends React.Component<Props> {

  renderEmailAsLink = (provider :Map, isRR :boolean) => {
    const { getText } = this.props;
    const email = getPropertyValue(provider, PROPERTY_TYPES.EMAIL);
    if (!email) {
      return <span>{getText(LABELS.UNKNOWN)}</span>;
    }
    const trackClick = () => trackLinkClick(email, `${isRR ? 'R&R' : 'Provider'} Email`);
    return <a onClick={trackClick()} href={`mailto:${email}`}>{email}</a>;
  };

  renderRR = (rr :Map) => {
    const url = getPropertyValue(rr, PROPERTY_TYPES.URL);
    const name = getPropertyValue(rr, PROPERTY_TYPES.FACILITY_NAME);

    let first = <div>{name}</div>;
    if (url) {
      const trackClick = () => trackLinkClick(name, 'RR Url');
      first = <a onClick={trackClick} key={name} href={url} target="_blank">{name}</a>;
    }

    return (
      <Row key={getEntityKeyId(rr)}>
        {first}
        <DataRows>
          {this.renderEmailAsLink(rr, true)}
        </DataRows>
      </Row>
    );
  };

  renderRRsSection = () => {
    const { rrs, getText } = this.props;

    return (
      <ExpandableSection title={getText(LABELS.RESOURCE_AND_REFERRAL)}>
        <>
          <InfoText>{getText(LABELS.RESOURCE_AND_REFERRAL_DESCRIPTION)}</InfoText>
          {rrs.map(this.renderRR)}
        </>
      </ExpandableSection>
    );
  };

  renderLicenseElement = () => {
    const { getText, provider } = this.props;

    const licenseNumber = getPropertyValue(provider, PROPERTY_TYPES.LICENSE_ID);
    const licenseURL = getPropertyValue(provider, PROPERTY_TYPES.LICENSE_URL);

    if (!licenseURL) {
      return <span>{licenseNumber || getText(LABELS.NOT_LICENSED)}</span>;
    }

    const trackClick = () => trackLinkClick(licenseURL, 'Provider License');
    return <a onClick={trackClick} href={licenseURL} target="_blank">{licenseNumber}</a>;
  }

  renderFamilyHomeLocationSection = () => {
    const { provider, getText } = this.props;

    if (!shouldHideLocation(provider)) {
      return null;
    }

    return (
      <TitleRow>
        <InfoText>{getText(LABELS.CONTACT_RR_FOR_INFO)}</InfoText>
      </TitleRow>
    );

  }

  renderCapacitySection = () => {
    const { provider, getText } = this.props;

    let capacity = 0;
    [
      PROPERTY_TYPES.CAPACITY_UNDER_2,
      PROPERTY_TYPES.CAPACITY_2_TO_5,
      PROPERTY_TYPES.CAPACITY_OVER_5,
      PROPERTY_TYPES.CAPACITY_AGE_UNKNOWN
    ].forEach((capacityFqn) => {
      capacity += provider.getIn([capacityFqn, 0], 0);
    });
    const capacityLabel = capacity === 1 ? LABELS.CHILD : LABELS.CHILDREN;

    return (
      <TitleRow>
        <span>{getText(LABELS.CAPACITY)}</span>
        <span>{`${capacity} ${getText(capacityLabel)}`}</span>
      </TitleRow>
    );
  }

  renderVacanciesSection = () => {
    const { provider, getText } = this.props;

    const hasVacancies = getPropertyValue(provider, PROPERTY_TYPES.VACANCIES);

    let label = LABELS.UNKNOWN;
    if (hasVacancies !== '') {
      label = hasVacancies ? LABELS.SPOTS_OPEN : LABELS.BOOKED;
    }

    return (
      <TitleRow>
        <span>{getText(LABELS.AVAILABILITY)}</span>
        <span>{getText(label)}</span>
      </TitleRow>
    );
  }

  renderUnknown = () => {
    const { getText } = this.props;
    return getText(LABELS.UNKNOWN);
  }

  renderContactSection = () => {
    const { getText, provider } = this.props;

    if (shouldHideContact(provider) || !isProviderActive(provider)) {
      return null;
    }

    const phone = getPropertyValue(provider, PROPERTY_TYPES.PHONE);
    const street = getPropertyValue(provider, PROPERTY_TYPES.ADDRESS);
    const city = getPropertyValue(provider, PROPERTY_TYPES.CITY);
    const zip = getPropertyValue(provider, PROPERTY_TYPES.ZIP);
    const email = this.renderEmailAsLink(provider, false);

    const formatTime = (time) => {
      if (!time) {
        return '?';
      }

      const withDate = moment.utc(time);
      if (!withDate.isValid()) {
        return '?';
      }

      return withDate.format('hh:mma');
    };

    const operatingHours = [];

    const unknown = this.renderUnknown();

    let phoneElem = <span>{unknown}</span>;
    if (phone) {
      const trackClick = () => trackLinkClick(phone, 'Provider Phone Number');
      phoneElem = <a onClick={trackClick} href={`tel:${phone}`}>{phone}</a>;
    }

    if (getPropertyValue(provider, PROPERTY_TYPES.HOURS_UNKNOWN)) {
      operatingHours.push(<span key="hours-unknown">{unknown}</span>);
    }
    else {
      Object.values(DAYS_OF_WEEK).forEach((day) => {
        const [startPT, endPT] = DAY_PTS[day];
        const start = getPropertyValue(provider, startPT);
        const end = getPropertyValue(provider, endPT);

        const timeWindowStr = (start || end) ? `${formatTime(start)} - ${formatTime(end)}` : 'Closed';

        if (start || end) {
          operatingHours.push(
            <DateRow key={day}>
              <span>{getText(LABELS[day])}</span>
              <span>{timeWindowStr}</span>
            </DateRow>
          );
        }
      });
    }

    if (!operatingHours.length) {
      operatingHours.push(<span key="hours-unknown">{unknown}</span>);
    }

    return (
      <ExpandableSection title={getText(LABELS.CONTACT)}>
        <>
          <Row>
            <div>{getText(LABELS.PHONE)}</div>
            <DataRows>
              {phoneElem}
            </DataRows>
          </Row>

          <Row>
            <div>{getText(LABELS.EMAIL)}</div>
            <DataRows>
              {email}
            </DataRows>
          </Row>

          <Row>
            <div>{getText(LABELS.ADDRESS)}</div>
            <DataRows>
              <span>{street}</span>
              <span>{`${city}, CA ${zip}`}</span>
            </DataRows>
          </Row>

          <Row>
            <div>{getText(LABELS.OPERATING_HOURS)}</div>
            <DataRows>
              {operatingHours}
            </DataRows>
          </Row>
        </>
      </ExpandableSection>
    );
  }

  renderHealthAndSafetySection = () => {
    const { getText, provider, hospital } = this.props;

    const unknown = this.renderUnknown();

    const lastInspectionDateStr = getPropertyValue(provider, PROPERTY_TYPES.LAST_INSPECTION_DATE);
    const complaints = getPropertyValue(provider, PROPERTY_TYPES.COMPLAINTS);
    const lastInspectionDate = lastInspectionDateStr ? moment(lastInspectionDateStr).format('MMMM DD, YYYY') : unknown;

    const hospitalName = getPropertyValue(hospital, PROPERTY_TYPES.FACILITY_NAME);

    const [fromLat, fromLon] = getCoordinates(provider);
    const [toLat, toLon] = getCoordinates(hospital);

    const hospitalDirections = `https://www.google.com/maps/dir/${fromLon},${fromLat}/${toLon},${toLat}`;

    const trackHospitalClicked = () => trackLinkClick(hospitalDirections, 'Hospital Directions');

    return (
      <ExpandableSection title={getText(LABELS.HEALTH_AND_SAFETY)}>
        <>
          <Row>
            <div>{getText(LABELS.LAST_INSPECTION_DATE)}</div>
            <DataRows>
              {lastInspectionDate}
            </DataRows>
          </Row>
          <Row>
            <FlexContainer>
              {getText(LABELS.CITATIONS)}
              <MarginWrapper>
                <Tooltip arrow placement="top" title={getText(LABELS.CITATIONS_INFO)}>
                  <InfoIcon />
                </Tooltip>
              </MarginWrapper>
            </FlexContainer>
            <DataRows>
              {complaints}
            </DataRows>
          </Row>
          <Row>
            <div>{getText(LABELS.LICENSE_NUMBER)}</div>
            <DataRows>
              {this.renderLicenseElement()}
            </DataRows>
          </Row>
          <Row>
            <div>{getText(LABELS.NEAREST_HOSPITAL)}</div>
            <DataRows alignEnd>
              <a onClick={trackHospitalClicked} href={hospitalDirections} target="_blank">{hospitalName}</a>
            </DataRows>
          </Row>

        </>
      </ExpandableSection>
    );
  }

  render() {

    const { provider } = this.props;

    if (!provider) {
      return null;
    }

    const sections = [
      this.renderFamilyHomeLocationSection(),
      this.renderVacanciesSection(),
      this.renderCapacitySection(),
      this.renderContactSection(),
      this.renderHealthAndSafetySection(),
      this.renderRRsSection()
    ].filter((s) => s).map((s, idx) => (
      /* eslint-disable-next-line */
      <Fragment key={idx}>
        {s}
        <Line />
      </Fragment>
    ));

    return (
      <StyledContentOuterWrapper>
        <StyledContentWrapper>
          {sections}
        </StyledContentWrapper>
      </StyledContentOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {
  const providerState = state.get(STATE.LOCATIONS, Map());

  const lat = providerState.getIn(['selectedOption', 'lat']);
  const lon = providerState.getIn(['selectedOption', 'lon']);

  const provider = providerState.get(PROVIDERS.SELECTED_PROVIDER);
  const selectedProviderId = getEntityKeyId(provider);
  const rrs = providerState.getIn([PROVIDERS.RRS_BY_ID, selectedProviderId], List())
    .map((entity) => entity.get('neighborDetails', Map()));
  const hospital = providerState.getIn([PROVIDERS.HOSPITALS_BY_ID, selectedProviderId], Map())
    .get('neighborDetails', Map());

  return {
    providerState,
    provider,
    coordinates: [lat, lon],
    getText: getRenderTextFn(state),
    rrs,
    hospital
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

export default connect<*, *, *, *, *, *>(mapStateToProps, mapDispatchToProps)(ProviderDetailsContainer);
