import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { ArrowRight, PencilIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import Delbutton from '../components/Delbutton'

dayjs.locale(ptBR)

interface Memory {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

export default async function Home() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  const token = cookies().get('token')?.value

  const response = await api.get('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories: Memory[] = response.data

  if (memories.length === 0) {
    return <EmptyMemories />
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => {
        return (
          <div key={memory.id} className="space-y-4">
            <div className="flex justify-between">
              <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-100">
                {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
              </time>

              <Link
                href={{
                  pathname: '/memories/edit',
                  query: { id: memory.id, token },
                }}
              >
                <label
                  htmlFor=""
                  className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
                >
                  <PencilIcon className="h-4 w-4" />
                  Editar memória
                </label>
              </Link>
            </div>
            <Image
              src={memory.coverUrl}
              alt=""
              width={592}
              height={280}
              className="aspect-video w-full rounded-lg object-cover"
            />
            <p className="text-lg leading-relaxed text-gray-100">
              {memory.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <Link
                href={{
                  pathname: '/memories/view',
                  query: { id: memory.id, token },
                }}
                className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
              >
                Ler mais
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Delbutton id={memory.id} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
