import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { LoginContextProvider } from './context/LoginContext';
import { Home } from './pages/Home';

function App() {
  return (
    <LoginContextProvider>
      <div className="App">
        <Home />
      </div>
    </LoginContextProvider>
  );
}

export default App;
