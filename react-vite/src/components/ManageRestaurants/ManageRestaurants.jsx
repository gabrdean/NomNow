// ManageRestaurants.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserRestaurants, deleteRestaurant, updateRestaurant } from '../../redux/restaurants';

function ManageRestaurants() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { restaurants, error } = useSelector(state => state.restaurants);
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(getUserRestaurants());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this restaurant?')) {
            await dispatch(deleteRestaurant(id));
        }
    };
    
       const handleUpdate = async (id) => { 
            await dispatch(updateRestaurant(id));
    
    };
    if (!user) return null; // Security

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>My Restaurants</h1>
            {restaurants.map(restaurant => (
                <div key={restaurant.id}>
                    <h2>{restaurant.name}</h2>
                    <button onClick={() => handleDelete(restaurant.id)}>
                        Delete
                    </button>
                    <button onClick={() => handleUpdate(restaurant.id)}>
                        Update
                    </button>

                </div>
            ))}
        </div>
    );
}

export default ManageRestaurants;