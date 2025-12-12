import { useState, useEffect } from "react";
import { FiStar, FiThumbsUp } from "react-icons/fi";
import "./ProductRatings.css";

function ProductRatings() {
  // ❌ OLD: Hardcoded reviews - Should fetch from API
  // const [reviews, setReviews] = useState([
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     rating: 5,
  //     date: "2024-11-15",
  //     title: "Excellent product!",
  //     comment: "Great quality, fast shipping. Very satisfied!",
  //     helpful: 25,
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     rating: 4,
  //     date: "2024-11-10",
  //     title: "Pretty good",
  //     comment: "Product matches description. Reasonable price.",
  //     helpful: 12,
  //   },
  //   {
  //     id: 3,
  //     name: "Mike Johnson",
  //     rating: 5,
  //     date: "2024-11-05",
  //     title: "Worth the money!",
  //     comment: "Bought 2, both are great. Will buy again.",
  //     helpful: 18,
  //   },
  // ]);

  // ✅ CORRECT: Fetch reviews from API (empty for now)
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // TODO: Fetch reviews from /api/products/:id/reviews
  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       setIsLoadingReviews(true);
  //       const productId = new URLSearchParams(window.location.search).get("id");
  //       const response = await fetch(`http://localhost:5000/api/products/${productId}/reviews`);
  //       if (!response.ok) throw new Error("Failed to fetch reviews");
  //       const data = await response.json();
  //       setReviews(data);
  //     } catch (error) {
  //       console.error("Error fetching reviews:", error);
  //     } finally {
  //       setIsLoadingReviews(false);
  //     }
  //   };
  //   fetchReviews();
  // }, []);

  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    title: "",
    comment: "",
  });

  const [showReviewForm, setShowReviewForm] = useState(false);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: name === "rating" ? parseInt(value) : value,
    });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!newReview.name || !newReview.title || !newReview.comment) {
      alert("Please fill in all the required information.");
      return;
    }

    const review = {
      id: reviews.length + 1,
      ...newReview,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    };

    setReviews([review, ...reviews]);

    setNewReview({ name: "", rating: 5, title: "", comment: "" });
    setShowReviewForm(false);
    alert("Thank you for your review!");
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FiStar key={i} className={`star ${i < rating ? "filled" : ""}`} size={16} />
    ));
  };

  return (
    <div className="product-ratings">
      <h3>Ratings & Reviews</h3>
      <div className="rating-summary">
        <div className="average-rating">
          <div className="rating-number">{averageRating}</div>
          <div className="rating-stars">{renderStars(Math.round(averageRating))}</div>
          <div className="rating-count">({reviews.length} ratings)</div>
        </div>
        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="rating-bar">
              <span className="rating-label">{rating} stars</span>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(ratingCounts[rating] / reviews.length) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="rating-count-small">{ratingCounts[rating]}</span>
            </div>
          ))}
          ;
        </div>
      </div>

      <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-write-review">
        {showReviewForm ? "Cancel" : "Write Review"}
      </button>
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="review-form">
          <h4>Share Your Review</h4>

          <div className="form-group">
            <label htmlFor="name">Your name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newReview.name}
              onChange={handleFormChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating *</label>
            <select id="rating" name="rating" value={newReview.rating} onChange={handleFormChange}>
              <option value={5}>5 stars - Excellent!</option>
              <option value={4}>4 stars - Very good</option>
              <option value={3}>3 stars - Average</option>
              <option value={2}>2 stars - Not good</option>
              <option value={1}>1 star - Bad</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newReview.title}
              onChange={handleFormChange}
              placeholder="Review title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="comment">Comment *</label>
            <textarea
              id="comment"
              name="comment"
              value={newReview.comment}
              onChange={handleFormChange}
              placeholder="Share your experience..."
              rows="4"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn-submit-review">
            Submit Review
          </button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            {/* Review header */}
            <div className="review-header">
              <div className="reviewer-info">
                <span className="reviewer-name">{review.name}</span>
                <span className="review-date">{review.date}</span>
              </div>
              <div className="review-stars">{renderStars(review.rating)}</div>
            </div>

            {/* Review title */}
            <h4 className="review-title">{review.title}</h4>

            {/* Review comment */}
            <p className="review-comment">{review.comment}</p>

            {/* Review footer */}
            <div className="review-footer">
              <button className="btn-helpful">
                <FiThumbsUp size={14} />
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductRatings;
