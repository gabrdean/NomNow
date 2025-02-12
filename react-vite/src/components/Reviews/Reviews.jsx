//react-vite/src/components/Reviews/Reviews.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { getReviewsForRestThunk } from '../../redux/reviews';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import './Reviews.css';

const Reviews = () => {
  const { restaurantId } = useParams(); // Extract restaurantId from the URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId'); // Extract orderId from query params
  const restaurantName = queryParams.get('restaurantName'); // Extract restaurantName from query params

  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.allReviewsForRest);

  useEffect(() => {
    if (restaurantId) {
      dispatch(getReviewsForRestThunk(restaurantId)); // Fetch reviews for the restaurant
    }
  }, [dispatch, restaurantId]);

  return (
    <div className="reviews-container">
      <h2>Reviews for {restaurantName || `Restaurant ${restaurantId}`}</h2> {/* Display restaurant name */}
      <ReviewForm restaurantId={restaurantId} orderId={orderId} /> {/* Pass orderId to the form */}
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default Reviews;