import { ArrowRight, Leaf, Shield, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-emerald-50 to-white pt-24 pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl">
              Rooted in Nature, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Crafted for You.
              </span>
            </h1>
            <p className="mt-8 text-xl leading-8 text-slate-600 font-medium">
              Herbify is more than an apothecary. We are a passionate team dedicated to bridging the gap between ancient botanical wisdom and modern wellness.
            </p>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#86efac] to-[#10b981] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
        </div>
      </div>

      {/* Mission & Vision Grid */}
      <div className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Mission */}
            <div className="relative group rounded-3xl p-10 bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <Leaf size={120} className="text-emerald-900" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-slate-900 mb-4 inline-flex items-center gap-3">
                  <Leaf className="text-emerald-500" /> Our Mission
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                  To democratize the healing power of the Earth. We meticulously source, test, and provide 100% organic, traceable herbs and botanical products that are highly effective, sustainably harvested, and completely transparent.
                </p>
                <div className="hidden sm:block w-16 h-1 bg-emerald-500 mt-8 rounded-full"></div>
              </div>
            </div>

            {/* Vision */}
            <div className="relative group rounded-3xl p-10 bg-slate-900 border border-slate-800 hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-900/20 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 text-white">
                <Shield size={120} />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white mb-4 inline-flex items-center gap-3">
                  <Shield className="text-emerald-400" /> Our Vision
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                  We envision a future where natural medicine is not an alternative, but the primary foundation of everyday health. We strive to be the world's most trusted platform for high-grade botanical remedies, uniting tradition with clinical excellence.
                </p>
                <div className="hidden sm:block w-16 h-1 bg-emerald-400 mt-8 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Pillars */}
      <div className="py-24 sm:py-32 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-bold leading-7 text-emerald-600 uppercase tracking-widest">Uncompromised Quality</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">What Makes Herbify Different?</p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              In a crowded market of supplements, purity is our ultimate currency. Here is the Herbify standard.
            </p>
          </div>
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                { name: '100% Organic Origins', description: 'Every single herb is wildcrafted or shade-grown on certified organic farms without the use of synthetic pesticides.', icon: Leaf },
                { name: 'Rigorous Lab Testing', description: 'We test for heavy metals, microbial contaminants, and active compound potency before anything reaches your door.', icon: Shield },
                { name: 'Fair Trade Sourcing', description: 'We partner directly with native farmers globally, paying premium wages to support sustainable agricultural communities.', icon: Heart },
              ].map((feature) => (
                <div key={feature.name} className="flex flex-col bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-200 transition">
                  <dt className="flex items-center gap-x-3 text-xl font-bold leading-7 text-slate-900">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 mb-4">
                      <feature.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                    </div>
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-relaxed text-slate-600">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.name}</h3>
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative isolate overflow-hidden bg-emerald-900 py-24 sm:py-32 rounded-t-[3rem] mt-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">Start your journey to vitality.</h2>
          <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto">
            Whether you're looking to boost immunity, restore calm, or find natural energy, our curated collection is here to support you.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/products" className="rounded-full bg-white px-8 py-4 text-sm font-bold text-emerald-900 shadow-sm hover:bg-slate-50 transition flex items-center gap-2">
              Browse Products <ArrowRight size={18} />
            </Link>
            <Link to="/herbs" className="rounded-full bg-emerald-800 px-8 py-4 text-sm font-bold text-white hover:bg-emerald-700 transition border border-emerald-700">
              Discover Herbs
            </Link>
          </div>
        </div>
        <svg viewBox="0 0 1024 1024" className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]" aria-hidden="true">
          <circle cx="512" cy="512" r="512" fill="url(#gradient)" fillOpacity="0.7" />
          <defs>
            <radialGradient id="gradient">
              <stop stopColor="#34d399" />
              <stop offset="1" stopColor="#064e3b" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
