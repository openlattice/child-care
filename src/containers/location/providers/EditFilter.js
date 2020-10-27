// @flow

import React from 'react';
import styled from 'styled-components';
import { faChevronLeft } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Colors } from 'lattice-ui-kit';
import { APP_CONTAINER_WIDTH, HEADER_HEIGHT } from '../../../core/style/Sizes';

import ActiveOnlyFilter from './filters/ActiveOnlyFilter';
import ChildrenFilter from './filters/ChildrenFilter';
import DayAndTimeFilter from './filters/DayAndTimeFilter';
import RadiusFilter from './filters/RadiusFilter';
import TypeOfCareFilter from './filters/TypeOfCareFilter';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { PROVIDERS } from '../../../utils/constants/StateConstants';
import { LABELS, HEADER_LABELS } from '../../../utils/constants/Labels';

const { NEUTRAL, PURPLE } = Colors;

const BOTTOM_BAR_HEIGHT = 70;
const PADDING = 25;

const StyledContentOuterWrapper = styled(ContentOuterWrapper)`
  position: fixed;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  top: ${HEADER_HEIGHT}px;
  bottom: 0;
  z-index: 15;
  background-color: ${NEUTRAL.N50};
`;

const StyledContentWrapper = styled(ContentWrapper)`
  background-color: white;
  position: relative;
  background-color: white;
  max-height: fit-content;
  position: relative;
  height: calc(100vh - ${BOTTOM_BAR_HEIGHT}px - ${HEADER_HEIGHT}px);
  max-height: calc(100vh - ${BOTTOM_BAR_HEIGHT}px - ${HEADER_HEIGHT}px);
  overflow-y: scroll;
`;

const BackButton = styled.div`
  display: flex;
  flex-direciton: row;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: ${PURPLE.P300};
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }

  span {
    margin-left: 15px;
  }

  &:hover {
    cursor: pointer
  }
`;

const EditFilterHeader = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 22px;
  line-height: 27px;
  margin: 20px 0;

  color: ${NEUTRAL.N700};
`;

const ApplyButtonWrapper = styled.div`
   position: fixed;
   padding: 10px ${PADDING}px 30px ${PADDING}px;
   width: min(100vw, ${APP_CONTAINER_WIDTH}px);
   bottom: 0;
   height: 70px;
   background-color: white;
   z-index: 16;

   button {
     width: 100%;
   }
`;

const FILTER_COMPONENTS = {
  [PROVIDERS.ACTIVE_ONLY]: ActiveOnlyFilter,
  [PROVIDERS.CHILDREN]: ChildrenFilter,
  [PROVIDERS.DAYS]: DayAndTimeFilter,
  [PROVIDERS.RADIUS]: RadiusFilter,
  [PROVIDERS.TYPE_OF_CARE]: TypeOfCareFilter,
};

export default class EditFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      isValid: false
    };
  }


  getContent = () => {
    const { field, renderText } = this.props;
    const { value } = this.state;

    const Component = FILTER_COMPONENTS[field];

    if (!Component) {
      return null;
    }

    return (
      <Component
          value={value}
          renderText={renderText}
          onChange={(newValue) => this.setState({ value: newValue })}
          setIsValid={(isValid) => this.setState({ isValid })} />
    );
  }

  render() {
    const {
      field,
      renderText,
      onCancel,
      onSave
    } = this.props;
    const { value, isValid } = this.state;

    return (
      <StyledContentOuterWrapper>
        <StyledContentWrapper padding={`${PADDING}px`}>
          <BackButton onClick={onCancel}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <span>{renderText(LABELS.SEARCH_PARAMETERS)}</span>
          </BackButton>

          <EditFilterHeader>{renderText(HEADER_LABELS[field])}</EditFilterHeader>

          {this.getContent()}

        </StyledContentWrapper>
        <ApplyButtonWrapper>
          <Button color="primary" disabled={!isValid} onClick={() => onSave({ field, value })}>
            {renderText(LABELS.SAVE)}
          </Button>
        </ApplyButtonWrapper>
      </StyledContentOuterWrapper>
    );
  }
}
