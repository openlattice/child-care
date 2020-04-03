// @flow
import React, { useEffect, useMemo } from 'react';

import styled from 'styled-components';
import {
  Card,
  CardStack,
  Label,
  Tag,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { RequestStates } from 'redux-reqseq';

import { getLBProfile } from './LongBeachProfileActions';

import IconDetail from '../../components/premium/styled/IconDetail';
import Portrait from '../../components/portrait/Portrait';
import ProfileBanner from '../../containers/profile/ProfileBanner';
import * as FQN from '../../edm/DataModelFqns';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { PROFILE_ID_PARAM } from '../../core/router/Routes';
import { getAddressFromLocation } from '../../utils/AddressUtils';
import { getImageDataFromEntity } from '../../utils/BinaryUtils';
import { getDateShortFromIsoDate, isNowValid } from '../../utils/DateUtils';
import { getDobFromPerson } from '../../utils/PersonUtils';
import {
  FlexColumn,
  FlexRow,
  ResultSegment
} from '../styled';

const Grid = styled.div`
  display: grid;
  grid-gap: 10px;
`;

const StyledFlexColumn = styled(FlexColumn)`
  width: 100%;
  margin-left: 10px;
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const LongBeachProfileContainer = () => {
  const isLoading = useSelector((store) => store
    .getIn(['longBeach', 'profile', 'fetchState']) === RequestStates.PENDING);
  const probation = useSelector((store) => store.getIn(['longBeach', 'profile', 'probation']));
  const profilePicture = useSelector((store) => store.getIn(['longBeach', 'profile', 'profilePicture']));
  const selectedPerson = useSelector((store) => store.getIn(['longBeach', 'profile', 'person']));
  const stayAwayLocation = useSelector((store) => store.getIn(['longBeach', 'profile', 'stayAwayLocation']));
  const warrant = useSelector((store) => store.getIn(['longBeach', 'profile', 'warrant']));
  const imageURL = useMemo(() => getImageDataFromEntity(profilePicture), [profilePicture]);
  const dispatch = useDispatch();

  const match = useRouteMatch();
  const { [PROFILE_ID_PARAM]: profileId } = match.params;
  useEffect(() => {
    dispatch(getLBProfile(profileId));
  }, [dispatch, profileId]);

  const dob :string = getDobFromPerson(selectedPerson);
  const race = selectedPerson.getIn([FQN.PERSON_RACE_FQN, 0], '');
  const sex = selectedPerson.getIn([FQN.PERSON_SEX_FQN, 0], '');

  const { name, address } = getAddressFromLocation(stayAwayLocation);

  const startDT = probation.getIn([FQN.RECOGNIZED_START_DATE_FQN, 0]);
  const endDT = probation.getIn([FQN.RECOGNIZED_END_DATE_FQN, 0]);
  const probationStart :string = getDateShortFromIsoDate(startDT);
  const probationEnd :string = getDateShortFromIsoDate(endDT);
  const isActive = isNowValid(startDT, endDT);
  const probationStatus = isActive ? 'Active' : 'Inactive';
  const warrantNumber = warrant.getIn([FQN.WARRANT_NUMBER_FQN, 0]);
  const probationTag = <Tag mode={isActive ? 'danger' : 'default'}>{probationStatus}</Tag>;

  return (
    <ContentOuterWrapper>
      <ProfileBanner selectedPerson={selectedPerson} noDob />
      <ContentWrapper>
        <CardStack>
          <Card>
            <ResultSegment padding="sm">
              <FlexRow>
                <FlexColumn>
                  <Center>
                    <Portrait imageUrl={imageURL} height="128" width="96" />
                    {/* <PlusButton mode="primary">Photo</PlusButton> */}
                  </Center>
                </FlexColumn>
                <StyledFlexColumn>
                  <Grid>
                    <div>
                      <Label subtle>
                        DOB
                      </Label>
                      <IconDetail content={dob} isLoading={isLoading} />
                    </div>
                    <div>
                      <Label subtle>
                        Race
                      </Label>
                      <IconDetail content={race} isLoading={isLoading} />
                    </div>
                    <div>
                      <Label subtle>
                        Sex
                      </Label>
                      <IconDetail content={sex} isLoading={isLoading} />
                    </div>
                  </Grid>
                </StyledFlexColumn>
              </FlexRow>
            </ResultSegment>
          </Card>
          <div>
            <strong>Stay Away Order</strong>
            <Card>
              <ResultSegment padding="sm" vertical>
                <Grid>
                  <div>
                    <Label subtle>
                      Location Name
                    </Label>
                    <IconDetail content={name} isLoading={isLoading} />
                  </div>
                  <div>
                    <Label subtle>
                      Location
                    </Label>
                    <IconDetail content={address} isLoading={isLoading} />
                  </div>
                </Grid>
              </ResultSegment>
            </Card>
          </div>
          <div>
            <strong>Probation</strong>
            <Card>
              <ResultSegment padding="sm">
                <Grid>
                  <div>
                    <Label subtle>
                      Status
                    </Label>
                    <IconDetail content={probationTag} isLoading={isLoading} />
                  </div>
                  <div>
                    <Label subtle>
                      Period
                    </Label>
                    <IconDetail content={`${probationStart} - ${probationEnd}`} isLoading={isLoading} />
                  </div>
                </Grid>
              </ResultSegment>
            </Card>
          </div>
          <div>
            <strong>Warrant</strong>
            <Card>
              <ResultSegment padding="sm">
                <Grid>
                  <div>
                    <Label subtle>
                      Warrant #
                    </Label>
                    <IconDetail content={warrantNumber} isLoading={isLoading} />
                  </div>
                </Grid>
              </ResultSegment>
            </Card>
          </div>
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default LongBeachProfileContainer;
