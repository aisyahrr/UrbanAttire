import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import App from './App.tsx'
import { HeadProvider } from "react-head";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeadProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HeadProvider>
  </StrictMode>
)
