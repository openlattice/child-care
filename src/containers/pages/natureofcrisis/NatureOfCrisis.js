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
  Radio,
} from 'lattice-ui-kit';
import type { Dispatch } from 'redux';

import { showInvalidFields } from '../../../utils/NavigationUtils';
import { STATE } from '../../../utils/constants/StateConstants';
import { CRISIS_NATURE, OTHER } from '../../../utils/constants/CrisisReportConstants';
import {
  NATURE_OF_CRISIS,
  CHEMICAL,
  CHEMICAL_CAUSES,
  ASSISTANCES,
  HOUSING_SITUATIONS
} from './Constants';
import {
  FormWrapper,
  FormSectionWithValidation,
  Header,
  IndentWrapper,
  RequiredField
} from '../../../components/crisis/FormComponents';
import { SELECT_ALL_THAT_APPLY } from '../constants';

import { getInvalidFields } from './Reducer';
import { setInputValue } from './ActionFactory';

type Props = {
  values :Map<*, *>,
  actions :{
    setInputValue :(value :{ field :string, value :Object }) => void
  };
  disabled :boolean;
}

const NatureOfCrisis = ({ values, actions, disabled } :Props) => {

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

  const renderCheckboxList = (field, valueList, otherField, dependentSubFields) => {
    const currentValues = values.get(field, List());

    const onChange = (event) => {
      onCheckboxChange(event);

      const { value, checked } = event.target;
      if (!!otherField && value === OTHER && !checked) {
        actions.setInputValue({ field: otherField, value: '' });
      }

      if (dependentSubFields && dependentSubFields[value] && !checked) {
        actions.setInputValue({ field: dependentSubFields[value].field, value: List() });
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
        {dependentSubFields && dependentSubFields[value] && currentValues.includes(value) ? (
          <IndentWrapper key={`${field}-${value}-ext`} extraIndent>{dependentSubFields[value].element}</IndentWrapper>
        ) : null}
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

  const renderRadio = (field, value, label) => {
    const checked = values.get(field) === value;

    const onChange = () => actions.setInputValue({ field, value });

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

  return (
    <FormWrapper>
      <FormSectionWithValidation noMargin invalid={invalidFields.includes(CRISIS_NATURE.NATURE_OF_CRISIS)}>
        <Header>
          <h1>Nature of Crisis</h1>
          <RequiredField>
            <Label>{SELECT_ALL_THAT_APPLY}</Label>
          </RequiredField>
        </Header>
        {renderCheckboxList(CRISIS_NATURE.NATURE_OF_CRISIS, NATURE_OF_CRISIS, null, {
          [CHEMICAL]: {
            element: renderCheckboxList(CRISIS_NATURE.CHEMICAL_CAUSES, CHEMICAL_CAUSES),
            field: CRISIS_NATURE.CHEMICAL_CAUSES
          }
        })}
      </FormSectionWithValidation>
      <FormSectionWithValidation noMargin invalid={invalidFields.includes(CRISIS_NATURE.ASSISTANCE)}>
        <Header>
          <h1>Assistance on Scene for Subject</h1>
          <RequiredField>
            <Label>{SELECT_ALL_THAT_APPLY}</Label>
          </RequiredField>
        </Header>
        {renderCheckboxList(CRISIS_NATURE.ASSISTANCE, ASSISTANCES, CRISIS_NATURE.OTHER_ASSISTANCE)}
      </FormSectionWithValidation>
      <FormSectionWithValidation noMargin invalid={invalidFields.includes(CRISIS_NATURE.HOUSING)}>
        <Header>
          <h1>Current Housing Situation</h1>
          <RequiredField>
            <Label>Select one.</Label>
          </RequiredField>
        </Header>
        {HOUSING_SITUATIONS.map((housing) => renderRadio(CRISIS_NATURE.HOUSING, housing, housing))}
      </FormSectionWithValidation>
    </FormWrapper>
  );
};

const mapStateToProps = (state :Map) => ({
  values: state.get(STATE.NATURE_OF_CRISIS)
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({ setInputValue }, dispatch)
});

// $FlowFixMe
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NatureOfCrisis)
);
