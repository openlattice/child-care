// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { CardSegment, MinusButton } from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';

import { removePersonFromEncampment } from './EncampmentActions';

import DefaultLink from '../../../components/links/DefaultLink';
import { PROFILE_ID_PATH, PROFILE_VIEW_PATH } from '../../../core/router/Routes';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { getFirstLastFromPerson } from '../../../utils/PersonUtils';

const StyledSegment = styled(CardSegment)`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 auto;
`;

type Props = {
  person :Map;
  livesAtEKID :UUID;
}

const OccupantItem = (props :Props) => {
  const { person, livesAtEKID } = props;
  const dispatch = useDispatch();

  const personEKID = getEntityKeyId(person);
  const name = getFirstLastFromPerson(person);

  const deleteEdge = () => dispatch(removePersonFromEncampment(livesAtEKID));

  return (
    <StyledSegment
        padding="10px">
      <DefaultLink to={PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, personEKID)}>{name}</DefaultLink>
      <MinusButton size="sm" mode="negative" onClick={deleteEdge} />
    </StyledSegment>
  );
};

export default OccupantItem;
