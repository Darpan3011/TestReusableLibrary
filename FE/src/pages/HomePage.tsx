import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuth } from '../auth/AuthContext'

export function HomePage() {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: '👤',
      title: 'User Profile',
      description: 'Manage your account settings with support for both OAuth2 and JWT authentication. Enable two-factor authentication (MFA) for enhanced security.',
      link: '/profile'
    },
    {
      icon: '💬',
      title: 'SMS Integration',
      description: 'Send SMS messages through multiple providers including Twilio, AWS SNS, and MessageBird.',
      link: '/sms'
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Interact with an intelligent AI that can answer questions and generate SQL queries from natural language.',
      link: '/ai'
    },
    {
      icon: '📧',
      title: 'Email Service',
      description: 'Send emails with attachments using a simple and intuitive interface with multipart support.',
      link: '/email/multiple'
    }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-6 pb-16 sm:pb-24">
        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Welcome to</span>{' '}
              <span className="block text-primary-600 xl:inline">Reusable Modules</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A modern, secure platform built with React and Tailwind CSS.
              Explore AI-powered features, communication tools, and seamless integrations.
            </p>

            {!isAuthenticated && (
              <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center">
                <div className="rounded-md shadow">
                  <Link to="/register">
                    <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10">
                      Get Started
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link to="/login">
                    <Button variant="secondary" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Everything you need to build modern applications
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              isAuthenticated ? (
                <Link key={index} to={feature.link} className="block h-full">
                  <Card className="hover:shadow-xl hover:scale-105 transition-all duration-200 flex flex-col h-full cursor-pointer">
                    <div className="text-center flex flex-col h-full">
                      <div className="text-5xl mb-4">{feature.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card key={index} className="flex flex-col h-full">
                  <div className="text-center flex flex-col h-full">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              )
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-primary-600">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-primary-200">Create your account today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link to="/register">
                  <button className="inline-flex items-center justify-center px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10 border border-transparent rounded-lg bg-white text-primary-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200">
                    Get Started
                  </button>
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link to="/login">
                  <button className="inline-flex items-center justify-center px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10 border border-transparent rounded-lg bg-primary-700 text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
