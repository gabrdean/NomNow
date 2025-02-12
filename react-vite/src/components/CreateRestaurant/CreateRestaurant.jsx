import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRestaurant } from '../../redux/restaurants';

const CUISINE_TYPES = [
    "American", "Chinese", "Italian", "Japanese", "Mexican", "Indian", 
    "Thai", "Mediterranean", "Korean", "Vietnamese", "Greek", "Spanish",
    "Seafood", "Pizza", "Vegetarian", "Vegan", "Breakfast", "Fast Food",
    "Caribbean", "Soul Food"
];

const PRICE_LEVELS = ["$", "$$", "$$$", "$$$$"];

export default function CreateRestaurant() {
    const dispatch = useDispatch();
    const error = useSelector((state) => state.restaurants.error);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        cuisine_type: '',
        delivery_fee: '',
        business_hours: '',
        servicing: true,
        store_image: null,
        price_level: '',
        delivery_time: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            store_image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    submitData.append(key, formData[key]);
                }
            });

            await dispatch(createRestaurant(submitData));
            // Reset form after successful submission
            setFormData({
                name: '',
                description: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                cuisine_type: '',
                delivery_fee: '',
                business_hours: '',
                servicing: true,
                store_image: null,
                price_level: '',
                delivery_time: ''
            });
        } catch (err) {
            console.error('Failed to create restaurant:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='create-restaurant-container'>
            <h2>Create New Restaurant</h2>
            
            {error && <div className='error-message'>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor="name">Restaurant Name*</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="description">Description*</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="address">Street Address*</label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="city">City*</label>
                    <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="state">State*</label>
                    <input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="zip">ZIP Code*</label>
                    <input
                        id="zip"
                        name="zip"
                        type="number"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="cuisine_type">Cuisine Type*</label>
                    <select
                        id="cuisine_type"
                        name="cuisine_type"
                        value={formData.cuisine_type}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select cuisine type</option>
                        {CUISINE_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor="price_level">Price Level*</label>
                    <select
                        id="price_level"
                        name="price_level"
                        value={formData.price_level}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select price level</option>
                        {PRICE_LEVELS.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor="delivery_fee">Delivery Fee</label>
                    <input
                        id="delivery_fee"
                        name="delivery_fee"
                        type="number"
                        step="0.01"
                        value={formData.delivery_fee}
                        onChange={handleInputChange}
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="business_hours">Business Hours*</label>
                    <input
                        id="business_hours"
                        name="business_hours"
                        type="text"
                        value={formData.business_hours}
                        onChange={handleInputChange}
                        placeholder="e.g., Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="delivery_time">Delivery Time (minutes)</label>
                    <input
                        id="delivery_time"
                        name="delivery_time"
                        type="number"
                        value={formData.delivery_time}
                        onChange={handleInputChange}
                    />
                </div>

                <div className='form-group'>
                    <label>
                        <input
                            type="checkbox"
                            name="servicing"
                            checked={formData.servicing}
                            onChange={handleInputChange}
                        />
                        Currently Servicing
                    </label>
                </div>

                <div className='form-group'>
                    <label htmlFor="store_image">Restaurant Image</label>
                    <input
                        id="store_image"
                        name="store_image"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className='submit-btn'
                >
                    {isLoading ? 'Creating...' : 'Create Restaurant'}
                </button>
            </form>
        </div>
    );
}