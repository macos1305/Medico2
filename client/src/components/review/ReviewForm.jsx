import React, { useState } from 'react';
import StarRating from './StarRating';
import reviewService from '../../services/reviewService';
import { useToast } from '../../context/ToastContext';
import { Send, X, AlertCircle } from 'lucide-react';
import { IconGlassButton, SecondaryGlassButton, PrimaryGlassButton } from '../common/buttons';

/**
 * ReviewForm
 * Props:
 *  appointment  – the COMPLETED appointment object
 *  doctorName   – string
 *  onSuccess    – callback(review) after successful submit
 *  onClose      – callback to close/dismiss the form
 */
const ReviewForm = ({ appointment, doctorName, onSuccess, onClose }) => {
  const { success: toastSuccess, error: toastError } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!rating || rating < 1 || rating > 5) {
      errs.rating = 'Please select a rating between 1 and 5 stars';
    }
    if (comment.length > 1000) {
      errs.comment = 'Comment must be 1000 characters or fewer';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await reviewService.create({
        appointmentId: appointment._id,
        rating,
        comment: comment.trim(),
      });
      toastSuccess('Your review has been submitted. Thank you!', 'Review Posted');
      onSuccess && onSuccess(res.data);
    } catch (err) {
      toastError(err.message || 'Failed to submit review', 'Submission Error');
    } finally {
      setSubmitting(false);
    }
  };

  const charLeft = 1000 - comment.length;

  return (
    <div
      className="card"
      style={{
        padding: '1.75rem',
        border: '2px solid var(--primary-100)',
        borderTop: '4px solid var(--primary-500)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '0.2rem' }}>
            Rate Your Visit
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)' }}>
            How was your consultation with <strong>{doctorName}</strong>?
          </p>
        </div>
        {onClose && (
          <IconGlassButton
            onClick={onClose}
            variant="ghost"
            size="sm"
            icon={<X size={16} />}
            aria-label="Close review form"
          />
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Star Rating */}
        <div className="form-group">
          <label className="form-label">
            Your Rating <span className="required">*</span>
          </label>
          <div style={{ marginTop: '0.35rem' }}>
            <StarRating value={rating} onChange={setRating} size={32} readOnly={false} />
          </div>
          {rating > 0 && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', marginTop: '0.35rem' }}>
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]} — {rating} star{rating > 1 ? 's' : ''}
            </p>
          )}
          {errors.rating && (
            <div className="form-error">
              <AlertCircle size={12} /> {errors.rating}
            </div>
          )}
        </div>

        {/* Comment */}
        <div className="form-group">
          <label className="form-label" htmlFor="review-comment">
            Your Review <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            id="review-comment"
            className={`form-input${errors.comment ? ' error' : ''}`}
            placeholder="Share your experience — what went well, how was the doctor's communication, would you recommend them?"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (errors.comment) setErrors((p) => ({ ...p, comment: '' }));
            }}
            rows={4}
            maxLength={1000}
            style={{ resize: 'vertical', minHeight: 100 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
            {errors.comment ? (
              <div className="form-error"><AlertCircle size={12} /> {errors.comment}</div>
            ) : (
              <span />
            )}
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: charLeft < 100 ? 'var(--accent-rose)' : 'var(--slate-400)',
              }}
            >
              {charLeft} remaining
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          {onClose && (
            <SecondaryGlassButton size="sm" onClick={onClose}>
              Cancel
            </SecondaryGlassButton>
          )}
          <PrimaryGlassButton
            type="submit"
            size="sm"
            disabled={submitting || rating === 0}
            loading={submitting}
            icon={<Send size={14} />}
            id="submit-review-btn"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </PrimaryGlassButton>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
