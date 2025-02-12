import './OrderItem.css';

export default function OrderItem({ item }) {
	return (
		<div className='order-item'>
			<div className='order-item-details'>
				<span className='quantity'>{item.quantity}x </span>
				<span className='item-name'>{item.name || item.menu_item_name || "Unnamed Item"}</span>
			</div>
			{item.customizations && (
				<p className='customizations'>{item.customizations}</p>
			)}
		</div>
	);
}