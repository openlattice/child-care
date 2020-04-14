// @flow

import React, {
  useCallback,
  useEffect,
  useReducer,
  useState,
  Fragment
} from 'react';

import moment from 'moment';
import ReactMapboxGl, { ScaleControl } from 'react-mapbox-gl';
import styled, { css } from 'styled-components';
import { faChevronLeft, faChevronRight, faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map, List } from 'immutable';
import { Tooltip } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EditFilter from './EditFilter';
import * as LocationsActions from './LocationsActions';
import { STAY_AWAY_STORE_PATH } from './constants';

import ExpandableSection from './ExpandableSection';
import BasicButton from '../../../components/buttons/BasicButton';
import InfoButton from '../../../components/buttons/InfoButton';
import FindingLocationSplash from '../FindingLocationSplash';
import { usePosition, useTimeout } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { APP_CONTAINER_WIDTH, HEIGHTS } from '../../../core/style/Sizes';
import { getRenderTextFn } from '../../../utils/AppUtils';
import { DAYS_OF_WEEK, DAY_PTS } from '../../../utils/DataConstants';
import {
  getValue,
  getValues,
  getEntityKeyId,
  isFamilyHome,
  isProviderActive
} from '../../../utils/DataUtils';
import { isNonEmptyString } from '../../../utils/LangUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { LABELS } from '../../../utils/constants/Labels';
import { PROVIDERS } from '../../../utils/constants/StateConstants';
import { getBoundsFromPointsOfInterest, getCoordinates } from '../../map/MapUtils';
import { FlexRow, MapWrapper, ResultSegment } from '../../styled';

const PADDING = 25;

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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 8px 0;


  font-family: Inter;
  font-size: 14px;
  line-height: 19px;

  div {
    color: #555E6F;
    max-width: 65%;
  }

  a {
    color: #6124E2;
    text-decoration: underline;
    max-width: 65%;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  div {
    margin-right: 10px;
  }
`;

const DataRows = styled.div`
  display: flex;
  flex-direction: column;

  ${(props) => (props.maxWidth ? css`max-width: ${props.maxWidth} !important;` : '')}

  span {
    text-align: right;
    color: #8E929B;
  }

  a {
    text-align: right;
    min-width: fit-content;
    ${(props) => (props.alignEnd ? css`align-self: flex-end;` : '')}
  }
`;

const DateRow = styled.article`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  span {
    color: #8E929B;
  }

  span:first-child {
    text-align: left;
    margin-right: 10px;
  }

  span:last-child {
    text-align: right;
  }
`;

const Line = styled.div`
  height: 1px;
  background-color: #E6E6EB;
  margin: ${(props) => props.paddingTop || 0}px -${PADDING}px 0 -${PADDING}px;
`;

const InfoText = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 19px;

  color: #8E929B;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #8E929B;
  width: 100%;
  padding: 20px 0;

  span {
    color: #555E6F;
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
  }

  span:last-child {
    font-weight: normal;
  }
`;

class ProviderDetailsContainer extends React.Component {

  renderRR = (rr) => {
    const url = getValue(rr, PROPERTY_TYPES.URL);
    const name = getValue(rr, PROPERTY_TYPES.FACILITY_NAME);
    const phone = getValue(rr, PROPERTY_TYPES.PHONE);

    let first = <div>{name}</div>;
    if (url) {
      first = <a key={name} href={url} target="_blank">{name}</a>;
    }

    let phoneElem = <span>{phone}</span>;
    if (phone) {
      phoneElem = <a href={`tel:${phone}`}>{phone}</a>;
    }

    return (
      <Row key={getEntityKeyId(rr)}>
        {first}
        <DataRows>
          {phoneElem}
        </DataRows>
      </Row>
    );
  };

  renderRRsSection = () => {
    const { rrs, renderText } = this.props;

    return (
      <ExpandableSection title={renderText(LABELS.RESOURCE_AND_REFERRAL)}>
        <>
          <InfoText>{renderText(LABELS.RESOURCE_AND_REFERRAL_DESCRIPTION)}</InfoText>
          {rrs.map(this.renderRR)}
        </>
      </ExpandableSection>
    );
  };

  renderLicenseElement = () => {
    const { renderText, provider } = this.props;

    const licenseNumber = getValue(provider, PROPERTY_TYPES.LICENSE_ID);
    const licenseURL = getValue(provider, PROPERTY_TYPES.LICENSE_URL);

    if (!licenseURL) {
      return <span>{licenseNumber || renderText(LABELS.NOT_LICENSED)}</span>;
    }

    return <a href={licenseURL} target="_blank">{licenseNumber}</a>;
  }

  renderFamilyHomeContactSection = () => {
    const { provider, renderText } = this.props;

    if (!isFamilyHome(provider)) {
      return null;
    }

    return (
      <TitleRow>
        <InfoText>{renderText(LABELS.CONTACT_RR_FOR_INFO)}</InfoText>
      </TitleRow>
    );

  }

  renderCapacitySection = () => {
    const { provider, renderText } = this.props;

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
        <span>{renderText(LABELS.CAPACITY)}</span>
        <span>{`${capacity} ${renderText(capacityLabel)}`}</span>
      </TitleRow>
    );
  }

  renderUnknown = () => {
    const { renderText } = this.props;
    return renderText(LABELS.UNKNOWN);
  }

  renderContactSection = () => {
    const { renderText, provider } = this.props;

    if (isFamilyHome(provider) || !isProviderActive(provider)) {
      return null;
    }

    const phone = getValue(provider, PROPERTY_TYPES.PHONE);
    const street = getValue(provider, PROPERTY_TYPES.ADDRESS);
    const city = getValue(provider, PROPERTY_TYPES.CITY);
    const zip = getValue(provider, PROPERTY_TYPES.ZIP);
    const pointOfContact = getValues(provider, PROPERTY_TYPES.POINT_OF_CONTACT_NAME);

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
      phoneElem = <a href={`tel:${phone}`}>{phone}</a>;
    }

    if (getValue(provider, PROPERTY_TYPES.HOURS_UNKNOWN)) {
      operatingHours.push(<span key="hours-unknown">{unknown}</span>);
    }
    else {
      Object.values(DAYS_OF_WEEK).forEach((day) => {
        const [startPT, endPT] = DAY_PTS[day];
        const start = getValue(provider, startPT);
        const end = getValue(provider, endPT);

        const timeWindowStr = (start || end) ? `${formatTime(start)} - ${formatTime(end)}` : 'Closed';

        if (start || end) {
          operatingHours.push(
            <DateRow key={day}>
              <span>{renderText(LABELS[day])}</span>
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
      <ExpandableSection title={renderText(LABELS.CONTACT)}>
        <>
          <Row>
            <div>{renderText(LABELS.PHONE)}</div>
            <DataRows>
              {phoneElem}
            </DataRows>
          </Row>

          <Row>
            <div>{renderText(LABELS.POINT_OF_CONTACT)}</div>
            <DataRows>
              <span>{pointOfContact || unknown}</span>
            </DataRows>
          </Row>

          <Row>
            <div>{renderText(LABELS.ADDRESS)}</div>
            <DataRows>
              <span>{street}</span>
              <span>{`${city}, CA ${zip}`}</span>
            </DataRows>
          </Row>

          <Row>
            <div>{renderText(LABELS.OPERATING_HOURS)}</div>
            <DataRows>
              {operatingHours}
            </DataRows>
          </Row>
        </>
      </ExpandableSection>
    );
  }


  renderHealthAndSafetySection = () => {
    const { renderText, provider, hospital } = this.props;

    const unknown = this.renderUnknown();

    const InfoIcon = React.forwardRef((props, ref) => (
      <span {...props} ref={ref}>
        <FontAwesomeIcon icon={faInfoCircle} fixedWidth />
      </span>
    ));

    const lastInspectionDateStr = getValue(provider, PROPERTY_TYPES.LAST_INSPECTION_DATE);
    const lastInspectionDate = lastInspectionDateStr ? moment(lastInspectionDateStr).format('MMMM DD, YYYY') : unknown;
    const numComplaints = getValue(provider, PROPERTY_TYPES.NUM_COMPLAINTS) || 0;

    const hospitalName = getValue(hospital, PROPERTY_TYPES.FACILITY_NAME);

    const [fromLat, fromLon] = getCoordinates(provider);
    const [toLat, toLon] = getCoordinates(hospital);

    const hospitalDirections = `https://www.google.com/maps/dir/${fromLon},${fromLat}/${toLon},${toLat}`;

    return (
      <ExpandableSection title={renderText(LABELS.HEALTH_AND_SAFETY)}>
        <>
          <Row>
            <div>{renderText(LABELS.LAST_INSPECTION_DATE)}</div>
            <DataRows>
              {lastInspectionDate}
            </DataRows>
          </Row>
          <Row>
            <Group>
              <div>{renderText(LABELS.COMPLAINTS)}</div>
              <Tooltip
                  arrow
                  placement="top"
                  title={renderText(LABELS.COMPLAINTS_DESCRIPTION)}>
                <InfoIcon />
              </Tooltip>
            </Group>
            <DataRows>
              {numComplaints}
            </DataRows>
          </Row>
          <Row>
            <div>{renderText(LABELS.LICENSE_NUMBER)}</div>
            <DataRows>
              {this.renderLicenseElement()}
            </DataRows>
          </Row>


          <Row>
            <div>{renderText(LABELS.NEAREST_HOSPITAL)}</div>
            <DataRows alignEnd>
              <a href={hospitalDirections} target="_blank">{hospitalName}</a>
            </DataRows>
          </Row>

        </>
      </ExpandableSection>
    );
  }

  render() {

    const { renderText, provider, rrs } = this.props;

    if (!provider) {
      return null;
    }

    const sections = [
      this.renderFamilyHomeContactSection(),
      this.renderCapacitySection(),
      this.renderContactSection(),
      this.renderHealthAndSafetySection(),
      this.renderRRsSection()
    ].filter(s => s).map((s, idx) => (
      <Fragment key={idx}>
        {s}
        <Line />
      </Fragment>
    ))

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
  const providerState = state.getIn([...STAY_AWAY_STORE_PATH], Map());

  const lat = providerState.getIn(['selectedOption', 'lat']);
  const lon = providerState.getIn(['selectedOption', 'lon']);

  const provider = providerState.get(PROVIDERS.SELECTED_PROVIDER);
  const selectedProviderId = getEntityKeyId(provider);
  const rrs = providerState.getIn([PROVIDERS.RRS_BY_ID, selectedProviderId], List())
    .map(e => e.get('neighborDetails', Map()));
  const hospital = providerState.getIn([PROVIDERS.HOSPITALS_BY_ID, selectedProviderId], Map())
    .get('neighborDetails', Map());

  return {
    providerState: state.getIn([...STAY_AWAY_STORE_PATH], Map()),
    provider,
    coordinates: [lat, lon],
    renderText: getRenderTextFn(state),
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
