import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard, FaMapMarkerAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    idType: 'PASSPORT',
    idNumber: '',
    acceptTerms: false,
    newsletter: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateStep1 = () => {
    const newErrors = {};
    if (!userData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!userData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!userData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!userData.password) {
      newErrors.password = 'Password is required';
    } else if (userData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!userData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(userData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!userData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required';
    } else {
      // Validate based on ID type
      switch (userData.idType) {
        case 'AADHAR':
          if (!/^\d{12}$/.test(userData.idNumber.replace(/-/g, '').trim())) {
            newErrors.idNumber = 'Aadhar number must be 12 digits';
          }
          break;
        case 'PAN':
          if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(userData.idNumber.trim())) {
            newErrors.idNumber = 'Invalid PAN number format';
          }
          break;
        case 'DRIVERS_LICENSE':
          if (!/^[A-Z]{2}\d{13}$/.test(userData.idNumber.trim())) {
            newErrors.idNumber = 'Driver\'s License must start with 2 letters followed by 13 digits';
          }
          break;
      }
    }
    if (!userData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';
    return newErrors;
  };

  const handleNextStep = () => {
    const stepErrors = validateStep1();
    if (Object.keys(stepErrors).length === 0) {
      setStep(2);
      setErrors({});
    } else {
      setErrors(stepErrors);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stepErrors = validateStep2();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsLoading(true);
    try {
      await authService.register(userData);
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please login to continue.',
          type: 'success'
        }
      });
    } catch (err) {
      setErrors({ 
        submit: err.response?.data?.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaUser />
              </span>
              <input
                type="text"
                placeholder="John"
                value={userData.firstName}
                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaUser />
              </span>
              <input
                type="text"
                placeholder="Doe"
                value={userData.lastName}
                onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <FaEnvelope />
            </span>
            <input
              type="email"
              placeholder="john.doe@example.com"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <FaLock />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={userData.confirmPassword}
              onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
              className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleNextStep}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
            hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold"
        >
          Next Step
        </button>
      </div>
    </>
  );

  const formatAadharNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < digits.length && i < 12; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join('-');
  };

  const formatDriversLicense = (value) => {
    const letters = value.slice(0, 2).replace(/[^A-Z]/g, '');
    const numbers = value.slice(2).replace(/\D/g, '');
    return `${letters}${numbers}`;
  };

  const renderStep2 = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="relative flex">
            <div className="flex items-center">
              <span className="inline-flex items-center px-4 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-800 font-medium text-base">
                <FaPhone className="mr-1 text-gray-500" />
                +91
              </span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="98765 43210"
              value={userData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                if (/^\d*$/.test(value)) {
                  setUserData({ ...userData, phone: value });
                }
              }}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key) || (userData.phone.length >= 10 && e.key !== 'Backspace')) {
                  e.preventDefault();
                }
              }}
              maxLength="10"
              className={`w-full rounded-r-lg pl-3 pr-4 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
          <select
            value={userData.idType}
            onChange={(e) => {
              setUserData({ 
                ...userData, 
                idType: e.target.value,
                idNumber: '' // Reset ID number when type changes
              });
            }}
            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="PASSPORT">PASSPORT</option>
            <option value="DRIVERS_LICENSE">DRIVER'S LICENSE</option>
            <option value="AADHAR">AADHAR CARD</option>
            <option value="PAN">PAN CARD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {userData.idType === 'AADHAR' ? 'Aadhar Number' : 
             userData.idType === 'PAN' ? 'PAN Number' : 
             'ID Number'}
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <FaIdCard />
            </span>
            <input
              type="text"
              placeholder={
                userData.idType === 'AADHAR' ? "XXXX-XXXX-XXXX" :
                userData.idType === 'PAN' ? "ABCDE1234F" :
                userData.idType === 'PASSPORT' ? "A1234567" :
                userData.idType === 'DRIVERS_LICENSE' ? "XX1234567890123" :
                "ENTER ID NUMBER"
              }
              value={userData.idNumber}
              onChange={(e) => {
                let value = e.target.value.toUpperCase();
                switch (userData.idType) {
                  case 'AADHAR':
                    // Remove any non-digits and format
                    const cleanValue = value.replace(/\D/g, '').slice(0, 12);
                    value = formatAadharNumber(cleanValue);
                    break;
                  case 'PAN':
                    value = value.toUpperCase().slice(0, 10);
                    break;
                  case 'PASSPORT':
                    value = value.toUpperCase().slice(0, 9);
                    break;
                  case 'DRIVERS_LICENSE':
                    // First 2 characters can only be letters, rest must be numbers
                    value = formatDriversLicense(value).slice(0, 15);
                    break;
                  default:
                    value = value.toUpperCase().slice(0, 20);
                }
                setUserData({ ...userData, idNumber: value });
              }}
              maxLength={
                userData.idType === 'AADHAR' ? "14" : // 12 digits + 2 hyphens
                userData.idType === 'PAN' ? "10" :
                userData.idType === 'PASSPORT' ? "9" :
                userData.idType === 'DRIVERS_LICENSE' ? "15" :
                "20"
              }
              style={{ textTransform: 'uppercase' }}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.idNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.idNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.idNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={userData.acceptTerms}
              onChange={(e) => setUserData({ ...userData, acceptTerms: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
              I accept the <Link to="/terms" className="text-blue-600 hover:text-blue-700">Terms and Conditions</Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-500">{errors.acceptTerms}</p>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="newsletter"
              checked={userData.newsletter}
              onChange={(e) => setUserData({ ...userData, newsletter: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
              Subscribe to our newsletter for exclusive offers
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {errors.submit && (
          <div className="p-3 rounded-lg bg-red-50 text-red-500 text-sm">
            {errors.submit}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handlePrevStep}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200
              transform hover:-translate-y-0.5 transition-all duration-300 font-semibold"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
              hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              'Complete Registration'
            )}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </div>

        <div className="relative flex items-center justify-center max-w-md mx-auto px-8 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-center">
              <div className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${
                step === 1 ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'
              } flex items-center justify-center`}>
                <FaUser className="text-xl" />
              </div>
              <span className="mt-3 text-xs font-medium uppercase">
                Account Details
              </span>
            </div>
            
            <div className={`flex-grow border-t-2 transition duration-500 ease-in-out mx-8 ${
              step === 2 ? 'border-blue-600' : 'border-gray-300'
            }`}></div>
            
            <div className="flex flex-col items-center">
              <div className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${
                step === 2 ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'
              } flex items-center justify-center`}>
                <FaIdCard className="text-xl" />
              </div>
              <span className="mt-3 text-xs font-medium uppercase">
                Verification
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? renderStep1() : renderStep2()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;