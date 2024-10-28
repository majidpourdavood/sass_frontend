import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import {constants} from "../../utils/constants";

const user = Cookies.get('user', {path: '/'});

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (values: any, {rejectWithValue}) => {
        try {

            const url_auth = process.env.URL_WEBSITE_SERVER + constants.URL_AUTH_LOGIN;
            const responseToken = await axios.post(url_auth, {
                username: values.username,
                password: values.password,
            });
            // console.log(responseToken)
            Cookies.set('user', JSON.stringify(responseToken.data), { path: '/' });
            return responseToken.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

interface AuthState {
    user: any;
}

// Define the initial state using that type
const initialState: AuthState = {
    user: user ? JSON.parse(user) : null,
};
// Define a type for the slice state

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        loadUser(state, action) {
            const user = state.user;

            if (user) {
                return {
                    ...state,
                    user: user,
                };
            } else return {...state, userLoaded: true};
        },
        logoutUser(state, action) {
            Cookies.remove('user', {path: '/'});

            return {
                ...state,
                user: null,
            };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state, action) => {
            return {...state, loginStatus: 'pending'};
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            if (action.payload) {
                const user = action.payload;
                return {
                    ...state,
                    user: user,
                };
            } else return state;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            return {
                ...state,
                loginStatus: 'rejected',
                loginError: action.payload,
            };
        });
    },
});

export const {loadUser, logoutUser} = authSlice.actions;

export default authSlice.reducer;
