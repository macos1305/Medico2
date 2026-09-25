import React, { useState, useEffect } from 'react';
import availabilityService from '../../services/availabilityService';
import LoadingSpinner from '../common/LoadingSpinner';
import { Calendar, Clock, AlertCircle, Sun, CloudSun, Moon } from 'lucide-react';

const SlotPicker = ({
  doctorId,
  selectedDate,
  onDateChange,
  selectedSlot,
  onSlotSelect,
}) => {
  const [slotsData, setSlotsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to format today's date YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!doctorId || !selectedDate) return;

    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await availabilityService.getAvailableSlots(doctorId, selectedDate);
        setSlotsData(res.data);
      } catch (err) {
        console.error('Failed to load slots:', err);
        setError(err.message || 'Could not load slots for this date');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [doctorId, selectedDate]);

  // Group slots into Morning, Afternoon, Evening
  const morningSlots =
    slotsData?.slots?.filter((s) => {
      const h = parseInt(s.startTime.split(':')[0], 10);
      return h < 12;
    }) || [];

  const afternoonSlots =
    slotsData?.slots?.filter((s) => {
      const h = parseInt(s.startTime.split(':')[0], 10);
      return h >= 12 && h < 17;
    }) || [];

  const eveningSlots =
    slotsData?.slots?.filter((s) => {
      const h = parseInt(s.startTime.split(':')[0], 10);
      return h >= 17;
    }) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Date Selection Area */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.5rem' }}>
          <Calendar size={16} color="#60a5fa" />
          <span>Select Consultation Date</span>
        </label>

        {/* Quick Date Selectors + Custom Date Input */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <button
            type="button"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: selectedDate === getTodayStr() ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedDate === getTodayStr() ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              boxShadow: selectedDate === getTodayStr() ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none',
            }}
            onClick={() => onDateChange(getTodayStr())}
          >
            Today
          </button>
          <button
            type="button"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: selectedDate === getTomorrowStr() ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedDate === getTomorrowStr() ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              boxShadow: selectedDate === getTomorrowStr() ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none',
            }}
            onClick={() => onDateChange(getTomorrowStr())}
          >
            Tomorrow
          </button>
          <div style={{ flex: 1, minWidth: '170px' }}>
            <input
              type="date"
              className="glass-input"
              value={selectedDate}
              min={getTodayStr()}
              onChange={(e) => onDateChange(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.875rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                colorScheme: 'dark',
              }}
            />
          </div>
        </div>
      </div>

      {/* Slots Section */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.5rem' }}>
          <Clock size={16} color="#60a5fa" />
          <span>Available Consultation Time Slots</span>
        </label>

        {loading ? (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <div className="spinner spinner-primary" style={{ width: '28px', height: '28px', margin: '0 auto' }}></div>
            <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Checking doctor availability...
            </p>
          </div>
        ) : error ? (
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '10px',
              color: '#fca5a5',
              fontSize: '0.85rem',
            }}
          >
            {error}
          </div>
        ) : !slotsData?.isWorkingDay ? (
          /* Day Off Alert */
          <div
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '10px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: '#fbbf24',
              fontSize: '0.875rem',
            }}
          >
            <AlertCircle size={20} color="#fbbf24" />
            <span>{slotsData?.message || 'Doctor does not schedule consultations on this day.'}</span>
          </div>
        ) : slotsData?.slots?.length === 0 ? (
          <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.85rem' }}>
            No slots generated for this schedule.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Morning */}
            {morningSlots.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <Sun size={14} color="#f59e0b" />
                  <span>Morning</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: '0.5rem' }}>
                  {morningSlots.map((slot, i) => (
                    <SlotChip
                      key={i}
                      slot={slot}
                      isSelected={selectedSlot?.startTime === slot.startTime}
                      onSelect={() => onSlotSelect(slot)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {afternoonSlots.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <CloudSun size={14} color="#38bdf8" />
                  <span>Afternoon</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: '0.5rem' }}>
                  {afternoonSlots.map((slot, i) => (
                    <SlotChip
                      key={i}
                      slot={slot}
                      isSelected={selectedSlot?.startTime === slot.startTime}
                      onSelect={() => onSlotSelect(slot)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Evening */}
            {eveningSlots.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <Moon size={14} color="#818cf8" />
                  <span>Evening</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: '0.5rem' }}>
                  {eveningSlots.map((slot, i) => (
                    <SlotChip
                      key={i}
                      slot={slot}
                      isSelected={selectedSlot?.startTime === slot.startTime}
                      onSelect={() => onSlotSelect(slot)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component for individual time slot button
const SlotChip = ({ slot, isSelected, onSelect }) => {
  const isAvailable = slot.isAvailable;

  return (
    <button
      type="button"
      disabled={!isAvailable}
      onClick={onSelect}
      style={{
        padding: '0.55rem 0.25rem',
        borderRadius: '10px',
        border: isSelected
          ? '2px solid #3b82f6'
          : isAvailable
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px dashed rgba(255, 255, 255, 0.05)',
        backgroundColor: isSelected
          ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
          : isAvailable
          ? 'rgba(255, 255, 255, 0.04)'
          : 'rgba(255, 255, 255, 0.01)',
        color: isSelected
          ? '#ffffff'
          : isAvailable
          ? 'rgba(255, 255, 255, 0.85)'
          : 'rgba(255, 255, 255, 0.2)',
        boxShadow: isSelected
          ? '0 0 15px rgba(59, 130, 246, 0.45)'
          : 'none',
        fontWeight: isSelected ? 700 : 600,
        fontSize: '0.85rem',
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        transition: 'all 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1.2,
      }}
    >
      <span>{slot.startTime}</span>
      <span
        style={{
          fontSize: '0.65rem',
          opacity: 0.7,
          marginTop: '2px',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}
      >
        {slot.isBooked ? 'Booked' : slot.isPast ? 'Past' : slot.endTime}
      </span>
    </button>
  );
};

export default SlotPicker;
