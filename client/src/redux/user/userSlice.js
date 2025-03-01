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
            state.loading = false,
            state.error = action.payload;
        },

    },


});

export const { SignInStart, signInSuccess, signInFailure} = userSlice.actions;

export default userSlice.reducer;


//create initialstate - current use null- because user does not exist yet 2. create a slice - name, initialState and then pass logic , first we get the state and 
