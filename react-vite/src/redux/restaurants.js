//Restaurant Actions

const GET_RESTAURANTS = 'GET_RESTAURANTS';
const GET_USER_RESTAURANTS = 'GET_USER_RESTAURANTS'
const GET_RESTAURANT = 'GET_RESTAURANT';
const CREATE_RESTAURANT = 'CREATE_RESTAURANT';
const UPDATE_RESTAURANT = 'UPDATE_RESTAURANT';
const DELETE_RESTAURANT = 'DELETE_RESTAURANT';
const RESTAURANT_ERROR = 'RESTAURANT_ERROR';

// Get all restaurants (owned by current user)
export const getUserRestaurants = () => async (dispatch) => {
    try {
        const response = await fetch('/api/manage/');
        const data = await response.json();
        dispatch({ type: GET_USER_RESTAURANTS, payload: data.restaurants });
    } catch (error) {
        dispatch({ type: RESTAURANT_ERROR, payload: error.message });
    }
};

// Get a specific restaurant by id
export const getRestaurant = (id) => async (dispatch) => {
    try {
        const response = await fetch(`/api/manage/${id}`);
        const data = await response.json();
        dispatch({ type: GET_RESTAURANT, payload: data });
    } catch (error) {
        dispatch({ type: RESTAURANT_ERROR, payload: error.message });
    }
};

// Get all restaurants
export const getAllRestaurants = () => async (dispatch) => {
    try {
        const response = await fetch('/api/restaurants/');
        const data = await response.json();
        dispatch({ type: GET_RESTAURANTS, payload: data.restaurants });
    } catch (error) {
        dispatch({ type: RESTAURANT_ERROR, payload: error.message });
    }
};

// Create a new restaurant
export const createRestaurant = (formData) => async (dispatch) => {
    try {
        const response = await fetch('/api/restaurants/', {
            method: 'POST',
            body: formData  // Using FormData finstead of JSON so user can upload images. 
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.errors);
        }
        
        dispatch({ type: CREATE_RESTAURANT, payload: data.restaurant });
        return data.restaurant;  // Return for successful navigation
    } catch (error) {
        dispatch({ type: RESTAURANT_ERROR, payload: error.message });
        throw error;  
    }
};

// Update an existing restaurant
export const updateRestaurant = (id, formData) => async (dispatch) => {
    try {
        const response = await fetch(`/api/restaurants/${id}`, {
            method: 'PUT',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.errors);
        }

        dispatch({ type: UPDATE_RESTAURANT, payload: data.restaurant });
        return data.restaurant;
    } catch (error) {
        dispatch({ type: RESTAURANT_ERROR, payload: error.message });
        throw error;
    }
};


// Delete a restaurant
export const deleteRestaurant = (id) => async (dispatch) => {
    try {
        const response = await fetch(`/api/restaurants/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.errors?.[0] || 'Failed to delete restaurant');
        }

        const data = await response.json();
        
        if (data.id) {
            dispatch({ type: DELETE_RESTAURANT, payload: data.id });
            return true; // Return success
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        dispatch({ type: RESTAURANT_ERROR, payload: error.message });
        throw error; // Re-throw to handle in component
    }
};

// ---- Reducer

const initialState = {
    restaurants: [],
    currentRestaurant: null,
    error: null,
    isLoading: false
};

const restaurantReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER_RESTAURANTS:
            return {
                ...state,
                restaurants: action.payload,
                error: null
            };
            
        case GET_RESTAURANT:
            return {
                ...state,
                currentRestaurant: action.payload,
                error: null
            };

        case GET_RESTAURANTS:
            return {
                ...state,
                restaurants: action.payload,
                error: null
            };
            
        case CREATE_RESTAURANT:
            return {
                ...state,
                restaurants: [...state.restaurants, action.payload],
                error: null
            };
            
        case UPDATE_RESTAURANT:
            return {
                ...state,
                restaurants: state.restaurants.map(restaurant =>
                    restaurant.id === action.payload.id ? action.payload : restaurant
                ),
                currentRestaurant: action.payload,
                error: null
            };
            
        case DELETE_RESTAURANT:
            return {
                ...state,
                restaurants: state.restaurants.filter(restaurant => 
                    restaurant.id !== action.payload
                ),
                error: null
            };
            
        case RESTAURANT_ERROR:
            return {
                ...state,
                error: action.payload
            };
            
        default:
            return state;
    }
};

export default restaurantReducer;