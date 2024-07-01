import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gender, User } from '../api/types';
import { registerUser } from '../api/authService';
import Alert from '../components/Alert';

type AlertState = {
  message: string | null;
  type: 'success' | 'error' | 'info' | 'warning';
}

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const navigate = useNavigate();
  const [alert, setAlert] = useState<AlertState>({ message: null, type: 'info' });


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gender) return;
    const userData: User = {
      name,
      password,
      email,
      gender
    }

    try {
      const res: any = await registerUser(userData);
      setAlert({ message: res.message, type: "success" });
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error: any) {
      const errorResponse = error.response;

      setAlert({ message: errorResponse.data.error, type: 'error' })
    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {
        alert.message !== null
        && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: null, type: 'info' })} />
      }
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl  shadow-lg">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="form-control">
            <label htmlFor="name" className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              id="name"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="password" className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              id="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="gender" className="label">
              <span className="label-text">Gender</span>
            </label>
            <select
              id="gender"
              className="select select-bordered w-full"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full">Register</button>
        </form>
        <div className="text-center">
          <p>
            Already have an account? <Link to="/login" className="text-primary">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
