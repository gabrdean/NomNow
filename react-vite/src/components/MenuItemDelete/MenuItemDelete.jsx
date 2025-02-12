import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMenuItem, getMenuItem } from '../../redux/menuItems';
import { useParams, useNavigate } from 'react-router-dom';
import './MenuItemDelete.css'

const MenuItemDelete = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuItemName, setMenuItemName] = useState('');
  const menuItem = useSelector(state => state.menuItems.menuItem);
  const error = useSelector(state => state.menuItems.error);
  const user = useSelector(state => state.session?.user || null);  // Check if user is logged in

  useEffect(() => {
    if (!user) {
      navigate('/login');  // Redirect to login if user is not logged in
      return;
    }
    if (id) {
      dispatch(getMenuItem(id));  // Fetch the menu item details
    }
  }, [dispatch, id, navigate, user]); // Include navigate and user in dependencies

  // Update the menuItemName once the menuItem is fetched
  useEffect(() => {
    if (menuItem) {
      setMenuItemName(menuItem.name);
    }
  }, [menuItem]);

  const handleDelete = () => {
    // Proceed with the delete action if user is logged in
    dispatch(deleteMenuItem(id));  // Dispatch delete action
    navigate('/menu-items');  // Redirect to the menu items list page after delete
  };

  const handleCancel = () => {
    navigate(`/menu-items/${id}`);  // Redirect back to the original menu item detail page
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="delete-container">
      <h2>Are you sure you want to delete {menuItemName}?</h2>
      <button onClick={handleDelete} className="delete-button">
        Yes, Delete
      </button>
      <button onClick={handleCancel} className="cancel-button">
        Cancel
      </button>
    </div>
  );
  
}
export default MenuItemDelete
