import React, { useState } from 'react';
import { User, UserStats } from '../types';
import { User as UserIcon, Mail, Phone, Calendar, Briefcase, GraduationCap, Heart, FileText, Edit2, Check, X, Shield, Sparkles } from 'lucide-react';

interface ProfileViewProps {
  currentUser: User;
  stats: UserStats | null;
  onUpdateProfile: (updates: Partial<User>) => Promise<void>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  stats,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser.full_name);
  const [mobileNumber, setMobileNumber] = useState(currentUser.mobile_number || '');
  const [gender, setGender] = useState(currentUser.gender || 'Not specified');
  const [profession, setProfession] = useState(currentUser.profession || '');
  const [education, setEducation] = useState(currentUser.education || '');
  const [maritalStatus, setMaritalStatus] = useState(currentUser.marital_status || 'Single');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [dateOfBirth, setDateOfBirth] = useState(currentUser.date_of_birth || '');
  const [age, setAge] = useState(currentUser.age || 26);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateProfile({
        full_name: fullName.trim(),
        mobile_number: mobileNumber.trim() || undefined,
        gender,
        profession: profession.trim() || undefined,
        education: education.trim() || undefined,
        marital_status: maritalStatus,
        bio: bio.trim() || undefined,
        date_of_birth: dateOfBirth || undefined,
        age: Number(age) || undefined,
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Card */}
      <div className="relative rounded-3xl border border-rose-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-rose-900/5 overflow-hidden">
        {/* Decorative backdrop glow */}
        <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-bl from-rose-200/40 via-pink-100/30 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
          <img
            src={currentUser.profile_image || `https://api.dicebear.com/7.x/notionists/svg?seed=${currentUser.email}`}
            alt={currentUser.full_name}
            className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-2 border-rose-200 object-cover shadow-sm"
          />

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
                {currentUser.full_name}
              </h1>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Author
              </span>
            </div>

            <p className="text-sm font-medium text-rose-600">{currentUser.profession || 'Content Creator & Author'}</p>
            <p className="text-xs text-stone-600 max-w-xl leading-relaxed pt-1">
              {currentUser.bio || 'Author exploring generative AI, editorial prose, and thoughtful systems.'}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all self-center sm:self-start"
          >
            {isEditing ? <X className="h-3.5 w-3.5" /> : <Edit2 className="h-3.5 w-3.5" />}
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Editing Form or Detailed View */}
      {isEditing ? (
        <form onSubmit={handleSave} className="rounded-3xl border border-rose-200/80 bg-white p-6 sm:p-8 shadow-md space-y-6">
          <div className="border-b border-rose-100 pb-3">
            <h2 className="font-editorial text-xl font-bold text-stone-900">Update Profile Information</h2>
            <p className="text-xs text-stone-500">Edit details stored in your PostgreSQL user record</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full rounded-xl border border-rose-200 p-2.5 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full rounded-xl border border-rose-200 p-2.5 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Profession</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Software Engineer / AI Researcher"
                className="w-full rounded-xl border border-rose-200 p-2.5 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Education</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="B.Tech Computer Science / Master"
                className="w-full rounded-xl border border-rose-200 p-2.5 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-rose-200 p-2.5 focus:outline-none focus:border-rose-500 bg-white"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Marital Status</label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full rounded-xl border border-rose-200 p-2.5 focus:outline-none focus:border-rose-500 bg-white"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full rounded-xl border border-rose-200 p-2.5 focus:outline-none focus:border-rose-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Age</label>
              <input
                type="number"
                min="10"
                max="120"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-xl border border-rose-200 p-2.5 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1 text-xs">Bio / Author Statement</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-rose-200 p-2.5 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      ) : (
        /* Detailed Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info Card */}
          <div className="rounded-3xl border border-rose-200/80 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-editorial text-lg font-bold text-stone-900 border-b border-rose-100 pb-2">
              Personal Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-500">
                  <Mail className="h-3.5 w-3.5 text-rose-500" />
                  <span>Email Address</span>
                </span>
                <span className="font-semibold text-stone-900">{currentUser.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-500">
                  <Phone className="h-3.5 w-3.5 text-rose-500" />
                  <span>Mobile</span>
                </span>
                <span className="font-semibold text-stone-900">{currentUser.mobile_number || 'Not provided'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-500">
                  <Calendar className="h-3.5 w-3.5 text-rose-500" />
                  <span>Date of Birth / Age</span>
                </span>
                <span className="font-semibold text-stone-900">
                  {currentUser.date_of_birth ? `${currentUser.date_of_birth} (${currentUser.age || 26} yrs)` : `${currentUser.age || 26} years`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-500">
                  <UserIcon className="h-3.5 w-3.5 text-rose-500" />
                  <span>Gender</span>
                </span>
                <span className="font-semibold text-stone-900">{currentUser.gender || 'Not specified'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-500">
                  <Heart className="h-3.5 w-3.5 text-rose-500" />
                  <span>Marital Status</span>
                </span>
                <span className="font-semibold text-stone-900">{currentUser.marital_status || 'Single'}</span>
              </div>
            </div>
          </div>

          {/* Academic & Professional Card */}
          <div className="rounded-3xl border border-rose-200/80 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-editorial text-lg font-bold text-stone-900 border-b border-rose-100 pb-2">
              Professional & Academic Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-500">
                  <Briefcase className="h-3.5 w-3.5 text-rose-500" />
                  <span>Profession</span>
                </span>
                <span className="font-semibold text-stone-900">{currentUser.profession || 'Author & Creator'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-500">
                  <GraduationCap className="h-3.5 w-3.5 text-rose-500" />
                  <span>Education</span>
                </span>
                <span className="font-semibold text-stone-900">{currentUser.education || 'Master of Science'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-500">
                  <FileText className="h-3.5 w-3.5 text-rose-500" />
                  <span>Articles Published</span>
                </span>
                <span className="font-semibold text-stone-900">{stats?.total_blogs || currentUser.blogs_count || 0} blogs</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-500">
                  <Calendar className="h-3.5 w-3.5 text-rose-500" />
                  <span>Member Since</span>
                </span>
                <span className="font-semibold text-stone-900">
                  {new Date(currentUser.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-500">
                  <Shield className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Account Security</span>
                </span>
                <span className="font-semibold text-emerald-600">Bcrypt Salted & JWT Protected</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
