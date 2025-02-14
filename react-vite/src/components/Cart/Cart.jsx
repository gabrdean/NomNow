import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { FaShoppingCart, FaTimes, } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {getCart, checkoutCart } from '../../redux/cart';
import Order from '../Orders/Order';
import './Cart.css';

export default function Cart() {
	// const currentOrder = useSelector((store) => store.orders.currentOrder);
	const cart = useSelector((store) => store.cart) || {};
	const cartItems = cart?.cartItems || [];
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleCheckout = async () => {
		if (cartItems.length === 0) return;

		const { payload } = await dispatch(checkoutCart());

		if (payload) {
			localStorage.setItem('currentOrder', JSON.stringify(payload)); 
			navigate('/checkout');
		}
	};

	// useEffect(() => {
	// 	const savedOrder = JSON.parse(localStorage.getItem('currentOrder'));

	// 	if (!currentOrder) {
	// 		if (savedOrder && savedOrder.id) {
	// 			dispatch(loadUserOrder(savedOrder));
	// 		} else {
	// 			navigate('/orders');
	// 		}
	// 	}
	// }, [currentOrder, dispatch, navigate]);

	useEffect(() => {
		if (!cartItems) {
			dispatch(getCart());
		}
	}, [dispatch, cartItems]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	}, [isOpen]);

	useEffect(() => {
		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen]);


	return (
		<>
			<button className='cart-container' onClick={() => setIsOpen(true)}>
				<FaShoppingCart className='cart-icon' />
				{/* <span className='cart-badge'>{cartItems?.length || 0}</span>
				 */}
				<span className='cart-badge'>
					{cartItems.reduce((total, item) => total + item.quantity, 0)}
				</span>
			</button>

			<div className={`cart-panel ${isOpen ? 'open' : ''}`}>
				<div className='cart-header'>
					<button className='close-btn' onClick={() => setIsOpen(false)}>
						<FaTimes />
					</button>
				</div>

				{cartItems.length > 0 ? (
					<Order items={cartItems} />
				) : (
					<div className='empty-cart'>
						<img
							src='/images/cart.jpeg'
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
								navigate('/home');
							}}>
							Start shopping
						</button>
					</div>
				)}

				{cartItems.length > 0 && (
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
						<button onClick={handleCheckout} className='checkout-btn'>
							Go to checkout
						</button>
					</div>
				)}
			</div>

			{isOpen && (
				<div
					className='cart-overlay'
					onClick={() => setIsOpen(false)}></div>
			)}
		</>
	);
}
