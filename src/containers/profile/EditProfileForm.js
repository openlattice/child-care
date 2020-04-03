// @flow
import React, { Component } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Constants } from 'lattice';
import {
  Button,
  CardSegment,
  DatePicker,
  Input,
  Label,
  Select
} from 'lattice-ui-kit';

import {
  eyeOptions,
  hairOptions,
  raceOptions,
  sexOptions,
} from './constants';

import * as FQN from '../../edm/DataModelFqns';

const { OPENLATTICE_ID_FQN } = Constants;

const FormGrid = styled.div`
  display: grid;
  grid-gap: 10px 30px;
  grid-template-columns: repeat(3, 1fr);
  flex: 1;
`;

const ActionRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

type Props = {
  isLoading :boolean;
  onDiscard :() => void;
  onSubmit :(payload :Object) => any;
  physicalAppearance :Map;
  selectedPerson :Map;
}

type State = {
  editedData :Map;
}

class EditProfileForm extends Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      editedData: this.initializeFormData()
    };
  }

  initializeFormData = () => {
    const { selectedPerson, physicalAppearance } = this.props;
    const aliases = selectedPerson.getIn([FQN.PERSON_NICK_NAME_FQN, 0], '');
    const dob = selectedPerson.getIn([FQN.PERSON_DOB_FQN, 0], '');
    const firstName = selectedPerson.getIn([FQN.PERSON_FIRST_NAME_FQN, 0], '');
    const lastName = selectedPerson.getIn([FQN.PERSON_LAST_NAME_FQN, 0], '');
    const middleName = selectedPerson.getIn([FQN.PERSON_MIDDLE_NAME_FQN, 0], '');
    const race = selectedPerson.getIn([FQN.PERSON_RACE_FQN, 0], '');
    const sex = selectedPerson.getIn([FQN.PERSON_SEX_FQN, 0], '');

    const eyeColor = physicalAppearance.getIn([FQN.EYE_COLOR_FQN, 0], '');
    const hairColor = physicalAppearance.getIn([FQN.HAIR_COLOR_FQN, 0], '');
    const height = physicalAppearance.getIn([FQN.HEIGHT_FQN, 0], '');
    const weight = physicalAppearance.getIn([FQN.WEIGHT_FQN, 0], '');

    return Map({
      aliases,
      dob,
      eyeColor,
      firstName,
      hairColor,
      height,
      lastName,
      middleName,
      race,
      sex,
      weight,
    });
  }

  handleInputChange = (e :SyntheticEvent<HTMLInputElement>) => {
    const { editedData } = this.state;
    const { name, value } = e.currentTarget;
    this.setState({ editedData: editedData.set(name, value) });
  }

  handleSelectChange = (value :string, e :Object) => {
    const { editedData } = this.state;
    const { name } = e;
    this.setState({ editedData: editedData.set(name, value) });
  }

  handleDateChange = (value :string) => {
    const { editedData } = this.state;
    this.setState({ editedData: editedData.set('dob', value) });
  }

  handleSubmit = () => {
    const { onSubmit, physicalAppearance, selectedPerson } = this.props;
    const { editedData } = this.state;
    onSubmit({
      appearanceEKID: physicalAppearance.getIn([OPENLATTICE_ID_FQN, 0]),
      data: editedData,
      personEKID: selectedPerson.getIn([OPENLATTICE_ID_FQN, 0]),
    });
  }

  render() {
    const { onDiscard, isLoading } = this.props;
    const { editedData } = this.state;
    return (
      <>
        <CardSegment padding="md" vertical>
          <FormGrid>
            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                  id="last-name"
                  name="lastName"
                  value={editedData.get('lastName')}
                  onChange={this.handleInputChange}
                  type="text" />
            </div>
            <div>
              <Label htmlFor="middle-name">Middle Name</Label>
              <Input
                  type="text"
                  name="middleName"
                  value={editedData.get('middleName')}
                  id="middle-name"
                  onChange={this.handleInputChange} />
            </div>
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input
                  type="text"
                  name="firstName"
                  value={editedData.get('firstName')}
                  id="first-name"
                  onChange={this.handleInputChange} />
            </div>
          </FormGrid>
        </CardSegment>
        <CardSegment padding="md" vertical>
          <FormGrid>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <DatePicker
                  id="dob"
                  name="dob"
                  value={editedData.get('dob')}
                  onChange={this.handleDateChange} />
            </div>
            <div>
              <Label htmlFor="aliases">Aliases</Label>
              <Input
                  id="aliases"
                  name="aliases"
                  onChange={this.handleInputChange}
                  type="text"
                  value={editedData.get('aliases')} />
            </div>
          </FormGrid>
        </CardSegment>
        <CardSegment padding="md" vertical>
          <FormGrid>
            <div>
              <Label htmlFor="race">Race</Label>
              <Select
                  inputId="race"
                  name="race"
                  onChange={this.handleSelectChange}
                  options={raceOptions}
                  useRawValues
                  value={editedData.get('race')} />
            </div>
            <div>
              <Label htmlFor="sex">Sex</Label>
              <Select
                  inputId="sex"
                  name="sex"
                  onChange={this.handleSelectChange}
                  options={sexOptions}
                  useRawValues
                  value={editedData.get('sex')} />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                  id="height"
                  name="height"
                  onChange={this.handleInputChange}
                  type="number"
                  value={editedData.get('height')} />
            </div>
            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input
                  id="weight"
                  name="weight"
                  onChange={this.handleInputChange}
                  type="number"
                  value={editedData.get('weight')} />
            </div>
            <div>
              <Label htmlFor="hair-color">Hair Color</Label>
              <Select
                  inputId="hair-color"
                  name="hairColor"
                  onChange={this.handleSelectChange}
                  options={hairOptions}
                  useRawValues
                  value={editedData.get('hairColor')} />
            </div>
            <div>
              <Label htmlFor="eye-color">Eye Color</Label>
              <Select
                  inputId="eye-color"
                  name="eyeColor"
                  onChange={this.handleSelectChange}
                  options={eyeOptions}
                  useRawValues
                  value={editedData.get('eyeColor')} />
            </div>
          </FormGrid>
          <ActionRow>
            <Button onClick={onDiscard}>Discard</Button>
            <Button mode="primary" onClick={this.handleSubmit} isLoading={isLoading}>Submit</Button>
          </ActionRow>
        </CardSegment>
      </>
    );
  }
}

export default EditProfileForm;
