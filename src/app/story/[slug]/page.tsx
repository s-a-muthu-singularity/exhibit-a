import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function StoryPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const { slug } = params

    const supabase = await createClient()

    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !post) {
        console.error('Error fetching post:', error)
        notFound()
    }

    // Calculate reading time
    const wordCount = post.content?.split(/\s+/g).length || 0
    const readingTime = Math.ceil(wordCount / 200)

    return (
        <article className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-20">
            {/* Cover Image Banner */}
            {post.cover_image && (
                <div className="w-full h-[60vh] relative mb-12">
                    <div className="absolute inset-0 bg-black/20 z-10" />
                    <img
                        src={post.cover_image}
                        className="w-full h-full object-cover"
                        alt={post.title}
                    />
                </div>
            )}

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12 text-center">
                    {/* Meta info */}
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6 font-medium tracking-wide uppercase">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{readingTime} min read</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight text-gray-900 dark:text-white">
                        {post.title}
                    </h1>
                </header>

                <div
                    className="prose dark:prose-invert prose-lg max-w-none font-serif leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </article>
    )
}
