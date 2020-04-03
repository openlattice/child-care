import styled from 'styled-components';
import { CardSegment, StyleUtils } from 'lattice-ui-kit';

import { APP_CONTAINER_WIDTH } from '../../core/style/Sizes';

const { media } = StyleUtils;

const MapWrapper = styled.div`
  display: flex;
  min-height: 400px;
  height: 40vh;
  max-width: ${APP_CONTAINER_WIDTH}px;
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
  font-size: 16px;
  margin: 0 10px;
  min-width: 0;
  ${media.phone`
    font-size: 12px;
  `}
`;

const ResultName = styled.div`
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
