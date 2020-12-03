// @flow
import React, { useEffect, useMemo, useReducer } from 'react';

import isFunction from 'lodash/isFunction';
import ReactMapboxGl, { ZoomControl } from 'react-mapbox-gl';
import { List, Map, get } from 'immutable';
import { LangUtils, ReduxUtils } from 'lattice-utils';
import { useSelector } from 'react-redux';

import ActiveProviderLocationLayer from './ActiveProviderLocationLayer';
import FamilyHomeRadius from './markers/FamilyHomeRadius';
import InactiveProviderLocationLayer from './InactiveProviderLocationLayer';
import ProviderPopup from './ProviderPopup';
import SearchCenterMarker from './markers/SearchCenterMarker';
import SelectedProviderMarker from './markers/SelectedProviderMarker';

import CurrentPositionLayer from '../../map/CurrentPositionLayer';
import { REQUEST_STATE } from '../../../core/redux/constants';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { isProviderActive } from '../../../utils/DataUtils';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { getBoundsFromPointsOfInterest, getCoordinates } from '../../map/MapUtils';
import { COORDS, MAP_STYLE } from '../../map/constants';
import {
  GEOCODE_PLACE,
  GET_GEO_OPTIONS,
  LOAD_CURRENT_POSITION,
  SEARCH_LOCATIONS
} from '../LocationsActions';

const { LOCATIONS } = STATE;
const {
  LAT,
  LON,
  PROVIDER_LOCATIONS,
  SEARCH_INPUTS,
  SELECTED_OPTION
} = PROVIDERS;

declare var __MAPBOX_TOKEN__;
declare var gtag :?Function;

const { isNonEmptyArray } = LangUtils;
const { isPending, reduceRequestStates } = ReduxUtils;

// eslint-disable-next-line new-cap
const Mapbox = ReactMapboxGl({
  accessToken: __MAPBOX_TOKEN__
});

const flyToOptions = {
  speed: 1.5
};

const fitBoundsOptions = {
  padding: {
    bottom: 30,
    left: 30,
    right: 30,
    top: 90,
  }
};

const containerStyle = { flex: 1 };

const LATITUDE_OFFSET = 0.0035;
const EXTRA_LATITUDE_OFFSET = 0.0065;

const INITIAL_STATE = {
  bounds: COORDS.BAY_AREA,
  center: undefined,
  isPopupOpen: false,
  selectedFeature: undefined,
  zoom: [14],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'center': {

      const {
        center,
        isPopupOpen,
        selectedFeature,
        // $FlowFixMe
        zoom
      } = action.payload;

      return {
        ...state,
        bounds: undefined,
        center,
        isPopupOpen,
        selectedFeature,
        zoom: zoom || [14]
      };
    }
    case 'bounds':
      return {
        ...state,
        bounds: action.payload,
        selectedFeature: undefined,
      };
    case 'dismiss': {
      return {
        ...state,
        isPopupOpen: false,
      };
    }
    default:
      return state;
  }
};

type Props = {
  currentPosition :Position;
  selectedOption :Object;
  searchResults :List;
};

const ProviderMap = (props :Props) => {
  const {
    currentPosition,
    searchResults,
    selectedOption
  } = props;
  const geocodePlaceRS = useSelector((store) => store.getIn(
    [LOCATIONS, GEOCODE_PLACE, REQUEST_STATE]
  ));
  const getGeoOptionsRS = useSelector((store) => store.getIn(
    [LOCATIONS, GET_GEO_OPTIONS, REQUEST_STATE]
  ));
  const loadCurrentPositionRS = useSelector((store) => store.getIn(
    [LOCATIONS, LOAD_CURRENT_POSITION, REQUEST_STATE]
  ));
  const searchLocationsRS = useSelector((store) => store.getIn(
    [LOCATIONS, SEARCH_LOCATIONS, REQUEST_STATE]
  ));
  const getText = useSelector(getTextFnFromState);
  const providerLocations = useSelector((store) => store.getIn([LOCATIONS, PROVIDER_LOCATIONS]));
  const selectedProvider = useSelector((store) => store.getIn([LOCATIONS, PROVIDERS.SELECTED_PROVIDER]));
  const selectedReferralAgency = useSelector((store) => store.getIn([LOCATIONS, PROVIDERS.SELECTED_REFERRAL_AGENCY]));
  const searchInputs = useSelector((store) => store.getIn([LOCATIONS, SEARCH_INPUTS], Map()));
  const isLoading = isPending(reduceRequestStates([
    geocodePlaceRS,
    searchLocationsRS,
    loadCurrentPositionRS,
    getGeoOptionsRS
  ]));
  const [state, stateDispatch] = useReducer(reducer, INITIAL_STATE);
  const {
    bounds,
    center,
    isPopupOpen,
    selectedFeature,
    zoom,
  } = state;

  const providerData = useMemo(() => searchResults
    .map((resultEKID) => providerLocations.get(resultEKID)),
  [searchResults, providerLocations]);

  const searchedCoordinates = [
    searchInputs.getIn([SELECTED_OPTION, LON]),
    searchInputs.getIn([SELECTED_OPTION, LAT])
  ];

  useEffect(() => {
    if (!isLoading) {
      const placeToMap = selectedReferralAgency || selectedProvider;
      const newBounds = getBoundsFromPointsOfInterest(providerData);
      // first check for selectedReferralAgency then fallback to selectedProvider
      if (placeToMap) {
        const feature = selectedReferralAgency
          ? undefined
          : selectedProvider;
        const [lng, lat] = getCoordinates(placeToMap);
        stateDispatch({
          type: 'center',
          payload: {
            center: [lng, lat + EXTRA_LATITUDE_OFFSET],
            selectedFeature: feature,
            isPopupOpen: false,
            zoom: [13]
          }
        });
      }
      // second, use bounds whenever possible
      else if (isNonEmptyArray(newBounds)) {
        stateDispatch({ type: 'bounds', payload: newBounds });
      }
      // then, try to center to position without bounds
      else if (selectedOption) {
        const lat = get(selectedOption, LAT);
        const lon = get(selectedOption, LON);

        if (lat && lon) {
          stateDispatch({
            type: 'center',
            payload: {
              center: [parseFloat(lon), parseFloat(lat) + LATITUDE_OFFSET],
              selectedFeature: undefined,
              isPopupOpen: false
            }
          });
        }
      }
      // TODO: fall back to app.settings default bounds
      // fall back to bay area bounds
      else {
        stateDispatch({
          type: 'bounds',
          payload: COORDS.BAY_AREA
        });
      }
    }
  }, [
    isLoading,
    providerData,
    selectedOption,
    selectedProvider,
    selectedReferralAgency
  ]);

  const showProviderPopup = (location) => {
    const [lng, lat] = getCoordinates(location);

    if (location && isFunction(gtag)) {
      gtag('event', 'View Provider Popup', {
        event_category: 'Map Interaction',
      });
    }

    stateDispatch({
      type: 'center',
      payload: {
        center: [lng, lat + LATITUDE_OFFSET],
        selectedFeature: location,
        isPopupOpen: true
      }
    });
  };

  const closeFeature = () => {
    stateDispatch({ type: 'dismiss' });
  };

  return (
    <Mapbox
        center={center}
        containerStyle={containerStyle}
        fitBounds={bounds}
        movingMethod="flyTo"
        flyToOptions={flyToOptions}
        fitBoundsOptions={fitBoundsOptions}
        style={MAP_STYLE.DEFAULT}
        zoom={zoom}>
      {
        !selectedProvider && (
          <ZoomControl />
        )
      }
      <CurrentPositionLayer position={currentPosition} />
      {
        !selectedProvider && (
          <SearchCenterMarker coordinates={searchedCoordinates} />
        )
      }
      {
        selectedProvider && (
          <>
            <FamilyHomeRadius provider={selectedProvider} />
            <SelectedProviderMarker provider={selectedProvider} />
          </>
        )
      }
      {
        selectedReferralAgency && (
          <>
            <FamilyHomeRadius provider={selectedReferralAgency} />
            <SelectedProviderMarker provider={selectedReferralAgency} />
          </>
        )
      }
      {
        selectedFeature && (
          <ProviderPopup
              getText={getText}
              isOpen={isPopupOpen && !selectedProvider}
              coordinates={getCoordinates(selectedFeature)}
              provider={selectedFeature}
              onClose={closeFeature} />
        )
      }
      {
        !selectedProvider && (
          <ActiveProviderLocationLayer
              providerLocations={providerData.filter(isProviderActive)}
              onFeatureClick={showProviderPopup} />
        )
      }
      {
        !selectedProvider && (
          <InactiveProviderLocationLayer
              providerLocations={providerData.filter((p) => !isProviderActive(p))}
              onFeatureClick={showProviderPopup} />
        )
      }
    </Mapbox>
  );
};

ProviderMap.defaultProps = {
  searchResults: List()
};

export default React.memo<Props>((props :Props) => (
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  <ProviderMap {...props} />
));
