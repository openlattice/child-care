import { PRIORITIES } from './issue/constants';

// @flow
import {
  COMPLETED_DT_FQN,
  PRIORITY_FQN,
  STATUS_FQN,
  TITLE_FQN
} from '../../edm/DataModelFqns';

const PRIORITY_ORDER = {
  [PRIORITIES.HIGHEST]: 5,
  [PRIORITIES.HIGH]: 4,
  [PRIORITIES.MEDIUM]: 3,
  [PRIORITIES.LOW]: 2,
  [PRIORITIES.LOWEST]: 1,
};

const comparator = (a :string, b :string) => {
  const priorityA = PRIORITY_ORDER[a];
  const priorityB = PRIORITY_ORDER[b];

  return priorityA - priorityB;
};

const ISSUE_FILTERS :Object = {
  MY_OPEN_ISSUES: 'My Open Issues',
  REPORTED_BY_ME: 'Reported By Me',
  ALL_ISSUES: 'All Issues',
};

const cellStyle = {
  width: '105px'
};

const ISSUE_HEADERS = [
  {
    key: TITLE_FQN,
    label: 'Title',
    cellStyle: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
  },
  {
    key: PRIORITY_FQN,
    label: 'Priority',
    cellStyle,
    comparator
  },
  { key: STATUS_FQN, label: 'Status', cellStyle },
  { key: COMPLETED_DT_FQN, label: 'Created', cellStyle },
  {
    key: 'action',
    label: '',
    cellStyle: { width: '50px' },
    sortable: false
  },
];

export {
  ISSUE_HEADERS,
  ISSUE_FILTERS,
};
