import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export default function TwitchIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <svg
        viewBox="0 0 14.59 14.59"
      >
        {/* <defs>
           <style>.cls-1{fill:#e2d7ff;}.cls-2{fill:#715bff;}</style> 
         </defs> 
        */}
        <path className="cls-1" style={{ fill: '#e2d7ff' }} d="M2.47,1.52v9.32h3.2V12.6l.11-.09,1.61-1.57a.35.35,0,0,1,.27-.11H11a.37.37,0,0,0,.25-.1c.7-.66,1.39-1.34,2.08-2a.31.31,0,0,0,.11-.25c0-2.26,0-4.53,0-6.79V1.52ZM3.86,14.78V13H.21c0-.07,0-.13,0-.19Q.2,7.93.21,3a.9.9,0,0,1,0-.28C.52,1.93.8,1.14,1.06.34A.18.18,0,0,1,1.26.2H14.79V.39q0,4.25,0,8.49a.34.34,0,0,1-.13.28L10.8,12.92a.4.4,0,0,1-.29.12H8.15a.48.48,0,0,0-.36.14c-.52.52-1,1-1.57,1.53a.37.37,0,0,1-.2.09H3.92Z" transform="translate(-0.2 -0.2)" />
        <path className="cls-2" style={{ fill: '#715bff' }} d="M7.49,4.2V8.14H6.14V4.2Z" transform="translate(-0.2 -0.2)" />
        <path className="cls-2" style={{ fill: '#715bff' }} d="M11.13,8.15H9.81V4.2h1.32Z" transform="translate(-0.2 -0.2)" />

      </svg>
    </SvgIcon>
  );
}
