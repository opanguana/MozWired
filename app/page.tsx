// File: app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// Dynamically import only HeroCard since others might not be exported
const HeroCard = dynamic(
  () => import("@/components/ui/card").then((mod) => mod.HeroCard),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

/**
 * Main homepage component
 * - Displays hero sections and product cards
 * - Demonstrates optimized image and environment variable usage
 */
export default function HomePage() {
  // Product sections data
  const productSections = [
    [
      {
        title: "Data migration",
        description: "Migrate mail and files to Exchange Online, SharePoint, and OneDrive.",
      },
      {
        title: "Microsoft Intune",
        description: "Simplify app and device management across multiple devices.",
      },
    ],
    [
      {
        title: "Microsoft Purview",
        description: "Powerful performance. Sleek design.",
      },
      {
        title: "Microsoft Entra",
        description: "Secure access for every identity with unified protection.",
      },
    ],
  ];

  // Stats data
  const companyStats = [
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "500+", label: "Projects Delivered" },
    { value: "24/7", label: "Support Coverage" },
    { value: "15+", label: "Years Experience" }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "MozWired transformed our network infrastructure with their structured cabling solutions. The reliability has been exceptional.",
      author: {
        name: "Sarah Chen",
        role: "IT Director",
        company: "TechFlow Inc"
      },
      rating: 5
    },
    {
      quote: "Their Microsoft solutions implementation was seamless. We migrated our entire organization with zero downtime.",
      author: {
        name: "Marcus Johnson",
        role: "CTO",
        company: "InnovateCorp"
      },
      rating: 5
    },
    {
      quote: "The web development team delivered beyond expectations. Our new platform has improved customer engagement by 40%.",
      author: {
        name: "Elena Rodriguez",
        role: "Product Manager",
        company: "GrowthLabs"
      },
      rating: 4
    }
  ];

  // Microsoft products data
  const microsoftProducts = [
    {
      title: "Data Migration",
      description: "Migrate mail and files to Exchange Online, SharePoint, and OneDrive with zero data loss.",
      icon: "📧"
    },
    {
      title: "Microsoft Intune",
      description: "Simplify app and device management across multiple devices with enterprise-grade security.",
      icon: "📱"
    },
    {
      title: "Microsoft Purview",
      description: "Comprehensive data governance and compliance solutions for modern enterprises.",
      icon: "🔍"
    },
    {
      title: "Microsoft Entra",
      description: "Secure access for every identity with unified protection across your organization.",
      icon: "🔐"
    }
  ];

  // Card actions for product cards
  function CardActions() {
    return (
      <div className="flex gap-4 mt-4">
        <Button variant="primary">Learn more</Button>
        <Button variant="appleOutline">Buy</Button>
      </div>
    );
  }

  // Get API key from environment variable (for demo only)
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  return (
    <main className="space-y-2.5">
      {/* Show API Key from env for demonstration (remove in production) */}
      {apiKey && (
        <div className="text-xs text-gray-500 text-center my-2">
          API Key: {apiKey}
        </div>
      )}
      
      {/* Top Hero Section */}
      <HeroCard
        title="Structured Cabling"
        description="LANs, Transport Networks, Access Networks."
        variant="dark"
        className="mt-16 mx-auto mt-9 bg-gray-100/80 dark:bg-black"
      >
        <CardActions />
      </HeroCard>
      
      {/* Other hero sections */}
      <HeroCard
        title="Web Development"
        description="Modern, flexible, and scalable stack."
        className="mx-auto"
      >
        <CardActions />
      </HeroCard>
      
      <HeroCard
        title="Security MSP"
        description="Assessing, surfacing actions to improve configurations."
        className="mx-auto"
      >
        <CardActions />
      </HeroCard>

      {/* Product Sections */}
      {productSections.map((section, idx) => (
        <section
          key={idx}
          className="mx-2.5 grid grid-cols-1 md:grid-cols-2 gap-2.5"
        >
          {section.map((card) => (
            <HeroCard
              key={card.title}
              title={card.title}
              description={card.description}
              className="rounded-none shadow-none border-none"
            >
              <CardActions />
            </HeroCard>
          ))}
        </section>
      ))}

      {/* Stats Section
      <div className="mx-2.5">
        <div className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700 p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Trusted by Industry Leaders
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Delivering exceptional results with proven track record and reliable performance metrics
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {companyStats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Features Grid
      <div className="mx-2.5">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700 p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Our Core Services
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive technology solutions tailored to your business needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: "🔌",
                title: "Structured Cabling",
                description: "Professional LANs, Transport Networks, and Access Networks with enterprise-grade infrastructure.",
              },
              {
                icon: "🌐",
                title: "Web Development",
                description: "Modern, flexible, and scalable stack using Next.js, React, and cutting-edge technologies.",
              },
              {
                icon: "☁️",
                title: "Microsoft Solutions",
                description: "Quickly adopt and efficiently implement Microsoft ecosystem with expert guidance.",
              },
              {
                icon: "🛡️",
                title: "Security & Compliance",
                description: "Comprehensive security solutions with Microsoft Purview and enterprise protection.",
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200/60 dark:border-gray-600 p-4 hover:shadow-lg transition-all duration-300 ${
                  index === 0 ? 'ring-1 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-lg">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="rounded-lg">
                        View Solutions
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Microsoft Products Section
      <div className="mx-2.5">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700 p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Microsoft Solutions
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive Microsoft ecosystem implementation and management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {microsoftProducts.map((product, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200/60 dark:border-gray-600 p-4 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-lg">
                    {product.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="rounded-lg">
                        Explore Solution
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Testimonials Section
      <div className="mx-2.5">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700 p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              What Our Clients Say
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Trusted by businesses worldwide to deliver exceptional technology solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200/60 dark:border-gray-600 p-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-base ${
                        i < testimonial.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-3 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {testimonial.author.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {testimonial.author.role}, {testimonial.author.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Final CTA Section */}
      <div className="mx-2.5 mb-2.5">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Transform Your Business?
          </h2>
          <p className="text-blue-100 text-base md:text-lg mb-6 max-w-2xl mx-auto">
            Let's discuss how our technology solutions can drive your business forward with innovation and reliability.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-semibold text-sm"
              size="sm"
            >
              Start Free Consultation
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-6 py-2 rounded-lg font-semibold text-sm"
              size="sm"
            >
              View Case Studies
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}