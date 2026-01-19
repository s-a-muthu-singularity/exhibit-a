'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { PenSquare, User as UserIcon, LogOut } from 'lucide-react'
import { signOut } from '@/app/actions/auth'
import { useState } from 'react'

export function UserNav({ user }: { user: User | null }) {
    const [isOpen, setIsOpen] = useState(false)

    if (!user) {
        return (
            <div className="flex items-center gap-4">
                <Link
                    href="/login"
                    className="text-sm font-medium hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                    Sign in
                </Link>
                <Link
                    href="/login"
                    className="rounded-full bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                    Get Started
                </Link>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-4">
            <Link
                href="/write"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
                <PenSquare className="h-5 w-5" />
                <span className="hidden sm:inline text-sm font-medium">Write</span>
            </Link>

            <div className="relative ml-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center p-1 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {/* Placeholder avatar if no user image */}
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <span className="font-serif font-bold text-sm">
                            {user.email?.[0].toUpperCase()}
                        </span>
                    </div>
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                            <div className="py-1">
                                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-900 mb-1">
                                    {user.email}
                                </div>
                                <Link
                                    href="/me/stories"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                                    onClick={() => setIsOpen(false)}
                                >
                                    My Stories
                                </Link>
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Profile
                                </Link>
                                <form action={signOut}>
                                    <button
                                        type="submit"
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-900"
                                    >
                                        Sign out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
