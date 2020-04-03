// @flow
import React, {
  useEffect,
  useMemo,
  useState
} from 'react';
import styled, { css } from 'styled-components';
import { Constants } from 'lattice';
import { List, Map } from 'immutable';
import {
  Card,
  CardStack,
  Colors,
  Label,
  Table
} from 'lattice-ui-kit';
import { useSelector, useDispatch } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import IssueRow from './IssueRow';
import { ISSUE_HEADERS, ISSUE_FILTERS } from './constants';
import {
  getAllIssues,
  getMyOpenIssues,
  getReportedByMe,
} from './IssuesActions';

const { OPENLATTICE_ID_FQN } = Constants;
const { NEUTRALS, PURPLES, WHITE } = Colors;
const {
  ALL_ISSUES,
  MY_OPEN_ISSUES,
  REPORTED_BY_ME,
} = ISSUE_FILTERS;

const H1 = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 20px 0;
`;

const H2 = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const StyledLabel = styled(Label)`
  padding: 30px 30px 0;
`;

const VerticalCard = styled(Card)`
  flex-direction: row;
`;

const Aside = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-right: 1px solid ${NEUTRALS[4]};
`;

const Main = styled.div`
  display: flex;
  flex: 3;
  flex-direction: column;
  padding: 30px;
`;

const getActiveStyles = ({ active } :any) => {
  if (active) {
    return css`
      color: ${PURPLES[1]};
      background-color: ${NEUTRALS[6]};
    `;
  }

  return css`
    color: ${NEUTRALS[0]};
    background-color: ${WHITE};
  `;
};

const IssueFilter = styled.div`
  color: ${(props) => (props.active ? PURPLES[1] : NEUTRALS[0])};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: normal;
  line-height: 1.5;
  outline: none;
  padding: 15px 30px;
  text-decoration: none;
  ${getActiveStyles};

  :hover {
    background-color: ${NEUTRALS[6]};
    cursor: pointer;
  }
`;

const FilteredIssues = () => {
  const [activeFilter, setActiveFilter] = useState(MY_OPEN_ISSUES);
  const [data, setData] = useState([]);
  const [expandedRowId, setExpandedRowId] = useState();

  const dispatch = useDispatch();
  const currentUser :Map = useSelector((store :Map) => store.getIn(['staff', 'currentUser', 'data']));
  const filteredData :List = useSelector((store :Map) => store.getIn(['issues', 'filteredIssues', 'data']));
  const fetchFilteredData :RequestState = useSelector((store :Map) => store
    .getIn(['issues', 'filteredIssues', 'fetchState']));

  const currentUserEKID :string = currentUser.getIn([OPENLATTICE_ID_FQN, 0]);

  useEffect(() => {
    setData(filteredData.toJS());
  }, [filteredData]);

  useEffect(() => {
    if (activeFilter === MY_OPEN_ISSUES) {
      dispatch(getMyOpenIssues(currentUserEKID));
    }
    if (activeFilter === REPORTED_BY_ME) {
      dispatch(getReportedByMe(currentUserEKID));
    }
    if (activeFilter === ALL_ISSUES) {
      dispatch(getAllIssues());
    }
  }, [activeFilter, currentUserEKID, dispatch]);

  const components = useMemo(() => ({
    Row: ({ data: rowData } :any) => (
      <IssueRow
          expanded={rowData.id === expandedRowId}
          data={rowData}
          setExpandedRowId={setExpandedRowId} />
    )
  }), [expandedRowId, setExpandedRowId]);

  return (
    <CardStack>
      <H1>Issues</H1>
      <VerticalCard>
        <Aside>
          <StyledLabel subtle>Filters</StyledLabel>
          {
            Object.values(ISSUE_FILTERS).map((filterValue :any) => (
              <IssueFilter
                  key={filterValue}
                  active={activeFilter === filterValue}
                  onClick={() => setActiveFilter(filterValue)}>
                {filterValue}
              </IssueFilter>
            ))
          }
        </Aside>
        <Main>
          <H2>{activeFilter}</H2>
          <Table
              isLoading={fetchFilteredData === RequestStates.PENDING}
              components={components}
              data={data}
              headers={ISSUE_HEADERS}
              rowsPerPageOptions={[15, 25, 50]}
              paginated />
        </Main>
      </VerticalCard>
    </CardStack>
  );
};

export default FilteredIssues;
