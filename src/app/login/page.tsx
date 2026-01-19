import { login, signup } from './actions'

export default function LoginPage({ searchParams }: { searchParams: { message: string; error: string } }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black">
            <div className="w-full max-w-sm space-y-10">
                <div className="text-center">
                    <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900 dark:text-white">
                        Exhibit A
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sign in to your account
                    </p>
                </div>

                <form className="space-y-6">
                    {searchParams?.message && (
                        <div className="p-3 text-sm bg-green-50 text-green-600 rounded-md border border-green-200">
                            {searchParams.message}
                        </div>
                    )}
                    {searchParams?.error && (
                        <div className="p-3 text-sm bg-red-50 text-red-600 rounded-md border border-red-200">
                            {searchParams.error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            formAction={login}
                            className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-auth-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                            Sign in
                        </button>
                        <button
                            formAction={signup}
                            className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
