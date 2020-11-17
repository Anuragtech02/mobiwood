import React, { createContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = (props) => {
  const [language, setLanguage] = useState("en");

  const onLanguageChange = () => {
    language === "en" ? setLanguage("hi") : setLanguage("en");
  };

  return (
    <LanguageContext.Provider value = { {
      data: language,
      changeLanguage: () => onLanguageChange
    } } >
      { props.children }
    </LanguageContext.Provider>
  )
}

export default LanguageContext;
