/*
 * @flow
 */

import React from 'react';

import styled, { css } from 'styled-components';

import { MEDIA_QUERY_LG, MEDIA_QUERY_MD } from '../../core/style/Sizes';
import {
  GREEN,
  OFF_WHITE,
  PURPLE,
  WHITE
} from '../../shared/Colors';
import { FORM_STEP_STATUS } from '../../utils/constants/FormConstants';

const {
  IN_PROGRESS,
  COMPLETED
} = FORM_STEP_STATUS;

type Step = {
  title :string;
  status :string;
  onClick :() => void;
  disabled :boolean;
}

type Props = {
  formTitle :string;
  currentStepNumber :number;
  steps :Step[];
}

const CIRCLE_RADIUS = 13;

const SidebarWrapper = styled.div`
  width: 150px;
  max-width: 35vw;
  background-color: ${PURPLE};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  color: ${OFF_WHITE};
  padding: 15px;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    width: 250px;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    width: 300px;
  }

  h1 {
    color: ${WHITE};
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 30px;

    @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
      font-size: 18px;
    }
  }
`;

const Divider = styled.div`
  background-color: ${OFF_WHITE};
  height: 45px;
  margin: 7px 0 7px ${CIRCLE_RADIUS - 1}px;
  width: 2px;
`;

const Circle = styled.span`
  min-height: ${CIRCLE_RADIUS * 2}px;
  min-width: ${CIRCLE_RADIUS * 2}px;
  border-radius: 50%;
  background-color: ${(props) => (props.selected || props.status === COMPLETED ? WHITE : OFF_WHITE)};
  color: ${PURPLE};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  div {
    margin-left: 4px;
    font-size: 12px;
    font-weight: ${(props) => (props.selected ? 600 : 400)};
    color: ${(props) => (props.selected ? WHITE : OFF_WHITE)};

    @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
      margin-left: 10px;
      font-size: 14px;
    }

    @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
      margin-left: 10px;
      font-size: 14px;
    }
  }

  &:hover {
    ${(props) => (props.isDisabled ? '' : css`
      cursor: pointer;

      div {
        color: ${WHITE};
      }
      `)}
  }
`;

const CompletedCheckmark = styled.span`
  height: 16px;
  width: 8px;
  display: inline-block;
  transform: rotate(45deg);
  border-bottom: 3px solid ${GREEN};
  border-right: 3px solid ${GREEN};
  margin-bottom: 2px;
`;

const InProgressSymbol = styled.span`
  height: ${CIRCLE_RADIUS * 2}px;
  width: ${CIRCLE_RADIUS}px;
  border-bottom-right-radius: ${CIRCLE_RADIUS * 2}px;
  border-top-right-radius: ${CIRCLE_RADIUS * 2}px;
  background-color: ${WHITE};
  margin-left: ${CIRCLE_RADIUS}px;
`;

const ProgressSidebar = ({ formTitle, currentStepNumber, steps } :Props) => {

  const renderStep = (step :Step, index :number) => {
    const {
      title,
      status,
      onClick,
      disabled
    } = step;
    const items = [];

    const selected = index === currentStepNumber;

    let content = '';
    if (selected) {
      content = `${index + 1}`;
    }
    else {
      switch (status) {
        case COMPLETED:
          content = <CompletedCheckmark />;
          break;
        case IN_PROGRESS:
          content = <InProgressSymbol />;
          break;
        default:
          content = '';
          break;
      }
    }

    const clickFn = disabled ? () => {} : onClick;

    items.push(
      <StepItem selected={selected} status={status} key={`step-${index}`} onClick={clickFn} isDisabled={disabled}>
        <Circle selected={selected} status={status}>{content}</Circle>
        <div>{title}</div>
      </StepItem>
    );

    if (index < steps.length - 1) {
      items.push(<Divider key={`divider-${index}`} />);
    }

    return items;
  };

  return (
    <SidebarWrapper>
      <h1>{formTitle}</h1>
      {steps.map(renderStep)}
    </SidebarWrapper>
  );
};

export default ProgressSidebar;
