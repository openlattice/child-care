// @flow

import React, {
  useCallback,
  useEffect,
  useReducer,
  useState
} from 'react';
import { bindActionCreators } from 'redux';

import isPlainObject from 'lodash/isPlainObject';
import styled, { css } from 'styled-components';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Card,
  Colors,
  IconButton,
  PaginationToolbar,
  SearchResults,
  Select,
} from 'lattice-ui-kit';
import { connect, useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import EditFilter from './EditFilter';
import { FILTER_HEADERS, STAY_AWAY_STORE_PATH } from './constants';
import { PROVIDERS } from '../../../utils/constants/StateConstants';
import { APP_CONTAINER_WIDTH } from '../../../core/style/Sizes';

import FindingLocationSplash from '../FindingLocationSplash';
import BasicButton from '../../../components/buttons/BasicButton';
import InfoButton from '../../../components/buttons/InfoButton';
import { usePosition, useTimeout } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { isNonEmptyString } from '../../../utils/LangUtils';
import { FlexRow, MapWrapper, ResultSegment } from '../../styled';
import * as LocationsActions from './LocationsActions';

const MAX_HITS = 20;
const INITIAL_STATE = {
  page: 0,
  start: 0,
  selectedOption: undefined
};

const StyledContentWrapper = styled(ContentWrapper)`
  background-color: white;
  position: relative;
`;

const MiniStyledContentWrapper = styled(StyledContentWrapper)`
  background-color: white;
  max-height: fit-content;
  position: relative;
`;

const BackButton = styled.div`
  display: flex;
  flex-direciton: row;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: ${Colors.PURPLES[1]};
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

  color: #555E6F;
`;

const FilterRow = styled.div`
  color: #8E929B;
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
      color: #555E6F;
      margin-right: 15px;
    }
  }

  &:hover {
    cursor: pointer
  }
`;

const Line = styled.div`
  height: 1px;
  background-color: #E6E6EB;
  margin: 10px -25px 0 -25px;
`;

const EditFilterHeader = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 22px;
  line-height: 27px;
  margin: 20px 0;

  color: #555E6F;
`;

const fixedBottomButtonStyle = css`
  position: fixed;
  bottom: 30px;
  border-radius: 3px;
  border: none;
  width: calc(min(100vw, ${APP_CONTAINER_WIDTH}px) - 50px);
  font-family: Inter;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
`;

const ApplyButton = styled(InfoButton)`
  ${fixedBottomButtonStyle}
`;

const SaveFilterButton = styled(BasicButton)`
  ${fixedBottomButtonStyle}
`;

class EditFiltersContainer extends React.Component {

  constructor(props) {
    super(props);

    const { providerState } = props;

    const getProviderValue = (field) => ({ [field]: providerState.get(field) });

    this.state = {
      filterPage: null,
      ...getProviderValue(PROVIDERS.TYPE_OF_CARE),
      ...getProviderValue(PROVIDERS.ZIP),
      ...getProviderValue(PROVIDERS.RADIUS),
      ...getProviderValue(PROVIDERS.CHILDREN),
      ...getProviderValue(PROVIDERS.DAYS),
    };
  }

  renderEditFilter = () => {
    const { actions } = this.props;
    const { filterPage } = this.state;

    const onCancel = () => this.setState({ filterPage: null });

    const onSave = ({ field, value }) => {
      this.setState({ [field]: value });
      onCancel();
    };

    return (
      <EditFilter
          field={filterPage}
          value={this.state[filterPage]}
          onCancel={onCancel}
          onSave={onSave} />
    );
  }

  render() {

    const { providerState, actions } = this.props;
    const {
      filterPage,
      [PROVIDERS.TYPE_OF_CARE]: typeOfCare,
      [PROVIDERS.ZIP]: zip,
      [PROVIDERS.RADIUS]: radius,
      [PROVIDERS.CHILDREN]: children,
      [PROVIDERS.DAYS]: days,
    } = this.state;

    if (filterPage) {
      return this.renderEditFilter();
    }

    const backToMap = () => actions.setValue({ field: PROVIDERS.IS_EDITING_FILTERS, value: false });

    const editFilter = (value) => this.setState({ filterPage: value });

    const getFacilityTypeValue = () => {
      const { size } = typeOfCare;
      if (!size) {
        return 'Any';
      }

      return `${size} type${size === 1 ? '' : 's'} selected`;
    };

    const getListValue = (list) => list.join(', ') || 'Any';

    const renderRow = (field, value, label) => (
      <FilterRow onClick={() => editFilter(field)}>
        <div>{label}</div>
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
      console.log('execute search!');
      backToMap();
    };

    return (
      <ContentOuterWrapper>
        <StyledContentWrapper padding="25px">
          <BackButton onClick={backToMap}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <span>Back to search results</span>
          </BackButton>
          <HeaderLabel>Provider Search</HeaderLabel>
          {renderRow(PROVIDERS.TYPE_OF_CARE, getFacilityTypeValue(), 'Type of Care')}
          {renderRow(PROVIDERS.ZIP, zip || 'Any', 'ZIP Code')}
          {renderRow(PROVIDERS.RADIUS, `${radius} mile${radius === 1 ? '' : 's'}`, 'Search Radius')}
          <Line />
          <HeaderLabel>Care Profile</HeaderLabel>
          {renderRow(PROVIDERS.CHILDREN, numberOfChildren, 'Number of Children')}
          {renderRow(PROVIDERS.DAYS, getListValue(days.keySeq()), 'Days Needed')}
          <ApplyButton onClick={onExecuteSearch}>Apply</ApplyButton>
        </StyledContentWrapper>
      </ContentOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    providerState: state.getIn([...STAY_AWAY_STORE_PATH], Map())
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
