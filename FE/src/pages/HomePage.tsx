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
      description: [
        'OAuth2 and JWT token-based authentication',
        'Two-Factor Authentication (MFA) support',
        'Secure user profile management',
        'Robust API rate limiting',
        'Enterprise-grade security protocols'
      ],
      link: '/profile',
      modules: ['darpan-security-starter', 'rate-limiter-core'],
      apis: ['/auth/*', '/profile/*']
    },
    {
      icon: '💬',
      title: 'SMS Integration',
      description: [
        'Multi-provider SMS support',
        'Twilio, AWS SNS, MessageBird integration',
        'Seamless message delivery',
        'Provider failover support',
        'Real-time delivery tracking'
      ],
      link: '/sms',
      modules: ['darpan-communication-starter'],
      apis: ['/smpp/*']
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: [
        'Natural language to SQL conversion',
        'Database query assistance',
        'Intelligent question answering',
        'Schema-aware responses',
        'Developer-friendly interface'
      ],
      link: '/ai',
      modules: ['darpan-ai-database-agent'],
      apis: ['/aidb/*']
    },
    {
      icon: '📧',
      title: 'Email Service',
      description: [
        'Multipart email with attachments',
        'Simple and intuitive API',
        'Template support',
        'Bulk email capabilities',
        'Delivery status tracking'
      ],
      link: '/email/multiple',
      modules: ['darpan-communication-starter'],
      apis: ['/email/test/*']
    }
  ]

  const stats = [
    { value: '4+', label: 'Production-Ready Modules' },
    { value: '100%', label: 'Type-Safe Code' },
    { value: 'OAuth2', label: 'Enterprise Security' },
    { value: 'RESTful', label: 'Modern APIs' }
  ]

  const techStack = [
    'Java 17+', 'Spring Boot', 'Microservices', 'OAuth2/JWT', 
    'PostgreSQL', 'MySQL', 'Redis'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Core Modules
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore the collection of reusable libraries designed to accelerate your development workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            isAuthenticated ? (
              <Link key={index} to={feature.link} className="block h-full">
                <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col h-full cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="p-6 flex flex-col h-full">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <ul className="text-gray-600 dark:text-gray-400 flex-grow mb-6 leading-relaxed space-y-2">
                      {feature.description.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-primary-500 mr-2 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto space-y-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">API Endpoints:</span>
                        <div className="flex flex-wrap gap-2">
                          {feature.apis.map((api, idx) => (
                            <code key={idx} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-900 text-sm font-mono text-primary-700 dark:text-primary-300 border border-gray-200 dark:border-gray-700">
                              {api}
                            </code>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {feature.modules.map((mod, idx) => (
                          <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-100 to-blue-100 text-primary-800 dark:from-primary-900 dark:to-blue-900 dark:text-primary-200 border border-primary-200 dark:border-primary-700">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ) : (
              <Card key={index} className="flex flex-col h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-6 flex flex-col h-full">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <ul className="text-gray-600 dark:text-gray-400 flex-grow mb-6 leading-relaxed space-y-2">
                    {feature.description.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary-500 mr-2 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto space-y-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">API Endpoints:</span>
                      <div className="flex flex-wrap gap-2">
                        {feature.apis.map((api, idx) => (
                          <code key={idx} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-900 text-sm font-mono text-primary-700 dark:text-primary-300 border border-gray-200 dark:border-gray-700">
                            {api}
                          </code>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {feature.modules.map((mod, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-100 to-blue-100 text-primary-800 dark:from-primary-900 dark:to-blue-900 dark:text-primary-200 border border-primary-200 dark:border-primary-700">
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

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:shadow-xl transition-shadow">
              <div className="text-3xl lg:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Built for <span className="text-primary-600 dark:text-primary-400">Production</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Each module in this collection has been designed and tested for real-world enterprise applications. 
                These aren't just code samples—they're battle-tested components that handle authentication, 
                communication, AI integration, and more with enterprise-grade reliability.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                The focus is on reusability, security, and developer experience. Every module follows 
                best practices for microservices architecture and can be easily integrated into existing systems.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Technology Stack</h3>
              <div className="flex flex-wrap gap-3">
                {techStack.map((tech, index) => (
                  <span key={index} className="px-4 py-2 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium border border-primary-200 dark:border-primary-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl p-8 lg:p-12 text-center shadow-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Explore?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Sign up to get full access to all modules and see the reusable libraries in action
            </p>
            <Link to="/register">
              <Button className="px-8 py-4 text-lg font-semibold bg-primary-500 text-white hover:bg-primary-700 shadow-xl transition-all">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Floating Arrow Popup pointing to the top right corner for API Tracking */}
      <div className="hidden lg:flex fixed top-[40vh] right-12 z-[9000] flex-col items-center pointer-events-none animate-bounce">
        <svg className="w-8 h-8 text-primary-500 mb-1 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
        <div className="bg-primary-600 text-white p-3 rounded-xl shadow-lg shadow-primary-500/40 relative max-w-[220px] text-center">
          <p className="text-sm font-bold leading-tight mb-1">Live API Tracking</p>
          <p className="text-xs font-medium text-primary-100 leading-snug">Watch here to see which custom module powers your interactions!</p>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary-600 rotate-45 rounded-sm"></div>
        </div>
      </div>
    </div>
  )
}
