// @flow
import React from 'react';

import { faClipboardListCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List } from 'immutable';
import { Constants } from 'lattice';
import {
  Card,
  CardHeader,
  CardSegment,
  IconSplash,
  Spinner,
} from 'lattice-ui-kit';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import EditLinkButton from '../../../components/buttons/EditLinkButton';
import InteractionStrategy from '../../../components/premium/responseplan/InteractionStrategy';
import NewIssueButton from '../../../components/buttons/CreateIssueButton';
import { H1, HeaderActions, IconWrapper } from '../../../components/layout';
import { CardSkeleton } from '../../../components/skeletons';
import { EDIT_PATH, RESPONSE_PLAN_PATH } from '../../../core/router/Routes';
import { DESCRIPTION_FQN, TITLE_FQN } from '../../../edm/DataModelFqns';
import { CATEGORIES } from '../../issues/issue/constants';

const { RESPONSE_PLAN } = CATEGORIES;
const { OPENLATTICE_ID_FQN } = Constants;

type Props = {
  isLoading ? :boolean;
  interactionStrategies :List;
  match :Match;
  showEdit :boolean;
};

const ResponsePlanCard = ({
  isLoading,
  interactionStrategies,
  match,
  showEdit
} :Props) => {

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faClipboardListCheck} fixedWidth />
          </IconWrapper>
          Response Plan
          <HeaderActions>
            { showEdit && <EditLinkButton mode="primary" to={`${match.url}${EDIT_PATH}${RESPONSE_PLAN_PATH}`} /> }
            <NewIssueButton defaultComponent={RESPONSE_PLAN} mode="primary" />
          </HeaderActions>
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        { isLoading && <Spinner size="2x" /> }
        { (!isLoading && interactionStrategies.isEmpty()) && <IconSplash caption="No response plan." /> }
        { (!isLoading && !interactionStrategies.isEmpty())
          && (
            interactionStrategies
              .map((strategy, step) => {
                const title = strategy.getIn([TITLE_FQN, 0]) || '';
                const description = strategy.getIn([DESCRIPTION_FQN, 0]) || '';
                const ekid = strategy.getIn([OPENLATTICE_ID_FQN, 0]);
                return <InteractionStrategy key={ekid} description={description} index={step + 1} title={title} />;
              })
          )}
      </CardSegment>
    </Card>
  );
};

ResponsePlanCard.defaultProps = {
  isLoading: false,
};

export default withRouter(ResponsePlanCard);
