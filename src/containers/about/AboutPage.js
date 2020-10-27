import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Colors } from 'lattice-ui-kit';

import { STATE } from '../../utils/constants/StateConstants';
import { ABOUT, LABELS } from '../../utils/constants/Labels';
import { getRenderTextFn } from '../../utils/AppUtils';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';

import caForAll from '../../assets/images/caForAll.png';
import cdnLogo from '../../assets/images/cdnLogo.png';
import cloudflareLogo from '../../assets/images/cloudflareLogo.png';
import everbridgeLogo from '../../assets/images/everbridgeLogo.png';
import openlatticeLogo from '../../assets/images/openlatticeLogoLong.png';
import mapboxLogo from '../../assets/images/mapboxLogo.png';

const { NEUTRAL, PURPLE } = Colors;

const URLS = {
  CDSS: 'https://cdss.ca.gov/',
  CDE: 'https://www.cde.ca.gov/',
  RR: 'https://rrnetwork.org/',
  OPENLATTICE: 'https://openlattice.com',
  CDN: 'https://www.datanetwork.org/',
  CLOUDFLARE: 'https://www.cloudflare.com',
  EVERBRIDGE: 'https://www.everbridge.com',
  MAPBOX: 'https://www.mapbox.com'
};

const URL_TO_IMG = {
  [URLS.OPENLATTICE]: openlatticeLogo,
  [URLS.CDN]: cdnLogo,
  [URLS.CLOUDFLARE]: cloudflareLogo,
  [URLS.EVERBRIDGE]: everbridgeLogo,
  [URLS.MAPBOX]: mapboxLogo
};

const IMG_HEIGHT = {
  [URLS.CDN]: 20
};

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

  color: ${NEUTRAL.N700};
`;

const Text = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  color: ${NEUTRAL.N700};
`;

const TextLink = styled.a.attrs({
  target: '_blank'
})`
  color: ${PURPLE.P300};
`;

const TextSection = styled.div`
  margin-top: 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  width: 100%;
`;

const LogoLink = styled.a.attrs({
  target: '_blank'
})`

  width: ${(props) => props.width}%;

  img {
    max-width: 100%;
    max-height: ${(props) => props.height || 40}px;
  }

  &:not(:first-child) {
    margin-left: 20px;
  }
`;

const CaImg = styled.img.attrs({
  src: caForAll
})`
  max-height: 125px;
  max-width: 125px;
  margin-top: 10px;
`;

class AboutPage extends React.Component {

  renderLogos = (logoUrls) => {
    const { length } = logoUrls;

    const width = Math.min(50, (100 / length) - 10);

    return (
      <LogoRow>
        {logoUrls.map((url) => (
          <LogoLink href={url} key={url} width={width} height={IMG_HEIGHT[url] || 40}>
            <img src={URL_TO_IMG[url]} />
          </LogoLink>
        ))}
      </LogoRow>
    );
  }

  render() {
    const { renderText } = this.props;

    return (
      <ContentOuterWrapper>
        <Wrapper>
          <Header>{renderText(LABELS.ABOUT)}</Header>

          <TextSection>
            <Text>
              <span>{renderText(ABOUT.INTRO)}</span>
              <TextLink href={URLS.CDSS}>California Department of Social Services</TextLink>
              <span>, </span>
              <TextLink href={URLS.CDE}>California Department of Education</TextLink>
              <span>{`, ${renderText(ABOUT.AND)} `}</span>
              <TextLink href={URLS.RR}>California Child Care Resource and Referral Network</TextLink>
              <span>.</span>
            </Text>
            <CaImg />
          </TextSection>

          <TextSection>
            <Text>{renderText(ABOUT.CRAFTED_WITH_LOVE)}</Text>
            {this.renderLogos([URLS.OPENLATTICE])}
          </TextSection>
          <TextSection>
            <Text>{renderText(ABOUT.DATA_COLLECTION)}</Text>
            {this.renderLogos([URLS.CDN])}
          </TextSection>
          <TextSection>
            <Text>{renderText(ABOUT.INFRASTRUCTURE_PARNERS)}</Text>
            {this.renderLogos([URLS.CLOUDFLARE, URLS.MAPBOX, URLS.EVERBRIDGE])}
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
