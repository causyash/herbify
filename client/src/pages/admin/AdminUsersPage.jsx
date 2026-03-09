import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../auth/AuthProvider'
import { toast } from 'react-hot-toast'

export function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadUsers() {
    try {
      setLoading(true)
      const res = await api.get('/api/admin/users')
      setUsers(res.data.items || [])
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  async function toggleRole(id, currentRole) {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin'
    if (id === currentUser.id && nextRole === 'user') {
      toast.error('You cannot remove your own admin access')
      return
    }

    try {
      await api.patch(`/api/admin/users/${id}/role`, { role: nextRole })
      toast.success('User role updated')
      loadUsers()
    } catch {
      toast.error('Failed to update role')
    }
  }

  async function deleteUser(id) {
    if (id === currentUser.id) {
      toast.error('You cannot delete yourself')
      return
    }
    if (!window.confirm('Delete this user?')) return

    try {
      await api.delete(`/api/admin/users/${id}`)
      toast.success('User deleted')
      loadUsers()
    } catch {
      toast.error('Failed to delete user')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Users</h1>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Verified</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3 font-medium text-slate-900">{u.name}</td>
                    <td className="px-5 py-3">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${u.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isVerified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleRole(u._id, u.role)}
                          disabled={u._id === currentUser.id}
                          className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                        >
                          Toggle Role
                        </button>
                        <button
                          onClick={() => deleteUser(u._id)}
                          disabled={u._id === currentUser.id}
                          className="rounded-lg bg-red-50 text-red-600 px-3 py-1 text-xs font-semibold hover:bg-red-100 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                     <td colSpan={5} className="p-6 text-center text-slate-500">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
