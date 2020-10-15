/*
 * @flow
 */
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { STATE } from '../../utils/constants/StateConstants';
import { LABELS } from '../../utils/constants/Labels';
import { getRenderTextFn } from '../../utils/AppUtils';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';

const Wrapper = styled(ContentWrapper)`
  padding: 30px !important;
  background-color: white;
`;

const Header = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 22px;
  line-height: 27px;

  color: #555E6F;
`;

type Props = {
  renderText :(currentLanguage :string) => string;
}

class AboutPage extends React.Component<Props> {

  render() {
    const { renderText } = this.props;

    return (
      <ContentOuterWrapper>
        <Wrapper>
          <Header>{renderText(LABELS.RESOURCES)}</Header>
        </Wrapper>
      </ContentOuterWrapper>
    );
  }
}

function mapStateToProps(state) {
  const app = state.get(STATE.APP);

  return {
    app,
    renderText: getRenderTextFn(state)
  };
}
// $FlowFixMe
export default connect(mapStateToProps, null)(AboutPage);
