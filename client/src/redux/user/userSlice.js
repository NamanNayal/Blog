import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    currentUser: null,
    error:null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        SignInStart: (state)=>{
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state)=>{
            state.loading = true;
            state.error = null;
        },
        updateSuccess :  (state, action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure:(state, action)=>{
            state.loading = false;
            state.error = action.payload;

        },
        deleteUserStart:(state) =>{
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess:(state)=>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFaliure:(state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        signOutSuccess:(state)=>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        }

    },


});

export const { 
    SignInStart,
    signInSuccess,
    signInFailure,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFaliure,
    signOutSuccess
 } = userSlice.actions;

export default userSlice.reducer;


//create initialstate - current use null- because user does not exist yet 2. create a slice - name, initialState and then pass logic , first we get the state and 
