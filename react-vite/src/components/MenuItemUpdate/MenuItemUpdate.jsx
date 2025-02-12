import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateMenuItem, getMenuItem } from '../../redux/menuItems'; // Correct path to actions
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate for navigation
import './MenuItemUpdate.css';

const UpdateMenuItem = () => {
  const { id } = useParams(); // Retrieve menu item ID from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate for navigation

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    food_image: '',
    food_type: 'appetizer',
  });

  const menuItem = useSelector((state) => state.menuItems.menuItem);
  const error = useSelector((state) => state.menuItems.error);
  const user = useSelector((state) => state.session?.user || null); // Check if the user is logged in

  useEffect(() => {
    if (id) {
      dispatch(getMenuItem(id)); // Fetch item data if the ID exists
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (menuItem && id) {
      setFormData({
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        food_image: menuItem.food_image,
        food_type: menuItem.food_type,
      });
    }
  }, [menuItem, id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateMenuItem(id, formData)); // Dispatch action to update menu item
    navigate(`/menu-items/${id}`); // Redirect to updated menu item detail page
  };

  if (!user) {
    navigate('/login'); // If user is not logged in, redirect to login page
    return null; // Return null to prevent rendering the rest of the component
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>; // Display error message if any
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Button to navigate back */}
      <button
        onClick={() => navigate(`/menu-items/${id}`)}
        type="button"
        className="back-button" // Added class name for styling
      >
        Back to Menu Items List
      </button>

      <h3>Update Menu Item</h3>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <input
        type="text"
        name="food_image"
        value={formData.food_image}
        onChange={handleChange}
        placeholder="Food Image URL"
        required
      />
      <select name="food_type" value={formData.food_type} onChange={handleChange} required>
        <option value="appetizer">Appetizer</option>
        <option value="entree">Entree</option>
        <option value="dessert">Dessert</option>
        <option value="beverage">Beverage</option>
      </select>

      <button type="submit" className="submit-button">Update Menu Item</button> {/* Added class name */}
    </form>
  );
};

export default UpdateMenuItem;
