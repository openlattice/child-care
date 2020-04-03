// @flow
import React from 'react';

import styled from 'styled-components';
import { faHistory, faTimes, faUsers } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Button, Hooks, IconButton } from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { Popup } from 'react-mapbox-gl';
import { useSelector } from 'react-redux';

import EncampmentOccupantsModal from './EncampmentOccupantsModal';
import { ENCAMPMENT_STORE_PATH } from './constants';

import IconDetail from '../../../components/premium/styled/IconDetail';
import {
  DESCRIPTION_FQN,
  ENTRY_UPDATED_FQN,
  NUMBER_OF_PEOPLE_FQN,
  OPENLATTICE_ID_FQN,
} from '../../../edm/DataModelFqns';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { getCoordinates } from '../../map/MapUtils';

const { useBoolean } = Hooks;

const ActionBar = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled(IconButton)`
  color: inherit;
  padding: 2px;
`;

const CloseIcon = <FontAwesomeIcon icon={faTimes} fixedWidth />;

type Props = {
  isOpen :boolean;
  selectedFeature :Map;
  onClose :() => void;
};

const EncampmentPopup = ({
  isOpen,
  onClose,
  selectedFeature
} :Props) => {

  const locationEKID = selectedFeature.getIn([OPENLATTICE_ID_FQN, 0]);
  const encampment = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'encampments', locationEKID])) || Map();
  const occupants = encampment.getIn([NUMBER_OF_PEOPLE_FQN, 0]);
  const description = encampment.getIn([DESCRIPTION_FQN, 0]);
  const rawUpdated = encampment.getIn([ENTRY_UPDATED_FQN, 0]);
  const lastUpdated = DateTime.fromISO(rawUpdated).toLocaleString(DateTime.DATETIME_SHORT);
  const [isVisible, setOpen, setClose] = useBoolean(false);

  const encampmentEKID = getEntityKeyId(encampment);

  if (!isOpen) return null;

  const coordinates = getCoordinates(selectedFeature);

  return (
    <Popup coordinates={coordinates}>
      <ActionBar>
        <strong>Encampment</strong>
        <CloseButton size="sm" mode="subtle" icon={CloseIcon} onClick={onClose} />
      </ActionBar>
      <IconDetail content={occupants} icon={faUsers} />
      <IconDetail content={lastUpdated} icon={faHistory} />
      <IconDetail content={description} />
      <Button size="sm" mode="subtle" onClick={setOpen}>View Occupants</Button>
      <EncampmentOccupantsModal
          viewportScrolling
          encampmentEKID={encampmentEKID}
          shouldCloseOnOutsideClick={false}
          textTitle="Occupants"
          isVisible={isVisible}
          onClose={setClose}>
        something
      </EncampmentOccupantsModal>
    </Popup>
  );
};

export default EncampmentPopup;
