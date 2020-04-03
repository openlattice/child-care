// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';

import { FormWrapper } from './FormComponents';
import { BLACK } from '../../shared/Colors';
import { HOME_PATH } from '../../core/router/Routes';
import { goToPath } from '../../core/router/RoutingActions';
import type { RoutingAction } from '../../core/router/RoutingActions';

const SubmittedView = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
  min-height: 230px;

  h1 {
    color: ${BLACK};
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 30px;
  }
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 0;
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin-bottom: 10px;
`;

type Props = {
  actions :{
    goToPath :(path :string) => RoutingAction;
  };
  actionText :string;
};

class SubmitSuccess extends Component<Props> {

  clearAndNavigate = (path :string) => () => {
    const { actions } = this.props;
    actions.goToPath(path);
  };

  render() {
    const { actionText } = this.props;
    return (
      <PageWrapper>
        <FormWrapper>
          <SubmittedView>
            <h1>{`Your report has been ${actionText}!`}</h1>
            <StyledButton mode="primary" onClick={this.clearAndNavigate(HOME_PATH)}>Return to Home</StyledButton>
          </SubmittedView>
        </FormWrapper>
      </PageWrapper>
    );
  }
}

const mapDispatchToProps = (dispatch :Dispatch<*>) => ({
  actions: bindActionCreators({
    goToPath,
  }, dispatch)
});

// $FlowFixMe
export default connect(null, mapDispatchToProps)(SubmitSuccess);
