import styled, { css } from 'styled-components';
import { CardSegment, Colors, StyleUtils } from 'lattice-ui-kit';

import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { APP_CONTAINER_WIDTH, HEADER_HEIGHT, HEIGHTS } from '../../core/style/Sizes';

const { NEUTRAL, PURPLE } = Colors;

const { media } = StyleUtils;

const PADDING = 25;

const Centered = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  opacity: ${(props) => (props.hidden ? 0 : 1)};
  padding: 15px 0;
`;

const DataRows = styled.div`
  display: flex;
  flex-direction: column;
  ${(props) => (props.maxWidth ? css` max-width: ${props.maxWidth} !important; ` : '')}

  span {
    color: ${NEUTRAL.N600};
    text-align: right;
  }

  a {
    min-width: fit-content;
    text-align: right;
    ${(props) => (props.alignEnd ? css` align-self: flex-end; ` : '')}
  }
`;

const Header = styled.div`
  align-items: center;
  color: ${NEUTRAL.N700};
  display: flex;
  flex-direction: row;
  font-style: normal;
  justify-content: space-between;

  @media only screen and (min-height: ${HEIGHTS[0]}px) {
    padding: 10px 0;
  }

  @media only screen and (min-height: ${HEIGHTS[1]}px) {
    padding: 15px 0;
  }

  div {
    @media only screen and (min-height: ${HEIGHTS[0]}px) {
      font-size: 18px;
      line-height: 14px;
    }

    @media only screen and (min-height: ${HEIGHTS[1]}px) {
      font-size: 22px;
      line-height: 27px;
    }

    font-weight: 600;
  }

  span {
    font-size: 14px;
    font-weight: normal;
    line-height: 17px;
    min-width: fit-content;
  }
`;

const TitleRow = styled.section`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px ${PADDING}px;
  width: 100%;

  span {
    font-size: 14px;
    font-style: normal;
    font-weight: 600;

    :last-child {
      font-weight: normal;
    }
  }
`;

const DateRow = styled.article`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  span {
    color: ${NEUTRAL.N600};
  }

  p:first-child {
    margin-right: 10px;
    text-align: left;
  }

  p:last-child {
    text-align: right;
  }
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FlexContainer = styled.div`
  display: flex;
`;

const FlexRow = styled.div`
  display: flex;
  flex: 1;
`;

const InfoText = styled.div`
  color: ${NEUTRAL.N600};
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  line-height: 19px;
`;

const Line = styled.div`
  background-color: ${NEUTRAL.N100};
  height: 1px;
  margin: ${(props) => props.paddingTop || 0}px -${PADDING}px 0 -${PADDING}px;
`;

const MapWrapper = styled.div`
  display: flex;
  min-height: 22rem;
  height: 40vh;
  max-width: ${APP_CONTAINER_WIDTH}px;
`;

const MarginWrapper = styled.span`
  margin-left: 5px;
`;

const ResultDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 14px;
  min-width: 0;
  ${media.phone`
    font-size: 12px;
  `}
`;

const ResultName = styled.div`
  font-style: normal;
  font-weight: ${(props) => (props.isInactive ? 400 : 600)};
  font-size: 16px;
  line-height: 19px;
  color: ${(props) => (props.isInactive ? NEUTRAL.N500 : NEUTRAL.N700)};
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 5px;
  ${media.phone`
    font-size: 16px;
  `}
`;

const ResultSegment = styled(CardSegment)`
  ${media.phone`
    padding: 10px 15px;
  `}
`;

const Row = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  justify-content: space-between;
  line-height: 19px;
  margin: 8px 0;

  div {
    color: ${NEUTRAL.N700};
    max-width: 65%;
  }

  a {
    color: ${PURPLE.P300};
    text-decoration: underline;
    max-width: 65%;
  }
`;

const SearchTitle = styled.h1`
  display: flex;
  font-size: 18px;
  font-weight: normal;
  margin: 0;
`;

const StyledContentOuterWrapper = styled(ContentOuterWrapper)`
  z-index: 1;

  @media only screen and (min-height: ${HEIGHTS[0]}px) {
    min-height: ${HEIGHTS[0] / 3}px;
  }

  @media only screen and (min-height: 639px) {
    min-height: 270px;
  }

  @media only screen and (min-height: ${HEIGHTS[1]}px) {
    min-height: 350px;
  }

  @media only screen and (min-height: ${HEIGHTS[2]}px) {
    min-height: 350px;
  }

  @media only screen and (min-height: ${HEIGHTS[3]}px) {
    min-height: 460px;
  }

  @media only screen and (min-height: ${HEIGHTS[4]}px) {
    min-height: 630px;
  }
`;

const StyledContentWrapper = styled(ContentWrapper)`
  background-color: white;
  position: relative;
  padding: 0 0 ${PADDING}px !important;

  > section {
    border-bottom: 1px solid ${NEUTRAL.N100};

    &:last-child {
      border-bottom: 0;
    }
  }
`;

const StyledHeaderOuterWrapper = styled(ContentOuterWrapper)`
  position: fixed;
  top: ${HEADER_HEIGHT}px;
  z-index: 1;
`;

const StyledHeaderWrapper = styled(ContentWrapper)`
  background-color: white;
  position: relative;

  @media only screen and (min-height: ${HEIGHTS[0]}px) {
    padding: 10px 25px;
  }

  @media only screen and (min-height: ${HEIGHTS[1]}px) {
    padding: 25px;
  }
`;

const SubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 3px 0;
`;

const Wrapper = styled.section`
  padding: 20px 25px;
  width: 100%;
`;

export {
  Centered,
  DataRows,
  DateRow,
  FlexColumn,
  FlexContainer,
  FlexRow,
  Header,
  InfoText,
  Line,
  MapWrapper,
  MarginWrapper,
  ResultDetails,
  ResultName,
  ResultSegment,
  Row,
  SearchTitle,
  StyledContentOuterWrapper,
  StyledContentWrapper,
  StyledHeaderOuterWrapper,
  StyledHeaderWrapper,
  SubHeader,
  TitleRow,
  Wrapper
};
