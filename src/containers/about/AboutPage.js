import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { STATE } from '../../utils/constants/StateConstants';
import { ABOUT, LABELS } from '../../utils/constants/Labels';
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

const TextSection = styled.div`
  margin-top: 15px;
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  color: #555E6F;

  a {
    color: #6124E2;
  }
`;

class AboutPage extends React.Component {

  render() {
    const { renderText } = this.props;

    return (
      <ContentOuterWrapper>
        <Wrapper>
          <Header>{renderText(LABELS.ABOUT)}</Header>
          <TextSection>
            <span>{renderText(ABOUT.INTRO)}</span>
            <a target="_blank" href="https://cdss.ca.gov/">CDSS</a>
            <span>, </span>
            <a target="_blank"  href="https://www.cde.ca.gov/">CDE</a>
            <span>{`, ${renderText(ABOUT.AND)} `}</span>
            <a target="_blank" href="https://rrnetwork.org/">R&R's</a>
            <span>.</span>
          </TextSection>
          <TextSection>
            <span>{renderText(ABOUT.POWERED_BY)}</span>
            <a href="https://openlattice.com/#/" target="_blank">OpenLattice</a>
            <span>, </span>
            <a target="_blank" href="https://www.datanetwork.org/">CDN</a>
            <span>, </span>
            <a target="_blank" href="https://www.cloudflare.com/">Cloudflare</a>
            <span>{`, ${renderText(ABOUT.AND)} `}</span>
            <a target="_blank" href="https://www.mapbox.com/">Mapbox</a>
            <span>.</span>
          </TextSection>
          <TextSection>
            <span>{renderText(ABOUT.CRAFTED_WITH_LOVE)}</span>
          </TextSection>
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

export default connect(mapStateToProps, null)(AboutPage);
