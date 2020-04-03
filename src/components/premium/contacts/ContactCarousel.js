// @flow

import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { Constants } from 'lattice';

import ContactCard from './ContactCard';

import * as FQN from '../../../edm/DataModelFqns';
import { getFirstLastFromPerson } from '../../../utils/PersonUtils';

const { OPENLATTICE_ID_FQN } = Constants;

const CarouselWrapper = styled.div`
  overflow-x: auto;
`;

const Carousel = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 10px;
`;

type Props = {
  contacts :List<Map>;
  contactInfoByContactEKID :Map;
  isContactForByContactEKID :Map;
};

const ContactCarousel = (props :Props) => {
  const { contacts, contactInfoByContactEKID, isContactForByContactEKID } = props;

  return (
    <CarouselWrapper>
      <Carousel>
        {
          contacts.map((contact :Map) => {
            const contactEKID = contact.getIn([OPENLATTICE_ID_FQN, 0]);
            const contactInfo = contactInfoByContactEKID.get(contactEKID, Map());
            const isContactFor = isContactForByContactEKID.get(contactEKID, Map());

            const name = getFirstLastFromPerson(contact);
            const relationship = isContactFor.getIn([FQN.RELATIONSHIP_FQN, 0]);
            const notes = contactInfo.getIn([FQN.GENERAL_NOTES_FQN, 0]);
            const phoneType = contactInfo.getIn([FQN.TYPE_FQN, 0]);
            const phoneNumber = contactInfo.getIn([FQN.CONTACT_PHONE_NUMBER_FQN, 0]);
            const extension = contactInfo.getIn([FQN.EXTENTION_FQN, 0]);

            return (
              <ContactCard
                  key={contactEKID}
                  extension={extension}
                  name={name}
                  notes={notes}
                  phoneNumber={phoneNumber}
                  phoneType={phoneType}
                  relationship={relationship} />
            );
          })
        }
      </Carousel>
    </CarouselWrapper>

  );
};

export default ContactCarousel;
