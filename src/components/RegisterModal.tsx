import React, { useState } from 'react';
import { X, Sparkles, User, Mail, Lock, Phone, Calendar, Briefcase, GraduationCap } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: {
    full_name: string;
    email: string;
    password: string;
    mobile_number?: string;
    date_of_birth?: string;
    gender?: string;
    profession?: string;
    education?: string;
    marital_status?: string;
    bio?: string;
  }) => Promise<void>;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  onSwitchToLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Female');
  const [profession, setProfession] = useState('');
  const [education, setEducation] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onRegister({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        mobile_number: mobileNumber.trim() || undefined,
        date_of_birth: dateOfBirth || undefined,
        gender,
        profession: profession.trim() || undefined,
        education: education.trim() || undefined,
        marital_status: maritalStatus,
        bio: bio.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-rose-200 my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-stone-900">Create Author Account</h3>
              <p className="text-[11px] text-stone-500">Fast sign up without email OTP verification</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Priya Sharma"
                className="w-full p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Gmail / Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@gmail.com"
                className="w-full p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-500 bg-white"
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
                className="w-full p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-500 bg-white"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Profession</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Software Engineer / Student"
                className="w-full p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Education</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="B.Tech, B.Sc, M.S."
                className="w-full p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Short Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell readers about your background and interests..."
              className="w-full p-2.5 rounded-xl border border-rose-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-xl shadow-md shadow-rose-300/40 transition-all mt-2"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-stone-500 mt-4 pt-3 border-t border-rose-100">
          Already registered?{' '}
          <button
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="font-semibold text-rose-600 hover:underline"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};
