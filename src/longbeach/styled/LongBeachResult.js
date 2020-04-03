// @flow

import React, { useMemo } from 'react';

import {
  faBirthdayCake,
  faDraftingCompass,
  faMapMarkerAltSlash,
  faUser,
  faVenusMars,
} from '@fortawesome/pro-solid-svg-icons';
import { Map } from 'immutable';
import { Card } from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';

import IconDetail from '../../components/premium/styled/IconDetail';
import Portrait from '../../components/portrait/Portrait';
import { useGoToPath } from '../../components/hooks';
import {
  PROFILE_ID_PATH,
  PROFILE_VIEW_PATH,
} from '../../core/router/Routes';
import {
  OPENLATTICE_ID_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN
} from '../../edm/DataModelFqns';
import { getAddressFromLocation } from '../../utils/AddressUtils';
import { getImageDataFromEntity } from '../../utils/BinaryUtils';
import { getDobFromPerson, getLastFirstMiFromPerson } from '../../utils/PersonUtils';
import { clearLBProfile, selectLBProfile } from '../profile/LongBeachProfileActions';
import {
  FlexRow,
  ResultDetails,
  ResultName,
  ResultSegment,
} from '.';

type Props = {
  person :Map;
  stayAwayLocation :Map;
  profilePicture :Map;
}

const LongBeachResult = ({
  person,
  stayAwayLocation,
  profilePicture,
} :Props) => {
  const personEKID = person.getIn([OPENLATTICE_ID_FQN, 0]);
  const goToProfile = useGoToPath(PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, personEKID));
  const dispatch = useDispatch();
  const imageUrl = useMemo(() => getImageDataFromEntity(profilePicture), [profilePicture]);

  const handleViewProfile = () => {
    dispatch(clearLBProfile());
    dispatch(selectLBProfile({
      person,
      stayAwayLocation,
      profilePicture
    }));
    goToProfile();
  };

  const fullName = getLastFirstMiFromPerson(person, true);
  const dob :string = getDobFromPerson(person, '---');
  const sex = person.getIn([PERSON_SEX_FQN, 0]);
  const race = person.getIn([PERSON_RACE_FQN, 0]);
  const { name, address } = getAddressFromLocation(stayAwayLocation);
  let nameAndAddress = address;
  if (name && address) {
    nameAndAddress = `${name}\n${address}`;
  }
  // TODO: Replace with true radius
  const radius = '100 yd';

  return (
    <Card onClick={handleViewProfile}>
      <ResultSegment padding="sm" vertical>
        <ResultName bold uppercase>{fullName}</ResultName>
        <FlexRow>
          <Portrait imageUrl={imageUrl} height="90" width="72" />
          <ResultDetails>
            <IconDetail content={dob} icon={faBirthdayCake} />
            <IconDetail content={race} icon={faUser} />
            <IconDetail content={sex} icon={faVenusMars} />
            <IconDetail content={nameAndAddress} icon={faMapMarkerAltSlash} />
            <IconDetail content={radius} icon={faDraftingCompass} />
          </ResultDetails>
        </FlexRow>
      </ResultSegment>
    </Card>
  );
};

export default LongBeachResult;
