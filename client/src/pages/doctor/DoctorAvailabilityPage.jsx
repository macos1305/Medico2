import React, { useState, useEffect } from 'react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import availabilityService from '../../services/availabilityService';
import { useToast } from '../../context/ToastContext';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Ban,
  Plus,
  Trash2,
  Save,
  Sun,
  CloudSun,
  Moon,
  Sparkles,
} from 'lucide-react';

const allDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const slotDurationOptions = [15, 20, 30, 45, 60];

const DoctorAvailabilityPage = () => {
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Form State
  const [workingDays, setWorkingDays] = useState([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(30);
  const [breakStartTime, setBreakStartTime] = useState('13:00');
  const [breakEndTime, setBreakEndTime] = useState('14:00');
  const [isActive, setIsActive] = useState(true);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockDate, setNewBlockDate] = useState('');

  // Interactive Preview State
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const [previewDate, setPreviewDate] = useState(getTodayStr());
  const [previewSlotsData, setPreviewSlotsData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const res = await availabilityService.getMyAvailability();
      if (res.data) {
        const d = res.data;
        setWorkingDays(d.workingDays || []);
        setStartTime(d.startTime || '09:00');
        setEndTime(d.endTime || '17:00');
        setSlotDuration(d.slotDuration || 30);
        setBreakStartTime(d.breakStartTime || '13:00');
        setBreakEndTime(d.breakEndTime || '14:00');
        setIsActive(d.isActive !== undefined ? d.isActive : true);
        setBlockedDates(d.blockedDates || []);
      }
    } catch (err) {
      console.error('Failed to load availability:', err);
      toastError(err.message || 'Could not load your availability schedule', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleToggleDay = (day) => {
    if (workingDays.includes(day)) {
      if (workingDays.length === 1) {
        toastError('You must select at least one working day.', 'Validation');
        return;
      }
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();

    // Client-side validation: prevent conflicting availability
    if (startTime >= endTime) {
      toastError('Operating start time must be earlier than end time.', 'Conflict Detected');
      return;
    }

    if (breakStartTime && breakEndTime) {
      if (breakStartTime >= breakEndTime) {
        toastError('Break start time must be before break end time.', 'Conflict Detected');
        return;
      }
      if (breakStartTime < startTime || breakEndTime > endTime) {
        toastError('Break interval must fall entirely within working hours.', 'Conflict Detected');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        workingDays,
        startTime,
        endTime,
        slotDuration: Number(slotDuration),
        breakStartTime,
        breakEndTime,
        isActive,
      };
      await availabilityService.updateMyAvailability(payload);
      success('Clinical schedule and operating parameters saved successfully!', 'Schedule Saved');
      fetchAvailability();
    } catch (err) {
      toastError(err.message || 'Failed to save availability schedule', 'Save Error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSchedule = async () => {
    setSaving(true);
    try {
      await availabilityService.resetMyAvailability();
      success('Availability reset to standard Monday-Friday 09:00 - 17:00 schedule', 'Schedule Reset');
      setResetModalOpen(false);
      fetchAvailability();
    } catch (err) {
      toastError(err.message || 'Failed to reset schedule', 'Reset Error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlockDate = async (e) => {
    e.preventDefault();
    if (!newBlockDate) {
      toastError('Please choose a date to block.', 'Validation');
      return;
    }
    if (blockedDates.includes(newBlockDate)) {
      toastError('This date is already blocked.', 'Notice');
      return;
    }

    setSaving(true);
    try {
      await availabilityService.blockDate(newBlockDate);
      success(`Date ${newBlockDate} blocked from consultations`, 'Date Blocked');
      setNewBlockDate('');
      fetchAvailability();
    } catch (err) {
      toastError(err.message || 'Failed to block date', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveBlockDate = async (date) => {
    setSaving(true);
    try {
      await availabilityService.unblockDate(date);
      success(`Date ${date} has been unblocked`, 'Date Unblocked');
      fetchAvailability();
    } catch (err) {
      toastError(err.message || 'Failed to unblock date', 'Error');
    } finally {
      setSaving(false);
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
          {/* Left Doctor Sidebar */}
          <DoctorSidebar />

          {/* Main Availability Area */}
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
                  <span className="badge badge-doctor">Practice Schedule</span>
                </div>
                <h1 style={{ fontSize: '2rem', color: 'var(--slate-900)' }}>
                  Clinical Availability & Slot Engine
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
                  Configure weekly operating days, hours, consultation intervals, and block off-duty dates.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setResetModalOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.4rem' }}
              >
                <RotateCcw size={15} />
                <span>Reset to Standard</span>
              </button>
            </div>

            {loading ? (
              <LoadingSpinner text="Retrieving schedule configuration..." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* 1. Working Schedule Card */}
                <div className="card" style={{ padding: '2rem' }}>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <Clock size={20} color="var(--primary-600)" />
                    <span>Operating Hours & Working Days</span>
                  </h3>

                  <form onSubmit={handleSaveSchedule}>
                    {/* Working Days Checkboxes */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.65rem', display: 'block' }}>
                        Weekly Consultation Days *
                      </label>
                      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                        {allDays.map((day) => {
                          const isSelected = workingDays.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleToggleDay(day)}
                              style={{
                                padding: '0.55rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: isSelected
                                  ? '2px solid var(--primary-600)'
                                  : '1px solid var(--border-subtle)',
                                backgroundColor: isSelected ? 'var(--primary-50)' : '#ffffff',
                                color: isSelected ? 'var(--primary-700)' : 'var(--slate-700)',
                                fontWeight: isSelected ? 700 : 500,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hours & Duration Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.25rem',
                        marginBottom: '1.75rem',
                      }}
                    >
                      {/* Start Time */}
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="startTime">
                          Day Start Time *
                        </label>
                        <input
                          id="startTime"
                          type="time"
                          className="form-input"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          required
                        />
                      </div>

                      {/* End Time */}
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="endTime">
                          Day End Time *
                        </label>
                        <input
                          id="endTime"
                          type="time"
                          className="form-input"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          required
                        />
                      </div>

                      {/* Slot Duration */}
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="slotDuration">
                          Slot Duration *
                        </label>
                        <select
                          id="slotDuration"
                          className="form-select"
                          value={slotDuration}
                          onChange={(e) => setSlotDuration(Number(e.target.value))}
                        >
                          {slotDurationOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt} minutes per consultation
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Break Times */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.25rem',
                        padding: '1.25rem',
                        backgroundColor: 'var(--slate-50)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.75rem',
                      }}
                    >
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="breakStart">
                          Break Start Time (Optional)
                        </label>
                        <input
                          id="breakStart"
                          type="time"
                          className="form-input"
                          value={breakStartTime}
                          onChange={(e) => setBreakStartTime(e.target.value)}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="breakEnd">
                          Break End Time (Optional)
                        </label>
                        <input
                          id="breakEnd"
                          type="time"
                          className="form-input"
                          value={breakEndTime}
                          onChange={(e) => setBreakEndTime(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Active Toggle & Save Button */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border-subtle)',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.925rem' }}>
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                        />
                        <span style={{ fontWeight: 600 }}>Enable Online Consultation Bookings</span>
                      </label>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                        style={{ minWidth: '160px', gap: '0.4rem' }}
                      >
                        <Save size={16} />
                        <span>{saving ? 'Saving...' : 'Save Schedule'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Block Unavailable Dates Tool */}
                <div className="card" style={{ padding: '2rem' }}>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <Ban size={20} color="var(--accent-rose)" />
                    <span>Block Unavailable Dates (Vacation / Leave)</span>
                  </h3>
                  <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Block specific calendar dates when you will be away or unavailable. No consultation slots will be generated or bookable for blocked dates.
                  </p>

                  <form onSubmit={handleAddBlockDate} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <input
                        type="date"
                        className="form-input"
                        min={getTodayStr()}
                        value={newBlockDate}
                        onChange={(e) => setNewBlockDate(e.target.value)}
                        placeholder="Select date to block"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving || !newBlockDate}
                      className="btn btn-secondary"
                      style={{ gap: '0.4rem' }}
                    >
                      <Plus size={16} />
                      <span>Block Selected Date</span>
                    </button>
                  </form>

                  {/* Blocked Dates Chips */}
                  {blockedDates.length > 0 ? (
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                        Currently Blocked Dates ({blockedDates.length})
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {blockedDates.map((date) => (
                          <div
                            key={date}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.4rem 0.75rem',
                              backgroundColor: '#fff1f2',
                              border: '1px solid #fecdd3',
                              borderRadius: 'var(--radius-md)',
                              color: 'var(--accent-rose)',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                            }}
                          >
                            <Calendar size={14} />
                            <span>{date}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveBlockDate(date)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--accent-rose)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '2px',
                              }}
                              title="Unblock this date"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
                      No calendar dates are currently blocked. You are operating on your standard weekly schedule.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={resetModalOpen}
        title="Reset Clinical Schedule"
        message="Are you sure you want to reset your availability schedule to standard parameters (Monday through Friday, 09:00 - 17:00, 30-min slots)? Any custom break times and blocked dates will be cleared."
        confirmText="Yes, Reset Schedule"
        cancelText="Cancel"
        isDangerous={false}
        loading={saving}
        onConfirm={handleResetSchedule}
        onCancel={() => setResetModalOpen(false)}
      />

      <style>{`
        @media (max-width: 840px) {
          .dashboard-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DoctorAvailabilityPage;
