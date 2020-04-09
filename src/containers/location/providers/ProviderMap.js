// @flow
import React, { useEffect, useMemo, useReducer } from 'react';

import ReactMapboxGl, { ScaleControl } from 'react-mapbox-gl';
import { List } from 'immutable';
import { useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import ProviderLocationLayer from './ProviderLocationLayer';
import HospitalsLocationLayer from './HospitalsLocationLayer';
import ProviderPopup from './ProviderPopup';
import { STAY_AWAY_STORE_PATH } from './constants';

import CurrentPositionLayer from '../../map/CurrentPositionLayer';
import RadiusLayer from '../../map/RadiusLayer';
import { getBoundsFromPointsOfInterest, getCoordinates } from '../../map/MapUtils';
import { COORDS, MAP_STYLE } from '../../map/constants';
import { PROVIDERS } from '../../../utils/constants/StateConstants';

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

const LATITUDE_OFFSET = 0.001;

const INITIAL_STATE = {
  bounds: COORDS.BAY_AREA,
  center: undefined,
  isPopupOpen: false,
  selectedFeature: undefined,
  zoom: [16],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'center': {
      const { center, isPopupOpen, selectedFeature } = action.payload;
      return {
        ...state,
        bounds: undefined,
        center,
        isPopupOpen,
        selectedFeature,
        zoom: [16],
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
  searchResults ?:List;
};

const ProviderMap = (props :Props) => {
  const {
    currentPosition,
    searchResults,
    selectedOption
  } = props;

  const providerLocations = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'providerLocations']));
  const hospitals = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, PROVIDERS.HOSPITALS]));
  const selectedProvider = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, PROVIDERS.SELECTED_PROVIDER]));
  const isLoading = useSelector((store) => store
    .getIn([...STAY_AWAY_STORE_PATH, 'fetchState']) === RequestStates.PENDING);
  const [state, stateDispatch] = useReducer(reducer, INITIAL_STATE);
  const {
    bounds,
    center,
    isPopupOpen,
    selectedFeature,
    zoom,
  } = state;

  const stayAwayData = useMemo(() => searchResults
    .map((resultEKID) => providerLocations.get(resultEKID)),
  [searchResults, providerLocations]);

  useEffect(() => {
    if (!isLoading) {
      // first, use bounds whenever possible
      const newBounds = getBoundsFromPointsOfInterest(stayAwayData);
      if (newBounds) {
        stateDispatch({ type: 'bounds', payload: newBounds });
      }
      // then, try to center to position without bounds
      else if (selectedOption) {
        const { lat, lon } = selectedOption;
        stateDispatch({
          type: 'center',
          payload: {
            center: [parseFloat(lon), parseFloat(lat) + LATITUDE_OFFSET],
            selectedFeature: undefined,
            isPopupOpen: false
          }
        });
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
    stayAwayData,
    selectedOption
  ]);

  const showProviderPopup = (location) => {
    const [lng, lat] = getCoordinates(location);
    stateDispatch({
      type: 'center',
      payload: {
        center: [lng, lat + LATITUDE_OFFSET],
        selectedFeature: location,
        isPopupOpen: true
      }
    });
  };

  const selectHospital = (location) => {
    const [lng, lat] = getCoordinates(location);
    stateDispatch({
      type: 'center',
      payload: {
        center: [lng, lat + LATITUDE_OFFSET]
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
      <CurrentPositionLayer position={currentPosition} />
      {
        selectedFeature && (
          <>
            <RadiusLayer location={selectedFeature} radius={100} unit="yd" />
            <ProviderPopup
                isOpen={isPopupOpen && !selectedProvider}
                coordinates={getCoordinates(selectedFeature)}
                provider={selectedFeature}
                onClose={closeFeature} />
          </>
        )
      }
      <HospitalsLocationLayer
          hospitalLocations={hospitals}
          onFeatureClick={selectHospital} />
      <ProviderLocationLayer
          providerLocations={stayAwayData}
          onFeatureClick={showProviderPopup} />
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
