// @flow
import React, { Component } from 'react';
import { CardStack } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import type { RequestSequence } from 'redux-reqseq';
import type { Match } from 'react-router-dom';

import OfficerSafetyConcernsForm from './OfficerSafetyConcernsForm';
import { getOfficerSafety } from './OfficerSafetyActions';
import { PROFILE_ID_PARAM } from '../../../../core/router/Routes';

type Props = {
  actions :{
    getOfficerSafety :RequestSequence;
  };
  match :Match;
};
class OfficerSafetyContainer extends Component<Props> {

  componentDidMount() {
    const { actions, match } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    actions.getOfficerSafety(personEKID);
  }

  componentDidUpdate(prevProps :Props) {
    const {
      actions,
      match
    } = this.props;
    const {
      match: prevMatch,
    } = prevProps;
    const personEKID = match.params[PROFILE_ID_PARAM];
    const prevPersonEKID = prevMatch.params[PROFILE_ID_PARAM];
    if (personEKID !== prevPersonEKID) {
      actions.getOfficerSafety(personEKID);
    }
  }

  render() {
    const { match } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];

    return (
      <CardStack>
        <OfficerSafetyConcernsForm personEKID={personEKID} />
      </CardStack>
    );
  }
}

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getOfficerSafety
  }, dispatch)
});

// $FlowFixMe
export default connect(null, mapDispatchToProps)(OfficerSafetyContainer);
