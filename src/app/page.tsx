import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  const { data: posts } = await supabase.from('posts').select('*')

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-4">
            Fresh Reads
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Discover the latest stories, essays, and ideas from our student community.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post) => (
            <Link key={post.id} href={`/story/${post.slug}`} className="block group h-full">
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-zinc-900/50">
                <div className="aspect-[3/2] overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                  <img
                    src={post.cover_image || 'https://placehold.co/600x400'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={post.title}
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-serif font-bold mb-3 line-clamp-2 leading-tight group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <span>Read Story</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(!posts || posts.length === 0) && (
          <div className="text-center py-20 text-gray-500">
            <p>No posts found.</p>
          </div>
        )}
      </div>
    </main>
  )
}
