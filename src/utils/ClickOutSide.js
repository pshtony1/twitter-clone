/* eslint-disable */

import { useRef, useEffect } from "react";

export const useClickOutSide = (buttonQuery, toggleProfile) => {
  const element = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (element.current && !element.current.contains(event.target)) {
        const button = document.querySelector(buttonQuery);

        if (!button.contains(event.target)) {
          toggleProfile();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [element]);

  return element;
};
