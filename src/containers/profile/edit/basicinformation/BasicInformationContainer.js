// @flow
import React, { Component } from 'react';
import { CardStack } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import type { RequestSequence } from 'redux-reqseq';
import type { Match } from 'react-router-dom';

import BasicsForm from './BasicsForm';
import AppearanceForm from './AppearanceForm';
import AddressForm from './AddressForm';
import ScarsMarksTattoosForm from './ScarsMarksTattoosForm';
import { getBasicInformation } from './actions/BasicInformationActions';
import { PROFILE_ID_PARAM } from '../../../../core/router/Routes';
import PhotosForm from './PhotosForm';

type Props = {
  actions :{
    getBasicInformation :RequestSequence;
  };
  match :Match;
};
class BasicInformationContainer extends Component<Props> {

  componentDidMount() {
    const { actions, match } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    actions.getBasicInformation(personEKID);
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
      actions.getBasicInformation(personEKID);
    }
  }

  render() {
    const { match } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];

    return (
      <CardStack>
        <BasicsForm />
        <AppearanceForm personEKID={personEKID} />
        <ScarsMarksTattoosForm personEKID={personEKID} />
        <PhotosForm personEKID={personEKID} />
        <AddressForm personEKID={personEKID} />
      </CardStack>
    );
  }
}

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getBasicInformation
  }, dispatch)
});

// $FlowFixMe
export default connect(null, mapDispatchToProps)(BasicInformationContainer);
