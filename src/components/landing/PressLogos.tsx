const pressLogos = [
  { name: 'TechCrunch', width: 140 },
  { name: 'Forbes', width: 100 },
  { name: 'Bloomberg', width: 130 },
  { name: 'Reuters', width: 110 },
  { name: 'Business Insider', width: 160 },
  { name: 'The Verge', width: 120 },
]

export function PressLogos() {
  return (
    <section className="py-12 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 mb-8">As seen in</p>

        {/* Scrolling marquee */}
        <div className="relative">
          <div className="flex gap-16 marquee-animate">
            {/* First set */}
            {pressLogos.map((logo) => (
              <div
                key={logo.name}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: logo.width }}
              >
                <span className="text-xl font-bold text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {pressLogos.map((logo) => (
              <div
                key={`${logo.name}-dup`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: logo.width }}
              >
                <span className="text-xl font-bold text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>

          {/* Gradient overlays */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
