'use client'

import { api } from '@/lib/api'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

interface Memory {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

export default async function PreviewMemory() {
  const searchParams = useSearchParams()
  const memoryId = searchParams.get('id')
  const clientId = searchParams.get('token')

  const response = await api.get(`/memories/${memoryId}`, {
    headers: {
      Authorization: `Bearer ${clientId}`,
    },
  })

  const memo: Memory = response.data

  return (
    <>
      <Image src={memo.coverUrl} alt="Memory cover" />
    </>
  )
}
