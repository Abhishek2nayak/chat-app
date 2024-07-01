import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginPayload } from './types';
import { loginUser } from '../api/authService';
import { AlertState } from '../api/types';
import Alert from '../components/Alert';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [alert, setAlert] = useState<AlertState>({ message: null, type: 'info' })
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const userData: LoginPayload = { password, email };

        try {
            const res: any = await loginUser(userData);
            setAlert({ message: "login successfully", type: "success" });
            localStorage.setItem('chat-token',res.token);
            setTimeout(() => {
                navigate('/home')
            }, 3000)
        } catch (error: any) {
            const errorResponse = error.response;
            console.log(errorResponse)
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
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <form onSubmit={handleLogin} className="space-y-6">
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
                    <button type="submit" className="btn btn-primary w-full">Login</button>
                </form>
                <div className="text-center">
                    <p>
                        Don't have an account? <Link to="/register" className="text-primary">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
