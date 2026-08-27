import api from './api.js';
import { Course } from '../types/index.js';

export const allCoursesDetailed: Course[] = [
  {
    id: 'c-ai-1',
    title: 'Python & Machine Learning Foundations',
    slug: 'python-ml-foundations',
    description:
      'Master linear algebra, PyTorch tensors, neural network backpropagation, and transformer attention mechanisms from mathematical primitives to GPU acceleration.',
    category: 'AI & Systems',
    difficulty: 'Intermediate',
    durationMinutes: 240,
    isFeatured: true,
    isRecommended: true,
    modules: [
      {
        id: 'mod-ai-1',
        title: 'Linear Algebra & Tensor Operations',
        description: 'Matrix multiplication, eigenvalues, broadcasting, and GPU tensor allocations in PyTorch.',
        order: 1,
        estimatedMinutes: 50,
        totalLessons: 3,
        lessons: [
          {
            id: 'l-ai-1',
            title: 'Tensors, Dimensions & GPU Allocation',
            type: 'VIDEO',
            durationMinutes: 15,
            order: 1,
            content:
              'In deep learning, a Tensor is a multidimensional array with hardware acceleration support. PyTorch allows moving computational graphs seamlessly between CPU and CUDA devices (`tensor.to("cuda")`).',
          },
          {
            id: 'l-ai-2',
            title: 'Vector Broadcasting & Dot Product Semantics',
            type: 'READING',
            durationMinutes: 15,
            order: 2,
            content:
              'Broadcasting allows element-wise operations on arrays of different shapes without copying data in memory. The trailing dimensions must either match or one of them must be 1.',
          },
          {
            id: 'l-ai-3',
            title: 'PyTorch Tensor Manipulation Challenge',
            type: 'CODING_CHALLENGE',
            durationMinutes: 20,
            order: 3,
            content:
              'Implement a batch matrix multiplier with dimensional reshaping and cosine similarity calculation.',
            codeSnippet: `import torch
import torch.nn.functional as F

def batch_cosine_similarity(tensor_a, tensor_b):
    # Normalize embeddings along feature dimension
    norm_a = F.normalize(tensor_a, p=2, dim=-1)
    norm_b = F.normalize(tensor_b, p=2, dim=-1)
    
    # Compute similarity matrix: (Batch, N) x (Batch, N)^T
    return torch.matmul(norm_a, norm_b.transpose(-1, -2))

# Test verification:
a = torch.randn(2, 4)
b = torch.randn(2, 4)
sim = batch_cosine_similarity(a, b)
print("Computed similarity matrix shape:", sim.shape)`,
          },
        ],
      },
      {
        id: 'mod-ai-2',
        title: 'Neural Networks & Backpropagation',
        description: 'Computational graphs, Autograd engine, activation functions (ReLU/GELU), and SGD/Adam optimizers.',
        order: 2,
        estimatedMinutes: 60,
        totalLessons: 3,
        lessons: [
          {
            id: 'l-ai-4',
            title: 'Forward Pass & Autograd Computation Graph',
            type: 'VIDEO',
            durationMinutes: 20,
            order: 1,
            content:
              'PyTorch Autograd records all tensor operations during the forward pass to build a directed acyclic graph (DAG). Calling `.backward()` computes partial derivatives using the multivariate chain rule.',
          },
          {
            id: 'l-ai-5',
            title: 'Cross-Entropy Loss & Softmax Mechanics',
            type: 'READING',
            durationMinutes: 20,
            order: 2,
            content:
              'Softmax transforms unnormalized logits into a categorical probability distribution. Cross-entropy loss measures the divergence between predicted probabilities and target one-hot distributions.',
          },
          {
            id: 'l-ai-6',
            title: 'Build a Multi-Layer Perceptron (MLP)',
            type: 'CODING_CHALLENGE',
            durationMinutes: 20,
            order: 3,
            content:
              'Build a 3-layer PyTorch neural network module with GELU activations and dropout regularization.',
            codeSnippet: `import torch.nn as nn

class FeedForwardMLP(nn.Module):
    def __init__(self, in_features=128, hidden_dim=512, out_features=10):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, hidden_dim),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(hidden_dim, out_features)
        )

    def forward(self, x):
        return self.net(x)`,
          },
        ],
      },
    ],
  },
  {
    id: 'c-ai-2',
    title: 'Vector Databases & RAG Pipelines',
    slug: 'vector-dbs-rag',
    description:
      'Build production Retrieval-Augmented Generation (RAG) pipelines with embedding chunking, vector indexing (HNSW), cosine reranking, and LLM context injection.',
    category: 'AI & Systems',
    difficulty: 'Advanced',
    durationMinutes: 210,
    isFeatured: true,
    isRecommended: true,
    modules: [
      {
        id: 'mod-rag-1',
        title: 'Chunking & Embedding Generation',
        description: 'Semantic chunking strategies, dense embeddings, and token limits.',
        order: 1,
        estimatedMinutes: 50,
        totalLessons: 2,
        lessons: [
          {
            id: 'l-rag-1',
            title: 'Semantic Window Chunking & Overlap',
            type: 'READING',
            durationMinutes: 25,
            order: 1,
            content:
              'Fixed character chunking often fractures context across sentence boundaries. Semantic chunking uses NLP sentence splitters with 10-15% sliding window overlap to maintain discourse coherence.',
          },
          {
            id: 'l-rag-2',
            title: 'Vector Similarity Indexing Challenge',
            type: 'CODING_CHALLENGE',
            durationMinutes: 25,
            order: 2,
            content: 'Implement a top-K semantic retriever with score thresholding.',
            codeSnippet: `function retrieveTopK(queryEmbedding, documentVectors, topK = 3) {
  return documentVectors
    .map(doc => ({
      ...doc,
      score: cosineSimilarity(queryEmbedding, doc.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}`,
          },
        ],
      },
    ],
  },
  {
    id: 'c-fs-1',
    title: 'Full Stack TypeScript Architecture',
    slug: 'fullstack-typescript',
    description:
      'End-to-end full stack development with React, Node.js, TypeScript, PostgreSQL, and Docker containerization.',
    category: 'Full Stack',
    difficulty: 'Intermediate',
    durationMinutes: 280,
    isFeatured: true,
    isRecommended: true,
    modules: [
      {
        id: 'mod-fs-1',
        title: 'Monorepo Architecture & Shared Schemas',
        description: 'Sharing interfaces, Zod validation models, and DTOs across frontend and backend.',
        order: 1,
        estimatedMinutes: 50,
        totalLessons: 2,
        lessons: [
          {
            id: 'l-fs-1',
            title: 'End-to-End Type Safety Principles',
            type: 'READING',
            durationMinutes: 25,
            order: 1,
            content:
              'In modern full stack TypeScript, data schemas are defined once using schema validators (like Zod or Prisma) and inferred directly into React frontend states and Express request payloads.',
          },
          {
            id: 'l-fs-2',
            title: 'Shared Zod Validation Pipeline Challenge',
            type: 'CODING_CHALLENGE',
            durationMinutes: 25,
            order: 2,
            content: 'Write a shared request schema that validates user profile input across both client and API.',
            codeSnippet: `import { z } from 'zod';

export const UserRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  targetRole: z.enum(['Frontend', 'Backend', 'AI & Systems', 'Full Stack']),
  dailyGoalMinutes: z.number().min(15).max(180).default(45)
});

export type UserRegistrationDTO = z.infer<typeof UserRegistrationSchema>;`,
          },
        ],
      },
    ],
  },
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
              'JavaScript is a single-threaded, non-blocking asynchronous concurrent runtime. Synchronous instructions are executed in the Call Stack (LIFO), while async operations are delegated to Browser Web APIs.',
          },
          {
            id: 'l-js-2',
            title: 'Microtask Queue vs Macrotask Queue',
            type: 'READING',
            durationMinutes: 15,
            order: 2,
            content:
              'Microtasks (Promises, queueMicrotask) are drained to completion before the browser renders and before the next Macrotask (setTimeout) runs.',
          },
          {
            id: 'l-js-3',
            title: 'Event Loop & Task Scheduling Challenge',
            type: 'CODING_CHALLENGE',
            durationMinutes: 15,
            order: 3,
            content:
              'Schedule high-priority background computations using queueMicrotask.',
            codeSnippet: `function scheduleImmediateMicrotask(callback) {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(callback);
  } else {
    Promise.resolve().then(callback);
  }
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
        totalLessons: 2,
        lessons: [
          {
            id: 'l-react-1',
            title: 'Declarative UI & Virtual DOM Reconciliation',
            type: 'VIDEO',
            durationMinutes: 20,
            order: 1,
            content:
              'React uses Fiber reconciliation to compute minimal DOM diffs and batch updates efficiently.',
          },
          {
            id: 'l-react-2',
            title: 'Custom Generic Card Component Challenge',
            type: 'CODING_CHALLENGE',
            durationMinutes: 30,
            order: 2,
            content: 'Build a reusable TypeScript React Card component with slot support.',
            codeSnippet: `import React from 'react';

export const ModernCard = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
    <div className="text-sm text-slate-600 dark:text-slate-300">{children}</div>
  </div>
);`,
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
              'Express middleware functions receive (req, res, next). Calling next() passes execution to the subsequent handler in the pipeline.',
          },
          {
            id: 'l-node-2',
            title: 'JWT Authentication Middleware Challenge',
            type: 'CODING_CHALLENGE',
            durationMinutes: 30,
            order: 2,
            content: 'Write a robust JWT authentication middleware that validates Bearer tokens.',
            codeSnippet: `import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
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
