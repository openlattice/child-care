import React from 'react';
import { Colors } from 'lattice-ui-kit';

import styled from 'styled-components';

import { LABELS } from '../../../../utils/constants/labels';

const { NEUTRAL, BLUE } = Colors;

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Button = styled.div`
  border-radius: 3px;
  margin-top: ${(props) => props.marginTop};
  padding: 20px;
  text-align: center;
  width: 49%;

  &:hover {
    cursor: pointer;
  }
`;

const SelectedValue = styled(Button)`
  background-color: ${BLUE.B100};
  color: ${BLUE.B400};

  &:hover {
    background-color: ${BLUE.B200};
    cursor: pointer;
  }
`;

const UnselectedValue = styled(Button)`
  background-color: ${NEUTRAL.N50};
  color: ${NEUTRAL.N600};

  &:hover {
    background-color: ${NEUTRAL.N200};
    cursor: pointer;
  }
`;

export default class ActiveOnlyFilter extends React.Component {

  componentDidMount() {
    const { setIsValid } = this.props;
    setIsValid(true);
  }

  render() {
    const { value, onChange, getText } = this.props;

    const NoComponent = value ? SelectedValue : UnselectedValue;
    const YesComponent = value ? UnselectedValue : SelectedValue;

    return (
      <Wrapper>
        <NoComponent onClick={() => onChange(true)}>
          {getText(LABELS.NO)}
        </NoComponent>
        <YesComponent onClick={() => onChange(false)}>
          {getText(LABELS.YES)}
        </YesComponent>
      </Wrapper>
    );
  }

}
