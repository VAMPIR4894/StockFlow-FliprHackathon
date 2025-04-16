import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5001/api';

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Form error states
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});

  const validateLoginForm = () => {
    const errors: Record<string, string> = {};
    if (!loginData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) errors.email = 'Please enter a valid email';
    if (!loginData.password) errors.password = 'Password is required';
    else if (loginData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    return errors;
  };

  const validateRegisterForm = () => {
    const errors: Record<string, string> = {};
    if (!registerData.name) errors.name = 'Name is required';
    if (!registerData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(registerData.email)) errors.email = 'Please enter a valid email';
    if (!registerData.password) errors.password = 'Password is required';
    else if (registerData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateLoginForm();
    setLoginErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, loginData);
        
        // Use the login function from AuthContext
        login(response.data.token, response.data.user);
        
        toast({
          title: "Login successful",
          description: "Welcome to StockFlow!",
        });
        
        navigate("/dashboard");
      } catch (error: any) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRegisterForm();
    setRegisterErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...registerPayload } = registerData;
        
        const response = await axios.post(`${API_URL}/auth/register`, registerPayload);
        
        toast({
          title: "Registration successful",
          description: "Your account has been created. You can now log in.",
        });
        
        // Clear form
        setRegisterData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        setIsLogin(true);
      } catch (error: any) {
        console.error('Registration error:', error);
        toast({
          title: "Registration failed",
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center px-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        backgroundImage: 'url("/uploads/bc3fe801-717c-4266-86cd-fb764f94f28a.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-md">
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.div 
            className="flex justify-center mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src="/uploads/99fb7d4f-0028-459f-99af-71f6fd8541a9.png" 
              alt="StockFlow Logo" 
              className="h-32 w-auto"
            />
          </motion.div>
          <motion.h2 
            className="text-2xl font-bold text-white mb-2"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Welcome to StockFlow
          </motion.h2>
          <motion.p 
            className="text-gray-200 text-lg"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Interactive Stock Market Platform
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl">
            <CardContent className="p-6">
              <motion.h3 
                className="text-xl font-semibold mb-6 text-stockflow-navy"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {isLogin ? "Sign in to your account" : "Create your account"}
              </motion.h3>
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.form
                    key="login"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleLoginSubmit} 
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="E-mail Address"
                        className="w-full px-4 py-3 bg-white border-gray-200 focus:border-stockflow-navy focus:ring-stockflow-navy text-gray-900"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      />
                      {loginErrors.email && (
                        <p className="text-sm font-medium text-red-600">{loginErrors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 bg-white border-gray-200 focus:border-stockflow-navy focus:ring-stockflow-navy text-gray-900"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      />
                      {loginErrors.password && (
                        <p className="text-sm font-medium text-red-600">{loginErrors.password}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <Button 
                        type="submit" 
                        className="px-8 py-2 bg-stockflow-navy hover:bg-stockflow-darkNavy text-white rounded-md font-medium"
                      >
                        Sign In
                      </Button>
                      <Button 
                        type="button"
                        variant="ghost"
                        onClick={() => setIsLogin(false)}
                        className="text-stockflow-navy hover:text-stockflow-darkNavy font-medium"
                      >
                        Sign Up
                      </Button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleRegisterSubmit} 
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Name"
                        className="w-full px-4 py-3 bg-white border-gray-200 focus:border-stockflow-navy focus:ring-stockflow-navy text-gray-900"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      />
                      {registerErrors.name && (
                        <p className="text-sm font-medium text-red-600">{registerErrors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="E-mail Address"
                        className="w-full px-4 py-3 bg-white border-gray-200 focus:border-stockflow-navy focus:ring-stockflow-navy text-gray-900"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      />
                      {registerErrors.email && (
                        <p className="text-sm font-medium text-red-600">{registerErrors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 bg-white border-gray-200 focus:border-stockflow-navy focus:ring-stockflow-navy text-gray-900"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      />
                      {registerErrors.password && (
                        <p className="text-sm font-medium text-red-600">{registerErrors.password}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full px-4 py-3 bg-white border-gray-200 focus:border-stockflow-navy focus:ring-stockflow-navy text-gray-900"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      />
                      {registerErrors.confirmPassword && (
                        <p className="text-sm font-medium text-red-600">{registerErrors.confirmPassword}</p>
                      )}
                    </div>
                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mr-2 h-4 w-4 border-gray-300 rounded text-stockflow-navy focus:ring-stockflow-navy"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        By signing up, I agree to the Terms & Conditions
                      </label>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <Button 
                        type="submit" 
                        className="px-8 py-2 bg-stockflow-navy hover:bg-stockflow-darkNavy text-white rounded-md font-medium"
                      >
                        Sign Up
                      </Button>
                      <Button 
                        type="button"
                        variant="ghost"
                        onClick={() => setIsLogin(true)}
                        className="text-stockflow-navy hover:text-stockflow-darkNavy font-medium"
                      >
                        Sign In
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Auth;
