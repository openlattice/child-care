// @flow

import React from 'react';

import { faHome } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment,
} from 'lattice-ui-kit';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import Address from './Address';

import EditLinkButton from '../../buttons/EditLinkButton';
import NewIssueButton from '../../buttons/CreateIssueButton';
import * as FQN from '../../../edm/DataModelFqns';
import { CATEGORIES } from '../../../containers/issues/issue/constants';
import { BASIC_PATH, EDIT_PATH } from '../../../core/router/Routes';
import { formatCityStateZip } from '../../../utils/AddressUtils';
import { H1, HeaderActions, IconWrapper } from '../../layout';
import { CardSkeleton } from '../../skeletons';

const { BASIC_INFORMATION } = CATEGORIES;

type Props = {
  address :Map;
  isLoading :boolean;
  match :Match;
  showEdit :boolean;
};

const AddressCard = (props :Props) => {

  const {
    address,
    isLoading,
    match,
    showEdit
  } = props;

  if (isLoading) {
    return <CardSkeleton />;
  }

  const name = address.getIn([FQN.LOCATION_NAME_FQN, 0]);
  const street = address.getIn([FQN.LOCATION_STREET_FQN, 0]);
  const line2 = address.getIn([FQN.LOCATION_ADDRESS_LINE_2_FQN, 0]);
  const city = address.getIn([FQN.LOCATION_CITY_FQN, 0]);
  const state = address.getIn([FQN.LOCATION_STATE_FQN, 0]);
  const zip = address.getIn([FQN.LOCATION_ZIP_FQN, 0]);
  const cityStateZip = formatCityStateZip(city, state, zip);

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faHome} />
          </IconWrapper>
          Address
          <HeaderActions>
            { showEdit && <EditLinkButton mode="primary" to={`${match.url}${EDIT_PATH}${BASIC_PATH}`} /> }
            <NewIssueButton defaultComponent={BASIC_INFORMATION} mode="primary" />
          </HeaderActions>
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        <Address
            cityStateZip={cityStateZip}
            isLoading={isLoading}
            line2={line2}
            name={name}
            street={street} />
      </CardSegment>
    </Card>
  );

};

export default withRouter(AddressCard);
