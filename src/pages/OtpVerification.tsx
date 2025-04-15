
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Timer } from 'lucide-react';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [phone] = useState<string>(location.state?.phone || '');
  
  useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
  }, [phone, navigate]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);
  
  const handleVerify = async () => {
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    try {
      await verifyOtp(otp, phone);
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    await resendOtp(phone);
    setCountdown(30);
  };

  const formatPhoneNumber = (phone: string) => {
    // Display only last 4 digits for privacy
    return phone.slice(-10).replace(/(\d{6})(\d{4})/, 'XXXXXX$2');
  };
  
  // Create an array to generate the exact number of slots needed
  const slots = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg overflow-hidden">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-200/30 to-purple-300/30 blur-sm -z-10"></div>
          <div className="absolute inset-0 rounded-lg border-2 border-purple-200/50 -z-10"></div>
          
          <CardHeader className="space-y-1 text-center">
            <Button 
              variant="ghost" 
              className="absolute left-3 top-3" 
              onClick={() => navigate('/login')}
              size="icon"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Identity</CardTitle>
            <CardDescription className="text-gray-500">
              We've sent a 6-digit code to {formatPhoneNumber(phone)}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={setOtp}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            
            <Button
              onClick={handleVerify}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
              disabled={otp.length !== 6 || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Timer className="h-4 w-4 text-gray-400" />
              {countdown > 0 ? (
                <span>Resend OTP in {countdown}s</span>
              ) : (
                <button 
                  onClick={handleResendOtp} 
                  className="text-primary font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
            <p className="text-xs text-center text-gray-500">
              For demo purposes, enter any 6-digit code
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OtpVerification;
