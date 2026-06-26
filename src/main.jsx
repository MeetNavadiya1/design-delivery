import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { TooltipProvider } from "@/components/ui/tooltip";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <TooltipProvider delayDuration={700}>
      <Toaster position="top-right" richColors />
      <App />
    </TooltipProvider>
  </BrowserRouter>,
);
