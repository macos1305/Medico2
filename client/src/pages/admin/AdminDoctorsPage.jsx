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
import { GlassButton, SecondaryGlassButton, IconGlassButton } from '../../components/common/buttons';

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
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 4rem' }}>
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
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      color: '#c084fc',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Physician Directory
                  </span>
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                    fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                    margin: 0,
                  }}
                >
                  Doctor Credentials & Governance
                </h1>
                <p style={{ color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
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
                marginBottom: '2rem',
              }}
            >
              {/* Filter Tabs */}
              <div
                style={{
                  display: 'inline-flex',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(20px)',
                  padding: '0.3rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  gap: '0.25rem',
                  flexWrap: 'wrap',
                }}
              >
                {['All', 'Pending', 'Approved', 'Rejected', 'Inactive'].map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => handleTabChange(tab)}
                      style={{
                        padding: '0.45rem 1rem',
                        borderRadius: '9999px',
                        border: isActive ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        transition: 'all 0.2s ease',
                        backgroundColor: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                        color: isActive ? '#38bdf8' : 'rgba(200, 205, 225, 0.7)',
                        boxShadow: isActive ? '0 0 15px rgba(56, 189, 248, 0.15)' : 'none',
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Keyword Search */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#38bdf8',
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search name, specialty, license..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    paddingLeft: '2.5rem',
                    backgroundColor: 'rgba(18, 20, 29, 0.7)',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    height: '42px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Doctors Grid */}
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
                      className="glass-card glass-card-hover"
                      style={{
                        padding: '1.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: '24px',
                        background: 'rgba(18, 20, 29, 0.65)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div>
                        {/* Top: Status Badges */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.6rem',
                              borderRadius: '999px',
                              backgroundColor: status === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' : status === 'REJECTED' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: status === 'APPROVED' ? '#34d399' : status === 'REJECTED' ? '#fb7185' : '#fbbf24',
                              border: `1px solid ${status === 'APPROVED' ? 'rgba(16, 185, 129, 0.3)' : status === 'REJECTED' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {status}
                          </span>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '999px',
                              backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                              color: isActive ? '#34d399' : '#fb7185',
                              border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                              textTransform: 'uppercase',
                            }}
                          >
                            {isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </div>

                        {/* Doctor Info */}
                        <div style={{ marginBottom: '1.25rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>
                            {user?.name || 'Physician'}
                          </h3>
                          <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
                            {doc.specialization}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(200, 205, 225, 0.65)', marginTop: '0.35rem' }}>
                            {user?.email} • {user?.phone || 'No phone'}
                          </div>
                        </div>

                        {/* License & Fee Meta */}
                        <div
                          style={{
                            padding: '0.85rem 1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '14px',
                            fontSize: '0.82rem',
                            marginBottom: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.4rem',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'rgba(148, 163, 184, 0.7)' }}>License ID:</span>
                            <code style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.78rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                              {doc.licenseNumber}
                            </code>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'rgba(148, 163, 184, 0.7)' }}>Exp / Fee:</span>
                            <span style={{ color: '#ffffff', fontWeight: 500 }}>{doc.experienceYears} Years • ₹{doc.consultationFee}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'rgba(148, 163, 184, 0.7)' }}>Hospital:</span>
                            <span style={{ color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
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
                          paddingTop: '1rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                          flexWrap: 'wrap',
                        }}
                      >
                        <SecondaryGlassButton
                          size="sm"
                          onClick={() => {
                            setSelectedDoctor(doc);
                            setReviewModalOpen(true);
                          }}
                          icon={<Eye size={14} />}
                          style={{ flex: 1 }}
                        >
                          Review
                        </SecondaryGlassButton>

                        {status !== 'APPROVED' && (
                          <GlassButton
                            variant="success"
                            size="sm"
                            disabled={actionLoading}
                            onClick={() => handleApprove(doc._id)}
                            icon={<Check size={14} />}
                            title="Approve Credentials"
                          >
                            Approve
                          </GlassButton>
                        )}

                        <IconGlassButton
                          variant={isActive ? 'ghost' : 'outline'}
                          size="sm"
                          disabled={actionLoading}
                          onClick={() => handleToggleStatus(doc._id, !isActive)}
                          icon={isActive ? <UserX size={15} color="#fb7185" /> : <UserCheck size={15} color="#38bdf8" />}
                          title={isActive ? 'Deactivate Doctor Account' : 'Activate Doctor Account'}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="glass-card"
                style={{
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  borderRadius: '24px',
                }}
              >
                <Stethoscope size={36} color="rgba(148, 163, 184, 0.5)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                  No Doctors Matching Filter
                </h3>
                <p style={{ color: 'rgba(200, 205, 225, 0.65)', fontSize: '0.9rem' }}>
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
