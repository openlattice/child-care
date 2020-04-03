// @flow
import React, { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';
import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import { Select } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import OccupantList from './OccupantList';
import {
  addPersonToEncampment,
  getEncampmentOccupants,
  getEncampmentPeopleOptions,
  resetEncampmentOccupants
} from './EncampmentActions';
import { ENCAMPMENT_STORE_PATH } from './constants';

import { useTimeout } from '../../../components/hooks';

const OccupantsWrapper = styled.div`
  display: grid;
  grid-gap: 10px;
  width: 100vw;
  max-width: 100%;
  padding-bottom: 30px;
`;

type Props = {
  encampmentEKID :UUID;
};

const EncampmentOccupants = ({ encampmentEKID } :Props) => {

  const [name, setName] = useState('');
  const options = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'options', 'people', 'data']));
  const fetchState = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'options', 'people', 'fetchState']));
  const dispatch = useDispatch();
  const isLoading = fetchState === RequestStates.PENDING;

  useEffect(() => {
    dispatch(getEncampmentOccupants(encampmentEKID));

    return () => dispatch(resetEncampmentOccupants());
  }, [dispatch, encampmentEKID]);

  const handleSelectPerson = (selectedPerson) => {
    const { person } = selectedPerson;
    dispatch(addPersonToEncampment({
      person,
      encampment: encampmentEKID
    }));
  };

  const fetchPeopleOptions = useCallback(() => {
    if (name.trim().length) {
      dispatch(getEncampmentPeopleOptions(name));
    }
  }, [dispatch, name]);

  useTimeout(fetchPeopleOptions, 300);

  return (
    <OccupantsWrapper>
      <Select
          icon={faSearch}
          isLoading={isLoading}
          onChange={handleSelectPerson}
          onInputChange={setName}
          options={options.toJS()}
          placeholder="Add people" />
      <OccupantList />
    </OccupantsWrapper>
  );
};

export default EncampmentOccupants;
