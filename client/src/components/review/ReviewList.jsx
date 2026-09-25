import React, { useState, useEffect, useCallback } from 'react';
import reviewService from '../../services/reviewService';
import StarRating from './StarRating';
import { SkeletonListItem } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Trash2, EyeOff, Eye, MessageSquare, ChevronDown } from 'lucide-react';
import { IconGlassButton, SecondaryGlassButton } from '../common/buttons';

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

/**
 * ReviewList
 * Props:
 *  doctorId  – the doctor's _id
 *  summary   – { average, count } from doctor.rating (shown as header)
 */
const ReviewList = ({ doctorId, summary }) => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const isAdmin = user?.role === 'ADMIN';

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReviews = useCallback(async (pageNum = 1) => {
    setLoading(pageNum === 1);
    try {
      const res = await reviewService.getDoctorReviews(doctorId, { page: pageNum, limit: 5 });
      const { reviews: list, total: tot, totalPages: tp } = res.data;
      setReviews((prev) => (pageNum === 1 ? list : [...prev, ...list]));
      setTotal(tot);
      setTotalPages(tp);
    } catch (err) {
      console.error('fetchReviews error:', err);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    setPage(1);
    fetchReviews(1);
  }, [fetchReviews]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchReviews(next);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setActionLoading(reviewId);
    try {
      await reviewService.delete(reviewId);
      success('Review deleted successfully');
      fetchReviews(1);
      setPage(1);
    } catch (err) {
      toastError(err.message || 'Failed to delete review');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleVisibility = async (reviewId, currentVisible) => {
    setActionLoading(reviewId);
    try {
      await reviewService.adminSetVisibility(reviewId, !currentVisible);
      success(`Review ${currentVisible ? 'hidden' : 'restored'} successfully`);
      fetchReviews(1);
      setPage(1);
    } catch (err) {
      toastError(err.message || 'Failed to update visibility');
    } finally {
      setActionLoading(null);
    }
  };

  /* ── Rating Distribution Bar ──────────────────────────────────────────── */
  const RatingBar = ({ star, count: cnt, total: tot }) => {
    const pct = tot > 0 ? Math.round((cnt / tot) * 100) : 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.78rem' }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.6)', width: 24, textAlign: 'right' }}>{star}★</span>
        <div
          style={{
            flex: 1,
            height: 6,
            borderRadius: 9999,
            background: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
              borderRadius: 9999,
              boxShadow: pct > 0 ? '0 0 8px rgba(251, 191, 36, 0.4)' : 'none',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
        <span style={{ color: 'rgba(255, 255, 255, 0.4)', width: 28, textAlign: 'right' }}>{pct}%</span>
      </div>
    );
  };

  /* ── Rating summary header ────────────────────────────────────────────── */
  const avgRating = summary?.average || 0;
  const totalCount = summary?.count || 0;

  return (
    <div>
      {/* ── Summary banner ──────────────────────────────────────────────── */}
      {totalCount > 0 && (
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            borderRadius: '16px',
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
            background: 'rgba(18, 20, 29, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderLeft: '4px solid #fbbf24',
          }}
        >
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
              {avgRating.toFixed(1)}
            </div>
            <div style={{ margin: '0.4rem 0' }}>
              <StarRating value={avgRating} readOnly size={18} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              {totalCount} verified review{totalCount !== 1 ? 's' : ''}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const cnt = reviews.filter((r) => Math.round(r.rating) === star).length;
              return <RatingBar key={star} star={star} count={cnt} total={reviews.length} />;
            })}
          </div>
        </div>
      )}

      {/* ── Review cards ────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map((i) => <SkeletonListItem key={i} />)}
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'rgba(255, 255, 255, 0.5)' }}>
          <MessageSquare size={32} style={{ margin: '0 auto 0.75rem auto', color: 'rgba(255, 255, 255, 0.25)' }} />
          <h4 style={{ fontSize: '1.1rem', color: '#ffffff', margin: '0 0 0.35rem 0' }}>No Reviews Yet</h4>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            This doctor has not received any patient reviews yet. Be the first to share your experience after your consultation.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((review) => {
            const patientName = review.patient?.user?.name || 'Patient';
            const initials = patientName.charAt(0).toUpperCase();
            const isActing = actionLoading === review._id;

            return (
              <div
                key={review._id}
                className="glass-card"
                style={{
                  padding: '1.35rem',
                  borderRadius: '14px',
                  background: 'rgba(18, 20, 29, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  opacity: review.isVisible === false ? 0.55 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                  {/* Patient avatar + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem',
                        flexShrink: 0,
                        overflow: 'hidden',
                        border: '2px solid rgba(59, 130, 246, 0.3)',
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      {review.patient?.user?.profileImage ? (
                        <img
                          src={review.patient.user.profileImage}
                          alt={patientName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>
                        {patientName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.45)' }}>
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Stars + admin tools */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <StarRating value={review.rating} readOnly size={16} />
                    {isAdmin && (
                      <>
                        <IconGlassButton
                          onClick={() => handleToggleVisibility(review._id, review.isVisible !== false)}
                          variant="ghost"
                          size="sm"
                          disabled={isActing}
                          title={review.isVisible === false ? 'Restore review' : 'Hide review'}
                          style={{ color: review.isVisible === false ? '#60a5fa' : 'rgba(255, 255, 255, 0.5)' }}
                          icon={review.isVisible === false ? <Eye size={14} /> : <EyeOff size={14} />}
                        />
                        <IconGlassButton
                          onClick={() => handleDelete(review._id)}
                          variant="ghost"
                          size="sm"
                          disabled={isActing}
                          title="Delete review"
                          style={{ color: '#f87171' }}
                          icon={<Trash2 size={14} />}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Comment body */}
                {review.comment ? (
                  <p
                    style={{
                      margin: '0.85rem 0 0 0',
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.65,
                      borderLeft: '3px solid rgba(59, 130, 246, 0.4)',
                      paddingLeft: '0.85rem',
                    }}
                  >
                    {review.comment}
                  </p>
                ) : (
                  <p style={{ margin: '0.6rem 0 0 0', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.35)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MessageSquare size={12} />
                    No written comment
                  </p>
                )}

                {review.isVisible === false && (
                  <div style={{ marginTop: '0.65rem' }}>
                    <span
                      style={{
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: '#fbbf24',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                      }}
                    >
                      Hidden by admin
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Load more */}
          {page < totalPages && (
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <SecondaryGlassButton
                size="sm"
                onClick={handleLoadMore}
                disabled={loading}
                icon={<ChevronDown size={16} />}
              >
                Load More Reviews
              </SecondaryGlassButton>
            </div>
          )}

          <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center', margin: '0.5rem 0 0 0' }}>
            Showing {reviews.length} of {total} review{total !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
