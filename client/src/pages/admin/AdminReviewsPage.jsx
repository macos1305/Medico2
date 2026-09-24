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
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 3rem' }}>
      <div className="container">
        <div className="dashboard-layout">
          <AdminSidebar />

          <main>
            {/* Header */}
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="badge badge-admin" style={{ marginBottom: '0.35rem' }}>
                Content Moderation
              </span>
              <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--slate-900)' }}>
                Review Moderation
              </h1>
              <p style={{ color: 'var(--slate-500)', fontSize: 'var(--text-sm)', marginTop: '0.2rem' }}>
                Manage patient reviews — hide inappropriate content or remove it permanently.
              </p>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              {[
                { label: 'Total Reviews', value: total, color: 'var(--primary-600)' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="card"
                  style={{
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    borderLeft: `4px solid ${s.color}`,
                  }}
                >
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {loading ? '—' : s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <Filter size={16} color="var(--slate-400)" />
              <div className="tab-list" style={{ width: 'fit-content' }}>
                {filterTabs.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => { setFilter(t.key); setPage(1); }}
                    className={`tab-btn${filter === t.key ? ' active' : ''}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews Table */}
            <div className="card" style={{ overflow: 'hidden' }}>
              {loading ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
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
                <EmptyState
                  IconComponent={MessageSquare}
                  title="No Reviews Found"
                  message="There are no reviews matching the current filter."
                />
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((review) => {
                        const patientName = review.patient?.user?.name || 'Patient';
                        const doctorName = review.doctor?.user?.name || 'Doctor';
                        const isHidden = review.isVisible === false;
                        const isActing = actionLoading === review._id;

                        return (
                          <tr key={review._id} style={{ opacity: isHidden ? 0.6 : 1 }}>
                            <td>
                              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--slate-900)' }}>
                                {patientName}
                              </div>
                              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>
                                {review.patient?.user?.email || ''}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--slate-900)' }}>
                                {doctorName}
                              </div>
                            </td>
                            <td>
                              <StarRating value={review.rating} readOnly size={14} showValue />
                            </td>
                            <td style={{ maxWidth: 240 }}>
                              {review.comment ? (
                                <p
                                  style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--slate-600)',
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
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-300)', fontStyle: 'italic' }}>
                                  No comment
                                </span>
                              )}
                            </td>
                            <td>
                              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>
                                {formatDate(review.createdAt)}
                              </span>
                            </td>
                            <td>
                              {isHidden ? (
                                <span
                                  style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: '#fef3c7',
                                    color: '#92400e',
                                    border: '1px solid #fde68a',
                                  }}
                                >
                                  Hidden
                                </span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: '#f0fdf4',
                                    color: '#166534',
                                    border: '1px solid #bbf7d0',
                                  }}
                                >
                                  Visible
                                </span>
                              )}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => handleToggleVisibility(review)}
                                  className="btn btn-secondary btn-sm"
                                  disabled={isActing}
                                  title={isHidden ? 'Restore review' : 'Hide review'}
                                  style={{ padding: '0.3rem 0.6rem' }}
                                >
                                  {isHidden ? <Eye size={13} /> : <EyeOff size={13} />}
                                  <span style={{ fontSize: '0.7rem' }}>{isHidden ? 'Restore' : 'Hide'}</span>
                                </button>
                                <button
                                  onClick={() => setDeleteModal({ open: true, review })}
                                  className="btn btn-danger btn-sm"
                                  disabled={isActing}
                                  title="Delete permanently"
                                  style={{ padding: '0.3rem 0.6rem' }}
                                >
                                  <Trash2 size={13} />
                                </button>
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
                <div style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => { const next = page + 1; setPage(next); fetchReviews(next); }}
                    disabled={loading}
                  >
                    Load More
                  </button>
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
