export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        About Herbify
      </h1>
      <p className="mt-4 text-lg text-slate-700 leading-relaxed">
        Herbify is a platform for learning about medicinal herbs and purchasing
        herbal products. Our mission is to make natural healing information more
        accessible and help you discover products that fit your wellness goals.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 text-left">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
          <p className="text-xl font-bold text-emerald-700">Mission</p>
          <p className="mt-3 text-slate-700 leading-relaxed text-sm">
            Provide clear, trustworthy herbal education and a quality product
            experience that allows anyone to easily start their path toward natural health.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
          <p className="text-xl font-bold text-emerald-700">Vision</p>
          <p className="mt-3 text-slate-700 leading-relaxed text-sm">
            Support natural wellness journeys with modern, responsible tooling, elevating the standard of botanical e-commerce.
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}

