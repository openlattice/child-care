/*
 * @flow
 */

import isFunction from 'lodash/isFunction';

declare var gtag :?Function;

export const trackLinkClick = (label :string, action :string) => {
  if (isFunction(gtag)) {
    gtag('event', action, {
      event_category: 'Link Clicked',
      event_label: label,
    });
  }
};
