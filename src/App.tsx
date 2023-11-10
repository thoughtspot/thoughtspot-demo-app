import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import PerformanceHub from './PerformanceHub';
import { AuthStatus, AuthType, getSessionInfo, init } from '@thoughtspot/visual-embed-sdk';
import { FiUser } from 'react-icons/fi';


const tsURL = "https://se-thoughtspot-cloud.thoughtspot.cloud"
const worksheet = '782b50d1-fe89-4fee-812f-b5f9eb0a552d'
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  init({
    thoughtSpotHost: tsURL+"/",
    authType: AuthType.None,
    callPrefetch: true,
    customizations: 
      {
      style: {
      customCSS: {
          variables: {
          "--ts-var-root-background": "#f6f8fa",
          "--ts-var-viz-border-radius": "25px",
          "--ts-var-viz-box-shadow":"0px"
          },
          rules_UNSTABLE: {
              '[data-testid="pinboard-header"]': {
                  'display': 'none !important'
              },
              '.ReactModalPortal .ReactModal__Overlay':{
                  'background-color': '#ffffff00 !important'
              },
              '.answer-module__searchCurtain':{
                  'background-color': '#ffffff00 !important'
              }
          }
          
      }
      }
  }
  
  }).on(AuthStatus.SUCCESS, (data)=>{
    getSessionInfo().then((session)=>{
      console.log(session,"sess")
    })

  });
  return (
    <div className="App">
      <div className='flex flex-row align-start items-center pl-4 h-16 w-full bg-slate-600 text-white text-2xl font-bold'>
        <div className="flex w-2/4">Performance Hub</div>
        <div className="flex w-2/4 align-end justify-end mr-8">
          <FiUser></FiUser>
        </div>
      </div>
      <div style={{height:'calc(100% - 4rem)'}} className='flex w-full overflow-auto'>
      <PerformanceHub tsURL={tsURL} worksheet={worksheet}></PerformanceHub>
      </div>
    </div>
  );
}

export default App;
