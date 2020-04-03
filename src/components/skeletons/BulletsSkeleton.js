import { Colors } from 'lattice-ui-kit';
import { rgba } from 'polished';
import { css, keyframes } from 'styled-components';

const { PURPLES } = Colors;

const loading = keyframes`
  0% {
    background-position:
      /* animation blur */
      -50vw 0,
      /* bulleted item 1 */
      3px 5px,
      20px 0,
      /* bulleted item 2 */
      3px 27px,
      20px 22px,
      /* bulleted item 3 */
      3px 49px,
      20px 44px,
      /* card bg */
      0 0;
  }

  100% {
    background-position:
      /* animation blur */
      100vw 0,
      /* bulleted item 1 */
      3px 5px,
      20px 0,
      /* bulleted item 2 */
      3px 27px,
      20px 22px,
      /* bulleted item 3 */
      3px 49px,
      20px 44px,
      /* card bg */
      0 0;
  }
`;

const bulletsSkeleton = css`
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
    /* bulleted item 1*/
    radial-gradient(circle 3px, ${PURPLES[6]} 100%, transparent 0),
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    /* bulleted item 2 */
    radial-gradient(circle 3px, ${PURPLES[6]} 100%, transparent 0),
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    /* bulleted item 3 */
    radial-gradient(circle 3px, ${PURPLES[6]} 100%, transparent 0),
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    /* card bg */
    /* gray rectangle that covers whole element */
    linear-gradient(white 100%, transparent 0);
  background-size:
    /* animation blur */
    100% 100%,
    /* bulleted item 1 */
    6px 6px,
    85% 1em,
    /* bulleted item 2 */
    6px 6px,
    70% 1em,
    /* bulleted item 3 */
    6px 6px,
    75% 1em,
    /* card bg */
    100% 100%;
  background-position:
    /* animation blur */
    -50vw 0,
    /* bulleted item 1 */
    3px 5px,
    20px 0,
    /* bulleted item 2 */
    3px 27px,
    20px 22px,
    /* bulleted item 3 */
    3px 49px,
    20px 44px,
    /* card bg */
    0 0;
  animation: ${loading} 2s infinite;
`;

export default bulletsSkeleton;
