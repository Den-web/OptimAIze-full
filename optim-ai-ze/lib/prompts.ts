export interface Prompt {
  id: string
  name: string
  description: string
  content: string
  category: 'development' | 'analysis' | 'optimization' | 'documentation' | 'general'
}

export const prompts: Prompt[] = [
  {
    id: 'optimize-nextjs',
    name: 'Next.js Optimization',
    description: 'Optimize Next.js application performance',
    content: `Analyze this Next.js code/component for:
- Server vs Client components usage
- Data fetching patterns
- Image optimization
- Route optimization
- Bundle size reduction
- Caching strategies
Provide specific Next.js-focused improvements.`,
    category: 'optimization'
  },
  {
    id: 'supabase-integration',
    name: 'Supabase Integration',
    description: 'Review and improve Supabase implementation',
    content: `Review Supabase integration focusing on:
- Authentication flow
- Database schema
- Real-time subscriptions
- Edge functions usage
- Security rules
- Query optimization
Suggest specific improvements for Supabase usage.`,
    category: 'development'
  },
  {
    id: 'ai-prompt-enhance',
    name: 'AI Prompt Engineering',
    description: 'Improve AI prompt effectiveness',
    content: `Enhance this AI prompt considering:
- Clarity and specificity
- Context inclusion
- Desired output format
- Edge cases handling
- Error prevention
- Response quality
Provide specific prompt improvements.`,
    category: 'optimization'
  },
  {
    id: 'typescript-check',
    name: 'TypeScript Review',
    description: 'Review TypeScript implementation and types',
    content: `Review TypeScript code focusing on:
- Type safety
- Interface definitions
- Generic usage
- Type inference
- Error handling
- Best practices
Suggest specific TypeScript improvements.`,
    category: 'development'
  },
  {
    id: 'component-review',
    name: 'UI Component Review',
    description: 'Review and improve React components',
    content: `Analyze React component for:
- Component structure
- Props interface
- State management
- Performance optimization
- Reusability
- Accessibility
Provide specific component improvements.`,
    category: 'development'
  },
  {
    id: 'api-route-check',
    name: 'API Route Review',
    description: 'Review and optimize API routes',
    content: `Review API route implementation:
- Error handling
- Input validation
- Response formatting
- Performance optimization
- Security measures
- Edge function usage
Suggest specific API improvements.`,
    category: 'development'
  },
  {
    id: 'auth-flow-review',
    name: 'Auth Flow Review',
    description: 'Review authentication implementation',
    content: `Analyze authentication flow for:
- Security best practices
- User experience
- Error handling
- Session management
- Protected routes
- Edge cases
Provide specific auth flow improvements.`,
    category: 'analysis'
  },
  {
    id: 'state-management',
    name: 'State Management Review',
    description: 'Review state management implementation',
    content: `Review state management focusing on:
- Zustand store structure
- State updates
- Performance impact
- Data persistence
- Error handling
- State synchronization
Suggest specific state management improvements.`,
    category: 'development'
  }
]

export const getPromptById = (id: string): Prompt | undefined => {
  return prompts.find(prompt => prompt.id === id)
}

export const getPromptsByCategory = (category: Prompt['category']): Prompt[] => {
  return prompts.filter(prompt => prompt.category === category)
} 