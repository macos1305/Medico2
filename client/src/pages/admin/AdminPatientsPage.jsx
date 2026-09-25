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

          {/* Main Patients Directory */}
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
                  <span className="badge badge-admin">User Registry</span>
                </div>
                <h1 style={{ fontSize: '2rem', color: 'var(--slate-900)' }}>
                  Patient Governance
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
                  Inspect registered patient accounts, emergency records, consultation records, and manage access privileges.
                </p>
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
                  placeholder="Search patient name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
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
                        {/* Top: Status Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span className="badge badge-patient">Patient</span>
                          <span className={`badge ${isActive ? 'badge-approved' : 'badge-rejected'}`} style={{ fontSize: '0.65rem' }}>
                            {isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </div>

                        {/* Patient Name & Contacts */}
                        <div style={{ marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '0.2rem' }}>
                            {user?.name || 'Patient'}
                          </h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.825rem', color: 'var(--slate-500)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Mail size={13} />
                              <span>{user?.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Phone size={13} />
                              <span>{user?.phone || 'No phone'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Medical Demographics Pill */}
                        <div
                          style={{
                            padding: '0.65rem 0.85rem',
                            backgroundColor: 'var(--slate-50)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.8rem',
                            marginBottom: '1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <span style={{ color: 'var(--slate-400)' }}>Blood Group: </span>
                            <strong style={{ color: 'var(--accent-rose)' }}>{pat.bloodGroup || 'UNKNOWN'}</strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--slate-400)' }}>Gender: </span>
                            <span style={{ textTransform: 'capitalize' }}>{pat.gender?.toLowerCase() || 'N/A'}</span>
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
                          icon={isActive ? <UserX size={15} color="var(--accent-rose)" /> : <UserCheck size={15} color="var(--medico-primary)" />}
                          title={isActive ? 'Deactivate Patient Account' : 'Activate Patient Account'}
                        />
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
                <Users size={36} color="var(--slate-300)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
                  No Patients Found
                </h3>
                <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
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
