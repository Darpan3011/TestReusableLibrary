import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Button } from './ui/Button'
import { ThemeToggle } from './ui/ThemeToggle'
import { API_BASE_URL } from '../config'

export function Layout() {
    const { isAuthenticated, logout, authType, user } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const location = useLocation()

    const oauthLogout = async () => {
        try {
            await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            })
        } catch (e) {
            // ignore
        }
        await logout()
    }

    const isActive = (path: string) => location.pathname === path

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
            {/* Navigation */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center gap-3">
                                <Link to="/" className="flex items-center gap-3">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-500/20 flex-shrink-0">
                                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-extrabold text-gray-900 dark:text-white text-lg leading-tight tracking-tight">Darpan's Modules</span>
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Demo Platform</span>
                                    </div>
                                </Link>
                            </div>
                            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                                <NavLink to="/" active={isActive('/')}>Home</NavLink>
                                {/* <NavLink to="/api/filter" active={isActive('/api/filter')}>API Filter</NavLink> */}
                                {isAuthenticated && (
                                    <>
                                        <NavLink to="/profile" active={isActive('/profile')}>Profile</NavLink>
                                        <NavLink to="/sms" active={isActive('/sms')}>SMS</NavLink>
                                        <NavLink to="/ai" active={isActive('/ai')}>AI</NavLink>
                                        {/* <NavLink to="/email" active={isActive('/email')}>Email</NavLink> */}
                                        <NavLink to="/email/multiple" active={isActive('/email/multiple')}>Email</NavLink>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                            <ThemeToggle />
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/login">
                                        <Button variant="ghost">Login</Button>
                                    </Link>
                                    {authType !== 'OAUTH2' && (
                                        <Link to="/register">
                                            <Button variant="primary">Register</Button>
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {user?.attributes?.name || user?.name || user?.username || 'User'}
                                    </span>
                                    <Button variant="ghost" onClick={authType === 'OAUTH2' ? oauthLogout : logout}>Logout</Button>
                                </>
                            )}
                        </div>
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
                        <div className="pt-2 pb-3 space-y-1">
                            <MobileNavLink to="/" active={isActive('/')} onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
                            {isAuthenticated && (
                                <>
                                    <MobileNavLink to="/profile" active={isActive('/profile')} onClick={() => setIsMobileMenuOpen(false)}>Profile</MobileNavLink>
                                    <MobileNavLink to="/sms" active={isActive('/sms')} onClick={() => setIsMobileMenuOpen(false)}>SMS</MobileNavLink>
                                    <MobileNavLink to="/ai" active={isActive('/ai')} onClick={() => setIsMobileMenuOpen(false)}>AI</MobileNavLink>
                                    <MobileNavLink to="/email" active={isActive('/email')} onClick={() => setIsMobileMenuOpen(false)}>Email</MobileNavLink>
                                    <MobileNavLink to="/email/multiple" active={isActive('/email/multiple')} onClick={() => setIsMobileMenuOpen(false)}>Email</MobileNavLink>
                                </>
                            )}
                        </div>
                        <div className="pt-4 pb-4 border-t border-gray-200">
                            <div className="flex items-center px-4 space-x-3">
                                <div className="flex-shrink-0">
                                    <ThemeToggle />
                                </div>
                                {!isAuthenticated ? (
                                    <>
                                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                                            <Button variant="ghost" className="w-full justify-center">Login</Button>
                                        </Link>
                                        {authType !== 'OAUTH2' && (
                                            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                                                <Button variant="primary" className="w-full justify-center">Register</Button>
                                            </Link>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full space-y-3">
                                        <div className="text-center">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {user?.attributes?.name || user?.name || user?.username || 'User'}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                if (authType === 'OAUTH2') {
                                                    oauthLogout();
                                                } else {
                                                    logout();
                                                }
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full justify-center"
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

function NavLink({ to, children, active }: { to: string; children: React.ReactNode; active: boolean }) {
    return (
        <Link
            to={to}
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${active
                ? 'border-primary-500 text-gray-900 dark:text-white'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
        >
            {children}
        </Link>
    )
}

function MobileNavLink({ to, children, active, onClick }: { to: string; children: React.ReactNode; active: boolean; onClick: () => void }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${active
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
        >
            {children}
        </Link>
    )
}
