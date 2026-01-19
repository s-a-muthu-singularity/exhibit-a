import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { UserNav } from './user-nav'

export async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <h1 className="text-2xl font-serif font-bold tracking-tighter">
                                Exhibit A
                            </h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <UserNav user={user} />
                    </div>
                </div>
            </div>
        </nav>
    )
}
