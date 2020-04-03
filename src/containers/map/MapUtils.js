// @flow
import { List, Map } from 'immutable';

import { UNIT_CONVERSION } from './constants';

import * as FQN from '../../edm/DataModelFqns';

const getCoordinates = (entity :Map) :[number, number] => {
  const [latStr, lonStr] = entity.getIn([FQN.LOCATION_COORDINATES_FQN, 0], '').split(',');
  const latitude = Number.parseFloat(latStr);
  const longitude = Number.parseFloat(lonStr);

  return [longitude, latitude];
};

const getBoundsFromPointsOfInterest = (
  pointsOfInterest :List,
  defaultBounds :number[][]
) :number[][] => {

  if (List.isList(pointsOfInterest) && pointsOfInterest.isEmpty()) return defaultBounds;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  pointsOfInterest.forEach((entity) => {
    const [x, y] = getCoordinates(entity);
    if (!Number.isNaN(x) && !Number.isNaN(y)) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  });

  return [[minX, minY], [maxX, maxY]];
};

// https://stackoverflow.com/a/37794326
const metersToPixelsAtMaxZoom = (
  meters :number,
  coordinate :number
) => meters / 0.075 / Math.cos((coordinate * Math.PI) / 180);

const distanceToPixelsAtMaxZoom = (
  scalar :number,
  coordinate :number,
  unit :string = 'm'
) => {

  const meters = scalar * UNIT_CONVERSION[unit];
  return metersToPixelsAtMaxZoom(meters, coordinate);
};

export {
  getBoundsFromPointsOfInterest,
  getCoordinates,
  metersToPixelsAtMaxZoom,
  distanceToPixelsAtMaxZoom,
};
