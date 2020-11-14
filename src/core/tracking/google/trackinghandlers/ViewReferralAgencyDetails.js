/*
 * @flow
 */

import isFunction from 'lodash/isFunction';
import { isImmutable, Map } from 'immutable';
import { DataUtils } from 'lattice-utils';

import Logger from '../../../../utils/Logger';
import { GOOGLE_TRACKING_ID } from '../GoogleAnalytics';

const { getEntityKeyId } = DataUtils;

const LOG :Logger = new Logger('ViewReferralAgencyDetailsHandler');

declare var gtag :?Function;
type Action = {
  id: string;
  +type :string;
  value :any;
};

type ViewReferralAgencyDetailsEvent = {
  event_category :string;
  event_label :string;
  value :Object
};

export default function handler(action :Action, prevState :Map, nextState :Map) {

  try {
    if (isFunction(gtag)) {
      const { value } = action;
      const providerEKID = getEntityKeyId(value);

      const event :ViewReferralAgencyDetailsEvent = {};
      event.event_category = 'Navigation';
      event.value = isImmutable(value) ? value.toJS() : value;
      if (providerEKID) event.event_label = providerEKID;

      gtag('event', 'View Referral Agency Details', event);
    }
    else {
      LOG.error('global "gtag" function not available', gtag);
    }
  }
  catch (e) {
    LOG.error('caught an exception', e);
  }
}
