import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const SignupForm = ({ onSignup }) => {
  
  const { signup } = useAuth(); // Get the signup function from context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '' 
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};

    // Name validation: must not contain digits
    if (/\d/.test(formData.name)) {
      newErrors.name = 'Name cannot contain any digits.';
    }

    // Phone number validation: must start with '0' and be 11 digits
    if (!formData.phone_number.startsWith('0')) {
      newErrors.phone_number = 'Phone number must start with 0.';
    } else if (!/^\d{11}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be exactly 11 digits long.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        await signup(formData);
        // Navigate to login page after successful signup
        navigate('/restaurants');
      } catch (error) {
        console.error("Signup failed:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <div>
        <Input
          label="Phone"
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
      </div>
      <Input
        label="Address"
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <Button type="submit" className="w-full">Sign Up</Button>
    </form>
  );
};

export default SignupForm;