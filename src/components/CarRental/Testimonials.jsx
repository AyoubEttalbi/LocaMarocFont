import React from "react"
import { Star } from "lucide-react"

export default function Testimonials() {
  // Remove the internal swiper initialization since it will be handled by the animations.js utility

  return (
    <section className="py-24 bg-white section__container client__container" id="client">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4 section__header">
            What People Say About Us
          </h2>
          <p className="text-xl text-gray-600 section__description">
            Discover why our customers love renting with us! Read real reviews and testimonials to see how we deliver
            exceptional service.
          </p>
        </div>

        <div className="swiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="client__card bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full">
                <img
                  src="/assets/client-1.jpg"
                  alt="client"
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                />
                <p className="text-gray-600 mb-6">
                  "The rental process was incredibly smooth, and the car was in perfect condition. Quick pick-up and
                  drop-off saved me so much time. I'll definitely use LocaMaroc again!"
                </p>
                <div className="client__rating flex justify-center mb-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 text-center">Ahmed Hassan</h4>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="client__card bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full">
                <img
                  src="/assets/client-2.jpg"
                  alt="client"
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                />
                <p className="text-gray-600 mb-6">
                  "Great value for money! Clean car, punctual service, and friendly staff who went out of their way to
                  make sure everything was perfect. Highly recommend!"
                </p>
                <div className="client__rating flex justify-center mb-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 opacity-50" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 text-center">Fatima Khalid</h4>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="client__card bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full">
                <img
                  src="/assets/client-3.jpg"
                  alt="client"
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                />
                <p className="text-gray-600 mb-6">
                  "As a frequent business traveler, I need reliability and efficiency. LocaMaroc has never let me down.
                  Their fleet is always updated, and the prices are competitive."
                </p>
                <div className="client__rating flex justify-center mb-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 text-center">Karim Benali</h4>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="client__card bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full">
                <img
                  src="/assets/client-4.jpg"
                  alt="client"
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                />
                <p className="text-gray-600 mb-6">
                  "My family and I had an amazing experience with our rented SUV. Plenty of space, great condition, and
                  the child seats were installed perfectly. Will definitely use again!"
                </p>
                <div className="client__rating flex justify-center mb-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 text-center">Nadia El Fassi</h4>
              </div>
            </div>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </section>
  )
} 