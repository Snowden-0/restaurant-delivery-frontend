import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const SignupForm = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
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
      <Input
        label="Phone"
        type="text"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        required
      />
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