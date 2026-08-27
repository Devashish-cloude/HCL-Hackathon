import api from './api.js';
import { Course } from '../types/index.js';

export const allCoursesDetailed: Course[] = [
  {
    id: 'c-1',
    title: 'JavaScript Async Programming',
    slug: 'js-async-programming',
    description:
      'Master Promises, async/await, and event loops to handle complex data fetching, microtasks, and asynchronous streaming in modern web apps.',
    category: 'Frontend',
    difficulty: 'Intermediate',
    durationMinutes: 240,
    isFeatured: true,
    isRecommended: true,
    modules: [
      {
        id: 'mod-js-1',
        title: 'Event Loop & Call Stack',
        description: 'Understanding the JavaScript single-threaded concurrency model and task queues.',
        order: 1,
        estimatedMinutes: 45,
        totalLessons: 3,
        lessons: [
          {
            id: 'l-js-1',
            title: 'How JavaScript Executes Code: Call Stack & Web APIs',
            type: 'VIDEO',
            durationMinutes: 15,
            order: 1,
            content:
              'JavaScript is a single-threaded, non-blocking asynchronous concurrent runtime. When executing code, synchronous instructions are pushed onto the Call Stack and executed immediately (LIFO).\n\nWhen asynchronous operations like `fetch()`, `setTimeout()`, or DOM events are invoked, they are delegated to the Browser Web APIs thread pool, freeing the main thread to remain responsive at 60 FPS.',
          },
          {
            id: 'l-js-2',
            title: 'Microtask Queue vs Macrotask Queue',
            type: 'READING',
            durationMinutes: 15,
            order: 2,
            content:
              'The Event Loop continuously inspects the Call Stack. When the Call Stack is completely empty, it processes tasks in this strict priority order:\n\n1. **Microtask Queue**: Promises (`.then()`, `.catch()`, `.finally()`), `queueMicrotask()`, and `MutationObserver`.\n2. **Render Phase**: Browser style recalculation, layout, and repaint.\n3. **Macrotask Queue**: `setTimeout`, `setInterval`, `setImmediate`, I/O operations.\n\nAll microtasks are drained to completion before the next macrotask is allowed to run.',
          },
          {
            id: 'l-js-3',
            title: 'Event Loop & Task Scheduling Challenge',
            type: 'CODING_CHALLENGE',
            durationMinutes: 15,
            order: 3,
            content:
              'Write a function that uses `queueMicrotask` to schedule high-priority background computations without blocking the UI rendering cycle.',
            codeSnippet: `function scheduleImmediateMicrotask(callback) {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(callback);
  } else {
    Promise.resolve().then(callback);
  }
}

// Test invocation:
scheduleImmediateMicrotask(() => {
  console.log("Executed before next macrotask!");
});`,
          },
        ],
      },
      {
        id: 'mod-js-2',
        title: 'Promises & Chaining',
        description: 'Managing deferred computation states, error propagation, and chain linking.',
        order: 2,
        estimatedMinutes: 50,
        totalLessons: 3,
        lessons: [
          {
            id: 'l-js-4',
            title: 'Promise States and Lifecycle Handlers',
            type: 'VIDEO',
            durationMinutes: 15,
            order: 1,
            content:
              'A Promise is an object representing the eventual completion (or failure) of an asynchronous operation. It resides in one of 3 mutually exclusive states:\n- **Pending**: Initial state before resolution.\n- **Fulfilled**: Resolved successfully with a resultant value.\n- **Rejected**: Failed with an error reason.',
          },
          {
            id: 'l-js-5',
            title: 'Error Bubbling and Chaining Guarantees',
            type: 'READING',
            durationMinutes: 15,
            order: 2,
            content:
              'In a Promise chain, any unhandled rejection propagates down the chain until it encounters a `.catch()` handler. Always return values inside `.then()` callbacks to pass data to the next step, and always attach a terminal `.catch()` or `.finally()` to clean up loaders or memory allocations.',
          },
          {
            id: 'l-js-6',
            title: 'Refactor Nested Callbacks to Promises',
            type: 'CODING_CHALLENGE',
            durationMinutes: 20,
            order: 3,
            content:
              'Convert this legacy callback-hell pattern into a clean, chained Promise pipeline with unified error handling.',
            codeSnippet: `function fetchUserProfile(userId) {
  return fetch(\`/api/users/\${userId}\`)
    .then(res => {
      if (!res.ok) throw new Error("User not found");
      return res.json();
    })
    .then(user => fetch(\`/api/scores/\${user.id}\`))
    .then(res => res.json())
    .catch(err => {
      console.error("Pipeline failure:", err.message);
      return { fallback: true };
    });
}`,
          },
        ],
      },
      {
        id: 'mod-js-3',
        title: 'Async / Await Mastery',
        description: 'Synchronous-looking asynchronous syntax, try/catch boundaries, and concurrency.',
        order: 3,
        estimatedMinutes: 55,
        totalLessons: 2,
        lessons: [
          {
            id: 'l-js-7',
            title: 'Async/Await Under the Hood & Generators',
            type: 'READING',
            durationMinutes: 25,
            order: 1,
            content:
              '`async/await` is syntactic sugar built on top of ECMAScript Generators and Promises. An `async` function always returns a Promise. The `await` keyword suspends the execution of the async function generator until the promise settles, without blocking the browser thread.',
          },
          {
            id: 'l-js-8',
            title: 'Concurrent Execution with Promise.allSettled',
            type: 'CODING_CHALLENGE',
            durationMinutes: 30,
            order: 2,
            content:
              'Build a resilient multi-source data aggregator that fetches multiple endpoints simultaneously and returns successful responses even if some endpoints fail.',
            codeSnippet: `async function fetchAggregatedDashboard(endpoints) {
  const settled = await Promise.allSettled(
    endpoints.map(url => fetch(url).then(r => r.json()))
  );

  return settled.map((result, idx) => ({
    endpoint: endpoints[idx],
    status: result.status,
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason.message : null
  }));
}`,
          },
        ],
      },
    ],
  },
  {
    id: 'c-2',
    title: 'React Fundamentals & Modern Architecture',
    slug: 'react-fundamentals',
    description:
      'Master modern React 18, functional components, hooks, custom state management, Context, and performance optimization patterns.',
    category: 'Frontend',
    difficulty: 'Intermediate',
    durationMinutes: 360,
    isFeatured: true,
    isRecommended: true,
    modules: [
      {
        id: 'mod-react-1',
        title: 'Component Architecture & Props',
        description: 'JSX semantics, pure components, props immutability, and conditional rendering.',
        order: 1,
        estimatedMinutes: 50,
        totalLessons: 3,
        lessons: [
          {
            id: 'l-react-1',
            title: 'Declarative UI & Virtual DOM Reconciliation',
            type: 'VIDEO',
            durationMinutes: 15,
            order: 1,
            content:
              'React uses a declarative programming paradigm. You describe what the UI should look like for a given state, and React handles DOM mutations using Fiber reconciliation (diffing algorithm) with $O(n)$ heuristic comparison.',
          },
          {
            id: 'l-react-2',
            title: 'Component Composition over Inheritance',
            type: 'READING',
            durationMinutes: 15,
            order: 2,
            content:
              'In React, components can accept arbitrary props, including children elements and render props. Composition allows building flexible UI primitives like Modals, Cards, and Dropdowns with high reuse and separation of concerns.',
          },
          {
            id: 'l-react-3',
            title: 'Custom Generic Card Component Challenge',
            type: 'CODING_CHALLENGE',
            durationMinutes: 20,
            order: 3,
            content:
              'Build a reusable TypeScript React Card component with slot support for header, footer, and variant styling.',
            codeSnippet: `import React from 'react';

interface CardProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const ModernCard: React.FC<CardProps> = ({ title, badge, children, footer }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      {badge && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">{badge}</span>}
    </div>
    <div className="text-sm text-slate-600 dark:text-slate-300">{children}</div>
    {footer && <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">{footer}</div>}
  </div>
);`,
          },
        ],
      },
      {
        id: 'mod-react-2',
        title: 'Hooks Mastery (useState, useEffect, useMemo)',
        description: 'Reactive state lifecycles, synchronization with external systems, and memoization.',
        order: 2,
        estimatedMinutes: 60,
        totalLessons: 3,
        lessons: [
          {
            id: 'l-react-4',
            title: 'The Rules of Hooks & State Batching',
            type: 'VIDEO',
            durationMinutes: 20,
            order: 1,
            content:
              'In React 18, automatic batching combines multiple state updates into a single render pass, whether inside promises, timeouts, or native event handlers. Hooks must never be called conditionally or within nested loops.',
          },
          {
            id: 'l-react-5',
            title: 'Managing Side Effects & AbortControllers in useEffect',
            type: 'READING',
            durationMinutes: 20,
            order: 2,
            content:
              '`useEffect` synchronizes your component with non-React widgets, network requests, or subscriptions. Always return a cleanup function from your effect to cancel pending network requests using `AbortController` and prevent memory leaks.',
          },
          {
            id: 'l-react-6',
            title: 'Custom useDebounce Hook Implementation',
            type: 'CODING_CHALLENGE',
            durationMinutes: 20,
            order: 3,
            content: 'Implement a type-safe `useDebounce` hook that delays updating a state value until after a specified delay.',
            codeSnippet: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`,
          },
        ],
      },
    ],
  },
  {
    id: 'c-3',
    title: 'APIs & Fetch',
    slug: 'apis-and-fetch',
    description:
      'Master HTTP methods, RESTful resource design, authentication headers, response streaming, and error handling.',
    category: 'Frontend',
    difficulty: 'Beginner',
    durationMinutes: 180,
    isFeatured: false,
    isRecommended: true,
    modules: [
      {
        id: 'mod-api-1',
        title: 'REST Architecture & HTTP Semantics',
        description: 'Understanding verbs, status codes, headers, and payload formats.',
        order: 1,
        estimatedMinutes: 45,
        totalLessons: 2,
        lessons: [
          {
            id: 'l-api-1',
            title: 'HTTP Methods: GET, POST, PUT, PATCH, DELETE',
            type: 'READING',
            durationMinutes: 20,
            order: 1,
            content:
              'REST (Representational State Transfer) treats server data as addressable resources. Idempotent methods (GET, PUT, DELETE) produce the same outcome on repeat executions without side effects, while POST creates new entities.',
          },
          {
            id: 'l-api-2',
            title: 'HTTP Status Codes and Error Resilience',
            type: 'VIDEO',
            durationMinutes: 25,
            order: 2,
            content:
              'Explore 2xx (Success), 3xx (Redirect), 4xx (Client errors like 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found), and 5xx (Server errors like 500 Internal Server Error, 503 Service Unavailable).',
          },
        ],
      },
      {
        id: 'mod-api-2',
        title: 'Modern Fetch API & Axios Client',
        description: 'Writing clean API clients with interceptors, timeouts, and authorization bearer tokens.',
        order: 2,
        estimatedMinutes: 50,
        totalLessons: 2,
        lessons: [
          {
            id: 'l-api-3',
            title: 'Fetch vs Axios: Headers, Interceptors, and JSON Parsing',
            type: 'READING',
            durationMinutes: 25,
            order: 1,
            content:
              'Native `fetch()` does not reject on 404 or 500 status codes (it only rejects on network failure). You must inspect `res.ok`. Axios automatically rejects non-2xx status codes and provides request/response interceptors.',
          },
          {
            id: 'l-api-4',
            title: 'Build a Resilient API Client with Interceptors',
            type: 'CODING_CHALLENGE',
            durationMinutes: 25,
            order: 2,
            content: 'Write an Axios client that automatically attaches Bearer tokens and handles token expiration gracefully.',
            codeSnippet: `import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.learnpath.ai/v1',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});`,
          },
        ],
      },
    ],
  },
  {
    id: 'c-4',
    title: 'Advanced Asynchronous Patterns in JS',
    slug: 'advanced-async-patterns',
    description:
      'Focus on Promises, Async/Await under the hood, event emitters, worker threads, and handling complex race conditions.',
    category: 'Frontend',
    difficulty: 'Advanced',
    durationMinutes: 240,
    isFeatured: true,
    isRecommended: true,
    modules: [
      {
        id: 'mod-adv-1',
        title: 'Concurrency & Race Condition Mitigation',
        description: 'Preventing stale closures, outdated responses, and managing request cancellation.',
        order: 1,
        estimatedMinutes: 60,
        totalLessons: 2,
        lessons: [
          {
            id: 'l-adv-1',
            title: 'Handling Async Race Conditions in Search Autocomplete',
            type: 'READING',
            durationMinutes: 30,
            order: 1,
            content:
              'When users rapidly type into search inputs, earlier network requests may return AFTER later requests, overwriting newer search results. Solve this with `AbortController` or sequence IDs.',
          },
          {
            id: 'l-adv-2',
            title: 'Implement Async Queue with Rate Limiting',
            type: 'CODING_CHALLENGE',
            durationMinutes: 30,
            order: 2,
            content: 'Create an asynchronous task queue that limits concurrency to a maximum of $N$ parallel executions.',
            codeSnippet: `class AsyncQueue {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  async add(task) {
    if (this.running >= this.concurrency) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    this.running++;
    try {
      return await task();
    } finally {
      this.running--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        next();
      }
    }
  }
}`,
          },
        ],
      },
    ],
  },
  {
    id: 'c-5',
    title: 'Modern CSS & Responsive Design',
    slug: 'modern-css-design',
    description:
      'Master CSS Grid, Flexbox, Container Queries, CSS Variables, dark mode palettes, and fluid typography.',
    category: 'Frontend',
    difficulty: 'Beginner',
    durationMinutes: 180,
    isFeatured: false,
    isRecommended: false,
    modules: [
      {
        id: 'mod-css-1',
        title: 'Flexbox & CSS Grid Layouts',
        description: 'One-dimensional vs two-dimensional responsive layouts without media query bloat.',
        order: 1,
        estimatedMinutes: 50,
        totalLessons: 2,
        lessons: [
          {
            id: 'l-css-1',
            title: 'Flexbox Axes, Alignment, and Shorthands',
            type: 'READING',
            durationMinutes: 25,
            order: 1,
            content:
              'Flexbox controls 1D distribution along the Main and Cross axes. Use `gap`, `justify-content`, `align-items`, and `flex: 1 1 auto` for responsive layouts.',
          },
          {
            id: 'l-css-2',
            title: 'Auto-Fit & MinMax in CSS Grid',
            type: 'CODING_CHALLENGE',
            durationMinutes: 25,
            order: 2,
            content: 'Create a responsive auto-wrapping grid that requires zero media queries.',
            codeSnippet: `.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}`,
          },
        ],
      },
    ],
  },
  {
    id: 'c-6',
    title: 'Node.js & Express REST APIs',
    slug: 'nodejs-express-apis',
    description:
      'Backend engineering with Node.js, Express middleware, authentication, Prisma ORM, and PostgreSQL relations.',
    category: 'Backend',
    difficulty: 'Intermediate',
    durationMinutes: 300,
    isFeatured: true,
    isRecommended: false,
    modules: [
      {
        id: 'mod-node-1',
        title: 'Express Server & Middleware Architecture',
        description: 'Request pipelines, error handling middleware, and route modularization.',
        order: 1,
        estimatedMinutes: 60,
        totalLessons: 2,
        lessons: [
          {
            id: 'l-node-1',
            title: 'Express Request Pipeline & Middleware Next Chain',
            type: 'READING',
            durationMinutes: 30,
            order: 1,
            content:
              'Express executes middleware sequentially. Calling `next()` transfers control to the next middleware. Calling `next(err)` bypasses normal middleware and jumps straight to the 4-argument error handler `(err, req, res, next)`.',
          },
          {
            id: 'l-node-2',
            title: 'JWT Authentication Middleware Challenge',
            type: 'CODING_CHALLENGE',
            durationMinutes: 30,
            order: 2,
            content: 'Write a robust JWT authentication middleware that validates Bearer tokens and attaches the user payload to the request object.',
            codeSnippet: `import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token missing' });
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};`,
          },
        ],
      },
    ],
  },
];

export const courseService = {
  async getCourses(params?: { category?: string; search?: string }): Promise<{ success: boolean; data: Course[] }> {
    try {
      const res = await api.get<{ success: boolean; data: Course[] }>('/courses', { params });
      if (res.data && res.data.success && res.data.data.length > 0) {
        return res.data;
      }
      return { success: true, data: allCoursesDetailed };
    } catch (error) {
      let filtered = allCoursesDetailed;
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
      const match = allCoursesDetailed.find((c) => c.slug === slug || c.id === slug) || allCoursesDetailed[0];
      return { success: true, data: match };
    } catch (error) {
      const match = allCoursesDetailed.find((c) => c.slug === slug || c.id === slug) || allCoursesDetailed[0];
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
