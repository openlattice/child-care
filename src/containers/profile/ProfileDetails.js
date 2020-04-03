// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { Map } from 'immutable';
import {
  CardSegment,
  DataGrid,
  Spinner
} from 'lattice-ui-kit';
import {
  labelMapAttributes,
  labelMapDobAlias,
  labelMapNames,
} from './constants';
import { PERSON_DOB_FQN } from '../../edm/DataModelFqns';

const Centered = styled(CardSegment)`
  align-items: center;
  display: flex;
  height: 382px;
  justify-content: center;
`;

type Props = {
  isLoading :boolean;
  physicalAppearance :Map;
  selectedPerson :Map;
};

class ProfileDetails extends Component<Props> {

  renderLoading = () => (
    <Centered>
      <Spinner size="2x" />
    </Centered>
  )

  formatResult = () => {
    const { physicalAppearance, selectedPerson } = this.props;
    const rawDob :string = selectedPerson.getIn([PERSON_DOB_FQN, 0]);
    let formattedPerson = selectedPerson;
    if (rawDob) {
      const formattedDob = DateTime.fromISO(rawDob).toLocaleString(DateTime.DATE_SHORT);

      // setIn behavior does not call .toString() like getIn does
      formattedPerson = selectedPerson.setIn([PERSON_DOB_FQN.toString(), 0], formattedDob);
    }

    return formattedPerson.merge(physicalAppearance);
  }

  renderDetails = () => {
    const formattedPerson = this.formatResult();

    return (
      <>
        <CardSegment padding="md">
          <DataGrid
              columns={3}
              data={formattedPerson}
              labelMap={labelMapNames} />
        </CardSegment>
        <CardSegment padding="md">
          <DataGrid
              columns={3}
              data={formattedPerson}
              labelMap={labelMapDobAlias} />
        </CardSegment>
        <CardSegment padding="md">
          <DataGrid
              columns={3}
              data={formattedPerson}
              labelMap={labelMapAttributes} />
        </CardSegment>
      </>
    );
  }

  render() {
    const { isLoading } = this.props;
    return (
      <>
        { isLoading
          ? this.renderLoading()
          : this.renderDetails()}
      </>
    );
  }
}

export default ProfileDetails;
