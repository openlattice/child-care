// @flow

import React from 'react';

import styled from 'styled-components';
import { faChevronLeft } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Colors } from 'lattice-ui-kit';

import ActiveOnlyFilter from './filters/ActiveOnlyFilter';
import ChildrenFilter from './filters/ChildrenFilter';
import DayAndTimeFilter from './filters/DayAndTimeFilter';
import RadiusFilter from './filters/RadiusFilter';
import TypeOfCareFilter from './filters/TypeOfCareFilter';

import BackButton from '../../../components/controls/BackButton';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { APP_CONTAINER_WIDTH, HEADER_HEIGHT } from '../../../core/style/Sizes';
import { HEADER_LABELS, LABELS } from '../../../utils/constants/labels';
import { PROVIDERS } from '../../../utils/constants/StateConstants';
import type { Translation } from '../../../types';

const { NEUTRAL } = Colors;

const BOTTOM_BAR_HEIGHT = 70;
const PADDING = 25;

const StyledContentOuterWrapper = styled(ContentOuterWrapper)`
  background-color: ${NEUTRAL.N50};
  bottom: 0;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  position: fixed;
  top: ${HEADER_HEIGHT}px;
  z-index: 15;
`;

const StyledContentWrapper = styled(ContentWrapper)`
  background-color: white;
  height: calc(100vh - ${BOTTOM_BAR_HEIGHT}px - ${HEADER_HEIGHT}px);
  max-height: calc(100vh - ${BOTTOM_BAR_HEIGHT}px - ${HEADER_HEIGHT}px);
  overflow-y: scroll;
  position: relative;
`;

const EditFilterHeader = styled.div`
  color: ${NEUTRAL.N700};
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  line-height: 27px;
  margin: 20px 0;
`;

const ApplyButtonWrapper = styled.div`
  background-color: white;
  bottom: 40px;
  height: 70px;
  padding: 10px ${PADDING}px 30px ${PADDING}px;
  position: fixed;
  width: min(100vw, ${APP_CONTAINER_WIDTH}px);
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

type Props = {
  field :string;
  onCancel :() => void;
  onSave :(nextObject :Object) => void;
  getText :(translation :Translation) => string;
  value :string;
};

type State = {
  value :string;
  isValid :boolean;
}
export default class EditFilter extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      value: props.value,
      isValid: false
    };
  }

  getContent = () => {
    const { field, getText } = this.props;
    const { value } = this.state;

    const Component = FILTER_COMPONENTS[field];

    if (!Component) {
      return null;
    }

    return (
      <Component
          value={value}
          getText={getText}
          onChange={(newValue) => this.setState({ value: newValue })}
          setIsValid={(isValid) => this.setState({ isValid })} />
    );
  }

  render() {
    const {
      field,
      getText,
      onCancel,
      onSave
    } = this.props;
    const { value, isValid } = this.state;

    return (
      <StyledContentOuterWrapper>
        <StyledContentWrapper padding={`${PADDING}px`}>
          <BackButton onClick={onCancel}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <span>{getText(LABELS.SEARCH_PARAMETERS)}</span>
          </BackButton>

          <EditFilterHeader>{getText(HEADER_LABELS[field])}</EditFilterHeader>

          {this.getContent()}

        </StyledContentWrapper>
        <ApplyButtonWrapper>
          <Button color="info" disabled={!isValid} onClick={() => onSave({ field, value })}>
            {getText(LABELS.SAVE)}
          </Button>
        </ApplyButtonWrapper>
      </StyledContentOuterWrapper>
    );
  }
}
