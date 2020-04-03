/*
 * @flow
 */

import React, { Component } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Label,
  Radio,
} from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';

import {
  clearSubjectInformation,
  setInputValue,
  setInputValues
} from './Actions';
import { getInvalidFields } from './Reducer';

import {
  FormSection,
  FormSectionWithValidation,
  FormWrapper,
  Header,
  RequiredField
} from '../../../components/crisis/FormComponents';
import { showInvalidFields } from '../../../utils/NavigationUtils';
import { SUBJECT_INFORMATION } from '../../../utils/constants/CrisisReportConstants';
import { STATE } from '../../../utils/constants/StateConstants';
import { ETHNICITY_VALUES, RACE_VALUES, SEX_VALUES } from '../../profile/constants';

type Props = {
  actions :{
    clearSubjectInformation :() => { type :string },
    setInputValue :(value :{ field :string, value :Object }) => void,
    setInputValues :(values :{}) => void,
  },
  className :string;
  disabled :boolean;
  values :Map,
}

const HeaderWithClearButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  h1 {
    margin: 0;
  }
`;

class SubjectInformation extends Component<Props> {

  renderInput = (field, disabledIfSelected, width) => {
    const { values, actions } = this.props;

    const onChange = ({ target }) => {
      const { value } = target;
      if (field !== SUBJECT_INFORMATION.SSN_LAST_4 || value.length <= 4) {
        actions.setInputValue({ field, value });
      }
    };

    const type = (
      field === SUBJECT_INFORMATION.SSN_LAST_4
      && !values.get(SUBJECT_INFORMATION.IS_NEW_PERSON)
    )
      ? 'password'
      : 'text';

    return (
      <Input
          type={type}
          padBottom
          name={field}
          disabled={!values.get(SUBJECT_INFORMATION.IS_NEW_PERSON)}
          value={values.get(field)}
          onChange={onChange}
          width={width && `${width}px`} />
    );
  };

  renderRadioButtons = (field, valueList) => {
    const { values, actions } = this.props;
    const currValue = values.get(field);

    const onChange = ({ target }) => {
      actions.setInputValue({
        field,
        value: target.value
      });
    };

    return valueList.map((value) => (
      <Radio
          key={`${field}-${value}`}
          disabled={!values.get(SUBJECT_INFORMATION.IS_NEW_PERSON)}
          label={value}
          value={value}
          checked={currValue === value}
          onChange={onChange} />
    ));
  };

  render() {
    const {
      actions,
      className,
      disabled,
      values
    } = this.props;

    const isCreatingNewPerson = values.get(SUBJECT_INFORMATION.IS_NEW_PERSON);
    const invalidFields = showInvalidFields(window.location) ? getInvalidFields(values) : [];

    const toggleDOBUnknown = (event) => {
      const { checked } = event.target;
      if (checked) {
        actions.setInputValues({
          [SUBJECT_INFORMATION.DOB_UNKNOWN]: true,
          [SUBJECT_INFORMATION.DOB]: ''
        });
      }
      else {
        actions.setInputValues({
          [SUBJECT_INFORMATION.DOB_UNKNOWN]: false,
          [SUBJECT_INFORMATION.AGE]: ''
        });
      }
    };

    const PersonFormSection = isCreatingNewPerson ? FormSectionWithValidation : FormSection;
    return (
      <FormWrapper className={className}>
        <PersonFormSection>
          <Header>
            <HeaderWithClearButton>
              <h1>Person Information</h1>
              {
                (!disabled && isCreatingNewPerson)
                && <Button mode="subtle" onClick={actions.clearSubjectInformation}>Clear Fields</Button>
              }
            </HeaderWithClearButton>
          </Header>
        </PersonFormSection>
        <PersonFormSection>
          <Label bold>Last</Label>
          {this.renderInput(SUBJECT_INFORMATION.LAST, true)}
        </PersonFormSection>
        <PersonFormSection>
          <Label bold>First</Label>
          {this.renderInput(SUBJECT_INFORMATION.FIRST, true)}
        </PersonFormSection>
        <PersonFormSection>
          <Label bold>Mid.</Label>
          {this.renderInput(SUBJECT_INFORMATION.MIDDLE, true, 80)}
        </PersonFormSection>
        <PersonFormSection>
          <Label bold>AKA / Alias</Label>
          {this.renderInput(SUBJECT_INFORMATION.AKA, true)}
        </PersonFormSection>
        <Checkbox
            name="dobCheckbox"
            checked={values.get(SUBJECT_INFORMATION.DOB_UNKNOWN)}
            label="DOB Unknown"
            disabled={!isCreatingNewPerson}
            onChange={toggleDOBUnknown} />
        {
          values.get(SUBJECT_INFORMATION.DOB_UNKNOWN) ? (
            <PersonFormSection invalid={invalidFields.includes(SUBJECT_INFORMATION.AGE)}>
              <RequiredField>
                <Label bold>Age (approximate)</Label>
              </RequiredField>
              {this.renderInput(SUBJECT_INFORMATION.AGE, false, 70)}
            </PersonFormSection>
          ) : (
            <PersonFormSection invalid={invalidFields.includes(SUBJECT_INFORMATION.DOB)}>
              <div>
                <RequiredField>
                  <Label bold>DOB</Label>
                </RequiredField>
                <DatePicker
                    value={values.get(SUBJECT_INFORMATION.DOB)}
                    disabled={!isCreatingNewPerson || disabled}
                    onChange={(value) => actions.setInputValue({ field: SUBJECT_INFORMATION.DOB, value })} />
              </div>

            </PersonFormSection>
          )
        }
        <PersonFormSection>
          <Label bold>SSN (last 4 digits)</Label>
          {this.renderInput(SUBJECT_INFORMATION.SSN_LAST_4, true, 85)}
        </PersonFormSection>
        <PersonFormSection invalid={invalidFields.includes(SUBJECT_INFORMATION.GENDER)}>
          <RequiredField>
            <Label bold>Sex</Label>
          </RequiredField>
          {this.renderRadioButtons(SUBJECT_INFORMATION.GENDER, SEX_VALUES)}
        </PersonFormSection>
        <PersonFormSection invalid={invalidFields.includes(SUBJECT_INFORMATION.RACE)}>
          <RequiredField>
            <Label bold>Race</Label>
          </RequiredField>
          {this.renderRadioButtons(SUBJECT_INFORMATION.RACE, RACE_VALUES)}
        </PersonFormSection>
        <PersonFormSection invalid={invalidFields.includes(SUBJECT_INFORMATION.ETHNICITY)}>
          <RequiredField>
            <Label bold>Ethnicity</Label>
          </RequiredField>
          {this.renderRadioButtons(SUBJECT_INFORMATION.ETHNICITY, ETHNICITY_VALUES)}
        </PersonFormSection>
      </FormWrapper>
    );
  }
}

const mapStateToProps = (state :Map) => ({
  app: state.get('app', Map()),
  values: state.get(STATE.SUBJECT_INFORMATION),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    clearSubjectInformation,
    setInputValue,
    setInputValues
  }, dispatch)
});

// $FlowFixMe
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SubjectInformation)
);
