
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useInvestorAuth } from '@/hooks/useInvestorAuth';

const Pricing = () => {
  const { user } = useInvestorAuth();
  const { toast } = useToast();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Browse marketplace',
        'Interact with up to 5 startups',
        'Basic startup information',
        'Email support'
      ],
      plan: 'free',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'month',
      description: 'For serious investors',
      features: [
        'Unlimited interactions',
        'AI-powered recommendations',
        'Early access to new startups',
        'Advanced filtering',
        'Priority support',
        'Investment tracking'
      ],
      plan: 'pro',
      popular: true
    },
    {
      name: 'Premium',
      price: '$59',
      period: 'month',
      description: 'Maximum investment power',
      features: [
        'Everything in Pro',
        'Pro-level analytics',
        'Direct messaging to founders',
        'Priority placement in startup lists',
        'Custom investment reports',
        'Dedicated account manager'
      ],
      plan: 'premium',
      popular: false
    }
  ];

  const handleSelectPlan = async (plan: string, price: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your plan",
        variant: "destructive"
      });
      return;
    }

    if (plan === 'free') {
      toast({
        title: "You're already on the Free plan",
        description: "No upgrade needed!",
      });
      return;
    }

    try {
      toast({
        title: "Redirecting to checkout...",
        description: "Please wait while we set up your payment",
      });

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan, price, userId: user.id }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                InvestRadar
              </span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link to="/investor-dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Investment Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock powerful tools and insights to make smarter investment decisions
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative border-0 shadow-lg bg-white/90 backdrop-blur-sm ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period !== 'forever' && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSelectPlan(plan.plan, plan.name === 'Pro' ? 2900 : 5900)}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                  disabled={!user && plan.plan !== 'free'}
                >
                  {plan.plan === 'free' ? 'Current Plan' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-left">
              <h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time through your dashboard.</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Our Free plan gives you access to core features. Upgrade when you're ready for more.</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards through our secure Stripe payment system.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
