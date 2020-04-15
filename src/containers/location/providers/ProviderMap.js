// @flow
import React, { useEffect, useMemo, useReducer } from 'react';

import ReactGA from 'react-ga';
import ReactMapboxGl, { ZoomControl } from 'react-mapbox-gl';
import { List, Map, isImmutable } from 'immutable';
import { useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import HospitalsLocationLayer from './HospitalsLocationLayer';
import ActiveProviderLocationLayer from './ActiveProviderLocationLayer';
import InactiveProviderLocationLayer from './InactiveProviderLocationLayer';
import ProviderPopup from './ProviderPopup';
import HospitalPopup from './HospitalPopup';
import SearchCenterMarker from './markers/SearchCenterMarker';
import SelectedProviderMarker from './markers/SelectedProviderMarker';
import FamilyHomeRadius from './markers/FamilyHomeRadius';
import { STAY_AWAY_STORE_PATH } from './constants';

import CurrentPositionLayer from '../../map/CurrentPositionLayer';
import { getRenderTextFn } from '../../../utils/AppUtils';
import { isProviderActive } from '../../../utils/DataUtils';
import { PROVIDERS } from '../../../utils/constants/StateConstants';
import { getBoundsFromPointsOfInterest, getCoordinates } from '../../map/MapUtils';
import { COORDS, MAP_STYLE } from '../../map/constants';

declare var __MAPBOX_TOKEN__;

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
  selectedHospital: undefined,
  zoom: [14],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'center': {

      const {
        center,
        isPopupOpen,
        selectedFeature,
        selectedHospital,
        zoom
      } = action.payload;

      return {
        ...state,
        bounds: undefined,
        center,
        isPopupOpen,
        selectedFeature,
        selectedHospital,
        zoom: [zoom || 14]
      };
    }
    case 'bounds':
      return {
        ...state,
        bounds: action.payload,
        selectedFeature: undefined,
        selectedHospital: undefined
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

  const renderText = useSelector(getRenderTextFn);
  const providerLocations = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'providerLocations']));
  const hospitals = useSelector((store) => store.getIn(['app', 'hospitals'], Map()));
  const selectedProvider = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, PROVIDERS.SELECTED_PROVIDER]));
  const hospitalsById = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, PROVIDERS.HOSPITALS_BY_ID]));
  const searchInputs = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'searchInputs'], Map()));
  const isLoading = useSelector((store) => store
    .getIn([...STAY_AWAY_STORE_PATH, 'fetchState']) === RequestStates.PENDING);
  const [state, stateDispatch] = useReducer(reducer, INITIAL_STATE);
  const {
    bounds,
    center,
    isPopupOpen,
    selectedFeature,
    selectedHospital,
    zoom,
  } = state;

  const providerData = useMemo(() => searchResults
    .map((resultEKID) => providerLocations.get(resultEKID)),
  [searchResults, providerLocations]);

  const searchedCoordinates = [
    searchInputs.getIn(['selectedOption', 'lon']),
    searchInputs.getIn(['selectedOption', 'lat'])
  ];

  useEffect(() => {
    if (!isLoading) {
      // first use external selectedProvider whenever possible
      if (selectedProvider) {
        const [lng, lat] = getCoordinates(selectedProvider);
        stateDispatch({
          type: 'center',
          payload: {
            center: [lng, lat + EXTRA_LATITUDE_OFFSET],
            selectedFeature: selectedProvider,
            selectedHospital: undefined,
            isPopupOpen: false,
            zoom: [13]
          }
        });
      }
      // second, use bounds whenever possible
      const newBounds = getBoundsFromPointsOfInterest(providerData);
      if (newBounds) {
        stateDispatch({ type: 'bounds', payload: newBounds });
      }
      // then, try to center to position without bounds
      else if (selectedOption) {
        let { lat, lon } = selectedOption;
        if (isImmutable(selectedOption)) {
          lat = selectedOption.get('lat');
          lon = selectedOption.get('lon');
        }

        if (lat && lon) {
          stateDispatch({
            type: 'center',
            payload: {
              center: [parseFloat(lon), parseFloat(lat) + LATITUDE_OFFSET],
              selectedFeature: undefined,
              selectedHospital: undefined,
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
  ]);

  const showProviderPopup = (location) => {
    const [lng, lat] = getCoordinates(location);

    if (location) {
      ReactGA.event({
        category: 'Map Interaction',
        action: 'View Provider Popup'
      });
    }

    stateDispatch({
      type: 'center',
      payload: {
        center: [lng, lat + LATITUDE_OFFSET],
        selectedFeature: location,
        selectedHospital: undefined,
        isPopupOpen: true
      }
    });
  };

  const selectHospital = (location) => {
    const [lng, lat] = getCoordinates(location);

    stateDispatch({
      type: 'center',
      payload: {
        center: [lng, lat + LATITUDE_OFFSET],
        selectedFeature: undefined,
        selectedHospital: location,
        isPopupOpen: true
      }
    });
  };

  const closeFeature = () => {
    stateDispatch({ type: 'dismiss' });
  };

  const renderHospitals = () => (
    <>
      {
        selectedHospital && (
          <HospitalPopup
              renderText={renderText}
              isOpen={isPopupOpen && !selectedProvider}
              coordinates={getCoordinates(selectedHospital)}
              hospital={selectedHospital}
              onClose={closeFeature} />
        )
      }
      <HospitalsLocationLayer
          hospitalLocations={hospitals.valueSeq()}
          onFeatureClick={selectHospital} />
    </>
  );

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
        selectedFeature && (
          <ProviderPopup
              renderText={renderText}
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
