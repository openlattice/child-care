// @flow
import React, { useEffect } from 'react';

import styled from 'styled-components';
import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  Card,
  CardSegment,
  CardStack,
  Stepper,
} from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import type { Match } from 'react-router';
import type { Dispatch } from 'redux';
import type { RequestSequence } from 'redux-reqseq';

import AboutForm from './about/AboutForm';
import BasicInformationContainer from './basicinformation/BasicInformationContainer';
import ContactsForm from './contacts/ContactsForm';
import NavStep from './NavStep';
import OfficerSafetyContainer from './officersafety/OfficerSafetyContainer';
import ResponsePlanForm from './responseplan/ResponsePlanForm';
import { getBasics } from './basicinformation/actions/BasicInformationActions';

import Accordion from '../../../components/accordion';
import IssueDetails from '../../issues/IssueDetails';
import LinkButton from '../../../components/buttons/LinkButton';
import PrivateRoute from '../../../components/route/PrivateRoute';
import ProfileBanner from '../ProfileBanner';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import {
  ABOUT_PATH,
  BASIC_PATH,
  CONTACTS_PATH,
  OFFICER_SAFETY_PATH,
  PROFILE_ID_PARAM,
  PROFILE_VIEW_PATH,
  RESPONSE_PLAN_PATH,
} from '../../../core/router/Routes';
import { getAuthorization } from '../../../core/sagas/authorize/AuthorizeActions';
import { TITLE_FQN } from '../../../edm/DataModelFqns';

const StickyCard = styled(Card)`
  position: sticky;
  top: 66px;
  z-index: 200;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1), 0 -10px 0 0 rgba(248, 248, 251, 0.7);
  margin-bottom: 20px;
`;

type Props = {
  actions :{
    getAuthorization :RequestSequence;
    getBasics :RequestSequence;
  };
  match :Match;
  selectedPerson :Map;
  selectedIssueData :Map;
};

const EditProfileContainer = (props :Props) => {
  const {
    actions,
    match,
    selectedIssueData,
    selectedPerson
  } = props;
  const personEKID = match.params[PROFILE_ID_PARAM];

  useEffect(() => {
    actions.getBasics(personEKID);
  }, [actions, personEKID]);

  const assignee = selectedIssueData.get('assignee');
  const issue = selectedIssueData.get('issue') || Map();
  const reporter = selectedIssueData.get('reporter');
  const subject = selectedIssueData.get('subject');

  const headline = issue.getIn([TITLE_FQN, 0]);

  return (
    <ContentOuterWrapper>
      <ProfileBanner selectedPerson={selectedPerson} />
      <ContentWrapper>
        {
          !selectedIssueData.isEmpty() && (
            <StickyCard>
              <Accordion>
                <CardSegment headline={headline} defaultOpen>
                  <IssueDetails
                      assignee={assignee}
                      authorized
                      hideTitle
                      issue={issue}
                      match={match}
                      reporter={reporter}
                      subject={subject} />
                </CardSegment>
              </Accordion>
            </StickyCard>
          )
        }
        <CardStack>
          <div>
            <LinkButton mode="subtle" to={match.url}>
              <FontAwesomeIcon icon={faArrowLeft} fixedWidth />
              Back to Profile
            </LinkButton>
          </div>
          <Card>
            <CardSegment padding="sm">
              <Stepper>
                <NavStep to={`${match.url}${BASIC_PATH}`}>Basics</NavStep>
                <NavStep to={`${match.url}${OFFICER_SAFETY_PATH}`}>Officer Safety</NavStep>
                <NavStep to={`${match.url}${RESPONSE_PLAN_PATH}`}>Response Plan</NavStep>
                <NavStep to={`${match.url}${CONTACTS_PATH}`}>Contacts</NavStep>
                <NavStep to={`${match.url}${ABOUT_PATH}`}>About</NavStep>
              </Stepper>
            </CardSegment>
          </Card>
          <Switch>
            <PrivateRoute
                authorize={actions.getAuthorization}
                component={BasicInformationContainer}
                feature="profile"
                path={`${match.path}${BASIC_PATH}`} />
            <PrivateRoute
                authorize={actions.getAuthorization}
                component={OfficerSafetyContainer}
                feature="profile"
                path={`${match.path}${OFFICER_SAFETY_PATH}`} />
            <PrivateRoute
                authorize={actions.getAuthorization}
                component={ResponsePlanForm}
                feature="profile"
                path={`${match.path}${RESPONSE_PLAN_PATH}`} />
            <PrivateRoute
                authorize={actions.getAuthorization}
                component={ContactsForm}
                feature="profile"
                path={`${match.path}${CONTACTS_PATH}`} />
            <PrivateRoute
                authorize={actions.getAuthorization}
                component={AboutForm}
                feature="profile"
                path={`${match.path}${ABOUT_PATH}`} />
            <Redirect to={PROFILE_VIEW_PATH} />
          </Switch>
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

const mapStateToProps = (state :Map) => ({
  selectedPerson: state.getIn(['profile', 'basicInformation', 'basics', 'data']) || Map(),
  selectedIssueData: state.getIn(['router', 'location', 'state']) || Map()
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getAuthorization,
    getBasics,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(EditProfileContainer);
