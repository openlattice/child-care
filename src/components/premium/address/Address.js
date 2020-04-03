// @flow
import React from 'react';
import styled from 'styled-components';
import { IconSplash } from 'lattice-ui-kit';
import { isEmptyString } from '../../../utils/LangUtils';
import { addressSkeleton } from '../../skeletons';

const H2 = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
`;

const AddressSkeleton = styled.div`
  ${addressSkeleton};
`;

type Props = {
  cityStateZip :string;
  isLoading :boolean;
  line2 :string;
  name :string;
  street :string;
};

const Address = (props :Props) => {
  const {
    cityStateZip,
    isLoading,
    line2,
    name,
    street,
  } = props;

  const emptyAddress = [name, street, line2, cityStateZip].every(isEmptyString);

  if (isLoading) return <AddressSkeleton />;
  if (emptyAddress) return <IconSplash caption="No address." />;

  return (
    <>
      <H2>
        {name}
      </H2>
      <div>{street}</div>
      <div>{line2}</div>
      <div>{cityStateZip}</div>
    </>
  );
};

Address.defaultProps = {
  cityStateZip: '',
  isLoading: false,
  line2: '',
  name: '',
  street: '',
};

export default Address;
