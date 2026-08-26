import api from './api.js';
import { Course } from '../types/index.js';

const fallbackCourses: Course[] = [
  {
    id: 'c-1',
    title: 'JavaScript Async Programming',
    slug: 'js-async-programming',
    description:
      'Master Promises, async/await, and event loops to handle complex data fetching and asynchronous flows.',
    category: 'Frontend',
    difficulty: 'Intermediate',
    durationMinutes: 240,
    isFeatured: true,
    isRecommended: true,
    modules: [
      {
        id: 'mod-1',
        title: 'Event Loop & Call Stack',
        description: 'Understanding the JavaScript single-threaded concurrency model.',
        order: 1,
        estimatedMinutes: 45,
        totalLessons: 3,
        lessons: [
          {
            id: 'l-1',
            title: 'How JavaScript Executes Code',
            type: 'VIDEO',
            durationMinutes: 15,
            order: 1,
            content:
              'A deep dive into execution contexts, call stack push/pop mechanics, and browser web APIs.',
          },
          {
            id: 'l-2',
            title: 'Task Queue vs Microtask Queue',
            type: 'READING',
            durationMinutes: 15,
            order: 2,
            content:
              'Why Promise callbacks resolve before setTimeout callbacks, explained through the microtask queue.',
          },
          {
            id: 'l-3',
            title: 'Event Loop Knowledge Check',
            type: 'QUIZ',
            durationMinutes: 15,
            order: 3,
            content: 'Test your understanding of synchronous and asynchronous order.',
          },
        ],
      },
      {
        id: 'mod-2',
        title: 'Async / Await Mastery',
        description: 'Syntactic sugar with error handling and concurrency.',
        order: 2,
        estimatedMinutes: 50,
        totalLessons: 2,
        lessons: [
          {
            id: 'l-4',
            title: 'Async/Await Syntax Under The Hood',
            type: 'VIDEO',
            durationMinutes: 20,
            order: 1,
            content: 'Learn how async functions return promises without blocking the main thread.',
          },
          {
            id: 'l-5',
            title: 'Async Practice Challenge',
            type: 'CODING_CHALLENGE',
            durationMinutes: 20,
            order: 2,
            content: 'Implement a resilient API fetch pipeline with Promise.allSettled.',
          },
        ],
      },
    ],
  },
  {
    id: 'c-2',
    title: 'APIs & Fetch',
    slug: 'apis-and-fetch',
    description:
      'Recommended because you are currently learning asynchronous JavaScript. Learn REST, headers, and error handling.',
    category: 'Frontend',
    difficulty: 'Beginner',
    durationMinutes: 150,
    isFeatured: false,
    isRecommended: true,
  },
  {
    id: 'c-3',
    title: 'Advanced Asynchronous Patterns in JS',
    slug: 'advanced-async-patterns',
    description:
      'Focus on Promises, Async/Await under the hood, and handling complex race conditions.',
    category: 'Frontend',
    difficulty: 'Advanced',
    durationMinutes: 240,
    isFeatured: true,
    isRecommended: true,
  },
  {
    id: 'c-4',
    title: 'React Fundamentals & Modern Architecture',
    slug: 'react-fundamentals',
    description:
      'Master modern React with functional components, hooks, custom state management, and performance tuning.',
    category: 'Frontend',
    difficulty: 'Intermediate',
    durationMinutes: 360,
    isFeatured: true,
    isRecommended: false,
  },
];

export const courseService = {
  async getCourses(params?: { category?: string; search?: string }): Promise<{ success: boolean; data: Course[] }> {
    try {
      const res = await api.get<{ success: boolean; data: Course[] }>('/courses', { params });
      if (res.data && res.data.success && res.data.data.length > 0) {
        return res.data;
      }
      return { success: true, data: fallbackCourses };
    } catch (error) {
      let filtered = fallbackCourses;
      if (params?.category && params.category !== 'ALL') {
        filtered = filtered.filter((c) => c.category === params.category);
      }
      if (params?.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter((c) => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s));
      }
      return { success: true, data: filtered };
    }
  },

  async getCourseBySlug(slug: string): Promise<{ success: boolean; data: Course }> {
    try {
      const res = await api.get<{ success: boolean; data: Course }>(`/courses/${slug}`);
      if (res.data && res.data.success && res.data.data) {
        return res.data;
      }
      const match = fallbackCourses.find((c) => c.slug === slug || c.id === slug) || fallbackCourses[0];
      return { success: true, data: match };
    } catch (error) {
      const match = fallbackCourses.find((c) => c.slug === slug || c.id === slug) || fallbackCourses[0];
      return { success: true, data: match };
    }
  },

  async updateProgress(data: { moduleId: string; isCompleted: boolean }): Promise<{ success: boolean; data: any }> {
    try {
      const res = await api.post('/progress/lesson', data);
      return res.data;
    } catch (error) {
      return { success: true, data: { status: 'ok' } };
    }
  },
};
