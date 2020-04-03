// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { Constants } from 'lattice';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import {
  Button,
  Card,
  CardHeader,
  CardSegment,
  CardStack,
  Colors,
  SearchResults
} from 'lattice-ui-kit';
import { faEdit, faPortrait, faUser } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';
import type { Match } from 'react-router';

import CrisisCountCard from './CrisisCountCard';
import EditProfileForm from './EditProfileForm';
import ProfileBanner from './ProfileBanner';
import ProfileDetails from './ProfileDetails';
import ProfileResult from './ProfileResult';
import LinkButton from '../../components/buttons/LinkButton';
import { labelMapReport } from './constants';
import { ContentWrapper, ContentOuterWrapper } from '../../components/layout';
import {
  clearProfile,
  getPersonData,
  getPhysicalAppearance,
  getProfileReports,
  updateProfileAbout
} from './ProfileActions';
import { DATE_TIME_OCCURRED_FQN } from '../../edm/DataModelFqns';
import {
  CRISIS_PATH,
  PROFILE_ID_PARAM,
  REPORT_ID_PATH,
  REPORT_VIEW_PATH,
} from '../../core/router/Routes';
import { goToPath } from '../../core/router/RoutingActions';
import { reduceRequestStates } from '../../utils/StateUtils';
import type { RoutingAction } from '../../core/router/RoutingActions';

const { OPENLATTICE_ID_FQN } = Constants;
const { NEUTRALS } = Colors;

// Fixed placeholder size
const PlaceholderPortrait = styled(FontAwesomeIcon)`
  height: 265px !important;
  width: 200px !important;
`;

const H1 = styled.h1`
  display: flex;
  flex: 1 0 auto;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  align-items: center;
`;

const UserIcon = styled(FontAwesomeIcon).attrs({
  icon: faUser
})`
  margin-right: 10px;
`;

const EditButton = styled(Button)`
  margin-left: auto;
  padding: 7px;
`;

const Aside = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 20px;
`;

type Props = {
  actions :{
    clearProfile :() => { type :string };
    getPersonData :RequestSequence;
    getPhysicalAppearance :RequestSequence;
    getProfileReports :RequestSequence;
    goToPath :(path :string) => RoutingAction;
    updateProfileAbout :RequestSequence;
  };
  fetchAppearanceState :RequestState;
  fetchPersonState :RequestState;
  fetchReportsState :RequestState;
  updateAboutState :RequestState;
  match :Match;
  physicalAppearance :Map;
  reports :List<Map>;
  selectedPerson :Map;
};

type State = {
  showEdit :boolean;
};

class ProfileContainer extends Component<Props, State> {

  state = {
    showEdit: false
  };

  componentDidMount() {
    const {
      actions,
      match,
      physicalAppearance,
      selectedPerson
    } = this.props;
    const personEKID = selectedPerson.get([OPENLATTICE_ID_FQN, 0]) || match.params[PROFILE_ID_PARAM];
    if (selectedPerson.isEmpty()) {
      actions.getPersonData(personEKID);
    }
    if (physicalAppearance.isEmpty()) {
      actions.getPhysicalAppearance(personEKID);
    }
    actions.getProfileReports(personEKID);
  }

  componentDidUpdate(prevProps :Props) {
    const { updateAboutState } = this.props;
    const { updateAboutState: prevUpdateAboutState } = prevProps;
    if (
      updateAboutState === RequestStates.SUCCESS
      && prevUpdateAboutState === RequestStates.PENDING) {
      this.handleHideEdit();
    }
  }

  componentWillUnmount() {
    const { actions } = this.props;
    actions.clearProfile();
  }

  countCrisisCalls = () => {
    const { reports } = this.props;
    let count = 0;
    reports.forEach((report :Map) => {
      const occurred = report.getIn([DATE_TIME_OCCURRED_FQN, 0], '');
      const dtOccurred = DateTime.fromISO(occurred);
      if (dtOccurred.isValid) {
        const durationInYears = dtOccurred
          .until(DateTime.local()).toDuration(['years'])
          .toObject()
          .years;

        if (durationInYears <= 1) count += 1;
      }
    });

    return count;
  }

  handleResultClick = (result :Map) => {
    const { actions } = this.props;
    const reportEKID = result.getIn([OPENLATTICE_ID_FQN, 0]);
    actions.goToPath(REPORT_VIEW_PATH.replace(REPORT_ID_PATH, reportEKID));
  }

  handleShowEdit = () => {
    this.setState({
      showEdit: true
    });
  }

  handleHideEdit = () => {
    this.setState({
      showEdit: false
    });
  }

  handleSubmit = (payload :Object) => {
    const { actions } = this.props;
    actions.updateProfileAbout(payload);
  }

  renderProfileDetails = () => {
    const {
      fetchAppearanceState,
      fetchPersonState,
      physicalAppearance,
      selectedPerson,
      updateAboutState,
    } = this.props;
    const { showEdit } = this.state;

    const isLoading = (
      fetchPersonState === RequestStates.PENDING
      || fetchAppearanceState === RequestStates.PENDING
    );

    const isUpdating = updateAboutState === RequestStates.PENDING;

    let content = (
      <ProfileDetails
          isLoading={isLoading}
          selectedPerson={selectedPerson}
          physicalAppearance={physicalAppearance} />
    );

    if (showEdit) {
      content = (
        <EditProfileForm
            selectedPerson={selectedPerson}
            physicalAppearance={physicalAppearance}
            onDiscard={this.handleHideEdit}
            onSubmit={this.handleSubmit}
            isLoading={isUpdating} />
      );
    }

    return (
      <Card>
        <CardHeader mode="primary" padding="sm">
          <H1>
            <UserIcon fixedWidth />
            About
            <EditButton mode="primary" onClick={this.handleShowEdit}>
              <FontAwesomeIcon icon={faEdit} fixedWidth />
            </EditButton>
          </H1>
        </CardHeader>
        { content }
      </Card>
    );
  }

  render() {
    const {
      fetchReportsState,
      reports,
      selectedPerson
    } = this.props;
    const count = this.countCrisisCalls();
    return (
      <ContentOuterWrapper>
        <ProfileBanner selectedPerson={selectedPerson} />
        <ContentWrapper>
          <ProfileGrid>
            <Aside>
              <Card>
                <CardSegment padding="sm">
                  <PlaceholderPortrait icon={faPortrait} color={NEUTRALS[5]} />
                </CardSegment>
                <CardSegment vertical padding="sm">
                  <LinkButton mode="primary" to={`${CRISIS_PATH}/1`} state={selectedPerson}>
                    New Crisis Report
                  </LinkButton>
                </CardSegment>
              </Card>
            </Aside>
            <div>
              <CardStack>
                <CrisisCountCard
                    count={count}
                    isLoading={fetchReportsState === RequestStates.PENDING} />
                { this.renderProfileDetails() }
                <SearchResults
                    hasSearched={fetchReportsState !== RequestStates.STANDBY}
                    isLoading={fetchReportsState === RequestStates.PENDING}
                    onResultClick={this.handleResultClick}
                    results={reports}
                    resultLabels={labelMapReport}
                    resultComponent={ProfileResult} />
              </CardStack>
            </div>
          </ProfileGrid>
        </ContentWrapper>
      </ContentOuterWrapper>
    );
  }
}

const mapStateToProps = (state :Map) => {
  const updateAboutStates = [
    state.getIn(['profile', 'person', 'updateState']),
    state.getIn(['profile', 'physicalAppearance', 'updateState']),
  ];

  return {
    fetchAppearanceState: state.getIn(['profile', 'physicalAppearance', 'fetchState'], RequestStates.STANDBY),
    fetchPersonState: state.getIn(['profile', 'person', 'fetchState'], RequestStates.STANDBY),
    fetchReportsState: state.getIn(['profile', 'reports', 'fetchState'], RequestStates.STANDBY),
    physicalAppearance: state.getIn(['profile', 'physicalAppearance', 'data'], Map()),
    reports: state.getIn(['profile', 'reports', 'data'], List()),
    selectedPerson: state.getIn(['profile', 'person', 'data'], Map()),
    updateAboutState: reduceRequestStates(updateAboutStates),
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    clearProfile,
    getPersonData,
    getPhysicalAppearance,
    getProfileReports,
    goToPath,
    updateProfileAbout,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
