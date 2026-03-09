import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../auth/AuthProvider'
import { toast } from 'react-hot-toast'

export function ReviewsSection({ itemType, itemId }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')

  useEffect(() => {
    let active = true
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/api/reviews/${itemType}/${itemId}`)
        if (!active) return
        setReviews(res.data.reviews || [])
        setStats(res.data.stats || { totalReviews: 0, averageRating: 0 })
      } catch (err) {
        if (!active) return
        setError('Failed to load reviews')
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchReviews()
    return () => { active = false }
  }, [itemType, itemId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('You must be logged in to leave a review')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await api.post(`/api/reviews/${itemType}/${itemId}`, { rating, text })
      setReviews([res.data.review, ...reviews])
      // Re-calculate stats locally or refetch
      const newTotal = stats.totalReviews + 1
      const newAvg = ((stats.averageRating * stats.totalReviews) + rating) / newTotal
      setStats({ totalReviews: newTotal, averageRating: Number(newAvg.toFixed(1)) })
      setText('')
      setRating(5)
      toast.success('Review submitted successfully!')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit review')
      toast.error(err?.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const userHasReviewed = reviews.some(r => r.userId?._id === user?._id)

  function renderStars(ratingCount, interactive = false, onSelect = null) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onSelect && onSelect(star)}
            className={`transition ${interactive ? 'hover:scale-110' : 'cursor-default'}`}
          >
            <svg
              className={`w-6 h-6 ${star <= ratingCount ? 'text-amber-400' : 'text-slate-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    )
  }

  return (
    <section className="mt-12 border-t border-slate-200 pt-10">
      <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Customer Reviews</h3>
      
      {loading ? (
        <p className="text-slate-500 text-sm">Loading reviews...</p>
      ) : (
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
          
          {/* Stats & Form Column */}
          <div>
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-black text-slate-900">{stats.averageRating}</span>
              <div className="mt-2 text-amber-500 mb-1">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <span className="text-sm font-medium text-slate-500">Based on {stats.totalReviews} reviews</span>
            </div>

            {user && !userHasReviewed && (
              <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h4 className="font-bold text-lg text-slate-900 mb-4 tracking-tight">Write a Review</h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                  {renderStars(rating, true, setRating)}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Review</label>
                  <textarea
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What did you think about this item?"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-emerald-500 focus:ring-2 resize-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60 transition"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
            {!user && (
              <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                <p className="text-sm text-slate-600">Please <a href="/login" className="text-emerald-600 font-bold hover:underline">log in</a> to write a review.</p>
              </div>
            )}
          </div>

          {/* Reviews List Column */}
          <div className="space-y-6">
             {error && <p className="text-red-600 text-sm">{error}</p>}
             {reviews.length === 0 ? (
               <p className="text-slate-500 italic">No reviews yet. Be the first to share your thoughts!</p>
             ) : (
               reviews.map((r) => (
                 <div key={r._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition hover:shadow-md">
                   <div className="flex items-center justify-between mb-3">
                     <span className="font-bold text-slate-900">{r.userId?.name || 'Anonymous User'}</span>
                     <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                       {new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                     </span>
                   </div>
                   <div className="mb-4">
                    {renderStars(r.rating)}
                   </div>
                   <p className="text-slate-600 leading-relaxed text-sm">
                     {r.text || <span className="italic text-slate-400">No written review provided.</span>}
                   </p>
                 </div>
               ))
             )}
          </div>

        </div>
      )}
    </section>
  )
}
