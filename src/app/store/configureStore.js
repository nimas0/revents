import { createStore, applyMiddleware } from "redux";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
import { reduxFirestore, getFirestore } from "redux-firestore";
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from "../reducers/routeReducer";
import thunk from "redux-thunk";
import firebase from '../config/firebase'

//react redux firestore configuration
const rrfConfig = {
    userProfile: 'user',
    attachAuthIsReady: true,
    useFirestoreForProfile: true

}

// Firebase and Firestore need to work with thunk four our app so we use withExtraArgument
export const configureStore = () => {
    const middlewares = [thunk.withExtraArgument({ getFirebase, getFirestore })];

    const composedEnhancer = composeWithDevTools(
        applyMiddleware(...middlewares),
        reactReduxFirebase(firebase, rrfConfig),
        reduxFirestore(firebase)
    );
    
    const store = createStore(rootReducer, composedEnhancer);


    return store;
}