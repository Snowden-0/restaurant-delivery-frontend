import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { ClipLoader } from 'react-spinners';

const RatingCard = ({ orderId, onRatingSubmit, existingRating, existingComment, isSubmitting }) => {
  const [rating, setRating] = useState(existingRating || 0);
  const [comment, setComment] = useState(existingComment || '');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    setRating(existingRating || 0);
    setComment(existingComment || '');
    if (existingRating || existingComment) {
      setHasSubmitted(true); 
    } else {
      setHasSubmitted(false);
    }
  }, [existingRating, existingComment]);

  const handleStarClick = (value) => {
    if (!hasSubmitted && !isSubmitting) { 
      setRating(value);
    }
  };

  const handleSubmit = async () => {
    if ((rating > 0 || comment.trim() !== '') && !hasSubmitted && !isSubmitting) {
      try {
        await onRatingSubmit(orderId, rating, comment);
      } catch (error) {
        console.error('Rating submission failed:', error);
      }
    }
  };

  // Show loading state when submitting
  if (isSubmitting) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md mx-auto mt-8 border border-amber-100">
        <div className="flex flex-col items-center justify-center py-8">
          <ClipLoader
            color="#F59E0B"
            size={40}
            loading={isSubmitting}
            cssOverride={{
              display: "block",
              margin: "0 auto",
            }}
          />
          <p className="mt-4 text-gray-600 text-lg">Submitting your rating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md mx-auto mt-8 border border-amber-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Rate Your Order</h2>
      <p className="text-gray-600 text-center mb-6">How was your experience?</p>

      <div className="flex justify-center items-center mb-6 space-x-1">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <Star
            key={starValue}
            size={36}
            fill={starValue <= rating ? '#F59E0B' : 'none'}
            stroke={starValue <= rating ? '#F59E0B' : '#D1D5DB'}
            className={`cursor-pointer transition-colors duration-200 ${
              (!hasSubmitted && !isSubmitting) ? 'hover:text-amber-400' : 'opacity-70 cursor-not-allowed'
            }`}
            onClick={() => handleStarClick(starValue)}
          />
        ))}
      </div>

      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Add a comment (optional)
        </label>
        <textarea
          id="comment"
          rows="4"
          className={`w-full p-3 border rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 ${
            (hasSubmitted || isSubmitting) ? 'bg-gray-50 cursor-not-allowed' : 'border-gray-300'
          }`}
          placeholder="Tell us what you think..."
          value={comment}
          onChange={(e) => (!hasSubmitted && !isSubmitting) && setComment(e.target.value)}
          disabled={hasSubmitted || isSubmitting}
        ></textarea>
      </div>

      {!hasSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || (rating === 0 && comment.trim() === '')}
          className="w-full bg-amber-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <ClipLoader
                color="#ffffff"
                size={20}
                loading={isSubmitting}
                cssOverride={{
                  display: "inline-block",
                  marginRight: "8px",
                }}
              />
              Submitting...
            </>
          ) : (
            'Submit Rating'
          )}
        </button>
      ) : (
        <p className="text-center text-green-600 font-semibold text-lg">Rating Submitted! Thank you.</p>
      )}
    </div>
  );
};

export default RatingCard;