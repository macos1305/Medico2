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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-xs)' }}>
        <span style={{ color: 'var(--slate-500)', width: 24, textAlign: 'right' }}>{star}★</span>
        <div
          style={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            background: 'var(--slate-100)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
              borderRadius: 4,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
        <span style={{ color: 'var(--slate-400)', width: 28, textAlign: 'right' }}>{pct}%</span>
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
          className="card"
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '1.25rem',
            background: 'linear-gradient(135deg, #f0fdfa, #f8fafc)',
            borderLeft: '4px solid #f59e0b',
          }}
        >
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1 }}>
              {avgRating.toFixed(1)}
            </div>
            <StarRating value={avgRating} readOnly size={18} />
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', marginTop: '0.25rem' }}>
              {totalCount} review{totalCount !== 1 ? 's' : ''}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
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
        <EmptyState
          icon="inbox"
          title="No Reviews Yet"
          message="This doctor has not received any patient reviews. Be the first to share your experience after your consultation."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((review) => {
            const patientName = review.patient?.user?.name || 'Patient';
            const initials = patientName.charAt(0).toUpperCase();
            const isActing = actionLoading === review._id;

            return (
              <div
                key={review._id}
                className="card"
                style={{
                  padding: '1.25rem',
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
                        background: 'var(--primary-100)',
                        color: 'var(--primary-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem',
                        flexShrink: 0,
                        overflow: 'hidden',
                        border: '2px solid var(--primary-200)',
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
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--slate-900)' }}>
                        {patientName}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>
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
                          style={{ color: review.isVisible === false ? 'var(--primary-600)' : 'var(--slate-400)' }}
                          icon={review.isVisible === false ? <Eye size={14} /> : <EyeOff size={14} />}
                        />
                        <IconGlassButton
                          onClick={() => handleDelete(review._id)}
                          variant="ghost"
                          size="sm"
                          disabled={isActing}
                          title="Delete review"
                          style={{ color: 'var(--accent-rose)' }}
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
                      marginTop: '0.875rem',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--slate-700)',
                      lineHeight: 1.65,
                      borderLeft: '3px solid var(--primary-100)',
                      paddingLeft: '0.875rem',
                    }}
                  >
                    {review.comment}
                  </p>
                ) : (
                  <p style={{ marginTop: '0.6rem', fontSize: 'var(--text-xs)', color: 'var(--slate-400)', fontStyle: 'italic' }}>
                    <MessageSquare size={12} style={{ marginRight: 4 }} />
                    No written comment
                  </p>
                )}

                {review.isVisible === false && (
                  <div style={{ marginTop: '0.65rem' }}>
                    <span
                      className="badge"
                      style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        border: '1px solid #fde68a',
                        fontSize: '0.65rem',
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

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', textAlign: 'center' }}>
            Showing {reviews.length} of {total} review{total !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
