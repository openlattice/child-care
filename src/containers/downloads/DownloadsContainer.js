/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Button } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';

import { downloadForms } from './DownloadsActionFactory';

import DateTimeRange from '../../components/controls/DateTimeRange';

type Props = {
  downloading :boolean,
  actions :{
    downloadForms :Function
  }
};

type State = {
  startDate :?string,
  endDate :?string
};

export const DownloadsWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const FormWrapper = styled.div`
  align-items: center;
  background: #fff;
  border: solid 1px #e1e1eb;
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 30px 0;
  width: 100%;
`;

const ButtonRow = styled.div`
  margin-top: 30px;
  text-align: center;
`;

class DownloadsContainer extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      startDate: '',
      endDate: ''
    };
  }

  download = () => {
    const { actions } = this.props;
    const { endDate, startDate } = this.state;

    actions.downloadForms({ endDate, startDate });
  }

  onDateChange = (field :string, newDate :string) => {
    this.setState({ [field]: newDate });
  }

  render() {
    const { downloading } = this.props;
    const { endDate, startDate } = this.state;

    return (
      <DownloadsWrapper>
        <FormWrapper>
          <DateTimeRange
              label="BHR Downloads"
              startDate={startDate}
              endDate={endDate}
              onStartChange={(date) => this.onDateChange('startDate', date)}
              onEndChange={(date) => this.onDateChange('endDate', date)} />
          <ButtonRow>
            <Button mode="primary" onClick={this.download} disabled={downloading || !startDate || !endDate}>
              Download BHR Reports
            </Button>
          </ButtonRow>
        </FormWrapper>
      </DownloadsWrapper>
    );
  }
}

const mapStateToProps = (state :Map) => ({
  downloading: state.getIn(['downloads', 'downloading'])
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({ downloadForms }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(DownloadsContainer);
