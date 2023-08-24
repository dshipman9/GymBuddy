import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import reportWebVitals from './app/reportWebVitals';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/bootstrap4-light-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import client from './apolloClient';
import { ApolloProvider } from '@apollo/client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
