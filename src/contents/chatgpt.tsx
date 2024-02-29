import { useStorage } from '@plasmohq/storage/hook';
import type { PlasmoGetInlineAnchorList } from 'plasmo';
import React from 'react';

export const config = {
  matches: ['https://chat.openai.com/*'],
  all_frames: true,
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const elements = document.querySelectorAll(".relative.flex.w-full.flex-col.agent-turn");
  const parentElements = Array.from(elements).map(element => element.parentElement).filter(parent => parent !== null);
  return parentElements as unknown as NodeList;
};

const CustomButton = () => {
  const [count] = useStorage("myCountKey", 0);
  const n = 3 - count;  
  return (
    <div style={{position:'relative', backgroundColor:'black', width: '100%'}}>
      <div style={{position:'relative', width:'40rem'}}>
        <div style={{color: 'white'}}>gugure</div>
        <div style={{color:'white'}}>残りの回数は{n}回です</div>
      </div>
    </div>
  );
};

export default CustomButton;
