import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LinguaLearn - Language Learning App',
    short_name: 'LinguaLearn',
    description: 'Learn languages with fun, bite-sized lessons',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6366F1',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
    categories: ['education', 'lifestyle'],
    shortcuts: [
      {
        name: 'Lessons',
        short_name: 'Lessons',
        description: 'Continue learning',
        url: '/lesson/1',
        icons: [{ src: '/logo.svg', sizes: '192x192' }],
      },
      {
        name: 'Practice',
        short_name: 'Practice',
        description: 'Practice skills',
        url: '/practice',
        icons: [{ src: '/logo.svg', sizes: '192x192' }],
      },
    ],
  }
}

