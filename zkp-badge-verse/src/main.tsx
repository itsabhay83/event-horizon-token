
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Buffer } from 'buffer'

// Make Buffer available globally
window.Buffer = Buffer;

document.title = "ZK cPOP - Private Proof. Public Fun."

createRoot(document.getElementById("root")!).render(<App />);
