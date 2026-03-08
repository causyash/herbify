export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        About Herbify
      </h1>
      <p className="mt-3 text-slate-700">
        Herbify is a platform for learning about medicinal herbs and purchasing
        herbal products. Our mission is to make natural healing information more
        accessible and help you discover products that fit your wellness goals.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-semibold text-slate-900">Mission</p>
          <p className="mt-1 text-sm text-slate-600">
            Provide clear, trustworthy herbal education and a quality product
            experience.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-semibold text-slate-900">Vision</p>
          <p className="mt-1 text-sm text-slate-600">
            Support natural wellness journeys with modern, responsible tooling.
          </p>
        </div>
      </div>
    </div>
  )
}

