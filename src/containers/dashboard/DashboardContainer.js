/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { Spinner } from 'lattice-ui-kit';
import type { RequestSequence } from 'redux-reqseq';

import ButtonToolbar from '../../components/buttons/ButtonToolbar';
import DropdownButton from '../../components/buttons/DropdownButton';
import SummaryStats from '../../components/dashboard/SummaryStats';
import OverviewCharts from '../../components/dashboard/OverviewCharts';
import IncidentCharts from '../../components/dashboard/IncidentCharts';
import OutcomeCharts from '../../components/dashboard/OutcomeCharts';
import { loadDashboardData } from './DashboardActionFactory';
import { SUBMISSION_STATES } from './DashboardReducer';
import { SUMMARY_STATS } from '../../shared/Consts';

const OptionRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Flex = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const DashboardWrapper = styled.div`
  width: 100%;
`;

const NoReports = styled.div`
  margin-top: 50px;
  width: 100%;
  text-align: center;
  font-size: 16px;
  color: #2e2e34;
`;

const LAYOUTS = {
  OVERVIEW: 'Overview',
  INCIDENT: 'Incident',
  OUTCOMES: 'Outcomes'
};

const TIME_LENGTHS = {
  MONTHS_1: {
    label: '1 Month',
    value: 1
  },
  MONTHS_3: {
    label: '3 Months',
    value: 3
  },
  MONTHS_6: {
    label: '6 Months',
    value: 6
  },
  YEAR: {
    label: '1 Year',
    value: 12
  }
};

type Props = {
  app :Map,
  dashboardCounts :Map,
  isLoading :boolean,
  summaryStats :Map,
  actions :{
    loadDashboardData :RequestSequence;
  }
};

type State = {
  layout :string;
  timeRange :any;
};

class DashboardContainer extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      layout: LAYOUTS.OVERVIEW,
      timeRange: TIME_LENGTHS.MONTHS_6
    };
  }

  componentDidMount() {
    const { actions, app } = this.props;
    const { timeRange } = this.state;
    actions.loadDashboardData({
      app,
      months: timeRange.value
    });
  }

  renderContent = () => {
    const {
      actions,
      app,
      dashboardCounts,
      summaryStats
    } = this.props;
    const { layout, timeRange } = this.state;

    const resultsArePresent = summaryStats.get(SUMMARY_STATS.NUM_REPORTS, 0) > 0;

    let ChartsComponent;

    switch (layout) {
      case LAYOUTS.INCIDENT:
        ChartsComponent = IncidentCharts;
        break;

      case LAYOUTS.OUTCOMES:
        ChartsComponent = OutcomeCharts;
        break;

      case LAYOUTS.OVERVIEW:
      default:
        ChartsComponent = OverviewCharts;
        break;
    }

    const viewOptions = Object.values(LAYOUTS).map((value) => ({
      label: value,
      value,
      onClick: () => this.setState({ layout: value })
    }));

    const timeOptions = Object.values(TIME_LENGTHS).map((range :any) => ({
      label: range.label,
      onClick: () => {
        this.setState({ timeRange: range });
        actions.loadDashboardData({
          app,
          months: range.value
        });
      }
    }));

    return (
      <DashboardWrapper>
        {resultsArePresent ? <SummaryStats summaryStats={summaryStats} interval={timeRange.label} /> : null}
        <OptionRow>
          <ButtonToolbar options={viewOptions} value={layout} noPadding />
          <DropdownButton options={timeOptions} title={timeRange.label} />
        </OptionRow>
        {resultsArePresent
          ? <ChartsComponent dashboardCounts={dashboardCounts} months={timeRange.value} />
          : <NoReports>No BHR reports were filed in this time period.</NoReports>}
      </DashboardWrapper>
    );
  }

  render() {
    const { isLoading } = this.props;

    return (
      <Flex>
        {isLoading ? <Spinner size="3x" /> : this.renderContent()}
      </Flex>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {
  const dashboard = state.get('dashboard');

  return {
    app: state.get('app', Map()),
    dashboardCounts: dashboard.get('dashboardCounts'),
    isLoading: dashboard.get('submissionState') === SUBMISSION_STATES.IS_SUBMITTING,
    summaryStats: dashboard.get('summaryStats')
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    loadDashboardData
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
