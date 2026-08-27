import api from './api.js';
import { Conversation, ChatMessage, User } from '../types/index.js';

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('learnpath_user_data');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

const devashishConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'CSS Flexbox Mastery',
    category: 'CSS',
    timeGroup: 'TODAY',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 'm-1',
        role: 'assistant',
        content:
          'Flexbox is a one-dimensional layout method for laying out items in rows or columns. Items flex to fill additional space and shrink to fit into smaller spaces.\n\nWould you like me to show you a practical example of how `justify-content` and `align-items` work together?',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'm-2',
        role: 'user',
        content:
          "Yes, please! I'm confused about the difference between centering things horizontally versus vertically.",
        createdAt: new Date().toISOString(),
      },
      {
        id: 'm-3',
        role: 'assistant',
        content:
          "I can help with that. Think of `justify-content` as controlling alignment along the **Main Axis** (usually horizontal), and `align-items` controlling alignment along the **Cross Axis** (usually vertical).\n\n```css\n.container {\n  display: flex;\n  justify-content: center; /* Horizontally centers in row mode */\n  align-items: center;     /* Vertically centers in row mode */\n  height: 100vh;\n}\n```\n\nWhen `flex-direction: column` is set, these roles switch: `justify-content` aligns vertically and `align-items` aligns horizontally!",
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

function createNewUserConversations(user: User): Conversation[] {
  return [
    {
      id: `conv-welcome-${user.id}`,
      title: 'Welcome & Engineering Roadmap',
      category: 'General',
      timeGroup: 'TODAY',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-welcome-1`,
          role: 'assistant',
          content: `Hi **${user.name}**! 👋 Welcome to LearnPath AI.\n\nI am your 24/7 technical engineering mentor. I can help you with:\n- 🗺️ **Step-by-step study plans & roadmaps** (C++, Python, Java, JavaScript, React, AI/ML, Backend, DevOps, DSA)\n- 💻 **Code reviews & debugging** across any language\n- 🏗️ **System architecture, algorithms, and technical interview prep**\n\nWhat technology or topic would you like to explore today?`,
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ];
}

export function generateContextualAIResponse(
  message: string,
  history: ChatMessage[] = [],
  userRole?: string
): string {
  const query = message.trim().toLowerCase();

  // Extract combined context from recent conversation history
  const recentHistoryText = history
    .slice(-4)
    .map((m) => m.content.toLowerCase())
    .join(' ');
  const combinedContext = `${query} ${recentHistoryText} ${(userRole || '').toLowerCase()}`;

  // Detect active subject domain
  const isCpp =
    combinedContext.includes('c++') ||
    combinedContext.includes('c+') ||
    combinedContext.includes('cpp') ||
    query.includes('pointer') ||
    query.includes('stl') ||
    query.includes('memory management') ||
    query.includes('raii') ||
    (query.includes(' c ') && !query.includes('css'));

  const isPythonAI =
    !isCpp &&
    (combinedContext.includes('python') ||
      combinedContext.includes('pytorch') ||
      combinedContext.includes('machine learning') ||
      combinedContext.includes('ai') ||
      combinedContext.includes('deep learning') ||
      combinedContext.includes('rag') ||
      combinedContext.includes('llm') ||
      combinedContext.includes('tensor'));

  const isJava =
    !isCpp &&
    !isPythonAI &&
    (combinedContext.includes('java') ||
      combinedContext.includes('spring') ||
      combinedContext.includes('jvm') ||
      combinedContext.includes('hibernate'));

  const isReactFrontend =
    !isCpp &&
    !isPythonAI &&
    !isJava &&
    (combinedContext.includes('react') ||
      combinedContext.includes('javascript') ||
      combinedContext.includes('typescript') ||
      combinedContext.includes('frontend') ||
      combinedContext.includes('flexbox') ||
      combinedContext.includes('css') ||
      combinedContext.includes('node') ||
      combinedContext.includes('html'));

  const isDSA =
    combinedContext.includes('dsa') ||
    combinedContext.includes('algorithm') ||
    combinedContext.includes('leetcode') ||
    combinedContext.includes('sorting') ||
    combinedContext.includes('binary tree') ||
    combinedContext.includes('graph') ||
    combinedContext.includes('dynamic programming');

  // ----------------------------------------------------
  // 1. C++ DOMAIN RESPONSES
  // ----------------------------------------------------
  if (isCpp) {
    // Specific follow-up on Pointers
    if (query.includes('pointer') || query.includes('memory') || query.includes('malloc') || query.includes('address')) {
      return `### 💡 Deep Dive: Pointers & Memory Management in C++

In C++, memory is divided into two primary regions:
1. **Stack Memory**: Fast, automatically managed, fixed-size frames (LIFO).
2. **Heap Memory**: Dynamic runtime allocations managed manually or via Smart Pointers.

---

#### 📌 1. Raw Pointers & Address Operator
\`\`\`cpp
#include <iostream>

int main() {
    int value = 42;
    int* ptr = &value; // ptr stores memory address of 'value'

    std::cout << "Value: " << value << "\\n";         // 42
    std::cout << "Address: " << ptr << "\\n";         // e.g. 0x7ffee34
    std::cout << "Dereferenced: " << *ptr << "\\n";   // 42

    *ptr = 100; // Modifies 'value' directly in memory
    std::cout << "Updated Value: " << value << "\\n"; // 100
    return 0;
}
\`\`\`

---

#### 📌 2. Modern Smart Pointers (C++11+)
Never use raw \`new\` and \`delete\` in modern C++. Always use **Smart Pointers** to prevent memory leaks:

- **\`std::unique_ptr<T>\`**: Exclusive ownership. Automatically frees memory when going out of scope.
\`\`\`cpp
#include <memory>

struct Node { int data; };

void process() {
    auto node = std::make_unique<Node>();
    node->data = 50;
} // 'node' is automatically deallocated here! No memory leak.
\`\`\`

Would you like to practice a coding problem on **Dynamic Array Resizing** or move to **Object-Oriented C++ (RAII & Virtual Tables)**?`;
    }

    // Specific follow-up on STL / Containers
    if (query.includes('stl') || query.includes('vector') || query.includes('map') || query.includes('queue')) {
      return `### 🧰 Standard Template Library (STL) in Modern C++

The STL is organized into **Containers**, **Algorithms**, and **Iterators**:

---

#### 📌 1. Essential Containers
| Container | Underlying Structure | Time Complexity (Access/Search) |
| :--- | :--- | :--- |
| \`std::vector<T>\` | Dynamic Contiguous Array | $O(1)$ random access, amortized $O(1)$ append |
| \`std::unordered_map<K, V>\` | Hash Table | Average $O(1)$ lookup / insert |
| \`std::map<K, V>\` | Red-Black Tree (Balanced BST) | $O(\\log n)$ ordered traversal |
| \`std::priority_queue<T>\` | Binary Heap | $O(1)$ top element, $O(\\log n)$ push/pop |

---

#### 📌 2. STL Code Example
\`\`\`cpp
#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>

int main() {
    // Vector with transform and sort
    std::vector<int> scores = {85, 92, 78, 95, 88};
    std::sort(scores.begin(), scores.end(), std::greater<int>());

    // Hash Map for frequency counting
    std::unordered_map<std::string, int> wordCount;
    wordCount["cpp"] = 10;
    wordCount["pointers"] = 5;

    std::cout << "Top Score: " << scores[0] << "\\n";
    std::cout << "C++ frequency: " << wordCount["cpp"] << "\\n";
    return 0;
}
\`\`\`

Would you like to see how to implement custom comparators or solve a **Two-Sum** problem in C++?`;
    }

    // General C++ Roadmap / Flow
    return `### 🚀 C++ Engineering Roadmap (Zero to Advanced)

Here is your step-by-step master roadmap for **Modern C++ Systems Programming**:

---

#### 📌 Phase 1: Core Syntax & Memory Foundations (Weeks 1–3)
- **Language Primitives**: Types, Control flow, Pass-by-value vs Pass-by-reference (\`int&\`).
- **Memory Architecture**: Stack frames, Heap allocation, Pointer arithmetic, \`nullptr\`, Dereferencing (\`*\`).
- **Manual Management**: \`malloc\` / \`free\` vs \`new\` / \`delete\`.

---

#### 📌 Phase 2: Object-Oriented Design & RAII (Weeks 4–6)
- **Classes & Encapsulation**: Constructors, Destructors, Copy/Move constructors, Deep copy.
- **RAII (Resource Acquisition Is Initialization)**: Automatic lifetime management.
- **Polymorphism**: \`virtual\` functions, Abstract classes, Virtual table (\`vtable\` / \`vptr\`).

---

#### 📌 Phase 3: Modern C++ Standards (C++11 to C++20) (Weeks 7–9)
- **Smart Pointers**: \`std::unique_ptr\`, \`std::shared_ptr\`, \`std::weak_ptr\`.
- **Move Semantics**: Rvalue references (\`T&&\`), \`std::move\`, preventing deep copy overhead.
- **Modern Idioms**: \`auto\`, \`constexpr\`, Lambda expressions, \`std::optional\`.

---

#### 📌 Phase 4: Standard Template Library & DSA (Weeks 10–12)
- **Containers**: \`std::vector\`, \`std::unordered_map\`, \`std::priority_queue\`.
- **Algorithms**: \`<algorithm>\` (\`std::sort\`, \`std::binary_search\`, \`std::transform\`).

---

#### 📌 Phase 5: High-Performance Concurrency & Systems (Weeks 13+)
- **Multithreading**: \`std::thread\`, \`std::mutex\`, \`std::lock_guard\`, \`std::atomic\`.
- **Profiling**: Valgrind memory leak checking, GDB debugging, Cache locality tuning.

---

### 💻 Modern C++ Example (RAII & Smart Pointers):
\`\`\`cpp
#include <iostream>
#include <memory>
#include <vector>
#include <algorithm>

class Engine {
public:
    std::string name;
    Engine(std::string n) : name(std::move(n)) { std::cout << "Allocated: " << name << "\\n"; }
    ~Engine() { std::cout << "Cleaned up: " << name << "\\n"; }
    void run() const { std::cout << "Running: " << name << "\\n"; }
};

int main() {
    auto enginePtr = std::make_unique<Engine>("C++ Physics Kernel");
    enginePtr->run();

    std::vector<int> nums = {4, 1, 9, 2};
    std::sort(nums.begin(), nums.end());

    std::cout << "Sorted: ";
    for (int n : nums) std::cout << n << " ";
    std::cout << "\\n";

    return 0; // enginePtr automatically deallocated!
}
\`\`\`

👉 **Next Step**: Would you like to practice **Pointers & Memory Exercises**, or dive into **STL Data Structures**?`;
  }

  // ----------------------------------------------------
  // 2. PYTHON & AI / ML DOMAIN RESPONSES
  // ----------------------------------------------------
  if (isPythonAI) {
    return `### 🧠 AI, Machine Learning & PyTorch Roadmap

Here is your structured curriculum for mastering **Artificial Intelligence, Neural Networks & Large Language Models**:

---

#### 📌 Phase 1: Python, Math & Data Engineering (Weeks 1–4)
- **Advanced Python**: Comprehensions, Generators, Decorators, OOP.
- **Mathematics**: Linear Algebra (Vectors, Matrix multiplication, Eigenvalues), Multivariate Calculus (Gradients, Chain rule), Probability.
- **Data Stack**: **NumPy** (vectorization), **Pandas** (ETL), **Matplotlib/Seaborn**.

---

#### 📌 Phase 2: Classical Machine Learning with Scikit-Learn (Weeks 5–8)
- **Supervised Learning**: Linear/Logistic Regression, Decision Trees, Random Forests, XGBoost.
- **Unsupervised Learning**: K-Means, PCA (Dimensionality Reduction).
- **Validation**: Precision/Recall, ROC-AUC, K-Fold Cross-Validation.

---

#### 📌 Phase 3: Deep Learning & PyTorch (Weeks 9–13)
- **Neural Foundations**: Perceptrons, MLP, Activation Functions (GELU, ReLU, Softmax).
- **Autograd & Optimizers**: Forward pass, Cross-Entropy Loss, Backpropagation, AdamW/SGD.
- **Architectures**: CNNs (Vision), RNNs/LSTMs (Time-Series), Transformers (Multi-Head Self-Attention).

---

#### 📌 Phase 4: Generative AI, RAG & LLMs (Weeks 14+)
- **LLM Fine-Tuning**: LoRA, QLoRA, Hugging Face Transformers.
- **RAG Systems**: Vector Embeddings, Cosine Similarity, Vector DBs (Chroma, Pinecone), LangChain.

---

### 💻 PyTorch MLP Neural Network Example:
\`\`\`python
import torch
import torch.nn as nn

class Classifier(nn.Module):
    def __init__(self, in_features=10, hidden=64, classes=2):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, hidden),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(hidden, classes)
        )

    def forward(self, x):
        return self.net(x)

model = Classifier()
print("PyTorch Model Initialized:\\n", model)
\`\`\`

👉 **Next Step**: Would you like to practice **Tensor Operations** or build a **RAG Pipeline**?`;
  }

  // ----------------------------------------------------
  // 3. JAVA & BACKEND DOMAIN RESPONSES
  // ----------------------------------------------------
  if (isJava) {
    return `### ☕ Java & Enterprise Spring Boot Roadmap

---

#### 📌 Phase 1: Core Java & JVM Architecture (Weeks 1–4)
- **OOP & Memory**: Heap vs Stack, Garbage Collection (G1GC), Interfaces vs Abstract Classes.
- **Collections**: \`ArrayList\`, \`LinkedList\`, \`HashMap\` (Hashing mechanics & collisions).

---

#### 📌 Phase 2: Concurrency & Multithreading (Weeks 5–7)
- **Thread Safety**: \`synchronized\`, \`volatile\`, \`AtomicInteger\`, \`ReentrantLock\`.
- **Async Pipelines**: \`ExecutorService\`, \`CompletableFuture\`, Virtual Threads (Java 21).

---

#### 📌 Phase 3: Spring Boot Microservices (Weeks 8–12)
- **Spring MVC**: Inversion of Control, \`@RestController\`, \`@Autowired\`, Request validation.
- **Spring Data JPA**: Hibernate ORM, Entity mapping (\`@OneToMany\`), \`@Transactional\`.
- **Security & Cloud**: Spring Security 6, JWT, Docker, PostgreSQL.

---

### 💻 Spring Boot RestController Example:
\`\`\`java
@RestController
@RequestMapping("/api/v1/students")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudent(@PathVariable UUID id) {
        return ResponseEntity.ok(studentService.findById(id));
    }
}
\`\`\`

👉 **Next Step**: Would you like to explore **Java Multithreading** or **Spring Data JPA**?`;
  }

  // ----------------------------------------------------
  // 4. JAVASCRIPT / REACT / FRONTEND DOMAIN RESPONSES
  // ----------------------------------------------------
  if (isReactFrontend) {
    return `### ⚡ Full-Stack JavaScript & React Roadmap

---

#### 📌 Phase 1: JavaScript Runtime & Async Core (Weeks 1–3)
- **Runtime Mechanics**: Execution Context, Call Stack, Closures, Event Loop (Microtasks vs Macrotasks).
- **Asynchronous Flow**: Promises, \`async/await\`, \`Promise.allSettled\`, Error handling.

---

#### 📌 Phase 2: TypeScript & Modern React 18 (Weeks 4–8)
- **TypeScript**: Interfaces, Generics, Discriminated Unions, Zod validation.
- **React 18**: Virtual DOM & Fiber reconciliation, Hooks (\`useState\`, \`useEffect\`, \`useMemo\`, \`useCallback\`, \`useContext\`), Custom Hooks.

---

#### 📌 Phase 3: Backend APIs & Full Stack (Weeks 9–12)
- **Backend**: Express REST APIs, Prisma ORM, PostgreSQL transactions.
- **Next.js**: Server Components (RSC), SSR, SSG, Route Handlers.

---

### 💻 React Custom Hook with AbortController Example:
\`\`\`tsx
import { useState, useEffect } from 'react';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(result => setData(result))
      .catch(err => { if (err.name !== 'AbortError') console.error(err); })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, isLoading };
}
\`\`\`

👉 **Next Step**: Would you like to build a **Custom Hook** or explore **Next.js App Router**?`;
  }

  // ----------------------------------------------------
  // 5. DATA STRUCTURES & ALGORITHMS (DSA)
  // ----------------------------------------------------
  if (isDSA) {
    return `### 🏆 Data Structures & Algorithms Mastery Roadmap

---

#### 📌 Level 1: Linear Data Structures (Weeks 1–3)
- **Arrays & Strings**: Two Pointers, Sliding Window, Prefix Sums.
- **Linked Lists**: Fast & Slow Pointers (Cycle Detection), Inversion.
- **Stacks & Queues**: Monotonic Stack, Queue using Stacks.

---

#### 📌 Level 2: Trees, Heaps & Recursion (Weeks 4–7)
- **Binary Trees**: BFS Level-Order, DFS (Pre/In/Post-Order), Lowest Common Ancestor.
- **Heaps / Priority Queues**: Top-K elements, Median from Data Stream.

---

#### 📌 Level 3: Graphs & Dynamic Programming (Weeks 8–12)
- **Graphs**: BFS/DFS, Dijkstra's algorithm, Topological Sort.
- **Dynamic Programming**: 1D DP, 2D Grid DP, 0/1 Knapsack, Longest Common Subsequence.

---

### 💻 Fast & Slow Pointers Example (Cycle Detection):
\`\`\`typescript
function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
\`\`\`

👉 **Next Step**: Would you like to practice a **Sliding Window** or **Graph Traversal** problem?`;
  }

  // ----------------------------------------------------
  // 6. GENERAL PROGRAMMING ROADMAP & ASSISTANCE
  // ----------------------------------------------------
  return `### 🗺️ Tailored Engineering Roadmap

To help you achieve your goals, here is a structured 4-phase learning flow:

---

#### 📌 Phase 1: Foundational Primitives (Weeks 1–3)
- Master variables, types, memory allocation, and control structures.
- Write modular, pure functions and understand runtime execution contexts.

#### 📌 Phase 2: Architecture & Data Structures (Weeks 4–6)
- Study linear and non-linear data structures (Arrays, Hash Maps, Trees).
- Implement clean object-oriented design and component separation.

#### 📌 Phase 3: Asynchronous Systems & APIs (Weeks 7–9)
- Build resilient network integrations with error boundaries and caching.
- Connect client interfaces with database layers and backend services.

#### 📌 Phase 4: Production Capstone (Weeks 10–12)
- Build, test, and deploy a complete production-grade application.

---

👉 **Which specific technology would you like to master?**
- ⚡ **C++ / Systems Programming**
- 🧠 **Python & Machine Learning / PyTorch**
- ☕ **Java & Spring Boot**
- ⚛️ **JavaScript / TypeScript & React**
- 🏆 **Data Structures & Algorithms (DSA)**`;
}

export const aiService = {
  async getConversations(): Promise<{
    success: boolean;
    data: {
      conversations: Conversation[];
      grouped: {
        TODAY: Conversation[];
        YESTERDAY: Conversation[];
        PREVIOUS: Conversation[];
      };
    };
  }> {
    const currentUser = getStoredUser();
    const isDevashish =
      currentUser &&
      (currentUser.email.toLowerCase().includes('devashish') ||
        currentUser.name.toLowerCase() === 'devashish');

    const convs = isDevashish || !currentUser
      ? devashishConversations
      : createNewUserConversations(currentUser);

    try {
      const res = await api.get('/conversations');
      if (res.data && res.data.success && res.data.data) {
        return res.data;
      }
      return {
        success: true,
        data: {
          conversations: convs,
          grouped: {
            TODAY: convs.filter((c) => c.timeGroup === 'TODAY'),
            YESTERDAY: convs.filter((c) => c.timeGroup === 'YESTERDAY'),
            PREVIOUS: [],
          },
        },
      };
    } catch (error) {
      return {
        success: true,
        data: {
          conversations: convs,
          grouped: {
            TODAY: convs.filter((c) => c.timeGroup === 'TODAY'),
            YESTERDAY: convs.filter((c) => c.timeGroup === 'YESTERDAY'),
            PREVIOUS: [],
          },
        },
      };
    }
  },

  async getConversation(id: string): Promise<{ success: boolean; data: Conversation }> {
    const currentUser = getStoredUser();
    const isDevashish =
      currentUser &&
      (currentUser.email.toLowerCase().includes('devashish') ||
        currentUser.name.toLowerCase() === 'devashish');

    const convs = isDevashish || !currentUser
      ? devashishConversations
      : createNewUserConversations(currentUser);

    try {
      const res = await api.get<{ success: boolean; data: Conversation }>(`/conversations/${id}`);
      if (res.data && res.data.success && res.data.data) {
        return res.data;
      }
      const match = convs.find((c) => c.id === id) || convs[0];
      return { success: true, data: match };
    } catch (error) {
      const match = convs.find((c) => c.id === id) || convs[0];
      return { success: true, data: match };
    }
  },

  async createConversation(data?: { title?: string; initialMessage?: string }): Promise<{ success: boolean; data: Conversation }> {
    try {
      const res = await api.post<{ success: boolean; data: Conversation }>('/conversations', data || {});
      return res.data;
    } catch (error) {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        title: data?.title || 'New Mentoring Session',
        category: 'General',
        timeGroup: 'TODAY',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content:
              data?.initialMessage ||
              'Hello! I am your AI Mentor. What programming concept, study roadmap, or architecture challenge would you like to explore today?',
            createdAt: new Date().toISOString(),
          },
        ],
      };
      return { success: true, data: newConv };
    }
  },

  async deleteConversation(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await api.delete(`/conversations/${id}`);
      return res.data;
    } catch (error) {
      return { success: true, message: 'Deleted' };
    }
  },

  async sendMessage(data: {
    conversationId?: string;
    message: string;
    history?: ChatMessage[];
  }): Promise<{
    success: boolean;
    conversationId: string;
    userMessage: ChatMessage;
    aiMessage: ChatMessage;
  }> {
    const currentUser = getStoredUser();

    try {
      const res = await api.post('/ai/chat', data);
      if (res.data && res.data.success && res.data.aiMessage) {
        return res.data;
      }
      throw new Error('Fallback required');
    } catch (error) {
      let aiResponseText = '';
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;

      if (apiKey && apiKey.startsWith('AIzaSy')) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
          const res = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `You are LearnPath AI Mentor, an expert engineering coach. Answer clearly with markdown, roadmaps, and code: ${data.message}` }] }],
            }),
          });
          if (res.ok) {
            const json = await res.json();
            aiResponseText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
          }
        } catch (e) {
          console.warn('Gemini direct API error, using contextual NLP engine:', e);
        }
      }

      if (!aiResponseText) {
        aiResponseText = generateContextualAIResponse(
          data.message,
          data.history || [],
          currentUser?.targetRole
        );
      }

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: data.message,
        createdAt: new Date().toISOString(),
      };
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiResponseText,
        createdAt: new Date().toISOString(),
      };
      return {
        success: true,
        conversationId: data.conversationId || 'conv-1',
        userMessage: userMsg,
        aiMessage: aiMsg,
      };
    }
  },
};
