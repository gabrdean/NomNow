//react-vite/src/router/index.jsx
import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import LandingPage from '../components/LandingPage/LandingPage';
import Layout from './Layout';
import Reviews from '../components/Reviews';
import WalletPage from '../components/WalletPage/WalletPage';
import Orders from '../components/Orders';
import MenuItemList from '../components/MenuItemList/MenuItemList';
import MenuItemDetail from '../components/MenuItemDetail/MenuItemDetail';
import MenuItemCreate from '../components/MenuItemCreate';
import UpdateMenuItem from '../components/MenuItemUpdate/MenuItemUpdate';
import DeleteMenuItem from '../components/MenuItemDelete';
import ManageRestaurants from '../components/ManageRestaurants/ManageRestaurants';
import Checkout from '../components/Checkout';
import { AccountFormPage, NameFormPage, PhoneNumberPage, EmailPage } from '../components/AccountFormPage';
import CreateRestaurant from '../components/CreateRestaurant/CreateRestaurant';
import HomePage from '../components/HomePage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: 'login',
        element: <LoginFormPage isLogin={true} />,
      },
      {
        path: 'signup',
        element: <LoginFormPage isSignup={true} />,
      },
      {
        path: 'account',
        element: <AccountFormPage />,
      },
      {
        path: 'account/name',
        element: <NameFormPage />,
      },
      {
        path: 'account/phone',
        element: <PhoneNumberPage />,
      },
      {
        path: 'account/email',
        element: <EmailPage />,
      },
      {
        path: 'wallet',
        element: <WalletPage />,
      },
      {
        path: 'orders',
        element: <Orders />,
      },
      {
        path: 'reviews/restaurant/:restaurantId', // Updated path from 627f183
        element: <Reviews />,
      },
      {
        path: '*',
        element: <h1>404 Page Not Available</h1>,
      },
      {
        path: 'menu-items',
        element: <MenuItemList />,
      },
      {
        path: 'menu-items/:id',
        element: <MenuItemDetail />,
      },
      {
        path: 'menu-items/new',
        element: <MenuItemCreate />,
      },
      {
        path: 'menu-items/:id/update',
        element: <UpdateMenuItem />,
      },
      {
        path: 'menu-items/:id/delete',
        element: <DeleteMenuItem />,
      },
      {
        path: 'restaurants/new', // Added from HEAD
        element: <CreateRestaurant />,
      },
      {
        path: 'restaurants/manage', // Added from HEAD
        element: <ManageRestaurants />,
      },
      {
        path: 'checkout', // Added from HEAD
        element: <Checkout />,
			},
      {
				path: 'home',
				element: <HomePage />,
      },
    ],
  },
]);