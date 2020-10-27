/*
 * @flow
 */

import isFunction from 'lodash/isFunction';
import { Map } from 'immutable';

import Logger from '../../../../utils/Logger';
import gaConsts from '../GoogleAnalytics';

const LOG :Logger = new Logger('RouteChangeEventHandler');

declare var gtag :?Function;
type Action = {
  +type :string;
};

type RouteChangeEvent = {
  page_location :string;
  page_path :string;
  user_id ?:string;
};

export default function handler(action :Action, prevState :Map, nextState :Map) {

  try {
    const prevPath = prevState.getIn(['router', 'location', 'pathname'], '');
    const prevSearch = prevState.getIn(['router', 'location', 'search'], '');
    const nextPath = nextState.getIn(['router', 'location', 'pathname'], '');
    const nextSearch = nextState.getIn(['router', 'location', 'search'], '');
    if (prevPath === nextPath && prevSearch === nextSearch) {
      return;
    }

    const { location } = window;
    const origin = `${location.protocol}//${location.host}`;
    const url = `${origin}${location.pathname}${location.hash}`.split('?')[0];

    const event :RouteChangeEvent = {};
    event.page_location = url;
    event.page_path = url.replace(origin, '');

    if (isFunction(gtag)) {
      gtag('config', gaConsts.GOOGLE_TRACKING_ID, event);
    }
    else {
      LOG.error('global "gtag" function not available', gtag);
    }
  }
  catch (e) {
    LOG.error('caught an exception', e);
  }
}
