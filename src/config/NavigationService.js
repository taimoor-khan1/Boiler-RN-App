import * as React from 'react';

export const navigationRef = React.createRef();

export const navigate = (routeName, params) => {
  navigationRef.current?.navigate(routeName, params);
};

export const changeStack = stackName => {
  resetRoot(stackName);
};

export const resetRoot = routeName => {
  navigationRef.current?.resetRoot({
    index: 0,
    routes: [{name: routeName}],
  });
};
