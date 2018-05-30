import { loadState, saveState } from './localStorage'
import throttle from 'lodash/throttle'
import { createStore } from 'redux';
import todoApp from './reducers';

export const configureStore = () => {
    const persistStore = loadState();
    const store = createStore(todoApp, persistStore);

    /**
     * get noticed when the storage is updated
     * using throttle function to just write on localStorage once a second (1000ms)
     */
    store.subscribe(throttle(() => {
        saveState({
            todos: store.getState().todos
        });
    }), 1000);

    return store;
}
