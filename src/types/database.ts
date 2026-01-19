export type Profile = {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
    updated_at: string | null
}

export type Post = {
    id: string
    title: string
    slug: string
    content: any // JSONB
    excerpt: string | null
    cover_image: string | null
    user_id: string
    published: boolean
    is_premium: boolean
    created_at: string
    updated_at: string
    profiles?: Profile // Joined relation
}
