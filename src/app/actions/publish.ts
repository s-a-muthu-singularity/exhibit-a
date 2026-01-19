'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function publishStory(formData: FormData) {
    const supabase = await createClient()

    // 1. Get User strictly
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'You must be logged in to publish a story.' }
    }

    // Check if profile exists, if not create it (Lazy creation to fix FK constraint)
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
    if (!profile) {
        // Create profile with data from auth
        const { error: profileError } = await supabase.from('profiles').insert({
            id: user.id,
            username: user.email?.split('@')[0], // Fallback username
            full_name: user.email?.split('@')[0], // Fallback name
        })
        if (profileError) {
            console.error('Error creating profile:', profileError)
            return { error: 'Failed to create user profile. Please try again.' }
        }
    }

    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const isPremium = formData.get('is_premium') === 'on'

    // 2. Slug Generation (kebab-case + timestamp)
    const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with -
        .replace(/^-+|-+$/g, '') // Trim - from start/end
        + '-' + Date.now() // Add timestamp for uniqueness

    // 3. Insert Post
    const { error } = await supabase.from('posts').insert({
        title,
        slug,
        content,
        excerpt,
        user_id: user.id, // 4. Author ID
        published: true,
        is_premium: isPremium,
    })

    // 5. Error Handling
    if (error) {
        console.error('Supabase insert error:', error)
        return { error: `Failed to publish: ${error.message}` }
    }

    redirect('/')
}
