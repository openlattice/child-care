// @flow

import React from 'react';

import { Button } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';

import ExpandableSection from './ExpandableSection';

import { RESOURCES_PATH } from '../../../core/router/Routes';
import { goToPath } from '../../../core/router/RoutingActions';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { LABELS } from '../../../utils/constants/labels';
import { InfoText, Row } from '../../styled';

const ResourceSection = () => {
  const dispatch = useDispatch();
  const goToFAQs = () => dispatch(goToPath(RESOURCES_PATH));
  const getText = useSelector(getTextFnFromState);

  return (
    <ExpandableSection title={getText(LABELS.PROVIDER_RESOURCES)}>
      <InfoText>{getText(LABELS.PROVIDER_RESOURCES_DESCRIPTION)}</InfoText>
      <Row>
        <Button color="primary" onClick={goToFAQs} size="small" variant="text">
          {`${getText(LABELS.LINK_TO)} ${getText(LABELS.RESOURCES)}`}
        </Button>
      </Row>
    </ExpandableSection>
  );
};

export default ResourceSection;
