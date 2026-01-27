import React, { useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
        setApiError("");
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(form.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const res = await axios.post(
                "http://localhost:4000/api/auth/login",
                form
            );

            const { token, roles } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("roles", JSON.stringify(roles));

            if (roles.includes("ADMIN")) {
                navigate("/adminHome");
            } else if (roles.includes("SELLER") && roles.includes("BUYER")) {
                navigate("/home");
            } else if (roles.includes("SELLER")) {
                navigate("/sellerHome");
            } else {
                navigate("/home");
            }

        } catch (error) {
            if (error.response) {
                setApiError(error.response.data.message);
            } else {
                setApiError("Server not reachable");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
            <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md sm:max-w-lg lg:max-w-lg relative z-10">

                <div className="text-center mb-5">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-1 mt-2 shadow-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 transform hover:scale-105 transition-transform duration-300">
                        <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
                        Rent<span className="text-orange-600 text-5xl">X</span>
                    </h3>
                    <p className="text-gray-600 text-lg font-medium">PowerTools Marketplace</p>
                </div>

                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 p-12 hover:shadow-3xl transition-all duration-300">
                    <div className="mb-6">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-3">
                            Login
                        </h2>
                        {apiError && (
                            <p className="text-red-400 font-mono bg-orange-50 p-3 rounded-3xl mt-5 text-sm text-center font-semibold">
                                {apiError}
                            </p>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-orange-600 transition-colors">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="you@example.com"
                                    className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 ${
                                        errors.email ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                                    } rounded-2xl focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all duration-200 placeholder-gray-400`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-700 group-focus-within:text-orange-600 transition-colors">
                                    Password
                                </label>
                                <Link to="/forgotPassword" className="text-xs pr-3 font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-all">
                                    forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-14 py-4 bg-gray-50/50 border-2 mb-2 ${
                                        errors.password ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                                    } rounded-2xl focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all duration-200`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-all p-1 rounded-lg hover:bg-orange-50"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group/btn"
                        >
                            <span>{loading ? "Logging in..." : "Login"}</span>
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">New to RentX?</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link
                                to="/registration"
                                className="inline-flex items-center gap-2 text-base font-bold text-orange-600 hover:text-orange-700 transition-all group/link"
                            >
                                <span className="border-b-2 border-transparent group-hover/link:border-orange-600 transition-all">
                                    Create your account
                                </span>
                                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 mb-7 text-center">
                    <p className="text-gray-500 text-sm font-medium">
                        © 2026 RentX. Empowering Tool Rentals.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                  0%, 100% { transform: translate(0, 0) scale(1); }
                  25% { transform: translate(20px, -20px) scale(1.1); }
                  50% { transform: translate(-20px, 20px) scale(0.9); }
                  75% { transform: translate(20px, 20px) scale(1.05); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
            `}</style>
        </div>
    );
};

export default Login;
