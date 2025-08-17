import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App';

async function start(): Promise<void> {
  const res = await fetch('/amplify_outputs.json');
  const outputs = await res.json();
  Amplify.configure(outputs);
  createRoot(document.getElementById('root')!).render(<App />);
}

void start();
