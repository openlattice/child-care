const orgSelectStyles = {
  container: (base, state) => {

    const { isDisabled } = state;
    return {
      ...base,
      cursor: isDisabled ? 'not-allowed' : 'default',
      marginLeft: '30px',
      pointerEvents: 'auto',
      width: '300px'
    };
  },
  control: (base, state) => {

    const { isFocused, isDisabled, selectProps } = state;
    let backgroundColor = isFocused ? 'white' : '#f9f9fd';
    let border = isFocused ? 'solid 1px #6124e2' : 'solid 1px #dcdce7';

    if (selectProps && selectProps.noBorder) {
      backgroundColor = 'transparent';
      border = 'none';
    }

    const style = {
      backgroundColor,
      border,
      borderRadius: '3px',
      boxShadow: 'none',
      fontSize: '12px',
      lineHeight: 'normal',
      minHeight: '30px',
      pointerEvents: isDisabled ? 'none' : 'auto',
      ':hover': {
        backgroundColor,
        border,
      },
    };
    return { ...base, ...style };
  },
  menuList: (base) => ({ ...base, borderRadius: '4px' }),
  menuPortal: (base) => ({ ...base, zIndex: 550 }),
  menu: (base, state) => {
    const { selectProps } = state;
    const display = (selectProps && selectProps.hideMenu) ? 'none' : 'block';
    return { ...base, display };
  },
  option: (base, state) => {

    const { isFocused, isSelected } = state;
    const color = isSelected ? '#6124e2' : '#555e6f';
    let backgroundColor = 'white';

    if (isSelected) {
      backgroundColor = '#e6e6f7';
    }
    else if (isFocused) {
      backgroundColor = '#f0f0f7';
    }

    return {
      ...base,
      color,
      backgroundColor,
      fontSize: '12px',
      ':active': {
        backgroundColor: '#e4d8ff'
      }
    };
  },
  singleValue: (base, state) => {
    const { isDisabled } = state;
    return { ...base, color: isDisabled ? '#8e929b' : '#2e2e34' };
  },
  indicatorSeparator: () => ({ display: 'none' }),
  indicatorsContainer: (base) => ({ ...base, marginRight: '5px', color: '#b6bbc7' }),
  clearIndicator: (base) => ({ ...base, padding: '0', margin: '5px' }),
  dropdownIndicator: (base, state) => {
    const { selectProps } = state;
    const style = {
      color: '#b6bbc7',
      padding: '0',
      margin: '4px',
      display: selectProps && selectProps.hideMenu ? 'none' : 'flex'
    };
    return { ...base, ...style };
  },
  valueContainer: (base) => ({ ...base, padding: '0 10px' }),
};

export { orgSelectStyles };
