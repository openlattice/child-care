
import React from 'react';

import Select from 'react-select';
import styled from 'styled-components';

import { LABELS } from '../../../../utils/constants/Labels';
import { APP_CONTAINER_WIDTH } from '../../../../core/style/Sizes';
import { isMobile } from '../../../../utils/AppUtils';
import { selectStyles } from '../../../app/SelectStyles';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.div`
  padding: 20px;
  border-radius: 3px;
  margin-top: ${(props) => props.marginTop};
  text-align: center;
  width: 49%;

  &:hover {
    cursor: pointer;
  }
`;

const SelectedValue = styled(Button)`
  background-color: #e4d8ff;
  color: #6124e2;

  &:hover {
    background-color: #d0bbff;
    cursor: pointer;
  }
`;

const UnselectedValue = styled(Button)`
  background-color: #F9F9FD;
  color: #8E929B;

  &:hover {
    background-color: #dcdce7;
    cursor: pointer;
  }
`;

export default class ActiveOnlyFilter extends React.Component {

  componentDidMount() {
    const { setIsValid } = this.props;
    setIsValid(true);
  }

  render() {
    const { value, onChange, renderText } = this.props;

    const NoComponent = value ? SelectedValue : UnselectedValue;
    const YesComponent = value ? UnselectedValue : SelectedValue;

    return (
      <Wrapper>
        <NoComponent onClick={() => onChange(true)}>
          {renderText(LABELS.NO)}
        </NoComponent>
        <YesComponent onClick={() => onChange(false)}>
          {renderText(LABELS.YES)}
        </YesComponent>
      </Wrapper>
    );
  }

}
