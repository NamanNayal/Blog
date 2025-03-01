import { configureStore } from '@reduxjs/toolkit'
import userReducer from  './user/userSlice'


export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})


//to create a store configureStore is a function from Redux Toolkit that simplifies store creation.It automatically sets up Redux DevTools and middleware like redux-thunk.
// The store is the object that brings actions and reducers together. It holds the application state and allows you to dispatch actions.
// The store is created by passing a reducer to the createStore function from Redux.
// A reducer is a pure function in Redux that takes the current state and an action and returns a new state.
//A reducer is a pure function in Redux that takes the current state and an action and returns a new state. A reducer is a function, but Redux needs an object when handling multiple slices of state.
//
