// @flow

import React from 'react';

import styled from 'styled-components';
import { faSearchLocation } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get, Map } from 'immutable';
import { Button, Typography } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';

import { getTextFnFromState } from '../../../utils/AppUtils';
import { getDistanceBetweenCoords } from '../../../utils/DataUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { NO_RESULTS } from '../../../utils/constants/labels';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { getCoordinates } from '../../map/MapUtils';
import { Centered, Row } from '../../styled';
import { selectReferralAgency } from '../LocationsActions';

const Instructions = styled(Typography)`
  padding: 15px;
  text-align: center;
`;

const { LOCATIONS } = STATE;
const {
  LAT,
  LON,
  REFERRAL_AGENCY_LOCATIONS,
  SELECTED_OPTION,
  ZIP_SEARCHED
} = PROVIDERS;

const { getEntityKeyId, getPropertyValue } = DataUtils;

const NoResults = () => {
  const dispatch = useDispatch();
  const getText = useSelector(getTextFnFromState);
  const nearbyReferralAgencies = useSelector((store) => store.getIn([LOCATIONS, REFERRAL_AGENCY_LOCATIONS], Map()));
  const zipCodeWasSearched :?boolean = useSelector((store) => store.getIn([LOCATIONS, ZIP_SEARCHED], false));
  const selectedOption = useSelector((store) => store.getIn([LOCATIONS, SELECTED_OPTION]));
  const instructionTextObject = zipCodeWasSearched
    ? NO_RESULTS.DETAILS_WITH_ZIP
    : NO_RESULTS.DETAILS_WITHOUT_ZIP;

  const renderRR = (rr :Map) => {
    const name = getPropertyValue(rr, [PROPERTY_TYPES.FACILITY_NAME, 0]);
    const handleViewProfile = () => {
      dispatch(selectReferralAgency(rr));
    };

    const lat = get(selectedOption, LAT);
    const lon = get(selectedOption, LON);
    const rrsCoordinates = getCoordinates(rr);
    const miles = getDistanceBetweenCoords([rrsCoordinates[1], rrsCoordinates[0]], [lat, lon]);

    return (
      <Row key={getEntityKeyId(rr)}>
        <Button color="primary" onClick={handleViewProfile} size="small" variant="text">{name}</Button>
        <Typography color="textSecondary" variant="body1">{`(${Math.round(miles)}mi)`}</Typography>
      </Row>
    );
  };

  return (
    <Centered>
      <FontAwesomeIcon size="3x" icon={faSearchLocation} />
      <Instructions color="textSecondary" variant="subtitle1">
        {getText(instructionTextObject)}
      </Instructions>
      {nearbyReferralAgencies.valueSeq().map(renderRR)}
    </Centered>
  );
};

export default NoResults;
