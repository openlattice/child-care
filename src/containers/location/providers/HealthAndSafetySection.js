// @flow
/* eslint-disable react/jsx-no-target-blank */
import React from 'react';

import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Tooltip, Typography } from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils } from 'lattice-utils';
import { useSelector } from 'react-redux';

import ExpandableSection from './ExpandableSection';

import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { trackLinkClick } from '../../../utils/AnalyticsUtils';
import { LABELS } from '../../../utils/constants/Labels';
import { getCoordinates } from '../../map/MapUtils';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import {
  DataRows,
  FlexContainer,
  MarginWrapper,
  Row,
} from '../../styled';

const { LOCATIONS } = STATE;

const { getEntityKeyId, getPropertyValue } = DataUtils;
const { formatAsDate } = DateTimeUtils;

const InfoIcon = React.forwardRef((props, ref) => (
  // https://material-ui.com/components/tooltips/#custom-child-element
  /* eslint-disable-next-line */
  <span {...props} ref={ref}>
    <FontAwesomeIcon icon={faInfoCircle} size="sm" />
  </span>
));

const HealthAndSafetySection = () => {
  const getText = useSelector(getTextFnFromState);
  const provider = useSelector((store) => store.getIn([LOCATIONS, PROVIDERS.SELECTED_PROVIDER]));
  const selectedProviderId = getEntityKeyId(provider);
  const hospital = useSelector((store) => store.getIn([LOCATIONS, PROVIDERS.HOSPITALS_BY_ID, selectedProviderId], Map())
    .get('neighborDetails', Map()));
  const unknown = getText(LABELS.UNKNOWN);

  const lastInspectionDateStr = getPropertyValue(provider, [PROPERTY_TYPES.LAST_INSPECTION_DATE, 0]);
  const complaints = getPropertyValue(provider, [PROPERTY_TYPES.COMPLAINTS, 0]);
  const lastInspectionDate = formatAsDate(lastInspectionDateStr, unknown);

  const hospitalName = getPropertyValue(hospital, [PROPERTY_TYPES.FACILITY_NAME, 0]);

  const [fromLat, fromLon] = getCoordinates(provider);
  const [toLat, toLon] = getCoordinates(hospital);

  const hospitalDirections = `https://www.google.com/maps/dir/${fromLon},${fromLat}/${toLon},${toLat}`;
  const licenseNumber = getPropertyValue(provider, [PROPERTY_TYPES.LICENSE_ID, 0]);
  const licenseURL = getPropertyValue(provider, [PROPERTY_TYPES.LICENSE_URL, 0]);

  const trackProviderClick = () => trackLinkClick(licenseURL, 'Provider License');
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
            {
              !licenseURL
                ? <span>{licenseNumber || getText(LABELS.NOT_LICENSED)}</span>
                : <a aria-label="link to license" onClick={trackProviderClick} href={licenseURL} target="_blank">{licenseNumber}</a>
            }
          </DataRows>
        </Row>
        <Row>
          <div>{getText(LABELS.NEAREST_HOSPITAL)}</div>
          <DataRows alignEnd>
            <a aria-label="link to hospital directions" onClick={trackHospitalClicked} href={hospitalDirections} target="_blank">{hospitalName}</a>
          </DataRows>
        </Row>

      </>
    </ExpandableSection>
  );
};

export default HealthAndSafetySection;
