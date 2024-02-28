import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetInlineAnchorList } from 'plasmo'
import React, { useEffect, useState } from 'react'

export const config: PlasmoCSConfig = {
  matches: ['https://chat.openai.com/*']
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const elements = document.querySelectorAll(".relative.flex.w-full.flex-col.agent-turn");
  const parentElements = Array.from(elements).map(element => element.parentElement).filter(parent => parent !== null);
  return parentElements as unknown as NodeList;
};


export const getShadowHostId = () => 'custom-button-container'

const CustomButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const checkConditions = async () => {
      const someCondition = true; 
      setShowButton(someCondition);
    };

    checkConditions();
  }, []);

  return (
    <>
      {showButton && (
        <button style={{
          position: 'relative',
          textAlign: 'center',
          margin: '10px',
          padding: '5px 10px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          backgroundColor: '#007BFF',
          borderRadius: '5px',
          cursor: 'pointer',
        }}>
          Custom Button
        </button>
      )}
    </>
  );
};

export default CustomButton;
