export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-slate-800">Herbify</p>
          <p>Educational herbal info + herbal products shop.</p>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Herbify. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

