import { Colors } from 'lattice-ui-kit';
import { rgba } from 'polished';
import { css, keyframes } from 'styled-components';

const { PURPLES } = Colors;

const loading = keyframes`
  0% {
    background-position:
      /* animation blur */
      -50vw 0,
      25% 0,
      72% 0.35em;
  }

  100% {
    background-position:
      /* animation blur */
      100vw 0,
      25% 0,
      72% 0.35em;
  }
`;

const crisisCountSkeleton = css`
  min-height: 1.5em;
  background-repeat: no-repeat;
  background-image:
    /* animation blur */
    linear-gradient(
      90deg,
      ${rgba('white', 0)} 0,
      ${rgba('white', 0.8)} 50%,
      ${rgba('white', 0)} 100%
    ),
    /* list item 1*/
    /* light rectangles with 20px height */
    linear-gradient(${PURPLES[6]} 1.5em, transparent 0),
    linear-gradient(${PURPLES[6]} 1em, transparent 0);
  background-size:
    /* animation blur */
    100% 100%,
    35% 1.5em,
    25% 1em;
  background-position:
    /* animation blur */
    -50vw 0,
    25% 0,
    72% 0.35em;
  animation: ${loading} 2s infinite;
`;

export default crisisCountSkeleton;
