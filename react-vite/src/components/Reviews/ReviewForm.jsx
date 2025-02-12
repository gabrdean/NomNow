//react-vite/src/components/Reviews/ReviewForm.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReviewThunk } from '../../redux/reviews';
import './Reviews.css';

const ReviewForm = ({ restaurantId, orderId }) => {
  const [reviewText, setReviewText] = useState('');
  const [orderRating, setOrderRating] = useState(0);
  const [restaurantRating, setRestaurantRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderId) {
      setErrorMessage('Order ID is missing. Please try again.');
      return;
    }
    if (!reviewText.trim()) {
      setErrorMessage('Please write a review before submitting.');
      return;
    }
    if (orderRating === 0 || restaurantRating === 0) {
      setErrorMessage('Please select a rating for both order and restaurant.');
      return;
    }

    const newReview = {
      restaurant_id: restaurantId,
      order_id: orderId,
      review: reviewText,
      order_rating: orderRating,
      restaurant_rating: restaurantRating,
    };

    try {
      const response = await dispatch(createReviewThunk(newReview));
      if (response && !response.errors) {
        setSuccessMessage('Review submitted successfully!');
        setErrorMessage('');
        setReviewText('');
        setOrderRating(0);
        setRestaurantRating(0);
      } else {
        setErrorMessage(response.errors || 'Failed to submit review. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const StarRating = ({ rating, setRating, label }) => (
    <div className="star-rating">
      <label>{label}</label>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? 'star selected' : 'star'}
          onClick={() => setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review here"
        required
      />

      <StarRating
        rating={orderRating}
        setRating={setOrderRating}
        label="Order Rating:"
      />

      <StarRating
        rating={restaurantRating}
        setRating={setRestaurantRating}
        label="Restaurant Rating:"
      />

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;