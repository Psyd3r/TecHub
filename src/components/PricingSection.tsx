
export const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      features: ["5 Projects", "10GB Storage", "Email Support", "Basic Analytics"],
      popular: false,
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      features: ["Unlimited Projects", "100GB Storage", "Priority Support", "Advanced Analytics", "Team Collaboration"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "/month",
      features: ["Everything in Pro", "Unlimited Storage", "24/7 Phone Support", "Custom Integrations", "Dedicated Manager"],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. No hidden fees, no surprises.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-gray-800 rounded-2xl p-8 ${plan.popular ? 'ring-2 ring-[#4ADE80] relative' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4ADE80] text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-[#4ADE80] rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-full font-medium transition-colors duration-200 ${
                plan.popular 
                  ? 'button-gradient text-white hover:scale-105 transition-transform' 
                  : 'border border-gray-600 text-white hover:bg-gray-700'
              }`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
