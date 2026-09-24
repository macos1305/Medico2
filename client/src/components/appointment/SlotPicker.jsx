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
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Calendar size={16} color="var(--primary-600)" />
          <span>Select Consultation Date</span>
        </label>

        {/* Quick Date Selectors + Custom Date Input */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${selectedDate === getTodayStr() ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onDateChange(getTodayStr())}
          >
            Today
          </button>
          <button
            type="button"
            className={`btn btn-sm ${selectedDate === getTomorrowStr() ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onDateChange(getTomorrowStr())}
          >
            Tomorrow
          </button>
          <div style={{ flex: 1, minWidth: '170px' }}>
            <input
              type="date"
              className="form-input"
              value={selectedDate}
              min={getTodayStr()}
              onChange={(e) => onDateChange(e.target.value)}
              style={{ height: '36px', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
            />
          </div>
        </div>
      </div>

      {/* Slots Section */}
      <div>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={16} color="var(--primary-600)" />
          <span>Available Consultation Time Slots</span>
        </label>

        {loading ? (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <div className="spinner spinner-primary" style={{ width: '28px', height: '28px', margin: '0 auto' }}></div>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Checking doctor availability...
            </p>
          </div>
        ) : error ? (
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#ffe4e6',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent-rose)',
              fontSize: '0.85rem',
            }}
          >
            {error}
          </div>
        ) : !slotsData?.isWorkingDay ? (
          /* Day Off Alert */
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: '#92400e',
              fontSize: '0.875rem',
            }}
          >
            <AlertCircle size={20} color="#b45309" />
            <span>{slotsData?.message || 'Doctor does not schedule consultations on this day.'}</span>
          </div>
        ) : slotsData?.slots?.length === 0 ? (
          <p style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>
            No slots generated for this schedule.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Morning */}
            {morningSlots.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '0.4rem' }}>
                  <Sun size={14} color="#f59e0b" />
                  <span>Morning</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: '0.4rem' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '0.4rem' }}>
                  <CloudSun size={14} color="#0284c7" />
                  <span>Afternoon</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: '0.4rem' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '0.4rem' }}>
                  <Moon size={14} color="#6366f1" />
                  <span>Evening</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: '0.4rem' }}>
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
        padding: '0.5rem 0.25rem',
        borderRadius: 'var(--radius-md)',
        border: isSelected
          ? '2px solid var(--primary-600)'
          : isAvailable
          ? '1px solid var(--border-subtle)'
          : '1px dashed var(--slate-200)',
        backgroundColor: isSelected
          ? 'var(--primary-600)'
          : isAvailable
          ? '#ffffff'
          : 'var(--slate-50)',
        color: isSelected
          ? '#ffffff'
          : isAvailable
          ? 'var(--slate-800)'
          : 'var(--slate-400)',
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
          opacity: 0.8,
          marginTop: '1px',
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
