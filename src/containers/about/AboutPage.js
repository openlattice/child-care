import React from 'react';

import styled from 'styled-components';
import { Colors, Typography } from 'lattice-ui-kit';
import { connect } from 'react-redux';

import caForAll from '../../assets/images/caForAll.png';
import cdnLogo from '../../assets/images/cdnLogo.png';
import cloudflareLogo from '../../assets/images/cloudflareLogo.png';
import everbridgeLogo from '../../assets/images/everbridgeLogo.png';
import mapboxLogo from '../../assets/images/mapboxLogo.png';
import openlatticeLogo from '../../assets/images/openlatticeLogoLong.png';
import { ContentOuterWrapper, ContentWrapper, TextLink } from '../../components/layout';
import { getTextFnFromState } from '../../utils/AppUtils';
import { STATE } from '../../utils/constants/StateConstants';
import { ABOUT, LABELS } from '../../utils/constants/labels';

const { NEUTRAL } = Colors;

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

const URL_TO_ALT_TEXT = {
  [URLS.OPENLATTICE]: 'OpenLattice',
  [URLS.CDN]: 'CDN',
  [URLS.CLOUDFLARE]: 'Coudflare',
  [URLS.EVERBRIDGE]: 'Everbridge',
  [URLS.MAPBOX]: 'Mapbox'
};

const IMG_HEIGHT = {
  [URLS.CDN]: 20
};

const Wrapper = styled(ContentWrapper)`
  background-color: white;
  padding: 30px !important;
`;

const Header = styled.div`
  color: ${NEUTRAL.N700};
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  line-height: 27px;
`;

const TextSection = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 30px;
  text-align: center;
`;

const LogoRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
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
            <img alt={URL_TO_ALT_TEXT[url]} src={URL_TO_IMG[url]} />
          </LogoLink>
        ))}
      </LogoRow>
    );
  }

  render() {
    const { getText } = this.props;

    return (
      <ContentOuterWrapper>
        <Wrapper>
          <Header>{getText(LABELS.ABOUT)}</Header>

          <TextSection>
            <Typography variant="body1">
              <>{getText(ABOUT.INTRO)}</>
              <TextLink href={URLS.CDSS}>California Department of Social Services</TextLink>
              <>, </>
              <TextLink href={URLS.CDE}>California Department of Education</TextLink>
              <>{`, ${getText(ABOUT.AND)} `}</>
              <TextLink href={URLS.RR}>California Child Care Resource and Referral Network</TextLink>
              <>.</>
            </Typography>
            <CaImg />
          </TextSection>

          <TextSection>
            <Typography variant="body1">{getText(ABOUT.CRAFTED_WITH_LOVE)}</Typography>
            {this.renderLogos([URLS.OPENLATTICE])}
          </TextSection>
          <TextSection>
            <Typography variant="body1">{getText(ABOUT.DATA_COLLECTION)}</Typography>
            {this.renderLogos([URLS.CDN])}
          </TextSection>
          <TextSection>
            <Typography variant="body1">{getText(ABOUT.INFRASTRUCTURE_PARNERS)}</Typography>
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
    getText: getTextFnFromState(state)
  };
}

export default connect(mapStateToProps, null)(AboutPage);
