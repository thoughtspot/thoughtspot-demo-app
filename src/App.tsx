import { useState } from 'react';
import './App.css';
import PerformanceHub from './PerformanceHub';
import { AuthStatus, AuthType, init } from '@thoughtspot/visual-embed-sdk';


const tsURL = process.env.REACT_APP_TS_HOST || 'https://embed-1-do-not-delete.thoughtspotstaging.cloud';
const authServiceUrl = (process.env.REACT_APP_AUTH_SERVICE_URL || '').endsWith('/')
  ? (process.env.REACT_APP_AUTH_SERVICE_URL || '').slice(0, -1)
  : process.env.REACT_APP_AUTH_SERVICE_URL || '';

const tsUserName = process.env.REACT_APP_TS_USER_NAME || 'aditya.mittal';
const orgId = Number(process.env.REACT_APP_TS_ORG_ID);

function App() {
  const [isInitialised, setIsInitialised] = useState(false);
  init({
    thoughtSpotHost: tsURL+"/",
    authType: AuthType.TrustedAuthToken,
    getAuthToken: () => {
      return fetch(`${authServiceUrl}/api/v2/gettoken/` + tsUserName, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({orgId: orgId})
      })
      .then((r) => r.text())
      .catch((e) => {
        console.log(e);
        return "";
      });
    },
    username: tsUserName,
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
  
  }).on(AuthStatus.SDK_SUCCESS, ()=>{
    setIsInitialised(true);

  });
  return (
    <div className="App">
      <div className='flex flex-row align-start items-center pl-4 h-16 w-full bg-slate-600 text-white text-2xl font-bold'>
        <div className="flex w-2/4">ThoughtSpot Everywhere</div>
      </div>
      <div style={{height:'calc(100% - 4rem)'}} className='flex w-full overflow-auto'>
      <PerformanceHub tsURL={tsURL} isInitialised={isInitialised}></PerformanceHub>
      </div>
    </div>
  );
}

export default App;
