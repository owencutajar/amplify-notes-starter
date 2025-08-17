import React from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App.jsx';

const mount = document.getElementById('root');

async function start() {
  try {
    // Use document.baseURI for robust base resolution across Amplify subpaths
    const url = new URL('amplify_outputs.json', document.baseURI).toString();
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load config: ${res.status}`);
    const outputs = await res.json();
    console.debug('[Amplify outputs]', outputs);
    Amplify.configure(outputs);
    createRoot(mount).render(<App />);
  } catch (err) {
    console.error(err);
    if (mount) {
      mount.innerHTML = `<div style="font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto;">
        <h1>Setup error</h1>
        <p>Could not load <code>amplify_outputs.json</code>. Please check Amplify Hosting is connected to this branch and the backend has deployed.</p>
        <pre style="white-space: pre-wrap; background: #f8f8f8; padding: 12px; border-radius: 8px;">${String(err)}</pre>
      </div>`;
    }
  }
}

start();
