import Link from 'next/link'
import { Post } from '@/types/database'
import { Calendar } from 'lucide-react'

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

export function PostCard({ post }: { post: Post }) {
    return (
        <article className="flex flex-col gap-2 py-8 border-b border-gray-100 dark:border-gray-900 last:border-0 group">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                        {post.profiles?.avatar_url ? (
                            <img src={post.profiles.avatar_url} alt={post.profiles.username || 'User'} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs font-serif font-bold">
                                {(post.profiles?.username || post.profiles?.full_name || 'A')?.[0]?.toUpperCase()}
                            </span>
                        )}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {post.profiles?.full_name || post.profiles?.username || 'Anonymous'}
                    </span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                </div>
            </div>

            <Link href={`/story/${post.slug}`} className="group-hover:opacity-80 transition-opacity flex gap-6">
                <div className="flex-1">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-50 mb-2">
                        {post.title}
                    </h2>
                    {post.excerpt && (
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 md:line-clamp-3 font-serif">
                            {post.excerpt}
                        </p>
                    )}
                </div>
                <div className="w-1/3 max-w-[200px] aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                    <img
                        src={post.cover_image || 'https://placehold.co/600x400'}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </Link>

            <div className="mt-4 flex items-center gap-4">
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                    Read more
                </span>
            </div>
        </article>
    )
}
