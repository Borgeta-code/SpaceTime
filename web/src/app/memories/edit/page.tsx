/* eslint-disable @next/next/no-img-element */
'use client'

import { api } from '@/lib/api'
import dayjs from 'dayjs'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Memory {
  id: string
  coverUrl: string
  content: string
  createdAt: string
}

export default async function EditMemory() {
  const searchParams = useSearchParams()
  const memoryId = searchParams.get('id')
  const clientId = searchParams.get('token')

  const response = await api.get(`/memories/${memoryId}`, {
    headers: {
      Authorization: `Bearer ${clientId}`,
    },
  })

  const memo: Memory = response.data

  console.log(memo)

  return (
    <div className="flex flex-1 flex-col gap-4 p-8">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar a timeline
      </Link>

      <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-100">
        {dayjs(memo.createdAt).format('D[ de ]MMMM[, ]YYYY')}
      </time>
      <img
        src={memo.coverUrl}
        alt="Memory Cover"
        className="aspect-video w-full rounded-lg object-cover"
      />
      <p className="text-lg leading-relaxed text-gray-100">{memo.content}</p>
    </div>
  )
}
