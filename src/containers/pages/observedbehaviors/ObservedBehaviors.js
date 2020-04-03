/*
 * @flow
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { List, Map } from 'immutable';
import {
  Checkbox,
  Input,
  Label,
  Radio
} from 'lattice-ui-kit';
import type { Dispatch } from 'redux';

import { showInvalidFields } from '../../../utils/NavigationUtils';
import { STATE } from '../../../utils/constants/StateConstants';
import { OBSERVED_BEHAVIORS, OTHER } from '../../../utils/constants/CrisisReportConstants';
import { SELECT_ALL_THAT_APPLY } from '../constants';
import {
  BEHAVIORS,
  SUICIDE_BEHAVIORS,
  SUICIDE_ACTION_TYPE,
  SUICIDE_METHODS,
  DEMEANORS
} from './Constants';
import {
  FormWrapper,
  FormSection,
  FormSectionWithValidation,
  Header,
  IndentWrapper,
  RequiredField
} from '../../../components/crisis/FormComponents';

import { getInvalidFields } from './Reducer';
import { setInputValue } from './ActionFactory';

type Props = {
  values :Map<*, *>,
  actions :{
    setInputValue :(value :{ field :string, value :Object }) => void
  },
  disabled :boolean;
}

const ObservedBehaviors = ({ values, actions, disabled } :Props) => {

  const onCheckboxChange = (event) => {
    const { name, checked, value } = event.target;
    let valueList = values.get(name, List());

    if (!checked && valueList.includes(value)) {
      valueList = valueList.delete(valueList.indexOf(value));
    }
    else if (!valueList.includes(value)) {
      valueList = valueList.push(value);
    }

    if (value === SUICIDE_BEHAVIORS && !checked) {
      actions.setInputValue({
        field: OBSERVED_BEHAVIORS.SUICIDE_ATTEMPT_TYPE,
        value: ''
      });
      actions.setInputValue({
        field: OBSERVED_BEHAVIORS.SUICIDE_METHODS,
        value: List()
      });
      actions.setInputValue({
        field: OBSERVED_BEHAVIORS.OTHER_SUICIDE_METHOD,
        value: ''
      });
    }

    actions.setInputValue({
      field: name,
      value: valueList
    });
  };

  const renderCheckboxList = (field, valueList, otherField, suicideDetailsElements) => {
    const currentValues = values.get(field, List());

    const onChange = (event) => {
      onCheckboxChange(event);

      const { value, checked } = event.target;
      if (!!otherField && value === OTHER && !checked) {
        actions.setInputValue({ field: otherField, value: '' });
      }
    };

    const checkboxes = valueList.map((value) => (
      <Fragment key={`${field}-${value}`}>
        <Checkbox
            disabled={disabled}
            name={field}
            value={value}
            label={value}
            checked={currentValues.includes(value)}
            onChange={onChange} />
        { value === SUICIDE_BEHAVIORS && currentValues.includes(SUICIDE_BEHAVIORS) ? suicideDetailsElements : null }
      </Fragment>
    ));

    return (
      <>
        {checkboxes}
        { !!otherField && currentValues.includes(OTHER) ? (
          <Input
              disabled={disabled}
              key={`${field}-other-value`}
              value={values.get(otherField, '')}
              onChange={({ target }) => actions.setInputValue({ field: otherField, value: target.value })} />
        ) : null}
      </>
    );
  };

  const renderSingleCheckbox = (field, label) => (
    <Checkbox
        disabled={disabled}
        name={field}
        checked={values.get(field)}
        label={label}
        onChange={({ target }) => actions.setInputValue({ field, value: target.checked })} />
  );

  const renderRadio = (field, value, label) => {
    const checked = values.get(field) === value;

    const onChange = () => {
      actions.setInputValue({ field, value });
    };

    return (
      <Radio
          key={`${field}-${value}`}
          disabled={disabled}
          label={label}
          checked={checked}
          onChange={onChange} />
    );
  };

  const invalidFields = showInvalidFields(window.location) ? getInvalidFields(values) : [];

  const suicideDetails = () => (
    <IndentWrapper>
      <Label bold>Suicide threat or attempt?</Label>
      {SUICIDE_ACTION_TYPE.map((type) => renderRadio(OBSERVED_BEHAVIORS.SUICIDE_ATTEMPT_TYPE, type, type))}
      <Label bold>Suicide Methods</Label>
      {renderCheckboxList(
        OBSERVED_BEHAVIORS.SUICIDE_METHODS,
        SUICIDE_METHODS,
        OBSERVED_BEHAVIORS.OTHER_SUICIDE_METHOD
      )}
    </IndentWrapper>
  );

  return (
    <FormWrapper>
      <FormSection>
        <Header>
          <h1>Additional Subject Information</h1>
          <Label>{SELECT_ALL_THAT_APPLY}</Label>
        </Header>
        {renderSingleCheckbox(OBSERVED_BEHAVIORS.VETERAN, 'Served in the military?')}
      </FormSection>
      <FormSectionWithValidation noMargin invalid={invalidFields.includes(OBSERVED_BEHAVIORS.BEHAVIORS)}>
        <Header>
          <h1>Behaviors</h1>
          <RequiredField>
            <Label>{SELECT_ALL_THAT_APPLY}</Label>
          </RequiredField>
        </Header>
        {renderCheckboxList(
          OBSERVED_BEHAVIORS.BEHAVIORS,
          BEHAVIORS,
          OBSERVED_BEHAVIORS.OTHER_BEHAVIOR,
          suicideDetails()
        )}
      </FormSectionWithValidation>
      <FormSectionWithValidation noMargin invalid={invalidFields.includes(OBSERVED_BEHAVIORS.DEMEANORS)}>
        <Header>
          <h1>Demeanors Observed Around Law Enforcement</h1>
          <RequiredField>
            <Label>{SELECT_ALL_THAT_APPLY}</Label>
          </RequiredField>
        </Header>
        {renderCheckboxList(OBSERVED_BEHAVIORS.DEMEANORS, DEMEANORS, OBSERVED_BEHAVIORS.OTHER_DEMEANOR)}
      </FormSectionWithValidation>
    </FormWrapper>
  );
};

const mapStateToProps = (state :Map) => ({
  values: state.get(STATE.OBSERVED_BEHAVIORS)
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({ setInputValue }, dispatch)
});

// $FlowFixMe
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ObservedBehaviors)
);
