import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export default function YoutubeIcon(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props}>
      <svg viewBox="0 0 17 13">
        {/* <defs>
       <style>.cls-1{fill:#715bff;}.cls-2{fill:#fff;}</style>
       </defs> */}
        <path className="cls-1" style={{ fill: '#715bff' }} d="M16.35,2.75A2,2,0,0,0,14.9,1.37,50.78,50.78,0,0,0,8.5,1a50.78,50.78,0,0,0-6.4.33A2,2,0,0,0,.65,2.75,19.41,19.41,0,0,0,.31,6.5a19.41,19.41,0,0,0,.34,3.75A2,2,0,0,0,2.1,11.63,50.78,50.78,0,0,0,8.5,12a50.78,50.78,0,0,0,6.4-.33,2,2,0,0,0,1.45-1.38,19.41,19.41,0,0,0,.34-3.75,19.41,19.41,0,0,0-.34-3.75" />
        <polygon className="cls-2" style={{ fill: '#fff' }} points="6.69 9.22 11.4 6.5 6.69 3.78 6.69 9.22" />

      </svg>
    </SvgIcon>
  );
}
