// @flow

import React from 'react';
import { bindActionCreators } from 'redux';

import { faChevronLeft, faChevronRight } from '@fortawesome/pro-light-svg-icons';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map, fromJS } from 'immutable';
import { Button, Colors } from 'lattice-ui-kit';
import { RequestStates } from 'redux-reqseq';
import { connect } from 'react-redux';

import EditFilter from './EditFilter';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { APP_CONTAINER_WIDTH, HEADER_HEIGHT } from '../../../core/style/Sizes';
import { LABELS } from '../../../utils/constants/Labels';

import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { getRenderTextFn } from '../../../utils/AppUtils';
import * as LocationsActions from '../LocationsActions';

const { NEUTRAL, PURPLE } = Colors;

const BOTTOM_BAR_HEIGHT = 70;
const PADDING = 25;

const StyledOuterWrapper = styled(ContentOuterWrapper)`
  position: fixed;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  top: ${HEADER_HEIGHT}px;
  bottom: 0;
  z-index: 15;
`;

const StyledContentWrapper = styled(ContentWrapper)`
  background-color: white;
  position: relative;
  height: calc(100vh - ${BOTTOM_BAR_HEIGHT}px - ${HEADER_HEIGHT}px);
  overflow-y: scroll;
  padding-bottom: 5px;
`;

const ScrollContainer = styled.div`
  overflow: auto;
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

const HeaderLabel = styled.div`
  padding-top: 20px;
  padding-bottom: 10px;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;

  color: ${NEUTRAL.N700};
`;

const FilterRow = styled.div`
  color: ${NEUTRAL.N500};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  div {

  }

  article {
    display: flex;
    flex-direction: row;
    align-items: center;

    span {
      font-weight: 600;
      color: ${NEUTRAL.N700};
      margin-right: 15px;
    }
  }

  &:hover {
    cursor: pointer
  }
`;

const Line = styled.div`
  height: 1px;
  background-color: ${NEUTRAL.N100};
  margin: 10px -${PADDING}px 0 -${PADDING}px;
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

class EditFiltersContainer extends React.Component {

  constructor(props) {
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
    const { renderText } = props;
    const { filterPage } = state;

    const onCancel = () => this.setState({ filterPage: null });

    const onSave = ({ field, value }) => {
      this.setState({ [field]: value });
      onCancel();
    };

    return (
      <EditFilter
          renderText={renderText}
          field={filterPage}
          value={state[filterPage]}
          onCancel={onCancel}
          onSave={onSave} />
    );
  }

  render() {
    const { state } = this;
    const { actions, hasSearched, renderText } = this.props;
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

    const any = renderText(LABELS.ANY);

    const getFacilityTypeValue = () => {
      const { size } = typeOfCare;
      if (!size) {
        return any;
      }

      if (size === 1) {
        return typeOfCare.get(0);
      }

      return `${size} ${renderText(LABELS.TYPES_SELECTED)}`;
    };

    const renderRow = (field, value, label) => (
      <FilterRow onClick={() => editFilter(field)}>
        <div>{renderText(label)}</div>
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
              <span>{renderText(LABELS.BACK_TO_SEARCH_RESULTS)}</span>
            </BackButton>

            <HeaderLabel>{renderText(LABELS.BASIC_SEARCH)}</HeaderLabel>
            {renderRow(PROVIDERS.TYPE_OF_CARE, getFacilityTypeValue(), LABELS.TYPE_OF_CARE)}
            {
              renderRow(
                PROVIDERS.RADIUS,
                `${radius} ${renderText(LABELS.MILE)}${radius === 1 ? '' : 's'}`,
                LABELS.SEARCH_RADIUS
              )
            }
            <Line />
            <HeaderLabel>{renderText(LABELS.ADVANCED_SEARCH)}</HeaderLabel>
            {renderRow(PROVIDERS.CHILDREN, numberOfChildren, LABELS.NUMBER_OF_CHILDREN)}
            {
              renderRow(
                PROVIDERS.ACTIVE_ONLY,
                renderText(activeOnly ? LABELS.NO : LABELS.YES),
                LABELS.SHOW_INACTIVE_FACILITIES
              )
            }

          </StyledContentWrapper>
        </ScrollContainer>
        <ApplyButtonWrapper>
          <Button color="primary" onClick={onExecuteSearch}>{renderText(LABELS.APPLY)}</Button>
        </ApplyButtonWrapper>
      </StyledOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {
  const providerState = state.get(STATE.LOCATIONS, Map());

  return {
    providerState,
    renderText: getRenderTextFn(state),
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
