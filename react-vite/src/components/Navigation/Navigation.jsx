import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useState} from "react";
import DropdownMenu from "./DropdownMenu";
import "./Navigation.css";
import Cart from '../Cart';

function Navigation() {
  const user = useSelector((store) => store.session.user);
	const [deliveryType, setDeliveryType] = useState('delivery');
  const [search, setSearch] = useState('');
	const location = useLocation();
	const navigate = useNavigate();
	const isCheckoutPage = location.pathname === '/checkout';
  // const location = useLocation().pathname.split('/');

	if (isCheckoutPage) {
		return (
			<div className='checkout-navbar'>
				<button className='back-to-store' onClick={() => navigate(-1)}>
					← Back to store
				</button>
				<h1 className='checkout-title'>NomNow</h1>
			</div>
		);
	}
	
  console.log('DELIVERY TYPE:', deliveryType);
  console.log(user)
  return (
	<div className='navContainer'>
		<ul className='nav'>
			<li>{user ? <DropdownMenu user={user} /> : <DropdownMenu />}</li>
			<li>
				<NavLink to='/'>Nom Now</NavLink>
			</li>
			{user && user.address && user.city && user.state && user.zip ? (
				<li className='delivery-type'>
					{deliveryType === 'delivery' ? (
						<button className='selected'>Delivery</button>
					) : (
						<button
							onClick={(e) => {
								e.preventDefault();
								setDeliveryType('delivery');
							}}>
							Delivery
						</button>
					)}

					{deliveryType === 'pickup' ? (
						<button className='selected'>Pickup</button>
					) : (
						<button
							onClick={(e) => {
								e.preventDefault();
								setDeliveryType('pickup');
							}}>
							Pickup
						</button>
					)}
				</li>
			) : (
				<li className='delivery-type'>Enter delivery address</li>
			)}

			<li>
				<input
					type='search'
					placeholder='Search Nom Now'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</li>
			<li className='user-actions'>
        {user?.address && (
          <li className='cart-nav'>
            <Cart />
          </li>
        )}
				{!user && (
					<li>
						<NavLink to='/login'>
							<button>Log in</button>
						</NavLink>
						<NavLink to='/signup'>
							<button>Sign up</button>
						</NavLink>
					</li>
				)}
			</li>
		</ul>
	</div>
  );
}

export default Navigation;
