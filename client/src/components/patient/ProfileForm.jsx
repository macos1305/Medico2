import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Image,
  Calendar,
  Heart,
  MapPin,
  ShieldAlert,
  Save,
  CheckCircle2,
} from 'lucide-react';

const ProfileForm = ({ initialData, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    profileImage: '',
    dateOfBirth: '',
    gender: 'PREFER_NOT_TO_SAY',
    bloodGroup: 'UNKNOWN',
    allergies: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const user = initialData.user || {};
      const profile = initialData.profile || {};

      let dobFormatted = '';
      if (profile.dateOfBirth) {
        dobFormatted = new Date(profile.dateOfBirth).toISOString().split('T')[0];
      }

      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        profileImage: user.profileImage || user.avatar || '',
        dateOfBirth: dobFormatted,
        gender: profile.gender || 'PREFER_NOT_TO_SAY',
        bloodGroup: profile.bloodGroup || 'UNKNOWN',
        allergies: Array.isArray(profile.allergies) ? profile.allergies.join(', ') : '',
        address: {
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          state: profile.address?.state || '',
          zipCode: profile.address?.zipCode || '',
        },
        emergencyContact: {
          name: profile.emergencyContact?.name || '',
          relationship: profile.emergencyContact?.relationship || '',
          phone: profile.emergencyContact?.phone || '',
        },
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Format allergies into an array
    const payload = {
      ...formData,
      allergies: formData.allergies
        ? formData.allergies.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
    };

    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* 1. Basic / Identity Details */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <h3
          style={{
            fontSize: '1.15rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <User size={20} color="var(--primary-600)" />
          Personal Information
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. Jane Doe"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="profileImage">
            Profile Image URL
          </label>
          <input
            id="profileImage"
            type="url"
            name="profileImage"
            className="form-input"
            value={formData.profileImage}
            onChange={handleChange}
            disabled={loading}
            placeholder="https://example.com/avatar.jpg"
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.25rem', display: 'block' }}>
            Provide a direct public image link to display your avatar.
          </span>
        </div>
      </div>

      {/* 2. Medical Details */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <h3
          style={{
            fontSize: '1.15rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Heart size={20} color="var(--accent-rose)" />
          Medical & Clinical Specifics
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="bloodGroup">
              Blood Group
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              className="form-select"
              value={formData.bloodGroup}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="UNKNOWN">Unknown</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dateOfBirth">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              className="form-input"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="allergies">
            Known Allergies (Comma-separated)
          </label>
          <input
            id="allergies"
            type="text"
            name="allergies"
            className="form-input"
            value={formData.allergies}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g. Penicillin, Peanuts, Latex"
          />
        </div>
      </div>

      {/* 3. Address Information */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <h3
          style={{
            fontSize: '1.15rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <MapPin size={20} color="var(--primary-600)" />
          Residential Address
        </h3>

        <div className="form-group">
          <label className="form-label" htmlFor="street">
            Street Address
          </label>
          <input
            id="street"
            type="text"
            name="address.street"
            className="form-input"
            value={formData.address.street}
            onChange={handleChange}
            disabled={loading}
            placeholder="123 Health Ave, Apt 4B"
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="city">
              City
            </label>
            <input
              id="city"
              type="text"
              name="address.city"
              className="form-input"
              value={formData.address.city}
              onChange={handleChange}
              disabled={loading}
              placeholder="New York"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="state">
              State / Province
            </label>
            <input
              id="state"
              type="text"
              name="address.state"
              className="form-input"
              value={formData.address.state}
              onChange={handleChange}
              disabled={loading}
              placeholder="NY"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="zipCode">
              Zip / Postal Code
            </label>
            <input
              id="zipCode"
              type="text"
              name="address.zipCode"
              className="form-input"
              value={formData.address.zipCode}
              onChange={handleChange}
              disabled={loading}
              placeholder="10001"
            />
          </div>
        </div>
      </div>

      {/* 4. Emergency Contact */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3
          style={{
            fontSize: '1.15rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <ShieldAlert size={20} color="var(--accent-amber)" />
          Emergency Contact Details
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="emName">
              Contact Name
            </label>
            <input
              id="emName"
              type="text"
              name="emergencyContact.name"
              className="form-input"
              value={formData.emergencyContact.name}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. Robert Doe"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="emRel">
              Relationship
            </label>
            <input
              id="emRel"
              type="text"
              name="emergencyContact.relationship"
              className="form-input"
              value={formData.emergencyContact.relationship}
              onChange={handleChange}
              disabled={loading}
              placeholder="Spouse, Parent, Sibling"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="emPhone">
              Emergency Phone
            </label>
            <input
              id="emPhone"
              type="tel"
              name="emergencyContact.phone"
              className="form-input"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
              disabled={loading}
              placeholder="+1 (555) 999-8888"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{ minWidth: '180px' }}
        >
          {loading ? (
            <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
          ) : (
            <>
              <Save size={18} />
              <span>Save Profile Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
