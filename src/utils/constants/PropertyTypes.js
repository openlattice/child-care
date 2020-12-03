export default [
  {
    id: 'cd1333ac-2c40-408b-8aab-864a88710e72',
    type: {
      namespace: 'ecps',
      name: 'capacity_0_to_2'
    },
    title: 'Capacity for services: 0-2 y.o.',
    description: 'Capacity for services: 0-2 y.o.',
    schemas: [],
    datatype: 'Int16',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'd454a3f6-dcc4-4cba-a06a-455e8f65755e',
    type: {
      namespace: 'ecps',
      name: 'capacity_2_to_5'
    },
    title: 'Capacity for services: 2-5 y.o.',
    description: 'Capacity for services: 2-5 y.o.',
    schemas: [],
    datatype: 'Int16',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '6cb40859-caaa-4f89-ae4c-204079b89446',
    type: {
      namespace: 'ecps',
      name: 'capacity_5_and_up'
    },
    title: 'Capacity for services: 5+ y.o.',
    description: 'Capacity for services: 5+ y.o.',
    schemas: [],
    datatype: 'Int16',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'e80db737-2485-4318-b110-380806053223',
    type: {
      namespace: 'ecps',
      name: 'capacity_age_unknown'
    },
    title: 'Total capacity for services',
    description: 'Total capacity for services',
    schemas: [],
    datatype: 'Int16',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'd2e21b56-1e6d-43b7-a0f0-688704f7af17',
    type: {
      namespace: 'ecps',
      name: 'clients_served'
    },
    title: 'Type of clients served at the Essential Care Provider Service',
    description: 'Type of clients served at the Essential Care Provider Service',
    schemas: [],
    datatype: 'String',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '23d12b34-8922-4655-a8c5-e7a375eb179b',
    type: {
      namespace: 'ecps',
      name: 'facility_address'
    },
    title: 'Facility Address',
    description: 'Facility Address',
    schemas: [],
    datatype: 'String',
    pii: true,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'beb50d67-b34c-4edc-b681-29ec2089d638',
    type: {
      namespace: 'ecps',
      name: 'facility_city'
    },
    title: 'Facility City',
    description: 'Facility City',
    schemas: [],
    datatype: 'String',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'ec9940ac-4109-4d87-908b-71b167d057a0',
    type: {
      namespace: 'ecps',
      name: 'facility_email'
    },
    title: 'Email address of the facility',
    description: 'Email address of the facility',
    schemas: [],
    datatype: 'String',
    pii: true,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '6f866f9f-f460-40a4-8d55-e639c85c563e',
    type: {
      namespace: 'ecps',
      name: 'facility_name'
    },
    title: 'Facility Name',
    description: 'Facility Name',
    schemas: [],
    datatype: 'String',
    pii: true,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'bdbf7335-f7f5-463f-8b12-e5fa8d0f10a0',
    type: {
      namespace: 'ecps',
      name: 'facility_phone'
    },
    title: 'Facility Phone Number',
    description: 'Facility Phone Number',
    schemas: [],
    datatype: 'String',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'c401ebfc-0c80-4f77-b35f-81044bb75f33',
    type: {
      namespace: 'ecps',
      name: 'facility_type'
    },
    title: 'Facility Type',
    description: 'Facility Type',
    schemas: [],
    datatype: 'String',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'ac1c5766-3e7a-48c2-a7d2-95dac6bf72da',
    type: {
      namespace: 'ecps',
      name: 'facility_zip'
    },
    title: 'Facility Zip code',
    description: 'Facility Zip code',
    schemas: [],
    datatype: 'Int64',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '29c1e895-3fbd-47c8-8bd5-33b5c71987e7',
    type: {
      namespace: 'ecps',
      name: 'friday_end'
    },
    title: 'Hours Availability: Friday End',
    description: 'Hours Availability: Friday End',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '4761a65d-8fac-4aea-9c50-75289bd11721',
    type: {
      namespace: 'ecps',
      name: 'friday_start'
    },
    title: 'Hours Availability: Friday Start',
    description: 'Hours Availability: Friday Start',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '2024cee1-9a9c-4f91-ac47-4c912773ed06',
    type: {
      namespace: 'ecps',
      name: 'google_place_id'
    },
    title: 'PlaceId from Google Maps API',
    description: 'PlaceId from Google Maps API',
    schemas: [],
    datatype: 'String',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '3ab48e81-7025-42b4-9231-46afad9da5a4',
    type: {
      namespace: 'ecps',
      name: 'hide_contact'
    },
    title: 'Hide contact information',
    description: '',
    schemas: [],
    datatype: 'Boolean',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '41570114-b499-4289-9e04-a16e6a1e7e92',
    type: {
      namespace: 'ecps',
      name: 'hours_unknown'
    },
    title: 'Hours Unknown',
    description: 'Hours Unknown',
    schemas: [],
    datatype: 'Boolean',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '481b9775-c29a-496b-a18e-ee6e9363939b',
    type: {
      namespace: 'ecps',
      name: 'license_complaints'
    },
    title: 'Number of complaints of the facility',
    description: 'Number of complaints of the facility',
    schemas: [],
    datatype: 'Int32',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '423a8d95-ebda-475a-9cad-4bbc9b475ce6',
    type: {
      namespace: 'ecps',
      name: 'license_last_inspection_date'
    },
    title: 'Date of the last inspection of the facility.',
    description: 'Date of the last inspection of the facility.',
    schemas: [],
    datatype: 'Date',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'e7b13899-81b6-48c1-89d0-357b69d9268c',
    type: {
      namespace: 'ecps',
      name: 'license_number'
    },
    title: 'License Number',
    description: 'License Number',
    schemas: [],
    datatype: 'String',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '32fb954b-7e2f-4f71-b883-6677148f9158',
    type: {
      namespace: 'ecps',
      name: 'license_url'
    },
    title: 'URL of the License with the local government',
    description: '',
    schemas: [],
    datatype: 'String',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'f9a7d9a9-bcea-40ce-947a-d5122e7f8580',
    type: {
      namespace: 'ecps',
      name: 'locationcoordinates'
    },
    title: 'Location Coordinates',
    description: 'Location Coordinates',
    schemas: [],
    datatype: 'GeographyPoint',
    pii: true,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '94136b95-cff5-4085-9ba4-0c3242510aab',
    type: {
      namespace: 'ecps',
      name: 'monday_end'
    },
    title: 'Hours Availability: Monday End',
    description: 'Hours Availability: Monday End',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'af2a4885-e6f8-4c7c-9a61-7e13354866e6',
    type: {
      namespace: 'ecps',
      name: 'monday_start'
    },
    title: 'Hours Availability: Monday Start',
    description: 'Hours Availability: Monday Start',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'a3472f64-8d33-473f-b64b-b20b2c9ef8a4',
    type: {
      namespace: 'ecps',
      name: 'payment_options'
    },
    title: 'Payment Options',
    description: 'Payment Options',
    schemas: [],
    datatype: 'String',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '466660f7-c091-411f-b7f9-297fc24b8250',
    type: {
      namespace: 'ecps',
      name: 'saturday_start'
    },
    title: 'Hours Availability: Saturday Start',
    description: 'Hours Availability: Saturday Start',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '5ec065c2-120a-40e6-b205-78f721c45f7b',
    type: {
      namespace: 'ecps',
      name: 'point_of_contact_name'
    },
    title: 'Point of Contact Name',
    description: 'Point of Contact Name',
    schemas: [],
    datatype: 'String',
    pii: true,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '1d47c267-8347-4eec-9d32-604ba6103c33',
    type: {
      namespace: 'ecps',
      name: 'thursday_end'
    },
    title: 'Hours Availability: Thursday End',
    description: 'Hours Availability: Thursday End',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'acb85491-7735-4f6c-b5c9-6d672da70302',
    type: {
      namespace: 'ecps',
      name: 'pop_up'
    },
    title: 'Pop Up',
    description: 'Pop Up',
    schemas: [],
    datatype: 'Boolean',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'b1d980aa-34d9-44ab-97aa-315bc71852c1',
    type: {
      namespace: 'ecps',
      name: 'saturday_end'
    },
    title: 'Hours Availability: Saturday End',
    description: 'Hours Availability: Saturday End',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '2d797ac6-426f-4085-a768-92ac0647ea3e',
    type: {
      namespace: 'ecps',
      name: 'tuesday_end'
    },
    title: 'Hours Availability: Tuesday End',
    description: 'Hours Availability: Tuesday End',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '42983b12-3a74-4f26-b7a7-86dae99a509b',
    type: {
      namespace: 'ecps',
      name: 'status'
    },
    title: 'Status',
    description: 'Status',
    schemas: [],
    datatype: 'String',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '2f59a905-5506-41fe-b31d-05ef80907716',
    type: {
      namespace: 'ecps',
      name: 'sunday_end'
    },
    title: 'Hours Availability: Sunday End',
    description: 'Hours Availability: Sunday End',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'aef9abe0-4a60-4296-96cf-a401e97a9e12',
    type: {
      namespace: 'ecps',
      name: 'sunday_start'
    },
    title: 'Hours Availability: Sunday Start',
    description: 'Hours Availability: Sunday Start',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '81c2f9b9-5147-463c-8ec8-4a17dd17dfa7',
    type: {
      namespace: 'ecps',
      name: 'thursday_start'
    },
    title: 'Hours Availability: Thursday Start',
    description: 'Hours Availability: Thursday Start',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '7d41aed9-1fc1-4832-b193-f3818aaececa',
    type: {
      namespace: 'ecps',
      name: 'tuesday_start'
    },
    title: 'Hours Availability: Tuesday Start',
    description: 'Hours Availability: Tuesday Start',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'c16ccc3d-3fe1-4948-accc-ed88702384cb',
    type: {
      namespace: 'ecps',
      name: 'url'
    },
    title: 'URL',
    description: 'URL',
    schemas: [],
    datatype: 'String',
    pii: true,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'f2a3e204-2808-4da4-b742-756059087457',
    type: {
      namespace: 'ecps',
      name: 'wednesday_end'
    },
    title: 'Hours Availability: Wednesday End',
    description: 'Hours Availability: Wednesday End',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: 'c4f263ee-b9e1-4d67-aba1-ca6660c14936',
    type: {
      namespace: 'ecps',
      name: 'wednesday_start'
    },
    title: 'Hours Availability: Wednesday Start',
    description: 'Hours Availability: Wednesday Start',
    schemas: [],
    datatype: 'DateTimeOffset',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  },
  {
    id: '57dcef08-6d0f-4b46-b676-db92790b74cd',
    type: {
      namespace: 'ecps',
      name: 'vacancies'
    },
    title: 'Boolean indicating whether the facility has vacancies',
    description: 'Boolean indicating whether the facility has vacancies',
    schemas: [],
    datatype: 'Boolean',
    pii: false,
    multiValued: true,
    analyzer: 'STANDARD',
    indexType: 'BTREE'
  }
];
