// @flow
import React, {
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react';

import styled from 'styled-components';
import ReactMapboxGl, { ScaleControl } from 'react-mapbox-gl';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map, fromJS } from 'immutable';
import {
  Colors,
  Hooks,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from 'lattice-ui-kit';
import { useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import EncampmentLayer from './EncampmentLayer';
import EncampmentModal from './EncampmentModal';
import EncampmentPopup from './EncampmentPopup';
import { ENCAMPMENT_STORE_PATH } from './constants';

import CurrentPositionLayer from '../../map/CurrentPositionLayer';
import pinSolid from '../../../assets/svg/pin-solid.svg';
import { LOCATION_COORDINATES_FQN } from '../../../edm/DataModelFqns';
import { getBoundsFromPointsOfInterest } from '../../map/MapUtils';
import { COORDS, MAP_STYLE } from '../../map/constants';

const { GREENS } = Colors;


declare var __MAPBOX_TOKEN__;

const { useBoolean } = Hooks;
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

const DoneIcon = <FontAwesomeIcon icon={faCheckCircle} fixedWidth size="lg" color={GREENS[4]} />;
const CenteredPinWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;

  
  svg, img {
    z-index: 1;
  }
`;

const StyledSpeedDial = styled(SpeedDial)`
  position: absolute;
  bottom: 1em;
  right: 1em;
  z-index: 2 !important;
`;

const containerStyle = { flex: 1 };

const INITIAL_STATE = {
  bounds: COORDS.BAY_AREA,
  center: undefined,
  isPopupOpen: false,
  selectedFeature: undefined,
  zoom: [18],
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
        zoom: [18],
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

const EncampmentMap = (props :Props) => {
  const {
    currentPosition,
    searchResults,
    selectedOption
  } = props;
  const [isSpeedDialOpen, openSpeedDial, closeSpeedDial] = useBoolean(false);
  const [isModalOpen, openModal, closeModal] = useBoolean(false);
  const [currentCenter, setCurrentCenter] = useState();
  const [confirmedLocation, setConfirmedLocation] = useState();
  const encampmentLocations = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'encampmentLocations']));
  const isLoading = useSelector((store) => store
    .getIn([...ENCAMPMENT_STORE_PATH, 'fetchState']) === RequestStates.PENDING);
  const [state, stateDispatch] = useReducer(reducer, INITIAL_STATE);
  const {
    bounds,
    center,
    isPopupOpen,
    selectedFeature,
    zoom,
  } = state;

  const locationData = useMemo(() => searchResults
    .map((resultEKID) => encampmentLocations.get(resultEKID, Map())),
  [searchResults, encampmentLocations]);

  const confirmLocation = () => {
    setConfirmedLocation(currentCenter);
    openModal();
  };

  const handleMoveEnd = (map :any) => {
    const { _center } = map.transform;
    const { lng, lat } = _center;
    const latLngEntity = fromJS({
      [LOCATION_COORDINATES_FQN]: [`${lat},${lng}`]
    });
    setCurrentCenter(latLngEntity);
  };

  useEffect(() => {
    if (!isLoading) {
      // first, use bounds whenever possible
      const newBounds = getBoundsFromPointsOfInterest(locationData);
      if (newBounds) {
        stateDispatch({ type: 'bounds', payload: newBounds });
      }
      // then, try to center to position without bounds
      else if (selectedOption) {
        const { lat, lon } = selectedOption;
        stateDispatch({
          type: 'center',
          payload: {
            center: [parseFloat(lon), parseFloat(lat)],
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
    locationData,
    selectedOption
  ]);

  const handleFeatureClick = (location, feature) => {
    const { lng, lat } = feature.lngLat;
    stateDispatch({
      type: 'center',
      payload: {
        center: [lng, lat],
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
        onMoveEnd={handleMoveEnd}
        zoom={zoom}>
      <ScaleControl
          style={{ maxWidth: '55%' }}
          position="bottom-left"
          measurement="mi" />
      <CurrentPositionLayer position={currentPosition} />
      {
        selectedFeature && (
          <EncampmentPopup
              isOpen={isPopupOpen}
              selectedFeature={selectedFeature}
              onClose={closeFeature} />
        )
      }
      <EncampmentLayer
          encampmentLocations={locationData}
          onFeatureClick={handleFeatureClick} />
      <StyledSpeedDial
          ariaLabel="Speed Dial Actions"
          icon={<SpeedDialIcon />}
          open={isSpeedDialOpen}
          onOpen={openSpeedDial}
          onClose={closeSpeedDial}>
        <SpeedDialAction
            onClick={confirmLocation}
            tooltipTitle="Done"
            icon={DoneIcon} />
      </StyledSpeedDial>
      {
        (isSpeedDialOpen && currentCenter) && (
          <CenteredPinWrapper>
            <img src={pinSolid} alt="pin-solid" height="20px" width="12px" />
          </CenteredPinWrapper>
        )
      }
      <EncampmentModal
          isVisible={isModalOpen}
          onClose={closeModal}
          encampmentLocation={confirmedLocation} />
    </Mapbox>
  );
};

EncampmentMap.defaultProps = {
  searchResults: List()
};

export default React.memo<Props>((props :Props) => (
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  <EncampmentMap {...props} />
));
