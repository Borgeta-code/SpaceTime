'use client'

import { api } from '@/lib/api'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { Camera, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent } from 'react'

dayjs.locale(ptBR)

interface Memory {
  id: string
  coverUrl: string
  content: string
  createdAt: string
  isPublic: boolean
}

export default async function EditMemory() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const memoryId = searchParams.get('id')
  const clientId = searchParams.get('token')

  const response = await api.get(`/memories/${memoryId}`, {
    headers: {
      Authorization: `Bearer ${clientId}`,
    },
  })

  const memo: Memory = response.data
  const isPublic = memo.isPublic
  const createdAt = memo.createdAt

  const data = dayjs(createdAt).format('MM-DD-YYYY')

  // ----------------   Função editar ------------------------

  async function handleEditMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    // Transforma a Data em string
    const formDataValue = formData.get('createData')
    const createdAt: Date = formDataValue
      ? new Date(Date.parse(formDataValue.toString()))
      : new Date()

    await api.put(
      `/memories/${memoryId}`,
      {
        coverUrl: memo.coverUrl,
        content: formData.get('content'),
        isPublic: formData.get('isPublic'),
        createdAt,
      },
      {
        headers: {
          Authorization: `Bearer ${clientId}`,
        },
      },
    )

    router.push('/')
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar a timeline
      </Link>

      <form onSubmit={handleEditMemory} className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-6">
          <label
            htmlFor="media"
            className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <Camera className="h-4 w-4" />
            Anexar mídia
          </label>

          <label
            htmlFor="isPublic"
            className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              value={isPublic.toString()}
              className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
            />
            Tornar memória pública
          </label>

          <input
            type="date"
            name="createData"
            placeholder={data}
            className="h-7 w-36 rounded border-0 border-gray-400 bg-gray-600 text-gray-100 focus:ring-0"
          />
        </div>

        <Image
          src={memo.coverUrl}
          alt="Memory Cover"
          width={592}
          height={280}
          className="aspect-video w-full rounded-lg object-cover"
        />

        <textarea
          name="content"
          spellCheck={false}
          className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
          placeholder={memo.content}
        />
        <button
          type="submit"
          className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
        >
          Editar
        </button>
      </form>
    </div>
  )
}
