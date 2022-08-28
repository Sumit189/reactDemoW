import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Signup from './Signup';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Onboarding from './Onboarding';
import Signin from './Signin';
const root = ReactDOM.createRoot(document.getElementById('root'));

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Signup />} />
        <Route path="signin" element={<Signin/>} />
        <Route path="onboarding" element={<Onboarding/>} />
      </Routes>
    </BrowserRouter>
  )
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
