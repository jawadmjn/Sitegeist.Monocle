import {createStore, compose, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import immutable from 'seamless-immutable';

import {reducer, saga} from '../state';

export default env => {
    const initialState = {
        env,
        business: {
            tasks: {},
            errors: {},
            needsAuthorization: false
        },
        sites: {},
        breakpoints: {},
        prototypes: {
            byName: {},
            overriddenProps: {}
        },
        navigation: {
            items: [],
            currentIndex: -1,
            isOpen: false,
            searchTerm: ''
        },
        qrcode: {
            isVisible: false
        }
    };
    const storeEnhancers = [];

    //
    // Saga middleqware
    //
    const sagaMiddleware = createSagaMiddleware();
    storeEnhancers.push(applyMiddleware(sagaMiddleware));

    //
    // Dev tools extension
    //
    if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
        storeEnhancers.push(window.devToolsExtension());
    }

    //
    // Create store
    //
    const store = createStore(
        reducer,
        immutable(initialState),
        compose(...storeEnhancers)
    );

    //
    // Run root saga
    //
    sagaMiddleware.run(saga);

    return store;
};
