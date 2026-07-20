import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuth } from '../auth/AuthContext'

export function HomePage() {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: '👤',
      title: 'Authentication & Security',
      description: 'Secure user management with OAuth2, JWT, and Two-Factor Authentication (MFA). Includes robust API rate limiting.',
      link: '/profile',
      modules: ['darpan-security-starter', 'rate-limiter-core'],
      apis: ['/auth/*', '/profile/*']
    },
    {
      icon: '💬',
      title: 'SMS Integration',
      description: 'Send SMS messages seamlessly through multiple providers including Twilio, AWS SNS, and MessageBird.',
      link: '/sms',
      modules: ['darpan-communication-starter'],
      apis: ['/smpp/*']
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Interact with an intelligent AI that can answer database questions and generate SQL queries from natural language.',
      link: '/ai',
      modules: ['darpan-ai-database-agent'],
      apis: ['/aidb/*']
    },
    {
      icon: '📧',
      title: 'Email Service',
      description: 'Send emails with attachments using a simple and intuitive interface with multipart support.',
      link: '/email/multiple',
      modules: ['darpan-communication-starter'],
      apis: ['/email/test/*']
    }
  ]

  return (
    <div className="relative flex flex-col lg:flex-row bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Left Column: Hero Section */}
      <div className="w-full lg:w-5/12 xl:w-1/3 flex flex-col relative p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 z-10">
        <main className="mx-auto max-w-md w-full text-center lg:text-left">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl">
            <span className="block">Darpan's</span>{' '}
            <span className="block text-primary-600 mt-2">Core Modules</span>
          </h1>
          
          <p className="mt-6 text-base text-gray-600 dark:text-gray-400 sm:text-lg leading-relaxed">
            A technical showcase of my custom-built Java microservices and libraries. Each module is designed to be highly scalable, secure, and easily integrated across modern architectures.
          </p>

          {!isAuthenticated && (
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register" className="w-full sm:w-auto">
                <Button className="w-full flex items-center justify-center px-6 py-3 text-base font-medium shadow-md hover:shadow-lg transition-all">
                  Get Started
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full flex items-center justify-center px-6 py-3 text-base font-medium shadow-sm hover:shadow transition-all bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Right Column: Features Section */}
      <div className="w-full lg:w-7/12 xl:w-2/3 flex flex-col p-8 lg:p-12 bg-gray-50 dark:bg-gray-900/50">
        <div className="w-full mx-auto">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Powerful Features
            </h2>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              Everything you need to build modern applications
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {features.map((feature, index) => (
              isAuthenticated ? (
                <Link key={index} to={feature.link} className="block h-full">
                  <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex flex-col h-full cursor-pointer">
                    <div className="text-center lg:text-left flex flex-col h-full">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow mb-4">
                        {feature.description}
                      </p>
                      <div className="mt-auto space-y-3">
                        <div className="flex flex-col lg:items-start items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-semibold uppercase tracking-wider">APIs:</span>
                          <div className="flex flex-wrap lg:justify-start justify-center gap-1">
                            {feature.apis.map((api, idx) => (
                              <code key={idx} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{api}</code>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap lg:justify-start justify-center gap-2">
                          {feature.modules.map((mod, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                              {mod}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card key={index} className="flex flex-col h-full">
                  <div className="text-center lg:text-left flex flex-col h-full">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow mb-4">
                      {feature.description}
                    </p>
                    <div className="mt-auto space-y-3">
                      <div className="flex flex-col lg:items-start items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-semibold uppercase tracking-wider">APIs:</span>
                        <div className="flex flex-wrap lg:justify-start justify-center gap-1">
                          {feature.apis.map((api, idx) => (
                            <code key={idx} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{api}</code>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap lg:justify-start justify-center gap-2">
                        {feature.modules.map((mod, idx) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Floating Arrow Popup pointing to the top right corner for API Tracking */}
      <div className="hidden lg:flex fixed top-32 right-12 z-[9000] flex-col items-center pointer-events-none animate-bounce">
        <svg className="w-8 h-8 text-primary-500 mb-1 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
        <div className="bg-primary-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-primary-500/40 text-sm font-bold relative">
          Watch for live API calls here!
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary-600 rotate-45 rounded-sm"></div>
        </div>
      </div>
    </div>
  )
}
