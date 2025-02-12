import { useModal } from './Modal.jsx';
import { useState } from 'react';

export default function TipModal({ orderTotal, setTip }) {
	// Accept orderTotal as a prop
	const { closeModal } = useModal();
	const [customTip, setCustomTip] = useState('');

	const handleSaveTip = () => {
		const tipAmount = parseFloat(customTip) || 0;
		setTip(tipAmount);
		closeModal();
	};

	return (
		<div className='tip-modal'>
			<div className='modal-header'>
				<div className='close-button' onClick={closeModal}>
					×
				</div>
				<h2>Enter other amount</h2>
			</div>
			<div className='input-container'>
				<span className='dollar-sign'>$</span>
				<input
					type='number'
					value={customTip}
					onChange={(e) => setCustomTip(e.target.value)}
					placeholder='0'
					min='0'
					inputMode='decimal'
				/>
			</div>
			<p>Your order is ${orderTotal?.toFixed(2) || '0.00'}</p>
			<button
				onClick={handleSaveTip}
				disabled={!customTip || parseFloat(customTip) <= 0}
				className={
					!customTip || parseFloat(customTip) <= 0 ? 'disabled-button' : ''
				}>
				Save
			</button>
		</div>
	);
}
