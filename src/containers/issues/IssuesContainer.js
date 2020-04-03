// @flow

import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { CardStack } from 'lattice-ui-kit';

import FilteredIssues from './FilteredIssues';
import Issue from './issue/Issue';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { ISSUES_PATH, ISSUE_PATH } from '../../core/router/Routes';

const IssuesContainer = () => (
  <ContentOuterWrapper>
    <ContentWrapper>
      <CardStack>
        <Switch>
          <Route path={ISSUES_PATH} exact strict component={FilteredIssues} />
          <Route path={ISSUE_PATH} component={Issue} />
          <Redirect to={ISSUES_PATH} />
        </Switch>
      </CardStack>
    </ContentWrapper>
  </ContentOuterWrapper>
);


export default IssuesContainer;
