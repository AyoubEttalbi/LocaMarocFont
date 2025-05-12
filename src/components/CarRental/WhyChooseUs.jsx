import { Wallet, Shield, Car, Settings } from "lucide-react"
import { useEffect, useState } from "react"

export default function WhyChooseUs() {
  const [isInView, setIsInView] = useState(false);

  // Add intersection observer to trigger animations when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('choose');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <section className="py-24 bg-gray-50" id="choose">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className={`lg:w-1/2 choose__image ${isInView ? 'car-drive-in' : ''}`}>
            <div className="relative">
              <img src="/assets/choose.png" alt="Luxury car" className="rounded-lg shadow-xl z-10 relative" />
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-purple-200 rounded-full opacity-50 z-0"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-yellow-200 rounded-full opacity-50 z-0"></div>

              {/* Car features badges */}
              <div className="absolute right-0 top-0 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-2 m-2 text-xs font-semibold text-purple-700 animate-pulse">
                TURBO ENGINE
              </div>
              
              {/* Wheels animation spots */}
              <div className="wheel absolute left-[15%] bottom-[20%] w-8 h-8 rounded-full border-2 border-purple-400 opacity-40"></div>
              <div className="wheel absolute right-[20%] bottom-[20%] w-8 h-8 rounded-full border-2 border-purple-400 opacity-40"></div>

              {/* Stats overlay */}
              <div className="absolute -right-10 top-1/4 bg-white rounded-lg shadow-lg p-4 z-20">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer Satisfaction</p>
                    <p className="text-lg font-bold text-gray-900">98%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-10 bottom-1/4 bg-white rounded-lg shadow-lg p-4 z-20">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Rental Time</p>
                    <p className="text-lg font-bold text-gray-900">4.5 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 choose__content">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6 section__header">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 mb-10 section__description">
              We offer reliable, modern vehicles, competitive rates, and friendly service. Our hassle-free rental
              process and dedication to customer satisfaction set us apart.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col h-full bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105 hover:shadow-lg choose__card">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Best price guaranteed</h4>
                  <p className="text-gray-600">
                    Our price-match policy ensures you always get the best deal, saving you money on every rental.
                  </p>
                </div>
              </div>

              <div className="flex flex-col h-full bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105 hover:shadow-lg choose__card">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Full insurance coverage</h4>
                  <p className="text-gray-600">
                    Drive with peace of mind knowing you're protected by our comprehensive insurance plans.
                  </p>
                </div>
              </div>

              <div className="flex flex-col h-full bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105 hover:shadow-lg choose__card">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Wide range of vehicles</h4>
                  <p className="text-gray-600">
                    From economy cars to luxury models, we have the perfect vehicle for every need and budget.
                  </p>
                </div>
              </div>

              <div className="flex flex-col h-full bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105 hover:shadow-lg choose__card">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Free maintenance</h4>
                  <p className="text-gray-600">
                    All our vehicles come with free maintenance, ensuring a worry-free driving experience throughout
                    your rental.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 