/*
 * @flow
 */

import Papa from 'papaparse';
import {
  call,
  put,
  select,
  takeEvery
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  OrderedSet,
  fromJS,
} from 'immutable';
import {
  Constants,
  EntityDataModelApi,
} from 'lattice';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import {
  DOWNLOAD_FORMS,
  downloadForms
} from './DownloadsActionFactory';

import FileSaver from '../../utils/FileSaver';
import Logger from '../../utils/Logger';
import * as FQN from '../../edm/DataModelFqns';
import { getAppearsInESId, getPeopleESId, getReportESId } from '../../utils/AppUtils';
import { getSearchTerm } from '../../utils/DataUtils';

const { OPENLATTICE_ID_FQN } = Constants;

const LOG = new Logger('DownloadsSagas');

const {
  searchEntitySetDataWorker,
  searchEntityNeighborsWithFilterWorker
} = SearchApiSagas;
const {
  searchEntitySetData,
  searchEntityNeighborsWithFilter
} = SearchApiActions;

const HIDDEN_FQNS = [
  OPENLATTICE_ID_FQN,
  FQN.STRING_ID_FQN.toString(),
  FQN.OL_ID_FQN.toString(),
  FQN.TYPE_FQN.toString(),
  'id'
];

const ORDERED_FQNS = [
  // Person fields
  FQN.PERSON_FIRST_NAME_FQN,
  FQN.PERSON_MIDDLE_NAME_FQN,
  FQN.PERSON_LAST_NAME_FQN,
  FQN.PERSON_SUFFIX_FQN,
  FQN.PERSON_DOB_FQN,
  FQN.AGE_FQN,
  FQN.GENDER_FQN,
  FQN.PERSON_SEX_FQN,
  FQN.PERSON_RACE_FQN,
  FQN.RACE_FQN,
  FQN.ADDRESS_FQN,
  FQN.HOMELESS_FQN,
  FQN.HOMELESS_LOCATION_FQN,
  FQN.MILITARY_STATUS_FQN,
  FQN.EMOTIONAL_STATE_FQN,
  FQN.EMOTIONAL_STATE_OTHER_FQN,
  FQN.DISPOSITION_FQN,
  FQN.OBSERVED_BEHAVIORS_FQN,
  FQN.OBSERVED_BEHAVIORS_OTHER_FQN,
  FQN.PREV_PSYCH_ADMISSION_FQN,
  FQN.TAKING_MEDICATION_FQN,
  FQN.PRESCRIBED_MEDICATION_FQN,
  FQN.SELF_DIAGNOSIS_FQN,
  FQN.SELF_DIAGNOSIS_OTHER_FQN,
  FQN.ARMED_WITH_WEAPON_FQN,
  FQN.ARMED_WEAPON_TYPE_FQN,
  FQN.ACCESS_TO_WEAPONS_FQN,
  FQN.ACCESSIBLE_WEAPON_TYPE_FQN,
  FQN.HISTORY_OF_VIOLENCE_FQN,
  FQN.INJURIES_FQN,
  FQN.INJURIES_OTHER_FQN,
  FQN.SUICIDAL_FQN,
  FQN.SUICIDAL_ACTIONS_FQN,
  FQN.SUICIDE_ATTEMPT_METHOD_FQN,
  FQN.SUICIDE_ATTEMPT_METHOD_OTHER_FQN,
  FQN.PERSON_ID_FQN,

  // Officer fields
  FQN.POST_OF_OCCURRENCE_FQN,
  FQN.UNIT_FQN,
  FQN.OFFICER_NAME_FQN,
  FQN.OFFICER_SEQ_ID_FQN,
  FQN.OFFICER_CERTIFICATION_FQN,
  FQN.COMPLAINT_NUMBER_FQN,
  FQN.COMPANION_OFFENSE_REPORT_FQN,
  FQN.SUPERVISOR_FQN,
  FQN.SUPERVISOR_ID_FQN,
  FQN.DISPATCH_REASON_FQN,
  FQN.DISPATCH_REASON_OTHER_FQN,
  FQN.OFFICER_INJURIES_FQN,
  FQN.DEESCALATION_SCALE_FQN,
  FQN.DEESCALATION_TECHNIQUES_FQN,
  FQN.DEESCALATION_TECHNIQUES_OTHER_FQN,
  FQN.REFERRAL_PROVIDER_INDICATOR_FQN,

  // Incident fields
  FQN.INCIDENT_FQN,
  FQN.INCIDENT_OTHER_FQN,
  FQN.DATE_TIME_OCCURRED_FQN,
  FQN.LOCATION_OF_INCIDENT_FQN,
  FQN.DATE_TIME_REPORTED_FQN,
  FQN.PHOTOS_TAKEN_OF_FQN,
  FQN.ON_VIEW_FQN,
  FQN.DRUGS_ALCOHOL_FQN,
  FQN.DRUG_TYPE_FQN,
  FQN.DRUG_TYPE_OTHER_FQN,
  FQN.HOSPITAL_TRANSPORT_INDICATOR_FQN,
  FQN.HOSPITAL_FQN,
  FQN.SPECIAL_RESOURCES_CALLED_FQN,
  FQN.PHONE_FQN,
  FQN.CAD_NUMBER_FQN,
  FQN.STABILIZED_INDICATOR_FQN,
  FQN.SCALE_1_TO_10_FQN,

  // Complainant fields
  FQN.COMPLAINANT_NAME_FQN,
  FQN.COMPLAINANT_ADDRESS_FQN,
  FQN.COMPLAINANT_PHONE_FQN,
  FQN.COMPLAINANT_RELATIONSHIP_FQN
].map((fqn) => fqn.toString());

function* downloadFormsWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(downloadForms.request(action.id));
    const {
      startDate,
      endDate
    } = action.value;

    const startDT = DateTime.fromISO(startDate);
    const endDT = DateTime.fromISO(endDate);
    const edm :Map = yield select((state) => state.get('edm'));
    const app = yield select((state) => state.get('app', Map()));
    const reportESID = getReportESId(app);
    const peopleESID = getPeopleESId(app);
    const appearsInESID = getAppearsInESId(app);

    const projection = yield call(EntityDataModelApi.getEntityDataModelProjection,
      [reportESID, peopleESID, appearsInESID].map((id) => ({
        id,
        type: 'EntitySet',
        include: ['EntitySet', 'PropertyTypeInEntitySet']
      })));

    let propertyTypesByFqn = Map();
    let titleToFqn = Map();
    Object.values(projection.propertyTypes).forEach((propertyType :any) => {
      const { type, title } = propertyType;
      const { name, namespace } = type;
      const fqn = `${namespace}.${name}`;
      propertyTypesByFqn = propertyTypesByFqn.set(fqn, fromJS(propertyType));
      titleToFqn = titleToFqn.set(title, fqn);
    });
    const datetimePTID = edm.getIn(['fqnToIdMap', FQN.DATE_TIME_OCCURRED_FQN]);
    const options = {
      searchTerm: getSearchTerm(datetimePTID, `[${startDT.toString()} TO ${endDT.toString()}]`),
      start: 0,
      maxHits: 10000,
      fuzzy: false
    };

    const reportsResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData({
        entitySetId: reportESID,
        searchOptions: options
      })
    );

    if (reportsResponse.error) throw reportsResponse.error;
    const reportData = fromJS(reportsResponse.data);

    let reportsAsMap = Map();
    reportData.get('hits', List()).forEach((row) => {
      const reportEKID = row.getIn([OPENLATTICE_ID_FQN, 0]);
      reportsAsMap = reportsAsMap.set(reportEKID, row);
    });
    const reportEKIDs = reportsAsMap.keySeq().toJS();

    const peopleSearchParams = {
      entitySetId: reportESID,
      filter: {
        entityKeyIds: reportEKIDs,
        edgeEntitySetIds: [appearsInESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [peopleESID],
      }
    };

    const peopleSearchResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(peopleSearchParams)
    );

    if (peopleSearchResponse.error) throw peopleSearchResponse.error;
    const peopleData = fromJS(peopleSearchResponse.data);

    const getUpdatedEntity = (combinedEntityInit, entitySetName, details) => {
      let combinedEntity = combinedEntityInit;
      details.keySeq().forEach((fqn) => {
        if (!HIDDEN_FQNS.includes(fqn)) {
          const header = propertyTypesByFqn.getIn([fqn, 'title'], `${fqn}|${entitySetName}`);
          if (header) {
            let newArrayValues = combinedEntity.get(header, List());
            details.get(fqn).forEach((val) => {
              if (!newArrayValues.includes(val)) {
                newArrayValues = newArrayValues.push(val);
              }
            });
            combinedEntity = combinedEntity.set(header, newArrayValues);
          }
        }
      });
      return combinedEntity;
    };

    let jsonResults = List();
    let allHeaders = OrderedSet();
    reportEKIDs.forEach((id) => {
      let combinedEntity = getUpdatedEntity(
        Map(),
        'BHRs',
        reportsAsMap.get(id, Map())
      );

      peopleData.get(id, List()).forEach((neighbor) => {
        combinedEntity = getUpdatedEntity(
          combinedEntity,
          neighbor.getIn(['associationEntitySet', 'name']),
          neighbor.get('associationDetails', Map())
        );
        combinedEntity = getUpdatedEntity(
          combinedEntity,
          neighbor.getIn(['neighborEntitySet', 'name']),
          neighbor.get('neighborDetails', Map())
        );
        allHeaders = allHeaders.union(combinedEntity.keys());
      });

      jsonResults = jsonResults.push(combinedEntity);
    });

    const fieldsNotInList = allHeaders.filter((val) => !ORDERED_FQNS.includes(titleToFqn.get(val)));

    const fields = allHeaders
      .filter((val) => ORDERED_FQNS.includes(titleToFqn.get(val)))
      .sort((h1, h2) => {
        const ind1 = ORDERED_FQNS.indexOf(titleToFqn.get(h1));
        const ind2 = ORDERED_FQNS.indexOf(titleToFqn.get(h2));

        return ind1 < ind2 ? -1 : 1;
      })
      .concat(fieldsNotInList)
      .toJS();

    const csv = Papa.unparse({
      fields,
      data: jsonResults.toJS()
    });

    const name = `BHRs-${startDT.toISODate()}-to-${endDT.toISODate()}`;

    FileSaver.saveFile(csv, name, 'csv');

    yield put(downloadForms.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(downloadForms.failure(action.id, { error }));
  }
  finally {
    yield put(downloadForms.finally(action.id));
  }
}

function* downloadFormsWatcher() :Generator<*, *, *> {
  yield takeEvery(DOWNLOAD_FORMS, downloadFormsWorker);
}

export {
  downloadFormsWatcher,
  downloadFormsWorker,
};
