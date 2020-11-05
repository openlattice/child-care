// @flow

import React from 'react';

import styled from 'styled-components';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map, fromJS } from 'immutable';
import { Button, Colors } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

import EditFilter from './EditFilter';

import * as LocationsActions from '../LocationsActions';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { APP_CONTAINER_WIDTH, HEADER_HEIGHT } from '../../../core/style/Sizes';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { LABELS } from '../../../utils/constants/Labels';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import type { Translation } from '../../../types';

const { NEUTRAL, PURPLE } = Colors;

const BOTTOM_BAR_HEIGHT = 70;
const PADDING = 25;

const StyledOuterWrapper = styled(ContentOuterWrapper)`
  bottom: 0;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  position: fixed;
  top: ${HEADER_HEIGHT}px;
  z-index: 15;
`;

const StyledContentWrapper = styled(ContentWrapper)`
  background-color: white;
  height: calc(100vh - ${BOTTOM_BAR_HEIGHT}px - ${HEADER_HEIGHT}px);
  overflow-y: scroll;
  padding-bottom: 5px;
  position: relative;
`;

const ScrollContainer = styled.div`
  overflow: auto;
`;

const BackButton = styled.div`
  align-items: center;
  color: ${PURPLE.P300};
  display: flex;
  flex-direction: row;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }

  span {
    margin-left: 15px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const HeaderLabel = styled.div`
  color: ${NEUTRAL.N700};
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 17px;
  padding-bottom: 10px;
  padding-top: 20px;
`;

const FilterRow = styled.div`
  align-items: center;
  color: ${NEUTRAL.N500};
  display: flex;
  flex-direction: row;
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  justify-content: space-between;
  line-height: 17px;
  padding: 10px 0;

  article {
    align-items: center;
    display: flex;
    flex-direction: row;

    span {
      color: ${NEUTRAL.N700};
      font-weight: 600;
      margin-right: 15px;
    }
  }

  &:hover {
    cursor: pointer;
  }
`;

const Line = styled.div`
  background-color: ${NEUTRAL.N100};
  height: 1px;
  margin: 10px -${PADDING}px 0 -${PADDING}px;
`;

const ApplyButtonWrapper = styled.div`
  background-color: white;
  bottom: 0;
  height: 70px;
  padding: 10px ${PADDING}px 30px ${PADDING}px;
  position: fixed;
  width: min(100vw, ${APP_CONTAINER_WIDTH}px);
  z-index: 16;

  button {
    width: 100%;
  }
`;

type Props = {
  actions :{
    searchLocations :RequestSequence;
    setValue :({ field :string, value :any }) => void;
  };
  hasSearched :boolean;
  providerState :Map;
  getText :(translation :Translation) => string;
}

type State = {
  filterPage :string | null;
}

class EditFiltersContainer extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);

    const { providerState } = props;

    const getProviderValue = (field) => ({ [field]: providerState.get(field) });

    this.state = {
      filterPage: null,
      ...getProviderValue(PROVIDERS.ACTIVE_ONLY),
      ...getProviderValue(PROVIDERS.TYPE_OF_CARE),
      ...getProviderValue(PROVIDERS.RADIUS),
      ...getProviderValue(PROVIDERS.CHILDREN),
      ...getProviderValue(PROVIDERS.DAYS),
    };
  }

  renderEditFilter = () => {
    const { props, state } = this;
    const { getText } = props;
    const { filterPage } = state;

    const onCancel = () => this.setState({ filterPage: null });

    const onSave = ({ field, value }) => {
      this.setState({ [field]: value });
      onCancel();
    };

    return (
      <EditFilter
          getText={getText}
          field={filterPage}
          value={state[filterPage]}
          onCancel={onCancel}
          onSave={onSave} />
    );
  }

  render() {
    const { state } = this;
    const { actions, hasSearched, getText } = this.props;
    const {
      filterPage,
      [PROVIDERS.ACTIVE_ONLY]: activeOnly,
      [PROVIDERS.TYPE_OF_CARE]: typeOfCare,
      [PROVIDERS.RADIUS]: radius,
      [PROVIDERS.CHILDREN]: children
    } = this.state;

    if (filterPage) {
      return this.renderEditFilter();
    }

    const backToMap = () => actions.setValue({ field: PROVIDERS.IS_EDITING_FILTERS, value: false });

    const editFilter = (value) => this.setState({ filterPage: value });

    const any = getText(LABELS.ANY);

    const getFacilityTypeValue = () => {
      const { size } = typeOfCare;
      if (!size) {
        return any;
      }

      if (size === 1) {
        return typeOfCare.get(0);
      }

      return `${size} ${getText(LABELS.TYPES_SELECTED)}`;
    };

    const renderRow = (field, value, label) => (
      <FilterRow onClick={() => editFilter(field)}>
        <div>{getText(label)}</div>
        <article>
          <span>{value}</span>
          <FontAwesomeIcon icon={faChevronRight} />
        </article>
      </FilterRow>
    );

    let numberOfChildren = 0;
    children.valueSeq().forEach((n) => {
      numberOfChildren += n;
    });

    const onExecuteSearch = () => {

      if (hasSearched) {

        const searchInputs = fromJS({
          [PROVIDERS.ACTIVE_ONLY]: state[PROVIDERS.ACTIVE_ONLY],
          [PROVIDERS.TYPE_OF_CARE]: state[PROVIDERS.TYPE_OF_CARE],
          [PROVIDERS.RADIUS]: state[PROVIDERS.RADIUS],
          [PROVIDERS.CHILDREN]: state[PROVIDERS.CHILDREN],
          [PROVIDERS.DAYS]: state[PROVIDERS.DAYS]
        });

        actions.searchLocations({
          searchInputs,
          start: 0,
          maxHits: 20
        });
      }

      backToMap();
    };

    return (
      <StyledOuterWrapper>

        <ScrollContainer>
          <StyledContentWrapper padding={`${PADDING}px`}>
            <BackButton onClick={backToMap}>
              <FontAwesomeIcon icon={faChevronLeft} />
              <span>{getText(LABELS.BACK_TO_SEARCH_RESULTS)}</span>
            </BackButton>

            <HeaderLabel>{getText(LABELS.BASIC_SEARCH)}</HeaderLabel>
            {renderRow(PROVIDERS.TYPE_OF_CARE, getFacilityTypeValue(), LABELS.TYPE_OF_CARE)}
            {
              renderRow(
                PROVIDERS.RADIUS,
                `${radius} ${getText(LABELS.MILE)}${radius === 1 ? '' : 's'}`,
                LABELS.SEARCH_RADIUS
              )
            }
            <Line />
            <HeaderLabel>{getText(LABELS.ADVANCED_SEARCH)}</HeaderLabel>
            {renderRow(PROVIDERS.CHILDREN, numberOfChildren, LABELS.NUMBER_OF_CHILDREN)}
            {
              renderRow(
                PROVIDERS.ACTIVE_ONLY,
                getText(activeOnly ? LABELS.NO : LABELS.YES),
                LABELS.SHOW_INACTIVE_FACILITIES
              )
            }

          </StyledContentWrapper>
        </ScrollContainer>
        <ApplyButtonWrapper>
          <Button color="primary" onClick={onExecuteSearch}>{getText(LABELS.APPLY)}</Button>
        </ApplyButtonWrapper>
      </StyledOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {
  const providerState = state.get(STATE.LOCATIONS, Map());

  return {
    providerState,
    getText: getTextFnFromState(state),
    hasSearched: providerState.get('fetchState') !== RequestStates.STANDBY
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions :{ [string] :Function } = {};

  Object.keys(LocationsActions).forEach((action :string) => {
    actions[action] = LocationsActions[action];
  });

  return {
    actions: {
      ...bindActionCreators(actions, dispatch)
    }
  };
}

export default connect<*, *, *, *, *, *>(mapStateToProps, mapDispatchToProps)(EditFiltersContainer);
