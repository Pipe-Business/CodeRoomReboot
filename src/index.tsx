import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const MainPage = React.lazy(() => import('./pages/main/MainPage.tsx'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/*<App />*/}
    <BrowserRouter>
    <Routes>
      <Route path = '/' element = {<MainPage />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


