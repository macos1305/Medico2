import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import StarRating from '../../components/review/StarRating';
import { SkeletonTableRow } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import reviewService from '../../services/reviewService';
import { useToast } from '../../context/ToastContext';
import {
  MessageSquare,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { SecondaryGlassButton, DangerGlassButton, IconGlassButton } from '../../components/common/buttons';

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return d; }
};

const AdminReviewsPage = () => {
  const { success, error: toastError } = useToast();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all'); // all | visible | hidden
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, review: null });

  const fetchReviews = useCallback(async (pg = 1) => {
    setLoading(pg === 1);
    try {
      const params = { page: pg, limit: 20 };
      if (filter === 'visible') params.isVisible = true;
      if (filter === 'hidden') params.isVisible = false;
      const res = await reviewService.adminGetAll(params);
      const { reviews: list, total: tot, totalPages: tp } = res.data;
      setReviews(pg === 1 ? list : (prev) => [...prev, ...list]);
      setTotal(tot);
      setTotalPages(tp);
    } catch (err) {
      toastError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [filter, toastError]);

  useEffect(() => { setPage(1); fetchReviews(1); }, [fetchReviews]);

  const handleToggleVisibility = async (review) => {
    const next = review.isVisible === false ? true : false;
    setActionLoading(review._id);
    try {
      await reviewService.adminSetVisibility(review._id, next);
      success(`Review ${next ? 'restored' : 'hidden'} successfully`);
      fetchReviews(1); setPage(1);
    } catch (err) {
      toastError(err.message || 'Failed to update visibility');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.review) return;
    setActionLoading(deleteModal.review._id);
    try {
      await reviewService.delete(deleteModal.review._id);
      success('Review deleted permanently');
      setDeleteModal({ open: false, review: null });
      fetchReviews(1); setPage(1);
    } catch (err) {
      toastError(err.message || 'Failed to delete review');
    } finally {
      setActionLoading(null);
    }
  };

  const filterTabs = [
    { key: 'all', label: 'All Reviews' },
    { key: 'visible', label: 'Visible' },
    { key: 'hidden', label: 'Hidden' },
  ];

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2.5rem 0 3.5rem', minHeight: '80vh' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 300px) 1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
          className="dashboard-layout"
        >
          <AdminSidebar />

          <main>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: '#c084fc',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                }}>Content Moderation</span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 0.4rem 0' }}>
                Review Moderation
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.95rem', margin: 0 }}>
                Manage patient reviews — audit feedback, hide questionable content, or remove violations permanently.
              </p>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1.75rem',
              }}
            >
              {[
                { label: 'Total Platform Reviews', value: total, color: '#3b82f6' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="glass-card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    borderRadius: '16px',
                    background: 'rgba(18, 20, 29, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '4px',
                    background: 'linear-gradient(180deg, #3b82f6, #6366f1)',
                  }} />
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
                    {loading ? '—' : s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <Filter size={16} color="rgba(255, 255, 255, 0.4)" />
              <div
                style={{
                  display: 'flex',
                  gap: '0.35rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.3rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {filterTabs.map((t) => {
                  const isActive = filter === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => { setFilter(t.key); setPage(1); }}
                      style={{
                        padding: '0.4rem 0.9rem',
                        borderRadius: '9px',
                        border: 'none',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: isActive ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
                        color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                        boxShadow: isActive ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none',
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reviews Table */}
            <div
              className="glass-card"
              style={{
                overflow: 'hidden',
                borderRadius: '16px',
                background: 'rgba(18, 20, 29, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {loading ? (
                <div style={{ overflowX: 'auto', padding: '1rem' }}>
                  <table className="glass-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1,2,3,4,5].map(i => <SkeletonTableRow key={i} cols={7} />)}
                    </tbody>
                  </table>
                </div>
              ) : reviews.length === 0 ? (
                <div style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
                  <MessageSquare size={36} style={{ margin: '0 auto 0.75rem auto', color: 'rgba(255, 255, 255, 0.3)' }} />
                  <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                    No Reviews Found
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
                    There are no reviews matching the current filter.
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="glass-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patient</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Doctor</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comment</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((review) => {
                        const patientName = review.patient?.user?.name || 'Patient';
                        const doctorName = review.doctor?.user?.name || 'Doctor';
                        const isHidden = review.isVisible === false;
                        const isActing = actionLoading === review._id;

                        return (
                          <tr
                            key={review._id}
                            style={{
                              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                              opacity: isHidden ? 0.6 : 1,
                              transition: 'background 0.2s ease',
                            }}
                          >
                            <td style={{ padding: '1rem' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#ffffff' }}>
                                {patientName}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                                {review.patient?.user?.email || ''}
                              </div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#818cf8' }}>
                                {doctorName}
                              </div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <StarRating value={review.rating} readOnly size={14} showValue />
                            </td>
                            <td style={{ padding: '1rem', maxWidth: 240 }}>
                              {review.comment ? (
                                <p
                                  style={{
                                    fontSize: '0.825rem',
                                    color: 'rgba(255, 255, 255, 0.75)',
                                    margin: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {review.comment}
                                </p>
                              ) : (
                                <span style={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.3)', fontStyle: 'italic' }}>
                                  No comment
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                                {formatDate(review.createdAt)}
                              </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              {isHidden ? (
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.55rem',
                                    borderRadius: '9999px',
                                    background: 'rgba(245, 158, 11, 0.15)',
                                    color: '#fbbf24',
                                    border: '1px solid rgba(245, 158, 11, 0.3)',
                                  }}
                                >
                                  Hidden
                                </span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.55rem',
                                    borderRadius: '9999px',
                                    background: 'rgba(16, 185, 129, 0.15)',
                                    color: '#34d399',
                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                  }}
                                >
                                  Visible
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                <SecondaryGlassButton
                                  onClick={() => handleToggleVisibility(review)}
                                  size="sm"
                                  disabled={isActing}
                                  title={isHidden ? 'Restore review' : 'Hide review'}
                                  icon={isHidden ? <Eye size={13} /> : <EyeOff size={13} />}
                                >
                                  {isHidden ? 'Restore' : 'Hide'}
                                </SecondaryGlassButton>
                                <IconGlassButton
                                  onClick={() => setDeleteModal({ open: true, review })}
                                  variant="danger"
                                  size="sm"
                                  disabled={isActing}
                                  title="Delete permanently"
                                  icon={<Trash2 size={13} />}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Load more */}
              {page < totalPages && (
                <div style={{ padding: '1.25rem', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <SecondaryGlassButton
                    size="sm"
                    onClick={() => { const next = page + 1; setPage(next); fetchReviews(next); }}
                    disabled={loading}
                  >
                    Load More
                  </SecondaryGlassButton>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteModal.open}
        title="Delete Review Permanently"
        message={`Are you sure you want to permanently delete this review by ${deleteModal.review?.patient?.user?.name || 'patient'}? This will also update the doctor's average rating and cannot be undone.`}
        confirmText="Delete Permanently"
        cancelText="Cancel"
        isDangerous
        loading={actionLoading !== null}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, review: null })}
      />
    </div>
  );
};

export default AdminReviewsPage;
