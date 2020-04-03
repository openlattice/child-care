// @flow
import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { DateTime } from 'luxon';
import { get } from 'immutable';
import { Colors, StyleUtils, Tag } from 'lattice-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';

import {
  resetIssue,
  selectIssue,
} from './issue/IssueActions';
import { STATUS } from './issue/constants';
import IssueRowExpansion from './IssueRowExpansion';
import {
  TITLE_FQN,
  PRIORITY_FQN,
  STATUS_FQN,
  COMPLETED_DT_FQN,
} from '../../edm/DataModelFqns';

const { NEUTRALS } = Colors;
const { getHoverStyles } = StyleUtils;

const STATUS_MODE = {
  [STATUS.RESOLVED]: 'success',
  [STATUS.DECLINED]: 'danger',
  [STATUS.OPEN]: 'neutral',
};

const CustomRowWrapper = styled.tr.attrs(() => ({ tabIndex: '1' }))`
  border-bottom: ${(props) => (props.expanded ? null : `1px solid ${NEUTRALS[4]}`)};
  outline: none;
  ${getHoverStyles};
`;

const CellContent = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledCell = styled.td`
  padding: 10px;
  text-align: ${(props) => (props.align ? 'center' : 'left')};
`;

type Props = {
  data :any;
  expanded :boolean;
  setExpandedRowId :(id ?:string) => void;
};

const IssueRow = (props :Props) => {
  const {
    data,
    expanded,
    setExpandedRowId,
  } = props;

  const dispatch = useDispatch();

  const id = get(data, 'id');
  const title = get(data, TITLE_FQN);
  const priority = get(data, PRIORITY_FQN);
  const status = get(data, STATUS_FQN) || 'Open';
  const created = DateTime.fromISO(get(data, COMPLETED_DT_FQN, ''))
    .toLocaleString(DateTime.DATE_SHORT);

  const icon = expanded ? faChevronUp : faChevronDown;

  const onClick = () => {
    if (expanded) {
      dispatch(resetIssue());
      setExpandedRowId();
    }
    else {
      dispatch(selectIssue(data));
      setExpandedRowId(id);
    }
  };

  return (
    <>
      <CustomRowWrapper onClick={onClick} expanded={expanded}>
        <StyledCell>
          <CellContent>
            { title }
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
            { priority }
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
            { status && <Tag mode={STATUS_MODE[status]}>{status}</Tag> }
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
            { created }
          </CellContent>
        </StyledCell>
        <StyledCell>
          <FontAwesomeIcon icon={icon} fixedWidth />
        </StyledCell>
      </CustomRowWrapper>
      {
        expanded && (<IssueRowExpansion />)
      }
    </>
  );
};

export default React.memo<Props>(IssueRow);
