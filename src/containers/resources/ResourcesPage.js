/*
 * @flow
 */
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Colors, Typography } from 'lattice-ui-kit';

import { STATE } from '../../utils/constants/StateConstants';
import { LABELS } from '../../utils/constants/Labels';
import { getRenderTextFn } from '../../utils/AppUtils';
import { ContentOuterWrapper, ContentWrapper, TextLink } from '../../components/layout';

const { NEUTRAL } = Colors;

const Wrapper = styled(ContentWrapper)`
  padding: 30px !important;
  background-color: white;
`;

const Description = styled(Typography)`
  color: ${NEUTRAL.N500};
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
          <Typography variant="h1">{renderText(LABELS.RESOURCES)}</Typography>
          <Description variant="body1">{renderText(LABELS.RESOURCES_DESCRIPTIONS)}</Description>
          <TextLink></TextLink>
          <Typography variant="subtitle1">California Resource and Referral Network</Typography>
          <TextLink></TextLink>
          <Typography variant="subtitle1">California Covid-19 Childcare Response</Typography>
          <TextLink></TextLink>
          <Typography variant="subtitle1">California Parent and Family Resources</Typography>
          <TextLink></TextLink>
          <Typography variant="subtitle1">Family Child Care Home Licensing Information</Typography>
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
