// @flow
/* eslint-disable react/jsx-no-target-blank */
import React from 'react';

import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Tooltip } from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils } from 'lattice-utils';
import { useSelector } from 'react-redux';

import ExpandableSection from './ExpandableSection';

import { Body3, TextLink } from '../../../components/layout';
import { trackLinkClick } from '../../../utils/AnalyticsUtils';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { LABELS } from '../../../utils/constants/labels';
import { getCoordinates } from '../../map/MapUtils';
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
  <Body3 {...props} ref={ref}>
    <FontAwesomeIcon icon={faInfoCircle} size="sm" />
  </Body3>
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
          <Body3>{getText(LABELS.LAST_INSPECTION_DATE)}</Body3>
          <DataRows>
            <Body3>{lastInspectionDate}</Body3>
          </DataRows>
        </Row>
        <Row>
          <FlexContainer>
            <Body3>{getText(LABELS.CITATIONS)}</Body3>
            <MarginWrapper>
              <Tooltip arrow placement="top" title={getText(LABELS.CITATIONS_INFO)}>
                <InfoIcon />
              </Tooltip>
            </MarginWrapper>
          </FlexContainer>
          <DataRows>
            <Body3>{complaints}</Body3>
          </DataRows>
        </Row>
        <Row>
          <Body3>{getText(LABELS.LICENSE_NUMBER)}</Body3>
          <DataRows>
            {
              !licenseURL
                ? <Body3>{licenseNumber || getText(LABELS.NOT_LICENSED)}</Body3>
                : (
                  <TextLink
                      aria-label="link to license"
                      onClick={trackProviderClick}
                      href={licenseURL}>
                    {licenseNumber}
                  </TextLink>
                )
            }
          </DataRows>
        </Row>
        <Row>
          <Body3>{getText(LABELS.NEAREST_HOSPITAL)}</Body3>
          <DataRows alignEnd>
            <TextLink
                aria-label="link to hospital directions"
                onClick={trackHospitalClicked}
                href={hospitalDirections}>
              {hospitalName}
            </TextLink>
          </DataRows>
        </Row>

      </>
    </ExpandableSection>
  );
};

export default HealthAndSafetySection;
