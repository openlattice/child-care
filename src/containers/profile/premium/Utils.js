import { List, Map } from 'immutable';
// @flow
import { Models } from 'lattice';
import { DateTime } from 'luxon';

import {
  ARMED_WITH_WEAPON,
  INJURED_PARTIES,
  THREATENED_VIOLENCE,
} from './constants';

import {
  ARMED_WITH_WEAPON_FQN,
  DATE_TIME_OCCURRED_FQN,
  INJURIES_FQN,
  INJURIES_OTHER_FQN,
  OTHER_PERSON_INJURED_FQN,
  PERSON_INJURED_FQN,
  THREATENED_INDICATOR_FQN,
} from '../../../edm/DataModelFqns';

const { FullyQualifiedName } = Models;

const incrementValueAtKey = (mutable :Map, key :string, value :boolean) => {
  if (value) {
    if (mutable.has(key)) {
      mutable.update(key, (count) => count + 1);
    }
    else {
      mutable.set(key, 1);
    }
  }
};

const countPropertyOccurrance = (reports :List<Map>, propertyTypeFqn :FullyQualifiedName) => Map()
  .withMutations((mutable) => {
    reports.forEach((report) => {
      const propertyValues = report.get(propertyTypeFqn, []);

      propertyValues.forEach((value) => {
        incrementValueAtKey(mutable, value, value);
      });

    });
  });

const countSafetyIncidents = (reports :List) :Map => Map()
  .withMutations((mutable) => {
    reports.forEach((report) => {
      const injuryType = report.get(INJURIES_FQN, List());
      const injuredParties = report.get(PERSON_INJURED_FQN, List());
      const otherInjuryType = report.getIn([INJURIES_OTHER_FQN, 0], '');
      const otherInjuredPerson = report.getIn([OTHER_PERSON_INJURED_FQN, 0], '');

      const hadInjuries :boolean = (
        injuryType.count() > 0
        || injuredParties.count() > 0
        || otherInjuryType.length > 0
        || otherInjuredPerson.length > 0
      );

      const armedWithWeapon :boolean = report.getIn([ARMED_WITH_WEAPON_FQN, 0], false);
      const threatenedViolence :boolean = report.getIn([THREATENED_INDICATOR_FQN, 0], false);

      incrementValueAtKey(mutable, ARMED_WITH_WEAPON, armedWithWeapon);
      incrementValueAtKey(mutable, INJURED_PARTIES, threatenedViolence);
      incrementValueAtKey(mutable, THREATENED_VIOLENCE, hadInjuries);
    });
  })
  .sortBy((count) => -count)
  .toKeyedSeq()
  .toArray();

export {
  countPropertyOccurrance,
  countSafetyIncidents,
  incrementValueAtKey,
};
