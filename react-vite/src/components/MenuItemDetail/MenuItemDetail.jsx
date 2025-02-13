import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMenuItem, toggleLike } from '../../redux/menuItems';
import { addToCart } from '../../redux/orders';
import { useParams, Link, useNavigate } from 'react-router-dom';

const MenuItemDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuItem = useSelector(state => state.menuItems.menuItem);
  const likedItems = useSelector(state => state.menuItems.likedItems);
  const error = useSelector(state => state.menuItems.error);
  const user = useSelector(state => state.session.user); // Get user state

  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(getMenuItem(id));
    }
  }, [dispatch, id]);

  if (error) return <div>Error: {error}</div>;
  if (!menuItem) return <div>Loading...</div>;

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    dispatch(addToCart({
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
    }));
    setQuantity(1);
    setMessage(`${quantity} ${menuItem.name} added to cart!`);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleToggleLike = () => dispatch(toggleLike(menuItem.id));
  const isLiked = likedItems.includes(menuItem.id);

  return (
    <div>
      {/* Back button is ALWAYS visible */}
      <button onClick={() => navigate('/menu-items')} style={{ marginTop: '20px' }}>
        Back to Menu Items List
      </button>

      <h2>{menuItem.name}</h2>
      <p>{menuItem.description}</p>
      <p>Price: ${menuItem.price}</p>
      <p>{menuItem.food_type}</p>
      <img src={menuItem.food_image} alt={menuItem.name} style={{ width: '200px', height: '200px' }} />

      {/* Only show these buttons if the user is logged in */}
      {user && (
        <>
          {/* Quantity Selection */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <button onClick={decreaseQuantity} style={{ padding: '5px 10px', fontSize: '20px' }}>-</button>
            <span style={{ margin: '0 10px', fontSize: '18px' }}>{quantity}</span>
            <button onClick={increaseQuantity} style={{ padding: '5px 10px', fontSize: '20px' }}>+</button>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart} 
            style={{ marginLeft: '10px', fontSize: '18px', padding: '8px 15px', marginTop: '10px' }}>
            + Add {quantity} to Cart
          </button>

          {/* Like Button (Heart) */}
          <button 
            onClick={handleToggleLike} 
            style={{ marginLeft: '10px', fontSize: '24px', padding: '8px 15px', marginTop: '10px', color: isLiked ? 'red' : 'gray' }}>
            {isLiked ? '❤️' : '🤍'}
          </button>

          {/* Confirmation Message */}
          {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}

          <br /><br />

          {/* Update & Delete buttons */}
          <Link to={`/menu-items/${menuItem.id}/update`} style={{ marginRight: '10px' }}>
            <button>Update Menu Item</button>
          </Link>

          <Link to={`/menu-items/${menuItem.id}/delete`}>
            <button style={{ backgroundColor: 'red', color: 'white' }}>
              Delete Menu Item
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default MenuItemDetail;
