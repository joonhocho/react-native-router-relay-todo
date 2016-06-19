import React from 'react';
import Relay from 'react-relay';
import {
  applyRouterMiddleware,
  Router,
  useRouterHistory,
} from 'react-router-native';
import useRelay from 'react-router-relay';
import RelayLocalSchema from 'relay-local-schema';

import routes from './routes';
import schema from './data/schema';
import {Buffer} from 'buffer';
global.Buffer = Buffer;

Relay.injectNetworkLayer(
  new RelayLocalSchema.NetworkLayer({ schema })
);

export default () => (
  <Router
    addressBar
    render={applyRouterMiddleware(useRelay)}
    environment={Relay.Store}
  >
    {routes}
  </Router>
);
