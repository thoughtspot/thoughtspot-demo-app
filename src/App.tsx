import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Tabs from './Tabs';
import { AuthType, init } from '@thoughtspot/visual-embed-sdk';
import { FiUser } from 'react-icons/fi';


const tsURL = "https://se-thoughtspot-cloud.thoughtspot.cloud/"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None,
    callPrefetch: true,
  });
  return (
    <div className="App">
      <div className='flex flex-row align-start items-center pl-4 h-16 w-full bg-slate-600 text-white text-2xl font-bold'>
        <div className="flex w-2/4">Performance Hub</div>
        <div className="flex w-2/4 align-end justify-end mr-8">
          <FiUser></FiUser>
        </div>
      </div>
      <Tabs tsURL={tsURL}></Tabs>
    </div>
  );
}

export default App;
