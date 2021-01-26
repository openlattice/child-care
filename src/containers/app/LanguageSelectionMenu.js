/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { faGlobe } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Select } from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';

import { switchLanguage } from './AppActions';

import CustomColors from '../../core/style/Colors';
import { LANGUAGES } from '../../utils/constants/labels';

const { CA_BLUE02 } = CustomColors;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
`;

const customStyles = {
  menu: (provided) => ({
    ...provided,
    backgroundColor: CA_BLUE02,
  }),
  control: (provided) => ({
    ...provided,
    border: 'none',
    backgroundColor: CA_BLUE02
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: CA_BLUE02,
  }),
  option: (provided) => ({
    ...provided,
    width: '100%',
    color: 'white',
    backgroundColor: CA_BLUE02,
  })
};

const LANG_OPTIONS = [
  { label: 'English', value: LANGUAGES.en },
  { label: 'Español', value: LANGUAGES.es }
];

const LanguageSelectionMenu = () => {
  const dispatch = useDispatch();
  const switchLang = (lang :Object) => {
    const { value } = lang;
    dispatch(switchLanguage(value));
  };

  return (
    <Wrapper>
      <Select
          aria-label="language"
          menuPortalTarget={document.body}
          inputIcon={<FontAwesomeIcon color="white" icon={faGlobe} fixedWidth />}
          onChange={switchLang}
          options={LANG_OPTIONS}
          styles={customStyles}
          value={{ label: 'English', value: LANGUAGES.en }} />
    </Wrapper>
  );
};

export default LanguageSelectionMenu;
