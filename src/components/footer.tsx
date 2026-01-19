export function Footer() {
    return (
        <footer className="border-t border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-black mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-serif font-bold text-lg mb-4">Exhibit A</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            A student magazine platform designed for storytelling.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-4">Links</h4>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><a href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</a></li>
                            <li><a href="/login" className="hover:text-black dark:hover:text-white transition-colors">Sign In</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-400">
                    &copy; 2026 Exhibit A - Student Magazine
                </div>
            </div>
        </footer>
    )
}
