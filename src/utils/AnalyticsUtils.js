import ReactGA from 'react-ga';

export const trackLinkClick = (label, action) => {
  ReactGA.event({
    category: 'Link Clicked',
    action,
    label
  });
};
