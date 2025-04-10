import Link from 'next/link'
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link href="/" className="flex items-center px-4 hover:text-blue-600">
                                Query Builder
                            </Link>
                            <Link href="/saved-queries" className="flex items-center px-4 hover:text-blue-600">
                                Saved Queries
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    )
}