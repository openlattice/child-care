import { Colors } from 'lattice-ui-kit';
import { rgba } from 'polished';
import { css, keyframes } from 'styled-components';

const { PURPLES } = Colors;

const loading = keyframes`
  0% {
    background-position:
      /* animation blur */
      -50vw 0,
      /* list item 1*/
      0 5px,
      80% 5px,
      100% 5px,
      /* list item 2*/
      0 37px,
      80% 37px,
      100% 37px,
      /* list item 3*/
      0 71px,
      80% 71px,
      100% 71px,
      /* card bg */
      0 0;
  }

  100% {
    background-position:
      /* animation blur */
      100vw 0,
      /* list item 1*/
      0 5px,
      80% 5px,
      100% 5px,
      /* list item 2*/
      0 37px,
      80% 37px,
      100% 37px,
      /* list item 3*/
      0 71px,
      80% 71px,
      100% 71px,
      /* card bg */
      0 0;
  }
`;

const behaviorItemSkeleton = css`
  min-height: 100px;
  background-repeat: no-repeat;
  background-image:
    /* animation blur */
    linear-gradient(
      90deg,
      ${rgba('white', 0)} 0,
      ${rgba('white', 0.8)} 50%,
      ${rgba('white', 0)} 100%
    ),
    /* grey rectangles with 20px height */
    /* list item 1*/
    linear-gradient(${PURPLES[6]} 1.5em, transparent 0),
    linear-gradient(${PURPLES[6]} 1.5em, transparent 0),
    linear-gradient(${PURPLES[6]} 1.5em, transparent 0),
    /* list item 2*/
    linear-gradient(${PURPLES[6]} 1.5em, transparent 0),
    linear-gradient(${PURPLES[6]} 1.5em, transparent 0),
    linear-gradient(${PURPLES[6]} 1.5em, transparent 0),
    /* list item 3*/
    linear-gradient(${PURPLES[6]} 1.5em, transparent 0),
    linear-gradient(${PURPLES[6]} 1.5em, transparent 0),
    linear-gradient(${PURPLES[6]} 1.5em, transparent 0),
    /* card bg */
    /* gray rectangle that covers whole element */
    linear-gradient(white 100%, transparent 0);
  background-size:
    /* animation blur */
    100% 100%,
    /* list item 1*/
    66% 1.5em,
    15% 1.5em,
    15% 1.5em,
    /* list item 2*/
    66% 1.5em,
    15% 1.5em,
    15% 1.5em,
    /* list item 3*/
    66% 1.5em,
    15% 1.5em,
    15% 1.5em,
    /* card bg */
    100% 100%;
  background-position:
    /* animation blur */
    -50vw 0,
    /* list item 1*/
    0 5px,
    80% 5px,
    100% 5px,
    /* list item 2*/
    0 37px,
    80% 37px,
    100% 37px,
    /* list item 3*/
    0 71px,
    80% 71px,
    100% 71px,
    /* card bg */
    0 0;
  animation: ${loading} 2s infinite;
`;

export default behaviorItemSkeleton;
