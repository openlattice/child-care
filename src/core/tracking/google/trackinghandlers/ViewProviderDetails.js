/*
 * @flow
 */

import isFunction from 'lodash/isFunction';
import { isImmutable } from 'immutable';
import { DataUtils } from 'lattice-utils';

import Logger from '../../../../utils/Logger';

const { getEntityKeyId } = DataUtils;

const LOG :Logger = new Logger('ViewProviderDetailsHandler');

declare var gtag :?Function;
type Action = {
  id :string;
  +type :string;
  value :any;
};

type ViewProviderDetailsEvent = {
  event_category :string;
  event_label :string;
  value :Object
};

export default function handler(action :Action) {

  try {
    if (isFunction(gtag)) {
      const { value } = action;
      const providerEKID = getEntityKeyId(value);

      const event :ViewProviderDetailsEvent = {};
      event.event_category = 'Navigation';
      event.value = isImmutable(value) ? value.toJS() : value;
      if (providerEKID) event.event_label = providerEKID;

      gtag('event', 'View Provider Details', event);
    }
    else {
      LOG.error('global "gtag" function not available', gtag);
    }
  }
  catch (e) {
    LOG.error('caught an exception', e);
  }
}
