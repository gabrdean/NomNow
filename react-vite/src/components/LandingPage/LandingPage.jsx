import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
function LandingPage() {
	const [address, setAddress] = useState('');
	const [delivery_time, setDeliveryTime] = useState('');
	const navigate = useNavigate();
	const user = useSelector((store) => store.session.user);
	useEffect(() => {
		if (user) {
			navigate('/home');
		}
	}, [user, navigate]);

	return (
		<div className='landing-page'>
			<div className='main-content'>
				<h1>Order delivery near you</h1>
				<form>
					<input
						type='text'
						placeholder='Enter delivery address'
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>

					<select
						value={delivery_time}
						onChange={(e) => setDeliveryTime(e.target.value)}>
						<option value='Deliver now'>Deliver now</option>
						<option value='Schedule Later'>Schedule for later</option>
					</select>

					<button type='submit'>Search here</button>
				</form>
				<a href='/login'>Or Sign In</a>
			</div>
		</div>
	);
}

export default LandingPage;
