// @flow
import React from 'react';

import styled from 'styled-components';
import {
  faBedEmpty,
  faClock,
  faMapMarkerAlt,
  faPhoneAlt
} from '@fortawesome/pro-solid-svg-icons';
import {
  Card,
  CardSegment,
  StyleUtils
} from 'lattice-ui-kit';

import IconDetail from '../../components/premium/styled/IconDetail';
import * as FQN from '../../edm/DataModelFqns';
import { addressSkeleton } from '../../components/skeletons';

const { media } = StyleUtils;

const ProviderDescription = styled.div`
  margin-bottom: 5px;
`;
const AddressSkeleton = styled.div`
  ${addressSkeleton};
`;

const ProviderContent = styled.div`
  ${media.phone`
    font-size: 12px;
  `}
`;

type Props = {
  provider :Map;
}

const LongBeachProviderCard = ({ provider } :Props) => {
  const isLoading = provider.isEmpty();
  // const isLoading = false;
  const name = provider.getIn([FQN.NAME_FQN, 0], '---');
  const description = provider.getIn([FQN.DESCRIPTION_FQN, 0], '---');
  const address = provider.getIn([FQN.LOCATION_ADDRESS_FQN, 0], '---');
  const phoneNumber = provider.getIn([FQN.CONTACT_PHONE_NUMBER_FQN, 0], '---');
  const operatingHours = provider.getIn([FQN.HOURS_OF_OPERATION_FQN, 0], '---');
  const availableSpaces = provider.getIn([FQN.NUMBER_OF_SPACES_AVAILABLE_FQN, 0], 0);
  const totalSpaces = provider.getIn([FQN.NUMBER_OF_SPACES_TOTAL_FQN, 0], 0);
  const capacity = `${availableSpaces} Available / ${totalSpaces} Total`;

  const telTag = <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>;

  return (
    <Card>
      <CardSegment padding="sm" vertical>
        <IconDetail content={name} isLoading={isLoading} />
      </CardSegment>
      <CardSegment padding="sm" vertical>
        {
          isLoading
            ? <AddressSkeleton />
            : (
              <ProviderContent>
                <ProviderDescription>{description}</ProviderDescription>
                <IconDetail content={address} icon={faMapMarkerAlt} />
                <IconDetail content={telTag} icon={faPhoneAlt} />
                <IconDetail content={capacity} icon={faBedEmpty} />
                <IconDetail content={operatingHours} icon={faClock} />
              </ProviderContent>
            )
        }
      </CardSegment>
    </Card>
  );
};

export default LongBeachProviderCard;
