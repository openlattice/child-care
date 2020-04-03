import { OTHER } from '../../../utils/constants/CrisisReportConstants';

export const BIOLOGICAL = 'Biologically Induced (Depression / Anxiety)';
export const CHEMICAL = 'Chemically Induced (Crack / Meth / PCP / Heroin)';

export const NATURE_OF_CRISIS = [
  BIOLOGICAL,
  'Medically Induced (Traumatic Brain Injury / UTI)',
  CHEMICAL,
  'Excited Delirium',
  'Unknown'
];

export const BIOLOGICAL_CAUSES = [
  'Depression',
  'Anxiety',
  'Schizophrenia',
  'Bipolar',
  'PTSD'
];

export const CHEMICAL_CAUSES = [
  'OTC',
  'Prescription',
  'Illicit',
  'Poison'
];

export const ASSISTANCES = [
  'Case Manager / Service Provider',
  'Spouse / Partner / Girlfriend / Boyfriend',
  'Family Member',
  'Friend',
  'Neighbor',
  'None',
  OTHER
];

export const HOMELESS_STR = 'Unsheltered Homeless';

export const HOUSING_SITUATIONS = [
  'Stable Housing',
  'Service Provider Housing',
  'Homeless Shelter',
  HOMELESS_STR,
  'Unknown'
];
