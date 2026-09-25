import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import PatientDetailsModal from '../../components/admin/PatientDetailsModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { SecondaryGlassButton, IconGlassButton } from '../../components/common/buttons';

const AdminPatientsPage = () => {
  const { success, error: toastError } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const query = {};
      if (searchTerm.trim()) query.search = searchTerm.trim();

      const res = await adminService.getPatients(query);
      setPatients(res.data || []);
    } catch (err) {
      console.error('Failed to load patients:', err);
      toastError(err.message || 'Could not load patient registry', 'Error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, toastError]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleViewPatient = async (id) => {
    setActionLoading(true);
    try {
      const res = await adminService.getPatient(id);
      setSelectedPatient(res.data);
      setDetailsModalOpen(true);
    } catch (err) {
      toastError(err.message || 'Failed to retrieve patient details', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    setActionLoading(true);
    try {
      await adminService.togglePatientStatus(id, isActive);
      success(`Patient account has been ${isActive ? 'activated' : 'deactivated'}`, 'Status Updated');
      setDetailsModalOpen(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (err) {
      toastError(err.message || 'Failed to update patient account status', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2.5rem 0', minHeight: '80vh' }}>
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

          {/* Main Patients Directory */}
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
                  }}>User Registry</span>
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 0.4rem 0' }}>
                  Patient Governance
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.95rem', margin: 0, maxWidth: '600px' }}>
                  Inspect registered patient accounts, emergency records, consultation records, and manage access privileges.
                </p>
              </div>

              {/* Keyword Search */}
              <div style={{ position: 'relative', width: '300px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.4)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  className="glass-input"
                  placeholder="Search patient name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem',
                    paddingTop: '0.65rem',
                    paddingBottom: '0.65rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Patients List */}
            {loading ? (
              <LoadingSpinner text="Retrieving patient records..." />
            ) : patients.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {patients.map((pat) => {
                  const user = pat.user;
                  const isActive = user?.isActive !== false;

                  return (
                    <div
                      key={pat._id}
                      className="glass-card glass-card-interactive"
                      style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: '16px',
                        background: 'rgba(18, 20, 29, 0.65)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div>
                        {/* Top: Status Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                          <span style={{
                            padding: '0.2rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            background: 'rgba(59, 130, 246, 0.15)',
                            color: '#60a5fa',
                            border: '1px solid rgba(59, 130, 246, 0.25)',
                          }}>Patient</span>
                          <span style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: isActive ? '#34d399' : '#f87171',
                            border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                          }}>
                            {isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </div>

                        {/* Patient Name & Contacts */}
                        <div style={{ marginBottom: '1.2rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
                            {user?.name || 'Patient'}
                          </h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Mail size={13} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                              <span>{user?.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Phone size={13} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                              <span>{user?.phone || 'No phone'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Medical Demographics Pill */}
                        <div
                          style={{
                            padding: '0.75rem 0.85rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '10px',
                            fontSize: '0.8rem',
                            marginBottom: '1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Blood Group: </span>
                            <strong style={{ color: '#f43f5e' }}>{pat.bloodGroup || 'UNKNOWN'}</strong>
                          </div>
                          <div>
                            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Gender: </span>
                            <span style={{ textTransform: 'capitalize', color: '#ffffff' }}>{pat.gender?.toLowerCase() || 'N/A'}</span>
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
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <SecondaryGlassButton
                          size="small"
                          onClick={() => handleViewPatient(pat._id)}
                          icon={<Eye size={14} />}
                          style={{ flex: 1 }}
                        >
                          Dossier
                        </SecondaryGlassButton>

                        <IconGlassButton
                          variant={isActive ? 'ghost' : 'outline'}
                          size="small"
                          disabled={actionLoading}
                          onClick={() => handleToggleStatus(pat._id, !isActive)}
                          icon={isActive ? <UserX size={15} color="#f43f5e" /> : <UserCheck size={15} color="#34d399" />}
                          title={isActive ? 'Deactivate Patient Account' : 'Activate Patient Account'}
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
                  borderRadius: '16px',
                  background: 'rgba(18, 20, 29, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Users size={36} style={{ margin: '0 auto 0.75rem auto', color: 'rgba(255, 255, 255, 0.3)' }} />
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                  No Patients Found
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
                  There are no patient records matching your search query.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient Dossier Modal */}
      <PatientDetailsModal
        isOpen={detailsModalOpen}
        patientData={selectedPatient}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedPatient(null);
        }}
        onToggleStatus={handleToggleStatus}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default AdminPatientsPage;
