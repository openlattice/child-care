import { Colors } from 'lattice-ui-kit';
import { rgba } from 'polished';
import { css, keyframes } from 'styled-components';

const { PURPLES } = Colors;

const loading = keyframes`
  0% {
    background-position:
      /* animation blur */
      -50vw 0,
      0 0,
      0 30px,
      0 52px,
      0 74px,
      /* card bg */
      0 0;
  }

  100% {
    background-position:
      /* animation blur */
      100vw 0,
      0 0,
      0 30px,
      0 52px,
      0 74px,
      /* card bg */
      0 0;
  }
`;

const addressSkeleton = css`
  min-height: 100px;
  background-repeat: no-repeat;
  background-image:
    /* layer 0 animation blur */
    linear-gradient(
      90deg,
      ${rgba('white', 0)} 0,
      ${rgba('white', 0.8)} 50%,
      ${rgba('white', 0)} 100%
    ),
    /* grey rectangles with 20px height */
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    /* gray rectangle that covers whole element */
    linear-gradient(white 100%, transparent 0);
  background-size:
    /* animation blur */
    100% 100%,
    50% 1em,
    80% 1em,
    35% 1em,
    100% 1em,
    /* card bg */
    100% 100%;
  background-position:
    /* animation blur */
    -50vw 0,
    0 0,
    0 30px,
    0 52px,
    0 74px,
    /* card bg */
    0 0;
  animation: ${loading} 2s infinite;
`;

export default addressSkeleton;
