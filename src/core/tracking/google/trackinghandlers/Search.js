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
  +type :string;
  value :any;
};

type SearchEvent = {
  event_category :string;
  event_label :string;
  value :Object
};

export default function handler(action :Action) {

  try {
    if (isFunction(gtag)) {
      const { type, value } = action;
      const { searchInputs } = value;

      const event :SearchEvent = {};
      event.event_category = 'Search';
      event.value = isImmutable(searchInputs) ? searchInputs.toJS() : searchInputs;
      event.event_label = type;

      gtag('event', 'Execute Search', event);
    }
    else {
      LOG.error('global "gtag" function not available', gtag);
    }
  }
  catch (e) {
    LOG.error('caught an exception', e);
  }
}
