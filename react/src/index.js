import 'core-js';
import ReactDOM from 'react-dom'
import { render } from 'react-dom'
import React, { Fragment } from 'react'
import App from './components/App'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import logger from 'redux-logger'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store/store';
import * as Sentry from '@sentry/browser'
import { getConfig } from '../src/config/config'
import CommonUtils from '../src/utils/CommonUtils';
import {setTag} from '../src/sentry/sentry'
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import theme from './assets/theme/theme';


const enableSentry = getConfig().thirdPartyIntegration.sentry.enable;

enableSentry && Sentry.init({
 dsn: getConfig().thirdPartyIntegration.sentry.dsn
});
enableSentry && Sentry.configureScope((scope) => {
  setTag(scope);
});

const GlobalStyle = createGlobalStyle`
  .product {
    display: none;
  }
  .product.product-${CommonUtils.getProduct()} {
    display: block;
  }
`

// const store = createStore(rootReducer, applyMiddleware(logger)

ReactDOM.render(
  <Provider store={store}> 
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <Fragment>
          <GlobalStyle/>
          <App />
        </Fragment>
      </ThemeProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);