import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DoctorReviewModal from '../../components/admin/DoctorReviewModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import {
  Stethoscope,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Check,
  Ban,
  UserCheck,
  UserX,
  Building2,
  ShieldCheck,
} from 'lucide-react';

const AdminDoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('approvalStatus') || 'All';

  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState(initialStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const query = {};
      if (activeTab === 'Pending') query.approvalStatus = 'PENDING';
      else if (activeTab === 'Approved') query.approvalStatus = 'APPROVED';
      else if (activeTab === 'Rejected') query.approvalStatus = 'REJECTED';
      else if (activeTab === 'Inactive') query.isActive = 'false';

      if (searchTerm.trim()) query.search = searchTerm.trim();

      const res = await adminService.getDoctors(query);
      setDoctors(res.data || []);
    } catch (err) {
      console.error('Failed to load doctors:', err);
      toastError(err.message || 'Could not load doctors', 'Load Error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, toastError]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab !== 'All' ? { approvalStatus: tab } : {});
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await adminService.approveDoctor(id);
      success('Doctor application approved successfully', 'Approved');
      setReviewModalOpen(false);
      setSelectedDoctor(null);
      fetchDoctors();
    } catch (err) {
      toastError(err.message || 'Failed to approve doctor', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id, reason) => {
    setActionLoading(true);
    try {
      await adminService.rejectDoctor(id, reason);
      success('Doctor application rejected', 'Rejected');
      setReviewModalOpen(false);
      setSelectedDoctor(null);
      fetchDoctors();
    } catch (err) {
      toastError(err.message || 'Failed to reject doctor', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    setActionLoading(true);
    try {
      await adminService.toggleDoctorStatus(id, isActive);
      success(`Doctor account has been ${isActive ? 'activated' : 'deactivated'}`, 'Status Updated');
      setReviewModalOpen(false);
      setSelectedDoctor(null);
      fetchDoctors();
    } catch (err) {
      toastError(err.message || 'Failed to update account status', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2.5rem 0' }}>
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
          {/* Left Admin Sidebar */}
          <AdminSidebar />

          {/* Main Doctors Directory */}
          <div>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.75rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-admin">Physician Directory</span>
                </div>
                <h1 style={{ fontSize: '2rem', color: 'var(--slate-900)' }}>
                  Doctor Credentials & Governance
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
                  Review physician license credentials, approve or reject applications, and manage account statuses.
                </p>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.75rem',
              }}
            >
              {/* Filter Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.4rem',
                  backgroundColor: 'var(--slate-100)',
                  padding: '0.35rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                }}
              >
                {['All', 'Pending', 'Approved', 'Rejected', 'Inactive'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleTabChange(tab)}
                    className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Keyword Search */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--slate-400)',
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search name, specialty, license..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            {/* Doctors Table / Cards */}
            {loading ? (
              <LoadingSpinner text="Loading doctors..." />
            ) : doctors.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {doctors.map((doc) => {
                  const user = doc.user;
                  const status = doc.approvalStatus;
                  const isActive = user?.isActive !== false;

                  return (
                    <div
                      key={doc._id}
                      className="card card-interactive"
                      style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: 'var(--radius-lg)',
                      }}
                    >
                      <div>
                        {/* Top: Status Badges */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span className={`badge ${status === 'APPROVED' ? 'badge-approved' : status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'}`}>
                            {status}
                          </span>
                          <span className={`badge ${isActive ? 'badge-approved' : 'badge-rejected'}`} style={{ fontSize: '0.65rem' }}>
                            {isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </div>

                        {/* Doctor Info */}
                        <div style={{ marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '0.2rem' }}>
                            {user?.name || 'Physician'}
                          </h3>
                          <div style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                            {doc.specialization}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                            {user?.email} • {user?.phone || 'No phone'}
                          </div>
                        </div>

                        {/* License & Fee Meta */}
                        <div
                          style={{
                            padding: '0.75rem 0.85rem',
                            backgroundColor: 'var(--slate-50)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.825rem',
                            marginBottom: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--slate-400)' }}>License ID:</span>
                            <code>{doc.licenseNumber}</code>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--slate-400)' }}>Experience / Fee:</span>
                            <span>{doc.experienceYears} Years • ${doc.consultationFee}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--slate-400)' }}>Hospital:</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                              {doc.hospitalAffiliation || 'Independent Practice'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          paddingTop: '0.85rem',
                          borderTop: '1px solid var(--border-subtle)',
                          flexWrap: 'wrap',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDoctor(doc);
                            setReviewModalOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, gap: '0.35rem' }}
                        >
                          <Eye size={14} />
                          <span>Review</span>
                        </button>

                        {status !== 'APPROVED' && (
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleApprove(doc._id)}
                            className="btn btn-primary btn-sm"
                            style={{ gap: '0.25rem' }}
                            title="Approve Credentials"
                          >
                            <Check size={14} />
                            <span>Approve</span>
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleToggleStatus(doc._id, !isActive)}
                          className={`btn btn-sm ${isActive ? 'btn-ghost' : 'btn-outline'}`}
                          style={{ color: isActive ? 'var(--accent-rose)' : 'var(--primary-600)', padding: '0.4rem 0.5rem' }}
                          title={isActive ? 'Deactivate Doctor Account' : 'Activate Doctor Account'}
                        >
                          {isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="card"
                style={{
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <Stethoscope size={36} color="var(--slate-300)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
                  No Doctors Matching Filter
                </h3>
                <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
                  There are no physicians corresponding to the selected filter "{activeTab}".
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Review Modal */}
      <DoctorReviewModal
        isOpen={reviewModalOpen}
        doctor={selectedDoctor}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedDoctor(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        onToggleStatus={handleToggleStatus}
        actionLoading={actionLoading}
      />



    </div>
  );
};

export default AdminDoctorsPage;
