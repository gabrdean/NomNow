import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import './Cart.css';

export default function Cart() {
	const cartItems = useSelector((store) => store.orders.currentOrder);
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate(); // React Router navigation

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'; // Prevents scrolling
		} else {
			document.body.style.overflow = 'auto'; // Allows scrolling
		}
	}, [isOpen]);

	return (
		<>
			{/* Shopping Cart Icon */}
			<button className='cart-container' onClick={() => setIsOpen(true)}>
				<FaShoppingCart className='cart-icon' />
				<span className='cart-badge'>{cartItems?.length || 0}</span>
			</button>

			{/* Side Panel (Cart Drawer) */}
			<div className={`cart-panel ${isOpen ? 'open' : ''}`}>
				<div className='cart-header'>
					{/* <h2>Your Cart</h2> */}
					<button className='close-btn' onClick={() => setIsOpen(false)}>
						<FaTimes />
					</button>
				</div>

				{/* Empty Cart UI */}
				{!cartItems || cartItems.length === 0 ? (
					<div className='empty-cart'>
						<img
							src='../../../public/images/cart.jpeg'
							alt='Empty cart'
							className='cart-image'
						/>
						<h3>Add items to start a cart</h3>
						<p>
							Once you add items from a restaurant or store, your cart
							will appear here.
						</p>
						<button
							className='start-shopping-btn'
              onClick={() => {
                setIsOpen(false);
                navigate('/home')
              }}>
							Start shopping
						</button>
					</div>
				) : (
					<>
						{/* Cart Items */}
						<div className='cart-items'>
							{cartItems.map((item) => (
								<div key={item.id} className='cart-item'>
									<img
										src={item.image || '/placeholder.jpg'}
										alt={item.name}
									/>
									<div className='cart-item-details'>
										<p>{item.name}</p>
										<p>${item.price.toFixed(2)}</p>
									</div>
									<div className='cart-item-controls'>
										<button>-</button>
										<span>{item.quantity}</span>
										<button>+</button>
									</div>
								</div>
							))}
						</div>

						{/* Checkout Button */}
						<div className='cart-footer'>
							<p>
								Subtotal: $
								{cartItems
									.reduce(
										(acc, item) => acc + item.price * item.quantity,
										0
									)
									.toFixed(2)}
							</p>
							<button className='checkout-btn'>Go to checkout</button>
						</div>
					</>
				)}
			</div>

			{/* Background Overlay (click to close) */}
			{isOpen && (
				<div
					className='cart-overlay'
					onClick={() => setIsOpen(false)}></div>
			)}
		</>
	);
}
