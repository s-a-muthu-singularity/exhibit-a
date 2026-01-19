'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RichTextEditor } from '@/components/editor'
import { createClient } from '@/lib/supabase/client'

export default function WritePage() {
    const [content, setContent] = useState('')
    const [coverImage, setCoverImage] = useState('')
    const [isPublishing, setIsPublishing] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('post-images')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data: { publicUrl } } = supabase.storage
                .from('post-images')
                .getPublicUrl(filePath)

            setCoverImage(publicUrl)
        } catch (error: any) {
            console.error('Error uploading image:', error)
            alert('Error uploading image: ' + error.message)
        } finally {
            setIsUploading(false)
        }
    }

    const handlePublish = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsPublishing(true)

        try {
            const formData = new FormData(event.currentTarget)
            const title = formData.get('title') as string
            const excerpt = formData.get('excerpt') as string
            const isPremium = formData.get('is_premium') === 'on'

            // 1. Get User strictly
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            if (authError || !user) {
                alert('You must be logged in to publish.')
                setIsPublishing(false)
                return
            }

            // 2. Slug Generation
            const slug = title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '')
                + '-' + Date.now()

            // 3. Direct Insert
            const { error } = await supabase.from('posts').insert({
                title,
                slug,
                content,
                excerpt,
                cover_image: coverImage,
                author_id: user.id, // Correct column name
                status: 'published', // Do not save as draft
            })

            // 4. Error Handling
            if (error) {
                console.error('Supabase insert error:', error)
                alert(`Error publishing story: ${error.message}`)
                setIsPublishing(false)
                return
            }

            // Success
            router.push('/')
            router.refresh()

        } catch (e: any) {
            console.error('Unexpected error:', e)
            alert(`Unexpected error: ${e.message}`)
            setIsPublishing(false)
        }
    }

    return (
        <main className="min-h-screen bg-white dark:bg-black py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">New Story</h1>
                </header>

                <form onSubmit={handlePublish} className="space-y-8">
                    <div className="space-y-4">
                        <input
                            name="title"
                            type="text"
                            placeholder="Title"
                            required
                            className="w-full text-5xl font-serif font-bold placeholder:text-gray-300 dark:placeholder:text-gray-700 border-none focus:ring-0 p-0 bg-transparent"
                        />
                        <input
                            name="excerpt"
                            type="text"
                            placeholder="Subtitle (optional)"
                            className="w-full text-xl text-gray-500 placeholder:text-gray-300 dark:placeholder:text-gray-700 border-none focus:ring-0 p-0 bg-transparent"
                        />

                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="cover-upload"
                                    className={`cursor-pointer inline-flex items-center px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isUploading ? 'Uploading...' : 'Upload Cover Image'}
                                    <input
                                        id="cover-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                        className="hidden"
                                    />
                                </label>
                                {coverImage && (
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                        Image uploaded successfully
                                    </span>
                                )}
                            </div>

                            {coverImage && (
                                <div className="mt-4 w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative group">
                                    <img
                                        src={coverImage}
                                        alt="Cover preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setCoverImage('')}
                                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="prose-container">
                        <RichTextEditor content={content} onChange={setContent} />
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-900 pt-6">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_premium"
                                name="is_premium"
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <label htmlFor="is_premium" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Premium / Students Only
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isPublishing || isUploading}
                            className="rounded-full bg-black dark:bg-white text-white dark:text-black px-8 py-3 font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                            {isPublishing ? 'Publishing...' : 'Publish'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}
