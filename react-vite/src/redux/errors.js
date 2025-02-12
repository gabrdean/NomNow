const SET_ERROR = 'errors/setError';
const CLEAR_ERROR = 'errors/clearError';

export const setError = (error) => ({
	type: SET_ERROR,
	payload: error,
});

const clearError = () => ({
	type: CLEAR_ERROR,
});

export const handleApiError =
	(actionThunk) =>
	async (dispatch, ...args) => {
		try {
			await dispatch(actionThunk(...args));
		} catch (error) {
			const errorMessage = error.response
				? await error.response.json()
				: { message: 'An unexpected error occurred.' };
			dispatch(setError(errorMessage));
		}
	};

const initialState = { message: null };

export default function errorsReducer(state = initialState, action) {
	switch (action.type) {
		case SET_ERROR:
			return { message: action.payload };
		case CLEAR_ERROR:
			return { message: null };
		default:
			return state;
	}
}
