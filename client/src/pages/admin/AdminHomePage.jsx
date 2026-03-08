import { Link } from 'react-router-dom'

export function AdminHomePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Admin overview
      </h1>
      <p className="mt-2 text-slate-600">
        Manage categories, herbs, and products.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          { to: '/admin/categories', title: 'Categories', body: 'Create and organize categories and subcategories.' },
          { to: '/admin/herbs', title: 'Herbs', body: 'Add herb profiles, uses, benefits, pricing, and images.' },
          { to: '/admin/products', title: 'Products', body: 'Manage products and assign them to categories.' },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50"
          >
            <p className="font-semibold text-slate-900">{c.title}</p>
            <p className="mt-1 text-sm text-slate-600">{c.body}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

