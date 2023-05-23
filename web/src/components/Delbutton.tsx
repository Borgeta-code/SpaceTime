'use client'

import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Delbutton(id: any) {
  const memoId = id.id
  const router = useRouter()

  const handleDelete = async () => {
    const token = Cookie.get('token')
    try {
      await api.delete(`/memories/${memoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error('Error deleting memory:', error)
    }

    router.refresh()
  }

  return (
    <span onClick={handleDelete}>
      <Trash className="h-4 w-4 cursor-pointer text-red-700" />
    </span>
  )
}
