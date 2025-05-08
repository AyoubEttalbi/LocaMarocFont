import { MapPin, Calendar, Car } from "lucide-react"

export default function About() {
  return (
    <section className="py-24 bg-white section__container about__container" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4 section__header">How It Works</h2>
          <p className="text-xl text-gray-600 section__description">
            Renting a car with us is simple! Choose your vehicle, pick your dates, and complete your booking. We'll
            handle the rest, ensuring a smooth start to your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 about__grid">
          <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 about__card">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Location</h3>
            <p className="text-gray-600">
              Select from a variety of pick-up locations that best suit your needs, whether it's close to home, work, or
              airport.
            </p>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-purple-600/20 text-gray-900 rounded-full font-bold text-lg" style={{ color: '#111827 !important' }}>
                1
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 md:transform md:translate-y-4 about__card">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Pick-up Date</h3>
            <p className="text-gray-600">
              Choose the exact date and time for your car pick-up, ensuring that your vehicle is ready when you need it.
            </p>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-purple-600/20 text-gray-900 rounded-full font-bold text-lg" style={{ color: '#111827 !important' }}>
                2
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 about__card">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Book your Car</h3>
            <p className="text-gray-600">
              Complete your booking with just a few clicks, and we'll prepare your vehicle to ensure a hassle-free
              pick-up.
            </p>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-purple-600/20 text-gray-900 rounded-full font-bold text-lg" style={{ color: '#111827 !important' }}>
                3
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <a href="#cars" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium">
            View Available Cars
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
} 