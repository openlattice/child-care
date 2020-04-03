/*
 * @flow
 */

import React from 'react';

import { List, Map } from 'immutable';
import {
  Checkbox,
  Input,
  Label,
} from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';

import { setInputValue } from './ActionFactory';
import {
  PERSON_TYPES,
  RELATIONSHIP_TYPES,
  TECHNIQUES,
  WEAPONS,
} from './Constants';
import { getInvalidFields } from './Reducer';

import YesNoToggle from '../../../components/controls/YesNoToggle';
import {
  FormSection,
  FormSectionWithValidation,
  FormWrapper,
  Header,
  IndentWrapper,
  RequiredField
} from '../../../components/crisis/FormComponents';
import { showInvalidFields } from '../../../utils/NavigationUtils';
import { OFFICER_SAFETY, OTHER } from '../../../utils/constants/CrisisReportConstants';
import { STATE } from '../../../utils/constants/StateConstants';
import { SELECT_ALL_THAT_APPLY } from '../constants';

type Props = {
  values :Map<*, *>,
  actions :{
    setInputValue :(value :{ field :string, value :Object }) => void
  };
  disabled :boolean;
}

const OfficerSafety = ({ values, actions, disabled } :Props) => {

  const onCheckboxChange = (event) => {
    const { name, checked, value } = event.target;
    let valueList = values.get(name, List());

    if (!checked && valueList.includes(value)) {
      valueList = valueList.delete(valueList.indexOf(value));
    }
    else if (!valueList.includes(value)) {
      valueList = valueList.push(value);
    }

    actions.setInputValue({
      field: name,
      value: valueList
    });
  };

  const renderCheckboxList = (field, valueList, otherField) => {
    const currentValues = values.get(field, List());

    const onChange = (event) => {
      onCheckboxChange(event);

      const { value, checked } = event.target;
      if (!!otherField && value === OTHER && !checked) {
        actions.setInputValue({ field: otherField, value: '' });
      }
    };

    const checkboxes = valueList.map((value) => (
      <Checkbox
          disabled={disabled}
          name={field}
          value={value}
          label={value}
          key={`${field}-${value}`}
          checked={currentValues.includes(value)}
          onChange={onChange} />
    ));

    return (
      <>
        {checkboxes}
        { (!!otherField && currentValues.includes(OTHER)) && (
          <Input
              disabled={disabled}
              key={`${field}-other-value`}
              value={values.get(otherField, '')}
              onChange={({ target }) => actions.setInputValue({ field: otherField, value: target.value })} />
        )}
      </>
    );
  };

  const clearDependentFields = (dependentListFields, dependentStringFields) => {
    if (dependentListFields) {
      dependentListFields.forEach((dependentListField) => {
        actions.setInputValue({
          field: dependentListField,
          value: List()
        });
      });
    }
    if (dependentStringFields) {
      dependentStringFields.forEach((dependentStringField) => {
        actions.setInputValue({
          field: dependentStringField,
          value: ''
        });
      });
    }
  };

  const renderYesNoToggle = (field, dependentListFields, dependentStringFields) => {

    const onChange = (value) => {
      actions.setInputValue({ field, value });
      clearDependentFields(dependentListFields, dependentStringFields);
    };

    return <YesNoToggle disabled={disabled} value={values.get(field)} onChange={onChange} />;
  };

  const invalidFields = showInvalidFields(window.location) ? getInvalidFields(values) : [];

  return (
    <FormWrapper>
      <FormSection>
        <Header>
          <h1>Techniques</h1>
          <RequiredField>
            <Label>{SELECT_ALL_THAT_APPLY}</Label>
          </RequiredField>
        </Header>
        {renderCheckboxList(OFFICER_SAFETY.TECHNIQUES, TECHNIQUES)}
      </FormSection>
      <FormSection>
        <Header>
          <h1>Threats / Violence / Weapons</h1>
          <RequiredField>
            <Label>{SELECT_ALL_THAT_APPLY}</Label>
          </RequiredField>
        </Header>

        <Label bold>Did subject use/brandish a weapon?</Label>

        {renderYesNoToggle(OFFICER_SAFETY.HAD_WEAPON, [OFFICER_SAFETY.WEAPONS], [OFFICER_SAFETY.OTHER_WEAPON])}
        {values.get(OFFICER_SAFETY.HAD_WEAPON) && (
          <IndentWrapper>
            <FormSectionWithValidation noMargin invalid={invalidFields.includes(OFFICER_SAFETY.WEAPONS)}>
              {renderCheckboxList(OFFICER_SAFETY.WEAPONS, WEAPONS, OFFICER_SAFETY.OTHER_WEAPON)}
            </FormSectionWithValidation>
          </IndentWrapper>
        )}

        <Label bold>Did subject threaten violence toward another person?</Label>

        {renderYesNoToggle(
          OFFICER_SAFETY.THREATENED_VIOLENCE,
          [OFFICER_SAFETY.THREATENED_PERSON_RELATIONSHIP],
          []
        )}
        {values.get(OFFICER_SAFETY.THREATENED_VIOLENCE) && (
          <IndentWrapper>
            <Label bold>Threatened person relationship(s)</Label>
            {renderCheckboxList(OFFICER_SAFETY.THREATENED_PERSON_RELATIONSHIP, RELATIONSHIP_TYPES)}
          </IndentWrapper>
        )}

        <Label bold>Were there any injuries during the incident?</Label>

        {renderYesNoToggle(
          OFFICER_SAFETY.HAD_INJURIES,
          [OFFICER_SAFETY.INJURY_TYPE],
          [OFFICER_SAFETY.OTHER_INJURED_PERSON]
        )}
        {values.get(OFFICER_SAFETY.HAD_INJURIES) && (
          <IndentWrapper>
            <FormSectionWithValidation noMargin invalid={invalidFields.includes(OFFICER_SAFETY.INJURED_PARTIES)}>
              <RequiredField>
                <Label bold>Injured Parties</Label>
              </RequiredField>
              {renderCheckboxList(
                OFFICER_SAFETY.INJURED_PARTIES,
                PERSON_TYPES,
                OFFICER_SAFETY.OTHER_INJURED_PERSON
              )}
            </FormSectionWithValidation>
          </IndentWrapper>
        )}

      </FormSection>
    </FormWrapper>
  );
};

const mapStateToProps = (state :Map) => ({
  values: state.get(STATE.OFFICER_SAFETY)
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({ setInputValue }, dispatch)
});

// $FlowFixMe
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OfficerSafety)
);
