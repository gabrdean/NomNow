import React from "react";
import { useDispatch} from "react-redux";
import { thunkLogout } from "../../redux/session";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { useModal } from "../../context/Modal";
import "./Navigation.css";


function DropdownMenu({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ulRef = React.useRef(null); 
  const location = useLocation();
  const {closeModal} = useModal();



  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeModal();
  };

  const handleRestaurantClick = () => {
    if (!user) {
      navigate('/login');
    } else if (user.restaurantOwner) { 
      navigate('/restaurants/manage');
    } else {
      navigate('/restaurants/new');
    }
    closeModal();
  };
  
  const getButtonText = () => {
    if (!user) return "Add your restaurant";
    if (user.restaurantOwner) return "Manage your restaurants";
    return "Add your restaurant";
  };
  
  let content = (
      <div className='menu-dropdown' ref={ulRef}>
          <li><NavLink to='/login' onClick={closeModal}>Log in</NavLink></li>
          <li><NavLink to='/signup' onClick={closeModal}>Sign up</NavLink></li>
          <li><button onClick={handleRestaurantClick}>{getButtonText()}</button></li>
      </div>
  )
  if (user) {
    content = (
			<div className='menu-dropdown' ref={ulRef}>
				<li>
					<div className='profile'>
						<img
							src='../../public/icons/user.png'
							alt=''
							className='icon'
						/>
						<div className='profile-info'>
							<h4>
								{user.firstName} {user.lastName}
							</h4>
							<a href='/'>Manage account</a>
						</div>
					</div>
				</li>
				<li>
					<NavLink to={`/orders`} onClick={closeModal}>
						Orders
					</NavLink>
				</li>
				<li>Favorites</li>
				<li>
					<NavLink to={`/wallet`} onClick={closeModal}>
						Wallet
					</NavLink>
				</li>
        <li>
					<NavLink to={`/menu-items`} onClick={closeModal}>
						Menu Items
					</NavLink>
				</li>
				<li>Meal Plan</li>
				<li>Help</li>
				<li>Promotions</li>
				<li>Invite a friend</li>
				<li>
					<button onClick={logout}>Sign out</button>
				</li>
				<li>
        <button
         onClick={handleRestaurantClick}
         className="link-button">
          {getButtonText()}</button>
				</li>
        {/* Show Add New Restaurant button only on manage restaurants page */}
        {location.pathname === '/restaurants/manage' && (
          <li>
            <NavLink to={'/restaurants/new'} onClick={closeModal}>Add New Restaurant</NavLink>
          </li>
        )}
			</div>
		);
  }

  return (
    <OpenModalMenuItem
      itemText={<img src="../../icons/menu.png" alt="" className='icon' />}
      modalComponent={content}
    />
  );
}

export default DropdownMenu;
