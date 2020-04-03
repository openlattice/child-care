/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import { DataApi, EntityDataModelApi, SearchApi } from 'lattice';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import {
  LOAD_DASHBOARD_DATA,
  loadDashboardData
} from './DashboardActionFactory';

import Logger from '../../utils/Logger';
import {
  ACCESSIBLE_WEAPON_TYPE_FQN,
  ACCESS_TO_WEAPONS_FQN,
  AGE_FQN,
  ARMED_WEAPON_TYPE_FQN,
  ARMED_WITH_WEAPON_FQN,
  DATE_TIME_OCCURRED_FQN,
  DEESCALATION_TECHNIQUES_FQN,
  DISPOSITION_FQN,
  DRUGS_ALCOHOL_FQN,
  EMOTIONAL_STATE_FQN,
  GENDER_FQN,
  HOMELESS_FQN,
  INJURIES_FQN,
  MILITARY_STATUS_FQN,
  OBSERVED_BEHAVIORS_FQN,
  OFFICER_CERTIFICATION_FQN,
  PRESCRIBED_MEDICATION_FQN,
  RACE_FQN,
  SELF_DIAGNOSIS_FQN,
  SPECIAL_RESOURCES_CALLED_FQN,
  SUICIDAL_ACTIONS_FQN,
  SUICIDAL_FQN,
  SUICIDE_ATTEMPT_METHOD_FQN,
  TAKING_MEDICATION_FQN
} from '../../edm/DataModelFqns';
import {
  DASHBOARD_COUNTS,
  SUMMARY_STATS
} from '../../shared/Consts';
import {
  getReportESId,
  getSelectedOrganizationId
} from '../../utils/AppUtils';
import {
  DEESCALATION_TECHNIQUES,
  DISPOSITIONS,
  DISPOSITIONS_PORTLAND
} from '../../utils/DataConstants';
import { getSearchTerm } from '../../utils/DataUtils';
import { isPortlandOrg } from '../../utils/Whitelist';

const LOG = new Logger('DashboardSagas');

const toLower = (list) => list.map((o) => o.toLowerCase());

function* loadDashboardDataWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(loadDashboardData.request(action.id));
    const {
      app,
      months
    } = action.value;

    const isPortland = isPortlandOrg(getSelectedOrganizationId(app));
    const reportESId :string = getReportESId(app);

    const ceiling = yield call(DataApi.getEntitySetSize, reportESId);
    const datePropertyTypeId = yield call(EntityDataModelApi.getPropertyTypeId, DATE_TIME_OCCURRED_FQN);
    const startDate = DateTime.local().minus({ months }).toISODate();
    const bhrs = yield call(SearchApi.searchEntitySetData, reportESId, {
      searchTerm: getSearchTerm(datePropertyTypeId, `[${startDate} TO *]`),
      start: 0,
      maxHits: ceiling,
      fuzzy: false
    });

    const numReports = bhrs.hits.length;

    let ageTotal = 0;
    let numHomeless = 0;
    let numMale = 0;
    let numVeterans = 0;
    let numUsingSubstance = 0;
    let numUsingAlcohol = 0;
    let numUsingDrugs = 0;

    let raceCounts = Map();
    let ageCounts = Map();
    let genderCounts = Map();
    let dateCounts = Map();
    let timeCounts = Map();
    let dayAndTimeCounts = Map();

    let emotionalStateCounts = Map();
    let behaviorCounts = Map();
    let diagnosisCounts = Map();
    let medicationCounts = Map();
    let injuryCounts = Map();
    let armedCounts = Map();
    let armedWeaponTypeCounts = Map();
    let accessibleWeaponCounts = Map();
    let accessibleWeaponTypeCounts = Map();
    let suicidalCounts = Map();
    let suicidalActionCounts = Map();
    let suicideMethodCounts = Map();

    let dispositionCounts = Map();
    let deescalationCounts = Map();
    let resourceCounts = Map();
    let dispositionsByDeescalation = Map();
    let certificationCounts = Map();

    const dispositionsList = isPortland ? Object.values(DISPOSITIONS_PORTLAND) : Object.values(DISPOSITIONS);
    Object.values(DEESCALATION_TECHNIQUES).forEach((deescTechnique) => {
      dispositionsList.forEach((disp) => {
        dispositionsByDeescalation = dispositionsByDeescalation.setIn([disp, deescTechnique], 0);
      });
    });


    fromJS(bhrs.hits).forEach((bhr) => {

      const mapValues = (fqn, initMap, noFilter) => {
        let map = initMap;
        bhr.get(fqn, List()).filter((val) => (noFilter || !!val)).forEach((val) => {
          map = map.set(val, map.get(val, 0) + 1);
        });
        return map;
      };
      /* Summary Stats */
      ageTotal += bhr.getIn([AGE_FQN, 0], 0);

      const genderList = toLower(bhr.get(GENDER_FQN, List()));
      const raceList = toLower(bhr.get(RACE_FQN, List()));
      const militaryStatusList = toLower(bhr.get(MILITARY_STATUS_FQN, List()));
      const substanceList = toLower(bhr.get(DRUGS_ALCOHOL_FQN, List()));

      if (bhr.getIn([HOMELESS_FQN, 0], false)) {
        numHomeless += 1;
      }

      if (genderList.includes('male')) {
        numMale += 1;
      }

      if (militaryStatusList.includes('veteran')) {
        numVeterans += 1;
      }

      if (substanceList.includes('drugs')) {
        numUsingDrugs += 1;
      }
      if (substanceList.includes('alcohol')) {
        numUsingAlcohol += 1;
      }
      if (substanceList.includes('both')) {
        numUsingSubstance += 1;
      }

      /* Dashboard Counts */
      raceList.forEach((race) => {
        raceCounts = raceCounts.set(race, raceCounts.get(race, 0) + 1);
      });

      genderList.forEach((gender) => {
        genderCounts = genderCounts.set(gender, genderCounts.get(gender, 0) + 1);
      });

      ageCounts = mapValues(AGE_FQN, ageCounts);

      bhr.get(DATE_TIME_OCCURRED_FQN, List()).forEach((date) => {
        const dateDT = DateTime.fromISO(date);
        if (dateDT.isValid) {
          const dateStr = dateDT.toISODate();
          const timeStr = dateDT.toLocaleString(DateTime.TIME_24_SIMPLE);
          const dayOfWeek = dateDT.weekdayShort;
          const timeHr = `${dateDT.hour}`;
          dateCounts = dateCounts.set(dateStr, dateCounts.get(dateStr, 0) + 1);
          timeCounts = timeCounts.set(timeStr, timeCounts.get(timeStr, 0) + 1);
          dayAndTimeCounts = dayAndTimeCounts
            .setIn([dayOfWeek, timeHr], dayAndTimeCounts.getIn([dayOfWeek, timeHr], 0) + 1);
        }
      });

      /* Incident counts */

      bhr
        .get(PRESCRIBED_MEDICATION_FQN, List())
        .filter((val) => !!val)
        .map((val) => val.toLowerCase())
        .forEach((isPrescribed) => {
          bhr
            .get(TAKING_MEDICATION_FQN, List())
            .filter((val) => !!val)
            .map((val) => val.toLowerCase())
            .forEach((isTaking) => {
              medicationCounts = medicationCounts
                .setIn([isPrescribed, isTaking], medicationCounts.getIn([isPrescribed, isTaking], 0) + 1);
            });
        });

      emotionalStateCounts = mapValues(EMOTIONAL_STATE_FQN, emotionalStateCounts);
      behaviorCounts = mapValues(OBSERVED_BEHAVIORS_FQN, behaviorCounts);
      diagnosisCounts = mapValues(SELF_DIAGNOSIS_FQN, diagnosisCounts);
      injuryCounts = mapValues(INJURIES_FQN, injuryCounts);
      armedCounts = mapValues(ARMED_WITH_WEAPON_FQN, armedCounts, true);
      armedWeaponTypeCounts = mapValues(ARMED_WEAPON_TYPE_FQN, armedWeaponTypeCounts);
      accessibleWeaponCounts = mapValues(ACCESS_TO_WEAPONS_FQN, accessibleWeaponCounts, true);
      accessibleWeaponTypeCounts = mapValues(ACCESSIBLE_WEAPON_TYPE_FQN, accessibleWeaponTypeCounts);
      suicidalCounts = mapValues(SUICIDAL_FQN, suicidalCounts, true);
      suicidalActionCounts = mapValues(SUICIDAL_ACTIONS_FQN, suicidalActionCounts);
      suicideMethodCounts = mapValues(SUICIDE_ATTEMPT_METHOD_FQN, suicideMethodCounts);

      /* Disposition counts */

      dispositionCounts = mapValues(DISPOSITION_FQN, dispositionCounts);
      deescalationCounts = mapValues(DEESCALATION_TECHNIQUES_FQN, deescalationCounts);
      resourceCounts = mapValues(SPECIAL_RESOURCES_CALLED_FQN, resourceCounts);
      certificationCounts = mapValues(OFFICER_CERTIFICATION_FQN, certificationCounts);

      bhr.get(DEESCALATION_TECHNIQUES_FQN, List()).filter((val) => !!val).forEach((deescTechnique) => {
        bhr.get(DISPOSITION_FQN, List()).filter((val) => !!val).forEach((disp) => {
          dispositionsByDeescalation = dispositionsByDeescalation.setIn([deescTechnique, disp],
            dispositionsByDeescalation.getIn([deescTechnique, disp], 0) + 1);
        });
      });

    });

    const summaryStats = {
      [SUMMARY_STATS.NUM_REPORTS]: numReports,
      [SUMMARY_STATS.AVG_AGE]: ageTotal / numReports,
      [SUMMARY_STATS.NUM_HOMELESS]: numHomeless,
      [SUMMARY_STATS.NUM_MALE]: numMale,
      [SUMMARY_STATS.NUM_VETERANS]: numVeterans,
      [SUMMARY_STATS.NUM_USING_SUBSTANCE]: numUsingSubstance,
      [SUMMARY_STATS.NUM_USING_ALCOHOL]: numUsingAlcohol,
      [SUMMARY_STATS.NUM_USING_DRUGS]: numUsingDrugs
    };

    const dashboardCounts = {
      [DASHBOARD_COUNTS.RACE]: raceCounts,
      [DASHBOARD_COUNTS.AGE]: ageCounts,
      [DASHBOARD_COUNTS.GENDER]: genderCounts,
      [DASHBOARD_COUNTS.REPORTS_BY_DATE]: dateCounts,
      [DASHBOARD_COUNTS.REPORTS_BY_TIME]: timeCounts,
      [DASHBOARD_COUNTS.REPORTS_BY_DAY_OF_WEEK]: dayAndTimeCounts,
      [DASHBOARD_COUNTS.EMOTIONAL_STATE]: emotionalStateCounts,
      [DASHBOARD_COUNTS.BEHAVIORS]: behaviorCounts,
      [DASHBOARD_COUNTS.SELF_DIAGNOSIS]: diagnosisCounts,
      [DASHBOARD_COUNTS.INJURIES]: injuryCounts,
      [DASHBOARD_COUNTS.MEDICATION]: medicationCounts,
      [DASHBOARD_COUNTS.ARMED]: armedCounts,
      [DASHBOARD_COUNTS.ARMED_WEAPON_TYPES]: armedWeaponTypeCounts,
      [DASHBOARD_COUNTS.WEAPON_ACCESS]: accessibleWeaponCounts,
      [DASHBOARD_COUNTS.ACCESS_WEAPON_TYPES]: accessibleWeaponTypeCounts,
      [DASHBOARD_COUNTS.SUICIDAL]: suicidalCounts,
      [DASHBOARD_COUNTS.SUICIDAL_ACTIONS]: suicidalActionCounts,
      [DASHBOARD_COUNTS.SUICIDE_METHOD]: suicideMethodCounts,
      [DASHBOARD_COUNTS.DISPOSITIONS]: dispositionCounts,
      [DASHBOARD_COUNTS.DEESCALATION]: deescalationCounts,
      [DASHBOARD_COUNTS.RESOURCES]: resourceCounts,
      [DASHBOARD_COUNTS.DISPOSITIONS_BY_DEESCALATION]: dispositionsByDeescalation,
      [DASHBOARD_COUNTS.CERTIFICATIONS]: certificationCounts
    };

    yield put(loadDashboardData.success(action.id, { summaryStats, dashboardCounts }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(loadDashboardData.failure(action.id, error));
  }
  finally {
    yield put(loadDashboardData.finally(action.id));
  }
}

function* loadDashboardDataWatcher() :Generator<*, *, *> {
  yield takeEvery(LOAD_DASHBOARD_DATA, loadDashboardDataWorker);
}

export {
  // eslint-disable-next-line import/prefer-default-export
  loadDashboardDataWatcher
};
