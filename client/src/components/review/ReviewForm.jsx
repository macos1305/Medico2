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
      className="glass-card"
      style={{
        padding: '1.75rem',
        borderRadius: '16px',
        background: 'rgba(18, 20, 29, 0.75)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderTop: '4px solid #3b82f6',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4), 0 0 20px rgba(59, 130, 246, 0.15)',
        color: '#ffffff',
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
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.25rem 0' }}>
            Rate Your Visit
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.65)', margin: 0 }}>
            How was your consultation with <strong style={{ color: '#ffffff' }}>{doctorName}</strong>?
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
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.4rem' }}>
            Your Rating <span style={{ color: '#f43f5e' }}>*</span>
          </label>
          <div style={{ marginTop: '0.35rem' }}>
            <StarRating value={rating} onChange={setRating} size={30} readOnly={false} />
          </div>
          {rating > 0 && (
            <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.35rem', margin: '0.35rem 0 0 0' }}>
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]} — {rating} star{rating > 1 ? 's' : ''}
            </p>
          )}
          {errors.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f87171', fontSize: '0.78rem', marginTop: '0.35rem' }}>
              <AlertCircle size={12} /> {errors.rating}
            </div>
          )}
        </div>

        {/* Comment */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="review-comment" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.4rem' }}>
            Your Review <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            id="review-comment"
            className="glass-input"
            placeholder="Share your experience — what went well, how was the doctor's communication, would you recommend them?"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (errors.comment) setErrors((p) => ({ ...p, comment: '' }));
            }}
            rows={4}
            maxLength={1000}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: errors.comment ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '0.875rem',
              resize: 'vertical',
              minHeight: 100,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
            {errors.comment ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f87171', fontSize: '0.78rem' }}><AlertCircle size={12} /> {errors.comment}</div>
            ) : (
              <span />
            )}
            <span
              style={{
                fontSize: '0.75rem',
                color: charLeft < 100 ? '#f87171' : 'rgba(255, 255, 255, 0.4)',
              }}
            >
              {charLeft} remaining
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
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
