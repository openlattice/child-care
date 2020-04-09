import styled from 'styled-components';
import { CardSegment, StyleUtils } from 'lattice-ui-kit';

import { APP_CONTAINER_WIDTH, HEIGHTS } from '../../core/style/Sizes';

const { media } = StyleUtils;

const MapWrapper = styled.div`
  display: flex;
  height: 50vh;
  max-width: ${APP_CONTAINER_WIDTH}px;

  @media only screen and (min-height: ${HEIGHTS[0]}px) {
    min-height: 200px;
  }

  @media only screen and (min-height: ${HEIGHTS[1]}px) {
    min-height: 400px;
  }
`;

const SearchTitle = styled.h1`
  display: flex;
  font-size: 18px;
  font-weight: normal;
  margin: 0;
`;

const ResultSegment = styled(CardSegment)`
  ${media.phone`
    padding: 10px 15px;
  `}
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
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: #555E6F;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 5px;
  ${media.phone`
    font-size: 16px;
  `}
`;

const FlexRow = styled.div`
  display: flex;
  flex: 1;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export {
  FlexColumn,
  FlexRow,
  MapWrapper,
  ResultDetails,
  ResultName,
  ResultSegment,
  SearchTitle,
};
