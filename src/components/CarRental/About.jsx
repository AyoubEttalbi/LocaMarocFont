import { MapPin, Calendar, Car, Award, Users, Globe, Clock, ShieldCheck } from "lucide-react"

export default function About() {
  return (
    <section className="py-24 bg-white section__container about__container" id="about">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center w-full mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4 section__header">About LocaMaroc</h2>
          <p className="text-xl text-gray-600 section__description">
            LocaMaroc is a professional car rental service in Morocco, dedicated to providing seamless vehicle rental
            experiences for individuals, professionals, and tourists. Our mission is to make car rentals accessible,
            convenient, and hassle-free.
          </p>
        </div>

        {/* Company Story */}
        <div className="mb-20">
          <div className="bg-purple-50 rounded-2xl p-8 md:p-12 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-700 mb-4">
                  LocaMaroc was developed as part of a digital development training program, where we had the
                  opportunity to create a professional website specializing in car rentals in Morocco. This project
                  allowed us to apply all the skills acquired during our training.
                </p>
                <p className="text-gray-700 mb-4">
                  The LocaMaroc website aims to facilitate online vehicle reservations while providing an administration
                  space to manage services. The work was carried out based on precise specifications, which allowed us
                  to follow a rigorous approach, from functional analysis to technical implementation.
                </p>
                <p className="text-gray-700">
                  Our platform is designed with a professional and collaborative approach, using modern tools and
                  technologies to deliver a seamless experience for both customers and administrators.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="text-xl font-semibold text-purple-600 mb-4">Our Mission</h4>
                <p className="text-gray-700 mb-6">
                  To provide modern and responsive car rental services for individuals, professionals, and tourists in
                  Morocco, making the reservation process simple and efficient.
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Reliable and secure service</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Serving all regions of Morocco</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Catering to locals and tourists alike</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center w-full mx-auto mb-16">
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
              <span className="inline-flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-full font-bold text-lg">
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
              <span className="inline-flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-full font-bold text-lg">
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
              <span className="inline-flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-full font-bold text-lg">
                3
              </span>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mt-20">
          <div className="text-center w-full mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              At LocaMaroc, we're committed to providing exceptional service guided by our core values.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Quality Service</h3>
              <p className="text-gray-600">We maintain high standards in our vehicle fleet and customer service.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reliability</h3>
              <p className="text-gray-600">Count on us for dependable vehicles and service when you need them.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Efficiency</h3>
              <p className="text-gray-600">Our streamlined booking process saves you time and hassle.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Customer Focus</h3>
              <p className="text-gray-600">Your satisfaction is our priority in everything we do.</p>
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
