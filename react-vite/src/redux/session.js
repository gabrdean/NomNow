import { csrfFetch } from "./csrf";

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const EDIT_USER = 'session/editUser';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

const editUser = (payload) => ({
  type: EDIT_USER,
  payload
})

export const thunkAuthenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    console.log('ERRORR MESSE', errorMessages)
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};


export const addFundsThunk = (fundsObject) => async (dispatch) => {
  const {id, amount} = fundsObject
    const response = await csrfFetch(`/api/users/wallet/${id}`, {
        method: "PUT",
        body: JSON.stringify({amount}),
    });
    if(response.ok){
        const data = await response.json()
        console.log('DATA', data)
        dispatch(editUser(data))
    }
    else if(response.status < 500){
        const errorMessages = await response.json()
        return errorMessages
    } else {
      return {server: 'Something went wrong. Please try again'}
    }
}
export const editUserThunk = (updateObj) => async (dispatch) => {
    const {id} = updateObj
    const response = await csrfFetch(`/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateObj),
    });
    if(response.ok){
        const data = await response.json()
        console.log('DATA', data)
        dispatch(editUser(data))
    }
    else if(response.status < 500){
        const errorMessages = await response.json()
        return errorMessages
    } else {
      return {server: 'Something went wrong. Please try again'}
    }
}


const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case EDIT_USER:
      return { ...state, user: action.payload }
    default:
      return state;
  }
}

export default sessionReducer;
