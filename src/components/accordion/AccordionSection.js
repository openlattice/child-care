// @flow
import React, { Component } from 'react';
import type { ComponentType, Node } from 'react';

import styled from 'styled-components';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, CardSegment } from 'lattice-ui-kit';

import AccordionHeader from './AccordionHeader';

const AccordionWrapper = styled(CardSegment)`
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const LabelWrapper = styled.div`
  display: flex;
  flex: 0 1 auto;
  align-items: center;
`;

const ToggleIcon = styled(FontAwesomeIcon).attrs((props :any) => ({
  icon: props.open ? faChevronUp : faChevronDown
}))``;

const ToggleButton = styled(Button)`
  color: inherit;
`;

export type AccordionSectionProps = {
  alwaysOpen :boolean;
  caption :string;
  children :Node;
  headline :string;
  index :number;
  isOpen :boolean;
  onClick :(index :number) => void;
  titleComponent :ComponentType<any>;
};

class AccordionSection extends Component<AccordionSectionProps> {

  static defaultProps = {
    alwaysOpen: false,
    caption: undefined,
    headline: undefined,
    titleComponent: AccordionHeader,
  };

  onClick = () => {
    const { index, onClick } = this.props;
    onClick(index);
  }

  render() {
    const {
      alwaysOpen,
      caption,
      children,
      headline,
      isOpen,
      titleComponent: TitleComponent,
    } = this.props;

    return (
      <AccordionWrapper isOpen={isOpen}>
        <HeaderWrapper onClick={this.onClick}>
          <LabelWrapper>
            <TitleComponent
                caption={caption}
                headline={headline}
                isOpen={isOpen} />
          </LabelWrapper>
          {
            !alwaysOpen && (
              <ToggleButton mode="subtle">
                <ToggleIcon open={isOpen} onClick={this.onClick} />
              </ToggleButton>
            )
          }
        </HeaderWrapper>
        {
          isOpen && children
        }
      </AccordionWrapper>
    );
  }
}

export default AccordionSection;
