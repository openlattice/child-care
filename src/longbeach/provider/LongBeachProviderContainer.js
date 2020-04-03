// @flow
import React, { useEffect } from 'react';

import { CardStack } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';

import LongBeachProviderCard from './LongBeachProviderCard';
import { getLBProviders } from './LongBeachProviderActions';

import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { OPENLATTICE_ID_FQN } from '../../edm/DataModelFqns';

const LongBeachProviderContainer = () => {
  const providers = useSelector((store) => store.getIn(['longBeach', 'providers', 'providers']));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLBProviders());
  }, [dispatch]);

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <CardStack>
          {
            providers.map((provider, idx) => {
              const key = provider.getIn([OPENLATTICE_ID_FQN, 0]) || idx;
              return (
                <LongBeachProviderCard key={key} provider={provider} />
              );
            }).valueSeq()
          }
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default LongBeachProviderContainer;
