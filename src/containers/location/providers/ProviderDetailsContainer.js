// @flow

import React, {
  useCallback,
  useEffect,
  useReducer,
  useState
} from 'react';
import { bindActionCreators } from 'redux';

import styled, { css } from 'styled-components';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map, fromJS } from 'immutable';
import { Colors } from 'lattice-ui-kit';
import { connect } from 'react-redux';

import EditFilter from './EditFilter';
import { STAY_AWAY_STORE_PATH } from './constants';
import { PROVIDERS } from '../../../utils/constants/StateConstants';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { DAYS_OF_WEEK } from '../../../utils/DataConstants';
import { APP_CONTAINER_WIDTH } from '../../../core/style/Sizes';

import FindingLocationSplash from '../FindingLocationSplash';
import BasicButton from '../../../components/buttons/BasicButton';
import InfoButton from '../../../components/buttons/InfoButton';
import { usePosition, useTimeout } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { isNonEmptyString } from '../../../utils/LangUtils';
import { getValue, getValues, getDistanceBetweenCoords } from '../../../utils/DataUtils';
import { getCoordinates } from '../../map/MapUtils';
import { FlexRow, MapWrapper, ResultSegment } from '../../styled';
import * as LocationsActions from './LocationsActions';

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

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-family: Inter;
  font-style: normal;
  color: #555E6F;
  padding: 15px 0;

  div {
    font-weight: 600;
    font-size: 22px;
    line-height: 27px;
  }


  span {
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
  }
`;

const SubHeader = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  margin: 3px 0;

  color: #555E6F;
`;

class ProviderDetailsContainer extends React.Component {

  getDistance = () => {
    const { coordinates, provider } = this.props;

    const [lon, lat] = getCoordinates(provider);
    const miles = getDistanceBetweenCoords(coordinates, [lat, lon]);

    return Math.round(miles * 10) / 10;
  }

  render() {

    const { actions, provider } = this.props;

    if (!provider) {
      return null;
    }

    const name = getValue(provider, PROPERTY_TYPES.FACILITY_NAME);
    const type = getValues(provider, PROPERTY_TYPES.FACILITY_TYPE);
    const status = getValues(provider, PROPERTY_TYPES.STATUS);
    const paymentOptions = getValues(provider, PROPERTY_TYPES.PAYMENT_OPTIONS);
    const url = getValue(provider, PROPERTY_TYPES.URL);

    const street = getValue(provider, PROPERTY_TYPES.ADDRESS);
    const city = getValue(provider, PROPERTY_TYPES.CITY);
    const zip = getValue(provider, PROPERTY_TYPES.ZIP);

    const isPopUp = getValue(provider, PROPERTY_TYPES.IS_POP_UP);

    const capacities = [];
    if (getValue(provider, PROPERTY_TYPES.CAPACITY_UNDER_2)) {
      capacities.push('0 yr - 1 yr');
    }
    if (getValue(provider, PROPERTY_TYPES.CAPACITY_2_to_5)) {
      capacities.push('2 yr - 5 yr');
    }
    if (getValue(provider, PROPERTY_TYPES.CAPACITY_OVER_5)) {
      capacities.push('6 yr and up');
    }

    const address = [street, city, zip].filter(v => v).join(', ');

    const distance = this.getDistance();

    return (
      <ContentOuterWrapper>
        <StyledContentWrapper padding="25px">
          <BackButton onClick={() => actions.selectProvider(false)}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <span>Search Results</span>
          </BackButton>
          <Header>
            <div>{name}</div>
            <span>{`${distance} mi`}</span>
          </Header>

          <SubHeader>{`${city}, CA`}</SubHeader>
          <SubHeader>{type}</SubHeader>
          <SubHeader>{capacities.join(', ') || 'Unknown age limitations'}</SubHeader>

        </StyledContentWrapper>
      </ContentOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {
  const providerState = state.getIn([...STAY_AWAY_STORE_PATH], Map());

  const lat = providerState.getIn(['selectedOption', 'lat']);
  const lon = providerState.getIn(['selectedOption', 'lon']);

  console.log([lat, lon])

  return {
    providerState: state.getIn([...STAY_AWAY_STORE_PATH], Map()),
    provider: providerState.get(PROVIDERS.SELECTED_PROVIDER),
    coordinates: [lat, lon]
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

export default connect<*, *, *, *, *, *>(mapStateToProps, mapDispatchToProps)(ProviderDetailsContainer);
