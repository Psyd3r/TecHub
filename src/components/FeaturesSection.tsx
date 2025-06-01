
import { Command } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      title: "Advanced Analytics",
      description: "Get deep insights into your data with our cutting-edge analytics platform.",
      icon: Command,
    },
    {
      title: "Real-time Monitoring",
      description: "Monitor your systems 24/7 with real-time alerts and notifications.",
      icon: Command,
    },
    {
      title: "Scalable Infrastructure",
      description: "Build and scale your applications with our robust cloud infrastructure.",
      icon: Command,
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the cutting-edge features that make TechHub the perfect choice for your next project
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <feature.icon className="h-12 w-12 text-[#4ADE80] mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
