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
import { GlassButton, PrimaryGlassButton, SecondaryGlassButton, DangerGlassButton } from '../../components/common/buttons';

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

const inputDarkStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '0.9rem',
  outline: 'none',
  colorScheme: 'dark',
};

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

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

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
                    Practice Schedule
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
                  Clinical Availability & Slot Engine
                </h1>
                <p style={{ color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
                  Configure weekly operating days, hours, consultation intervals, and block off-duty dates.
                </p>
              </div>

              <SecondaryGlassButton
                onClick={() => setResetModalOpen(true)}
                size="sm"
                icon={<RotateCcw size={15} />}
              >
                Reset to Standard
              </SecondaryGlassButton>
            </div>

            {loading ? (
              <LoadingSpinner text="Retrieving schedule configuration..." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* 1. Working Schedule Card */}
                <div
                  className="glass-card"
                  style={{
                    padding: '2rem',
                    background: 'rgba(18, 20, 29, 0.65)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Clock size={20} color="#38bdf8" />
                    <span>Operating Hours & Working Days</span>
                  </h3>

                  <form onSubmit={handleSaveSchedule}>
                    {/* Working Days Checkboxes */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.65rem', display: 'block' }}>
                        Weekly Consultation Days *
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {allDays.map((day) => {
                          const isSelected = workingDays.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleToggleDay(day)}
                              style={{
                                padding: '0.55rem 1.1rem',
                                borderRadius: '9999px',
                                border: isSelected
                                  ? '1px solid rgba(56, 189, 248, 0.4)'
                                  : '1px solid rgba(255, 255, 255, 0.08)',
                                backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                color: isSelected ? '#38bdf8' : 'rgba(200, 205, 225, 0.75)',
                                fontWeight: isSelected ? 700 : 500,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: isSelected ? '0 0 15px rgba(56, 189, 248, 0.15)' : 'none',
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
                        <label className="form-label" htmlFor="startTime" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}>
                          Day Start Time *
                        </label>
                        <input
                          id="startTime"
                          type="time"
                          className="form-input"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          style={inputDarkStyle}
                          required
                        />
                      </div>

                      {/* End Time */}
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="endTime" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}>
                          Day End Time *
                        </label>
                        <input
                          id="endTime"
                          type="time"
                          className="form-input"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          style={inputDarkStyle}
                          required
                        />
                      </div>

                      {/* Slot Duration */}
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="slotDuration" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}>
                          Slot Duration *
                        </label>
                        <select
                          id="slotDuration"
                          className="form-select"
                          value={slotDuration}
                          onChange={(e) => setSlotDuration(Number(e.target.value))}
                          style={{
                            ...inputDarkStyle,
                            backgroundColor: '#12141d',
                          }}
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
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '16px',
                        marginBottom: '1.75rem',
                      }}
                    >
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="breakStart" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}>
                          Break Start Time (Optional)
                        </label>
                        <input
                          id="breakStart"
                          type="time"
                          className="form-input"
                          value={breakStartTime}
                          onChange={(e) => setBreakStartTime(e.target.value)}
                          style={inputDarkStyle}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="breakEnd" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}>
                          Break End Time (Optional)
                        </label>
                        <input
                          id="breakEnd"
                          type="time"
                          className="form-input"
                          value={breakEndTime}
                          onChange={(e) => setBreakEndTime(e.target.value)}
                          style={inputDarkStyle}
                        />
                      </div>
                    </div>

                    {/* Active Toggle & Save Button */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '1.25rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', color: '#ffffff' }}>
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: '#38bdf8' }}
                        />
                        <span style={{ fontWeight: 600 }}>Enable Online Consultation Bookings</span>
                      </label>

                      <PrimaryGlassButton
                        type="submit"
                        loading={saving}
                        icon={<Save size={16} />}
                        style={{ minWidth: '160px' }}
                      >
                        Save Schedule
                      </PrimaryGlassButton>
                    </div>
                  </form>
                </div>

                {/* 2. Block Unavailable Dates Tool */}
                <div
                  className="glass-card"
                  style={{
                    padding: '2rem',
                    background: 'rgba(18, 20, 29, 0.65)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      marginBottom: '0.75rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Ban size={20} color="#fb7185" />
                    <span>Block Unavailable Dates (Vacation / Leave)</span>
                  </h3>
                  <p style={{ color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
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
                        style={inputDarkStyle}
                      />
                    </div>
                    <GlassButton
                      variant="warning"
                      type="submit"
                      disabled={saving || !newBlockDate}
                      icon={<Plus size={16} />}
                    >
                      Block Selected Date
                    </GlassButton>
                  </form>

                  {/* Blocked Dates Chips */}
                  {blockedDates.length > 0 ? (
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.65rem' }}>
                        Currently Blocked Dates ({blockedDates.length})
                      </span>
                      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                        {blockedDates.map((date) => (
                          <div
                            key={date}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.45rem 0.85rem',
                              backgroundColor: 'rgba(244, 63, 94, 0.12)',
                              border: '1px solid rgba(244, 63, 94, 0.3)',
                              borderRadius: '9999px',
                              color: '#fb7185',
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
                                color: '#fb7185',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '2px',
                                opacity: 0.8,
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
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px', color: 'rgba(200, 205, 225, 0.65)', fontSize: '0.85rem' }}>
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
    </div>
  );
};

export default DoctorAvailabilityPage;
