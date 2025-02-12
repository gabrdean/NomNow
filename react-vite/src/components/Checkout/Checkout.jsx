import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import TipModal from '../../context/TipModal';
import './Checkout.css';

export default function Checkout() {
	const location = useLocation();
	const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  const { setModalContent } = useModal();
	const [orderDetails, setOrderDetails] = useState(
		location.state?.order || null
	);
  const [tip, setTip] = useState(0);

  const subtotal = orderDetails.totalCost || 0;
  const deliveryFee = 6.49;
  const taxes = subtotal * 0.1;
  const orderTotal = subtotal + deliveryFee + taxes
  const total = subtotal + deliveryFee + taxes + tip;

  const openTipModal = () => {
    setModalContent(<TipModal orderTotal={orderTotal} setTip={setTip} />);
  };

	useEffect(() => {
		if (location.state?.order) {
			setOrderDetails(location.state.order);
		} else {
			navigate('/home');
		}
  }, [location.state, navigate]);


	return (
		<div className='checkout-page'>
			<div className='checkout-left'>
				{/* Delivery Details */}
				<div className='delivery-section'>
					<h3>Delivery details</h3>
					<div className='address'>
						<p>
							<strong>
								{user?.address || 'Delivery Address Not Provided'}
							</strong>
						</p>
						<p>
							{user?.city
								? `${user.city}, ${user.state}`
								: 'City, State'}
						</p>
					</div>
					<div className='delivery-instructions'>
						<p>
							{user?.deliveryInstructions ||
								'No delivery instructions provided.'}
						</p>
					</div>
				</div>

				{/* Delivery Options */}
				<div className='delivery-options'>
					<h3>Delivery options</h3>
					<div className='option priority'>
						<span>⚡ Priority</span>
						<span>15-30 min • Delivered directly to you</span>
						<span className='extra-fee'>+$1.49</span>
					</div>
					<div className='option standard'>
						<span>📦 Standard</span>
						<span>20-35 min</span>
					</div>
					<div className='option schedule'>
						<span>⏰ Schedule</span>
						<span>Choose a time</span>
					</div>
				</div>

				{/* Payment */}
				<div className='payment-section'>
					<h3>Payment</h3>
					<div className='payment-method'>
						<span>
							💳{' '}
							{orderDetails?.paymentMethod ||
								'Payment Method Not Available'}
						</span>
						<button>Edit</button>
					</div>
				</div>

				{/* Place Order Button */}
				<button className='confirm-order-btn'>Place order</button>
			</div>

			{/* Right Sidebar - Order Summary */}
			<div className='checkout-right'>
				<h3>{orderDetails.restaurant?.name}</h3>
				<div className='order-summary'>
					<h4>Cart summary ({orderDetails?.orderItems?.length} item/s)</h4>
					{orderDetails?.orderItems?.length ? (
						orderDetails.orderItems.map((item) => (
							<div key={item.id} className='summary-item'>
								<p>
									{item.name ||
										item.menu_item_name ||
										'Unavailable Item'}{' '}
									x{item.quantity || 1}
								</p>
								<p>${item.price ? item.price.toFixed(2) : '0.00'}</p>
							</div>
						))
					) : (
						<p>No items found.</p>
					)}
				</div>

				{/* Order Total Section including Tip */}
				<div className='order-total'>
					<h3>Order total</h3>
					<p>Subtotal: ${subtotal.toFixed(2)}</p>
					<p>Delivery Fee: ${deliveryFee.toFixed(2)}</p>
					<p>Taxes & Other Fees: ${taxes.toFixed(2)}</p>

					{/* Tip Selection - Moved Inside Order Total */}
					<div className='tip-section'>
						<h4>
							Add a tip <span className='tooltip'>ℹ</span>
						</h4>
						<p>100% of your tip goes to your courier.</p>
						<div className='tip-buttons'>
							{[0.15, 0.2, 0.25, 0.3].map((percentage) => (
								<button
									key={percentage}
									className={
										tip === subtotal * percentage
											? 'selected-tip'
											: ''
									}
									onClick={() => setTip(subtotal * percentage)}>
									{`${percentage * 100}%`}
								</button>
							))}
							<button className='other-tip-btn' onClick={openTipModal}>
								Other
							</button>
						</div>
						<p>Tip: ${tip.toFixed(2)}</p>
					</div>

					<h3>Total: ${total.toFixed(2)}</h3>
				</div>
			</div>
		</div>
	);
}