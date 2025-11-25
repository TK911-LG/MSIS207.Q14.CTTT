import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { paymentAPI } from '../../services/api';
import { 
  Lock, CheckCircle, ArrowLeft, Sparkle
} from 'phosphor-react';
import paypalLogo from '../../assets/paypal-logo.png';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getCardStyle, isDark } = useTheme();
  const { user } = useAuth();
  const toast = useToast();

  // Get plan type from URL params (default to monthly)
  const planType = searchParams.get('plan') || 'monthly';
  
  // Validate plan type
  const validPlanTypes = ['monthly', 'yearly'];
  const finalPlanType = validPlanTypes.includes(planType) ? planType : 'monthly';

  const [loading, setLoading] = useState(false);

  const planDetails = {
    monthly: {
      name: 'Monthly Plan',
      price: 9.99,
      period: 'per month',
      total: 9.99,
    },
    yearly: {
      name: 'Yearly Plan',
      price: 79.99,
      period: 'per year',
      total: 79.99,
      savings: 'Save 33% vs monthly',
    },
  };

  const currentPlan = planDetails[finalPlanType];

  // Check for PayPal return and verify payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('paymentId');
    const payerId = urlParams.get('PayerID');
    const token = urlParams.get('token');
    const canceled = urlParams.get('canceled');
    
    // Handle cancellation
    if (canceled) {
      toast.info('Payment cancelled');
      window.history.replaceState({}, document.title, '/dashboard/checkout');
      return;
    }
    
    // Handle PayPal return (both PayPal.me and PayPal SDK)
    if (paymentId) {
      const verifyPayment = async () => {
        setLoading(true);
        try {
          const plan = urlParams.get('plan') || finalPlanType;
          const response = await paymentAPI.verifyPayPalPayment(paymentId, payerId, token, plan);
          
          if (response.success) {
            toast.success('Payment verified! Welcome to Pro!');
            window.history.replaceState({}, document.title, '/dashboard/checkout');
            
            setTimeout(() => {
              navigate('/dashboard/settings?tab=billing&upgraded=true');
            }, 1500);
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          toast.error(error.response?.data?.message || 'Payment verification failed. Please contact support.');
          setLoading(false);
        }
      };
      
      verifyPayment();
      return;
    }
    
    // Handle PayPal.me return (no paymentId in URL, check localStorage)
    const storedPaymentId = sessionStorage.getItem('paypal_payment_id');
    if (storedPaymentId && !paymentId && !canceled) {
      const checkPayment = async () => {
        const confirmed = window.confirm(
          'Đã thanh toán qua PayPal?\n\n' +
          'Nếu đã thanh toán, chúng tôi sẽ kích hoạt Pro plan cho bạn.\n\n' +
          'Click OK để kích hoạt, hoặc Cancel nếu chưa thanh toán.'
        );
        
        if (confirmed) {
          setLoading(true);
          try {
            const plan = sessionStorage.getItem('paypal_plan') || finalPlanType;
            const response = await paymentAPI.verifyPayPalPayment(
              storedPaymentId,
              null,
              null,
              plan
            );
            
            if (response.success) {
              toast.success('Payment verified! Welcome to Pro!');
              sessionStorage.removeItem('paypal_payment_id');
              sessionStorage.removeItem('paypal_plan');
              
              setTimeout(() => {
                navigate('/dashboard/settings?tab=billing&upgraded=true');
              }, 1500);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Verification failed. Please contact support with your PayPal transaction ID.');
            setLoading(false);
          }
        } else {
          sessionStorage.removeItem('paypal_payment_id');
          sessionStorage.removeItem('paypal_plan');
        }
      };
      
      checkPayment();
    }
  }, [finalPlanType, navigate, toast]);

  const handlePayPalClick = async () => {
    setLoading(true);
    try {
      toast.info('Creating PayPal payment...');
      
      const response = await paymentAPI.createPayPalPayment(finalPlanType, currentPlan.total);
      
      if (response.success) {
        // Store payment ID for verification after return
        if (response.method === 'paypalme') {
          // PayPal.me: Store in sessionStorage and redirect
          sessionStorage.setItem('paypal_payment_id', response.paymentId);
          sessionStorage.setItem('paypal_plan', finalPlanType);
          toast.info('Redirecting to PayPal...');
        } else {
          // PayPal SDK: Store payment ID for return URL
          sessionStorage.setItem('paypal_payment_id', response.paymentId);
          sessionStorage.setItem('paypal_plan', finalPlanType);
        }
        
        if (response.redirectUrl) {
          // Redirect to PayPal
          window.location.href = response.redirectUrl;
          return;
        }
        
        // Demo mode fallback
        if (response.demoMode) {
          const confirmed = window.confirm(
            `Demo Mode: Simulate PayPal payment?\n\n` +
            `Plan: ${currentPlan.name}\n` +
            `Amount: $${currentPlan.total.toFixed(2)}\n\n` +
            `To enable real PayPal, add PAYPAL_ME_USERNAME to .env`
          );
          
          if (confirmed) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const verifyResponse = await paymentAPI.verifyPayPalPayment(
              response.paymentId,
              null,
              null,
              finalPlanType
            );
            
            if (verifyResponse.success) {
              toast.success('Payment processed successfully! Welcome to Pro!');
              sessionStorage.removeItem('paypal_payment_id');
              sessionStorage.removeItem('paypal_plan');
              setTimeout(() => {
                navigate('/dashboard/settings?tab=billing&upgraded=true');
              }, 1500);
            } else {
              throw new Error('Payment verification failed');
            }
          } else {
            setLoading(false);
          }
        } else {
          throw new Error('Invalid payment response - no redirect URL');
        }
      } else {
        throw new Error('Failed to create PayPal payment');
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
      toast.error(error.response?.data?.message || 'Failed to process PayPal payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header - Soft Minimalism */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-2xl font-semibold text-primary mb-2">Complete Your Purchase</h1>
          <p className="text-sm text-secondary">Simple, secure payment via PayPal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Summary - Soft Minimalism */}
            <div className="p-8 rounded-3xl" style={{ ...getCardStyle() }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-medium text-primary">Order Summary</h2>
                <button
                  onClick={() => navigate('/dashboard/settings?tab=billing')}
                  className="text-xs text-secondary hover:text-primary transition-colors"
                >
                  Change
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div>
                    <p className="text-sm font-medium text-primary">{currentPlan.name}</p>
                    <p className="text-xs text-secondary mt-0.5">{currentPlan.period}</p>
                  </div>
                  <span className="text-lg font-semibold text-primary">${currentPlan.price.toFixed(2)}</span>
                </div>
                {currentPlan.savings && (
                  <div className="text-xs text-accent-sage text-center py-2">
                    {currentPlan.savings}
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-sm font-medium text-primary">Total</span>
                  <span className="text-2xl font-semibold text-primary">${currentPlan.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* PayPal Payment - Soft Minimalism */}
            <div className="p-8 rounded-3xl" style={{ ...getCardStyle() }}>
              <div className="text-center mb-6">
                <h2 className="text-base font-medium text-primary mb-2">Pay with PayPal</h2>
                <p className="text-xs text-secondary">
                  You'll be redirected to PayPal to complete your payment securely
                </p>
              </div>

              {/* PayPal Logo */}
              <div className="flex justify-center mb-6">
                <img 
                  src={paypalLogo} 
                  alt="PayPal" 
                  className="h-6 w-auto object-contain opacity-90"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* PayPal Button - Soft Minimalism */}
              <button
                onClick={handlePayPalClick}
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#0070BA',
                  boxShadow: '0 2px 8px rgba(0, 112, 186, 0.2)',
                }}
              >
                {loading ? 'Processing...' : `Pay $${currentPlan.total.toFixed(2)}`}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-secondary">
                  <Lock size={12} className="inline mr-1" />
                  Secure payment • Cancel anytime
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side (1 column) */}
          <div className="space-y-6">
            {/* Security - Soft Minimalism */}
            <div className="p-6 rounded-3xl" style={{ ...getCardStyle() }}>
              <div className="flex items-center gap-2 mb-4">
                <Lock size={18} weight="duotone" style={{ color: 'var(--accent-sage)' }} />
                <h3 className="text-sm font-medium text-primary">Secure</h3>
              </div>
              <p className="text-xs text-secondary mb-4 leading-relaxed">
                Your payment is processed securely through PayPal. We never store your payment information.
              </p>
              <div className="space-y-2 text-xs text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle size={12} weight="fill" style={{ color: 'var(--accent-sage)' }} />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={12} weight="fill" style={{ color: 'var(--accent-sage)' }} />
                  <span>PCI compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={12} weight="fill" style={{ color: 'var(--accent-sage)' }} />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* What's Included - Soft Minimalism */}
            <div className="p-6 rounded-3xl" style={{ ...getCardStyle() }}>
              <h3 className="text-sm font-medium text-primary mb-4">What's Included</h3>
              <ul className="space-y-2.5 text-xs text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} weight="fill" style={{ color: 'var(--accent-sage)' }} className="mt-0.5 flex-shrink-0" />
                  <span>Unlimited notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} weight="fill" style={{ color: 'var(--accent-sage)' }} className="mt-0.5 flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} weight="fill" style={{ color: 'var(--accent-sage)' }} className="mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} weight="fill" style={{ color: 'var(--accent-sage)' }} className="mt-0.5 flex-shrink-0" />
                  <span>Data export</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} weight="fill" style={{ color: 'var(--accent-sage)' }} className="mt-0.5 flex-shrink-0" />
                  <span>Custom themes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} weight="fill" style={{ color: 'var(--accent-sage)' }} className="mt-0.5 flex-shrink-0" />
                  <span>Early access</span>
                </li>
              </ul>
            </div>

            {/* Support - Soft Minimalism */}
            <div className="p-4 rounded-2xl text-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <p className="text-xs text-secondary">
                Need help? <a href="#" className="text-accent-sage hover:underline">Contact Support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
