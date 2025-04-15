
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'nurse' | 'admin';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; phone?: string }>;
  verifyOtp: (otp: string, phone: string) => Promise<void>;
  resendOtp: (phone: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'doctor' | 'nurse' | 'admin') => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; phone?: string }> => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      if (email === 'dr.rajput@example.com' && password === 'password') {
        // Return phone number for OTP verification instead of logging in right away
        return { 
          success: true, 
          phone: "+91 98765 43210" // Mock phone number for demo
        };
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try: dr.rajput@example.com / password",
          variant: "destructive",
        });
        return { success: false };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An error occurred during login.",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const verifyOtp = async (otp: string, phone: string) => {
    try {
      // In a real app, this would verify OTP with an API
      // For demo purposes, any 6-digit OTP will work
      if (otp.length === 6) {
        const mockUser = {
          id: '1',
          name: 'Dr. Rajput',
          email: 'dr.rajput@example.com',
          role: 'doctor' as const
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        toast({
          title: "Login successful",
          description: "Welcome back, Dr. Rajput!",
          variant: "default",
        });
        
        navigate('/');
      } else {
        toast({
          title: "Verification failed",
          description: "Invalid OTP. Please enter a 6-digit code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: "Verification failed",
        description: "An error occurred during OTP verification.",
        variant: "destructive",
      });
    }
  };
  
  const resendOtp = async (phone: string) => {
    try {
      // In a real app, this would trigger a new OTP to be sent
      toast({
        title: "OTP Resent",
        description: `A new OTP has been sent to ${phone}`,
        variant: "default",
      });
    } catch (error) {
      console.error('OTP resend error:', error);
      toast({
        title: "Failed to resend OTP",
        description: "An error occurred while trying to resend the OTP.",
        variant: "destructive",
      });
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'doctor' | 'nurse' | 'admin') => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, just create a new user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "Account created",
        description: `Welcome ${name}! Your account has been created successfully.`,
        variant: "default",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: "An error occurred during signup.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, verifyOtp, resendOtp, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
