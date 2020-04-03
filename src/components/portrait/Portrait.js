// @flow
import React from 'react';

import styled from 'styled-components';

import PlaceholderPortrait from './PlaceholderPortrait';

import { isEmptyString } from '../../utils/LangUtils';

type Props = {
  imageUrl :string;
  height ? :string;
  width ? :string;
}
const Image = styled.img`
  border-radius: 10%;
  object-fit: cover;
  object-position: 50% 50%;
`;

const Portrait = (props :Props) => {
  const {
    height = '265',
    imageUrl,
    width = '200'
  } = props;

  if (isEmptyString(imageUrl)) {
    return (
      <PlaceholderPortrait
          height={height}
          width={width} />
    );
  }

  return <Image src={imageUrl} height={height} width={width} />;
};

Portrait.defaultProps = {
  height: '265',
  width: '200',
};

export default Portrait;
