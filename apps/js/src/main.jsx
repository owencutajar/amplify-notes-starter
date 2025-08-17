import React from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App.jsx';

async function start() {
  // Amplify Hosting exposes the config at this path at runtime
  const res = await fetch('/amplify_outputs.json');
  const outputs = await res.json();
  Amplify.configure(outputs);
  createRoot(document.getElementById('root')).render(<App />);
}

start();
