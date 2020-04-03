// @flow

import React, { Component } from 'react';

import styled from 'styled-components';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Colors } from 'lattice-ui-kit';

const { NEUTRALS } = Colors;

const DropdownButtonWrapper = styled.div`
  display: inline-flex;
  position: relative;
`;

const BaseButton = styled(Button)`
  svg {
    margin-left: 10px;
  }
`;

const MenuContainer = styled.div`
  background-color: white;
  border-radius: 3px;
  border: 1px solid ${NEUTRALS[4]};
  bottom: auto;
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  left: auto;
  max-width: 400px;
  min-width: max-content;
  overflow: visible;
  padding: 4px 0;
  position: absolute;
  right: 0;
  top: ${(props) => (props.offset === 'sm' ? '33px' : '45px')};
  width: auto;
  z-index: 1;

  button {
    padding: 8px 12px;
    text-transform: none;
    font-size: 14px;
    color: ${NEUTRALS[0]};
    border: none;
    min-width: fit-content;

    &:hover {
      background-color: ${NEUTRALS[6]};
    }
  }
`;

type Props = {
  isLoading :boolean;
  options :{ label :string, onClick :() => void }[];
  size ? :string;
  title :string;
};

type State = {
  open :boolean
};

class DropdownButton extends Component<Props, State> {

  static defaultProps = {
    size: undefined,
    isLoading: false,
  };

  menuRef = React.createRef<MenuContainer>();
  constructor(props :Props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toggleDropdown = (e :SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const { open } = this.state;
    this.setState({ open: !open });
  };

  closeDropdown = (e :SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    this.setState({ open: false });
  }

  render() {
    const { open } = this.state;
    const {
      isLoading,
      options,
      size,
      title
    } = this.props;

    return (
      <DropdownButtonWrapper>
        <BaseButton
            isLoading={isLoading}
            onBlur={this.closeDropdown}
            onClick={this.toggleDropdown}
            size={size}>
          {title}
          <FontAwesomeIcon icon={faChevronDown} fixedWidth />
        </BaseButton>
        { open && (
          <MenuContainer offset={size}>
            {options.map((option) => (
              <button
                  type="button"
                  key={option.label}
                  onClick={this.closeDropdown}
                  onMouseDown={option.onClick}>
                {option.label}
              </button>
            ))}
          </MenuContainer>
        )}
      </DropdownButtonWrapper>
    );
  }
}

export default DropdownButton;
