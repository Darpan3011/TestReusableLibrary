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
    <div className="relative flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Left Column: Hero Section */}
      <div className="w-full lg:w-5/12 xl:w-1/3 flex flex-col lg:h-screen lg:sticky lg:top-0 justify-center relative pt-16 pb-16 lg:py-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl lg:shadow-none z-10">
        <main className="mx-auto max-w-md px-6 text-center lg:text-left">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 text-sm font-semibold mb-6 shadow-sm border border-primary-200 dark:border-primary-800">
            👋 Welcome to my portfolio
          </div>
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
            <span className="block">Darpan's</span>{' '}
            <span className="block text-primary-600 mt-2">Core Modules</span>
          </h1>
          
          <div className="mt-6 w-16 h-1.5 bg-primary-500 mx-auto lg:mx-0 rounded-full"></div>
          
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
          
          {/* Decorative Elements */}
          <div className="mt-12 flex justify-center lg:justify-start gap-4 text-gray-400 dark:text-gray-500">
             <a href="#" className="hover:text-primary-600 transition-colors" aria-label="GitHub">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
             </a>
             <a href="#" className="hover:text-primary-600 transition-colors" aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
             </a>
          </div>
        </main>
      </div>

      {/* Right Column: Features Section */}
      <div className="w-full lg:w-7/12 xl:w-2/3 flex flex-col py-12 lg:py-16 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="text-center lg:text-left mb-10">
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
    </div>
  )
}
