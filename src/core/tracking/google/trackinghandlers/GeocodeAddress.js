/*
 * @flow
 */

import isFunction from 'lodash/isFunction';
import { isImmutable } from 'immutable';

import Logger from '../../../../utils/Logger';

const LOG :Logger = new Logger('ViewProviderDetailsHandler');

declare var gtag :?Function;
type Action = {
  id :string;
  value :any;
};

type GeocodeEvent = {
  event_category :string;
  event_label :string;
};

export default function handler(action :Action) {

  try {
    if (isFunction(gtag)) {
      const { value } = action;
      const { address } = value;

      const event :GeocodeEvent = {};
      event.event_category = 'Search';
      event.event_label = address;

      gtag('event', 'Geocoode Address', event);
    }
    else {
      LOG.error('global "gtag" function not available', gtag);
    }
  }
  catch (e) {
    LOG.error('caught an exception', e);
  }
}
