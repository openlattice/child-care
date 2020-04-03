/*
 * @flow
 */

import React, { useEffect } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Checkbox,
  DateTimePicker,
  Input,
  Label,
  Radio,
  TextArea
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';

import { setInputValue } from './ActionFactory';
import {
  ARRESTABLE_OFFENSES,
  COURTESY_TRANSPORTS,
  DISPOSITIONS,
  NO_ACTION_VALUES,
  OFFICER_TRAINING,
  PEOPLE_NOTIFIED,
  VERBAL_REFERRALS
} from './Constants';
import { getInvalidFields } from './Reducer';

import {
  FormSection,
  FormSectionWithValidation,
  FormWrapper,
  Header,
  IndentWrapper,
  RequiredField
} from '../../../components/crisis/FormComponents';
import { showInvalidFields } from '../../../utils/NavigationUtils';
import { DISPOSITION, OTHER } from '../../../utils/constants/CrisisReportConstants';
import { STATE } from '../../../utils/constants/StateConstants';
import { SELECT_ALL_THAT_APPLY } from '../constants';

type Props = {
  values :Map,
  actions :{
    setInputValue :(value :{ field :string, value :Object }) => void
  };
  disabled :boolean;
}

const DateTimePickerWrapper = styled.div`
  margin-bottom: 10px;
`;

const Disposition = ({ values, actions, disabled } :Props) => {

  const incidentDateTime = values.get(DISPOSITION.INCIDENT_DATE_TIME);

  useEffect(() => {
    if (!incidentDateTime) {
      actions.setInputValue({
        field: DISPOSITION.INCIDENT_DATE_TIME,
        value: DateTime.local().toISO()
      });
    }
  }, [actions, incidentDateTime]);

  const clearDependentFields = (dependentListFields, dependentStringFields, dependentBoolFields) => {
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
    if (dependentBoolFields) {
      dependentBoolFields.forEach((dependentBoolField) => {
        actions.setInputValue({
          field: dependentBoolField,
          value: undefined
        });
      });
    }
  };

  const renderInput = (field, isTextArea) => {
    const InputComponent = isTextArea ? TextArea : Input;
    return (
      <InputComponent
          disabled={disabled}
          name={field}
          value={values.get(field)}
          onChange={({ target }) => actions.setInputValue({ field, value: target.value })} />
    );
  };

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

  const renderDispositionCheckbox = (value, dependentStringFields, dependentListFields, dependentBoolField) => {
    const onChange = (event) => {
      onCheckboxChange(event);
      clearDependentFields(dependentStringFields, dependentListFields, dependentBoolField);
    };

    return (
      <Checkbox
          disabled={disabled}
          name={DISPOSITION.DISPOSITIONS}
          checked={values.get(DISPOSITION.DISPOSITIONS).includes(value)}
          label={value}
          value={value}
          onChange={onChange} />
    );
  };

  const renderRadio = (field, value, label, inverseDependentField) => {
    const checked = values.get(field) === value;

    const onChange = () => {
      if (inverseDependentField) {
        actions.setInputValue({
          field: inverseDependentField,
          value: ''
        });
      }
      actions.setInputValue({ field, value });
    };

    return (
      <Radio
          disabled={disabled}
          label={label}
          checked={checked}
          onChange={onChange} />
    );
  };

  const onDateChange = (value) => {
    actions.setInputValue({
      field: DISPOSITION.INCIDENT_DATE_TIME,
      value
    });
  };

  const hasDisposition = (value) => values.get(DISPOSITION.DISPOSITIONS).includes(value);

  const invalidFields = showInvalidFields(window.location) ? getInvalidFields(values) : [];

  return (
    <FormWrapper>
      <FormSection>
        <Header>
          <h1>Specialists On Scene</h1>
          <Label>{SELECT_ALL_THAT_APPLY}</Label>
        </Header>
        {renderCheckboxList(DISPOSITION.SPECIALISTS, OFFICER_TRAINING)}
      </FormSection>
      <FormSectionWithValidation noMargin invalid={invalidFields.includes(DISPOSITION.DISPOSITIONS)}>
        <Header>
          <h1>Disposition</h1>
          <RequiredField>
            <Label>{SELECT_ALL_THAT_APPLY}</Label>
          </RequiredField>
        </Header>

        {renderDispositionCheckbox(
          DISPOSITIONS.NOTIFIED_SOMEONE,
          [DISPOSITION.PEOPLE_NOTIFIED],
          [DISPOSITION.OTHER_PEOPLE_NOTIFIED]
        )}
        {
          hasDisposition(DISPOSITIONS.NOTIFIED_SOMEONE)
          && (
            <IndentWrapper>
              <FormSectionWithValidation noMargin invalid={invalidFields.includes(DISPOSITION.PEOPLE_NOTIFIED)}>
                {renderCheckboxList(DISPOSITION.PEOPLE_NOTIFIED, PEOPLE_NOTIFIED, DISPOSITION.OTHER_PEOPLE_NOTIFIED)}
              </FormSectionWithValidation>
            </IndentWrapper>
          )
        }

        {renderDispositionCheckbox(
          DISPOSITIONS.VERBAL_REFERRAL,
          [DISPOSITION.VERBAL_REFERRALS],
          [DISPOSITION.OTHER_VERBAL_REFERRAL]
        )}
        {
          hasDisposition(DISPOSITIONS.VERBAL_REFERRAL)
          && (
            <IndentWrapper>
              <FormSectionWithValidation noMargin invalid={invalidFields.includes(DISPOSITION.VERBAL_REFERRALS)}>
                {renderCheckboxList(
                  DISPOSITION.VERBAL_REFERRALS,
                  VERBAL_REFERRALS,
                  DISPOSITION.OTHER_VERBAL_REFERRAL
                )}
              </FormSectionWithValidation>
            </IndentWrapper>
          )
        }

        {renderDispositionCheckbox(DISPOSITIONS.COURTESY_TRANPORT, [DISPOSITION.COURTESY_TRANSPORTS], [])}
        {
          hasDisposition(DISPOSITIONS.COURTESY_TRANPORT)
          && (
            <IndentWrapper>
              <FormSectionWithValidation noMargin invalid={invalidFields.includes(DISPOSITION.COURTESY_TRANSPORTS)}>
                {renderCheckboxList(DISPOSITION.COURTESY_TRANSPORTS, COURTESY_TRANSPORTS)}
              </FormSectionWithValidation>
            </IndentWrapper>
          )
        }

        {renderDispositionCheckbox(
          DISPOSITIONS.HOSPITAL,
          [DISPOSITION.HOSPITALS],
          [],
          [DISPOSITION.WAS_VOLUNTARY_TRANSPORT]
        )}
        {
          hasDisposition(DISPOSITIONS.HOSPITAL)
          && (
            <IndentWrapper>
              <FormSectionWithValidation
                  noMargin
                  invalid={invalidFields.includes(DISPOSITION.WAS_VOLUNTARY_TRANSPORT)}>
                {renderRadio(DISPOSITION.WAS_VOLUNTARY_TRANSPORT, true, 'Voluntary')}
                {renderRadio(DISPOSITION.WAS_VOLUNTARY_TRANSPORT, false, 'Involuntary')}
              </FormSectionWithValidation>
            </IndentWrapper>
          )
        }

        {renderDispositionCheckbox(DISPOSITIONS.ADMINISTERED_DRUG)}

        {renderDispositionCheckbox(DISPOSITIONS.ARRESTABLE_OFFENSE, [DISPOSITION.ARRESTABLE_OFFENSES], [])}
        {
          hasDisposition(DISPOSITIONS.ARRESTABLE_OFFENSE)
          && (
            <IndentWrapper>
              <FormSectionWithValidation noMargin invalid={invalidFields.includes(DISPOSITION.ARRESTABLE_OFFENSES)}>
                {renderCheckboxList(DISPOSITION.ARRESTABLE_OFFENSES, ARRESTABLE_OFFENSES)}
              </FormSectionWithValidation>
            </IndentWrapper>
          )
        }

        {renderDispositionCheckbox(DISPOSITIONS.NO_ACTION_POSSIBLE, [DISPOSITION.NO_ACTION_VALUES], [])}
        {
          hasDisposition(DISPOSITIONS.NO_ACTION_POSSIBLE)
          && (
            <IndentWrapper>
              <FormSectionWithValidation noMargin invalid={invalidFields.includes(DISPOSITION.NO_ACTION_VALUES)}>
                {renderCheckboxList(DISPOSITION.NO_ACTION_VALUES, NO_ACTION_VALUES)}
              </FormSectionWithValidation>
            </IndentWrapper>
          )
        }
      </FormSectionWithValidation>
      <FormSectionWithValidation noMargin invalid={invalidFields.includes(DISPOSITION.HAS_REPORT_NUMBER)}>
        <Header>
          <h1>Additional Details</h1>
        </Header>
        <RequiredField invalid={invalidFields.includes(DISPOSITION.INCIDENT_DATE_TIME)}>
          <Label bold>Incident date/time</Label>
        </RequiredField>
        <DateTimePickerWrapper>
          <DateTimePicker
              disabled={disabled}
              value={values.get(DISPOSITION.INCIDENT_DATE_TIME)}
              onChange={onDateChange} />
        </DateTimePickerWrapper>
        <RequiredField>
          <Label bold>Report info</Label>
        </RequiredField>
        {renderRadio(
          DISPOSITION.HAS_REPORT_NUMBER,
          true,
          'Incident has a report or case number',
          DISPOSITION.INCIDENT_DESCRIPTION
        )}
        {
          values.get(DISPOSITION.HAS_REPORT_NUMBER)
          && (
            <IndentWrapper>
              <FormSectionWithValidation noMargin invalid={invalidFields.includes(DISPOSITION.REPORT_NUMBER)}>
                <RequiredField>
                  <Label bold>
                    Report / Case number
                  </Label>
                </RequiredField>
                {renderInput(DISPOSITION.REPORT_NUMBER)}
              </FormSectionWithValidation>
            </IndentWrapper>
          )
        }
        {renderRadio(DISPOSITION.HAS_REPORT_NUMBER, false, 'No report or case number', DISPOSITION.REPORT_NUMBER)}
        {
          values.get(DISPOSITION.HAS_REPORT_NUMBER) === false
          && (
            <IndentWrapper>
              <FormSectionWithValidation noMargin invalid={invalidFields.includes(DISPOSITION.INCIDENT_DESCRIPTION)}>
                <RequiredField>
                  <Label bold>
                    Describe the incident briefly below.
                  </Label>
                </RequiredField>
                {renderInput(DISPOSITION.INCIDENT_DESCRIPTION, true)}
              </FormSectionWithValidation>
            </IndentWrapper>
          )
        }
      </FormSectionWithValidation>
    </FormWrapper>
  );
};

const mapStateToProps = (state :Map) => ({
  values: state.get(STATE.DISPOSITION)
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({ setInputValue }, dispatch)
});

// $FlowFixMe
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Disposition)
);
