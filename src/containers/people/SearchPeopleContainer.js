// @flow

import React, { useState } from 'react';

import styled from 'styled-components';
import { List, Map, fromJS } from 'immutable';
import {
  Button,
  Card,
  CardSegment,
  CardStack,
  Checkbox,
  DatePicker,
  Input,
  Label,
  PaginationToolbar,
  PlusButton,
  SearchResults,
  Select,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import AdvancedHeader from './AdvancedHeader';
import MetaphoneLabel from './MetaphoneLabel';
import PersonResult from './PersonResult';
import { searchPeople } from './PeopleActions';

import Accordion from '../../components/accordion';
import { useInput } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { CRISIS_PATH } from '../../core/router/Routes';
import { goToPath } from '../../core/router/RoutingActions';
import { isNonEmptyString } from '../../utils/LangUtils';
import { media } from '../../utils/StyleUtils';
import { SUBJECT_INFORMATION } from '../../utils/constants/CrisisReportConstants';
import { setInputValues } from '../pages/subjectinformation/Actions';
import { ethnicityOptions, raceOptions, sexOptions } from '../profile/constants';

const NewPersonButton = styled(PlusButton)`
  margin-left: auto;
  padding: 5px 20px;
`;

const InputGrid = styled.div`
  align-items: flex-start;
  display: grid;
  flex: 1;
  grid-auto-flow: column;
  grid-gap: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  ${media.phone`
    grid-gap: 5px;
    grid-auto-flow: row;
    grid-template-columns: none;
  `}
`;

const Title = styled.h1`
  display: flex;
  font-size: 18px;
  font-weight: normal;
  margin: 0;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FlexEnd = styled.div`
  align-self: flex-end;
`;

const MAX_HITS = 20;

const SearchPeopleContainer = () => {

  const searchResults = useSelector((store) => store.getIn(['people', 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn(['people', 'totalHits'], 0));
  const fetchState = useSelector((store) => store.getIn(['people', 'fetchState']));
  const searchInputs = useSelector((store) => store.getIn(['people', 'searchInputs']));
  const dispatch = useDispatch();

  const [dob, setDob] = useState(searchInputs.get('dob'));
  const [ethnicity, setEthnicity] = useState(searchInputs.get('ethnicity'));
  const [firstName, setFirstName] = useInput(searchInputs.get('firstName'));
  const [lastName, setLastName] = useInput(searchInputs.get('lastName'));
  const [metaphone, setSimilar] = useState(searchInputs.get('metaphone', false));
  const [page, setPage] = useState(0);
  const [race, setRace] = useState(searchInputs.get('race'));
  const [sex, setSex] = useState(searchInputs.get('sex'));

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;

  const handleNewPerson = () => {
    const person = fromJS({
      [SUBJECT_INFORMATION.DOB]: dob,
      [SUBJECT_INFORMATION.FIRST]: firstName,
      [SUBJECT_INFORMATION.LAST]: lastName,
      [SUBJECT_INFORMATION.IS_NEW_PERSON]: true
    });

    dispatch(setInputValues(person));
    dispatch(goToPath(`${CRISIS_PATH}/1`));
  };

  const dispatchSearch = (start = 0) => {
    const newSearchInputs = Map({
      dob,
      ethnicity,
      firstName,
      lastName,
      metaphone,
      race,
      sex,
    });

    const hasValues = newSearchInputs.some(isNonEmptyString);

    if (hasValues) {
      dispatch(searchPeople({
        searchInputs: newSearchInputs,
        start,
        maxHits: MAX_HITS
      }));
    }
  };

  const handleOnSearch = (e :SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatchSearch();
    setPage(0);
  };

  const handleOnSimilar = (e :SyntheticEvent<HTMLInputElement>) => {
    const { currentTarget } = e;
    setSimilar(currentTarget.checked);
  };

  const onPageChange = ({ page: newPage, start }) => {
    dispatchSearch(start);
    setPage(newPage);
  };

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <CardStack>
          <Card>
            <CardSegment vertical>
              <Title>
                Search People
                <NewPersonButton
                    disabled={fetchState !== RequestStates.SUCCESS}
                    onClick={handleNewPerson}>
                  New Person
                </NewPersonButton>
              </Title>
              <form>
                <InputGrid>
                  <FlexColumn>
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                        id="last-name"
                        value={lastName}
                        onChange={setLastName} />
                  </FlexColumn>
                  <FlexColumn>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                        id="first-name"
                        value={firstName}
                        onChange={setFirstName} />
                  </FlexColumn>
                  <FlexColumn>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <DatePicker id="dob" value={dob} onChange={setDob} />
                  </FlexColumn>
                  <FlexColumn>
                    <Label stealth>Submit</Label>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        mode="primary"
                        onClick={handleOnSearch}>
                      Search People
                    </Button>
                  </FlexColumn>
                </InputGrid>
              </form>
            </CardSegment>
            <Accordion>
              <div headline="Additional Fields" titleComponent={AdvancedHeader}>
                <InputGrid>
                  <FlexColumn>
                    <Label htmlFor="sex">Sex</Label>
                    <Select
                        id="sex"
                        isClearable
                        onChange={(option) => setSex(option)}
                        value={sex}
                        options={sexOptions} />
                  </FlexColumn>
                  <FlexColumn>
                    <Label htmlFor="race">Race</Label>
                    <Select
                        id="race"
                        isClearable
                        onChange={(option) => setRace(option)}
                        value={race}
                        options={raceOptions} />
                  </FlexColumn>
                  <FlexColumn>
                    <Label htmlFor="ethnicity">Ethnicity</Label>
                    <Select
                        id="ethnicity"
                        isClearable
                        onChange={(option) => setEthnicity(option)}
                        value={ethnicity}
                        options={ethnicityOptions} />
                  </FlexColumn>
                  <FlexEnd>
                    <Checkbox
                        id="similar"
                        checked={metaphone}
                        onChange={handleOnSimilar}
                        label={MetaphoneLabel} />
                  </FlexEnd>
                </InputGrid>
              </div>
            </Accordion>
          </Card>
          <SearchResults
              hasSearched={hasSearched}
              isLoading={isLoading}
              resultComponent={PersonResult}
              results={searchResults} />
          {
            hasSearched && (
              <PaginationToolbar
                  page={page}
                  count={totalHits}
                  onPageChange={onPageChange}
                  rowsPerPage={MAX_HITS} />
            )
          }
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default SearchPeopleContainer;
