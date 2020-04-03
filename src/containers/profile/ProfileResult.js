// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import isFunction from 'lodash/isFunction';
import { DateTime } from 'luxon';
import { List, Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import {
  Card,
  CardSegment,
  DataGrid,
} from 'lattice-ui-kit';

import { DATE_TIME_OCCURRED_FQN, TYPE_FQN } from '../../edm/DataModelFqns';

const ReportHeader = styled.div`
  display: flex;
  flex: 1;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 10px 0;
  align-items: center;
`;

const ReportType = styled.span`
  font-size: 14px;
  font-weight: 600;
  margin: 0 15px;
`;

type Props = {
  onClick ? :(result :Map) => void;
  resultLabels ? :Map;
  result :Map;
}

class ReportResult extends Component<Props> {

  static defaultProps = {
    onClick: undefined,
    resultLabels: Map(),
  }

  handleClick = () => {
    const { onClick, result } = this.props;
    if (isFunction(onClick)) {
      onClick(result);
    }
  }

  formatResult = () => {
    const { result } = this.props;
    const rawDatetime :string = result.getIn([DATE_TIME_OCCURRED_FQN, 0]);
    if (rawDatetime) {
      const formattedDob = DateTime.fromISO(rawDatetime).toLocaleString(DateTime.DATE_SHORT);
      return result.set(DATE_TIME_OCCURRED_FQN, List(formattedDob));
    }

    return result;
  }

  render() {

    const { result, resultLabels } = this.props;

    const reportType = result.get(TYPE_FQN, '');
    const formattedResult = this.formatResult();

    return (
      <Card onClick={this.handleClick}>
        <CardSegment vertical>
          <ReportHeader>
            <FontAwesomeIcon icon={faFileAlt} color="black" fixedWidth />
            <ReportType>
              { reportType }
            </ReportType>
          </ReportHeader>
          <DataGrid
              columns={2}
              data={formattedResult}
              labelMap={resultLabels} />
        </CardSegment>
      </Card>
    );
  }
}

export default ReportResult;
