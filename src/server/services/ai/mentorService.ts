import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../../utils/logger.js';

interface MessageHistory {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class MentorService {
  private static geminiClient: GoogleGenerativeAI | null = null;

  private static getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && !this.geminiClient) {
      try {
        this.geminiClient = new GoogleGenerativeAI(apiKey);
      } catch (err) {
        logger.warn('Failed to initialize GoogleGenerativeAI client:', err);
      }
    }
    return this.geminiClient;
  }

  public static async generateResponse(
    userMessage: string,
    history: MessageHistory[] = [],
    context?: {
      userRole?: string;
      currentFocus?: string;
      skillGaps?: string[];
    }
  ): Promise<string> {
    const client = this.getClient();

    if (client && process.env.GEMINI_API_KEY) {
      try {
        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const systemPrompt = `You are "LearnPath AI Mentor", an elite, supportive, and pedagogical AI engineering coach.
The learner's current target role is ${context?.userRole || 'Engineer'}.
Current focus topic: ${context?.currentFocus || 'Software Engineering'}.
Identified skill gaps: ${context?.skillGaps?.join(', ') || 'Technical Mastery'}.

Format your responses with clean Markdown, clear conceptual explanations, step-by-step roadmaps when asked for study flows, concise code examples with syntax highlighting, and encouraging next-step questions.`;

        const chat = model.startChat({
          history: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }],
            },
            {
              role: 'model',
              parts: [{ text: 'Understood! I am ready to mentor the student with clear technical explanations, code examples, and structured guidance.' }],
            },
            ...history.map((m) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }],
            })),
          ],
        });

        const result = await chat.sendMessage(userMessage);
        return result.response.text();
      } catch (error) {
        logger.error('Gemini API error, falling back to heuristic mentor response:', error);
      }
    }

    // Intelligent pedagogical rule-based mentor fallback
    return this.generateSmartFallback(userMessage, context);
  }

  private static generateSmartFallback(
    message: string,
    context?: {
      userRole?: string;
      currentFocus?: string;
      skillGaps?: string[];
    }
  ): string {
    const query = message.trim().toLowerCase();

    // 1. C++ / C / CPP
    if (
      query.includes('c++') ||
      query.includes('c+') ||
      query.includes('cpp') ||
      (query.includes('c') && (query.includes('study') || query.includes('flow') || query.includes('learn') || query.includes('roadmap') || query.includes('pointer')))
    ) {
      return `### 🚀 Comprehensive Study Flow for C++ (Zero to Advanced)

Here is a structured, production-tested roadmap to master **C++** from foundational systems mechanics to modern C++20 standards:

---

#### 📌 Phase 1: Core Syntax & Memory Foundations (Weeks 1–3)
- **Basic Primitives**: Variables, Control Flow, Functions, Pass-by-value vs Pass-by-reference (\`int&\`).
- **Memory Model**: Stack allocation vs Heap allocation.
- **Pointers & References**: Pointer arithmetic, dereferencing (\`*\`), address-of (\`&\`), \`nullptr\`, dangling pointers.
- **Manual Memory Management**: \`malloc\` / \`free\` vs \`new\` / \`delete\`.

---

#### 📌 Phase 2: Object-Oriented Programming & RAII (Weeks 4–6)
- **Classes & Encapsulation**: Constructors, Destructors, Copy Constructors, Deep vs Shallow copy.
- **RAII (Resource Acquisition Is Initialization)**: Automatic resource management ensuring zero memory leaks.
- **Operator Overloading**: Custom behavior for \`+\`, \`==\`, \`<<\`, \`>>\`.
- **Inheritance & Polymorphism**: \`virtual\` functions, Abstract classes, Pure virtual functions, Virtual Method Table (\`vtable\` / \`vptr\`).

---

#### 📌 Phase 3: Modern C++ (C++11 to C++20) (Weeks 7–9)
- **Smart Pointers**:
  - \`std::unique_ptr<T>\`: Exclusive ownership (lightweight, zero-cost abstraction).
  - \`std::shared_ptr<T>\`: Reference-counted shared ownership.
  - \`std::weak_ptr<T>\`: Breaking circular references.
- **Move Semantics & Rvalue References (\`T&&\`)**: \`std::move\`, move constructors, avoiding expensive deep copies.
- **Modern Idioms**: \`auto\`, \`nullptr\`, \`constexpr\`, Lambda expressions, \`std::optional\`, \`std::variant\`.

---

#### 📌 Phase 4: Standard Template Library (STL) & Data Structures (Weeks 10–12)
- **Containers**: \`std::vector\`, \`std::deque\`, \`std::list\`, \`std::unordered_map\` (Hash Table), \`std::map\` (Red-Black Tree), \`std::priority_queue\`.
- **Algorithms**: \`<algorithm>\` functions (\`std::sort\`, \`std::find_if\`, \`std::transform\`, \`std::binary_search\`).
- **Iterators**: Random access, forward, and reverse iterators.

---

#### 📌 Phase 5: High-Performance Systems & Concurrency (Weeks 13+)
- **Multithreading**: \`std::thread\`, \`std::mutex\`, \`std::lock_guard\`, \`std::atomic\`, Condition variables.
- **Performance Profiling**: Valgrind (memory leak detection), GDB debugging, Cache locality optimization.

---

### 💻 Modern C++ Example (RAII & Smart Pointers):
\`\`\`cpp
#include <iostream>
#include <memory>
#include <vector>
#include <algorithm>

class Task {
public:
    std::string name;
    Task(std::string taskName) : name(std::move(taskName)) {
        std::cout << "[Allocated] Task: " << name << "\\n";
    }
    ~Task() {
        std::cout << "[Deallocated] Task: " << name << "\\n";
    }
    void execute() const {
        std::cout << "Executing: " << name << "\\n";
    }
};

int main() {
    auto taskPtr = std::make_unique<Task>("Compile C++ Engine");
    taskPtr->execute();

    std::vector<int> numbers = {5, 2, 8, 1, 9};
    std::sort(numbers.begin(), numbers.end());

    std::cout << "Sorted: ";
    for (int n : numbers) std::cout << n << " ";
    std::cout << "\\n";

    return 0; // taskPtr memory is automatically freed here!
}
\`\`\`

Would you like to start with **Pointers and Memory Management** exercises, or dive into **STL Data Structures** first?`;
    }

    // 2. Python / AI / Machine Learning
    if (
      query.includes('python') ||
      query.includes('ml') ||
      query.includes('machine learning') ||
      query.includes('ai') ||
      query.includes('deep learning') ||
      query.includes('pytorch') ||
      query.includes('rag') ||
      query.includes('llm')
    ) {
      return `### 🧠 Complete Study Flow for AI & Machine Learning with Python

Here is the industry-standard curriculum for mastering **Artificial Intelligence, PyTorch & LLM Systems**:

---

#### 📌 Phase 1: Python & Math Foundations (Weeks 1–4)
- **Advanced Python**: List comprehensions, Generators, Decorators, \`asyncio\`, Object-Oriented Python.
- **Linear Algebra**: Vectors, Matrices, Eigenvalues, Dot products, Tensor broadcasting.
- **Calculus & Probability**: Derivatives, Partial gradients, Chain rule, Bayes' theorem, Normal distributions.
- **Scientific Libraries**: **NumPy** (vectorization), **Pandas** (data wrangling), **Matplotlib/Seaborn**.

---

#### 📌 Phase 2: Classical Machine Learning with Scikit-Learn (Weeks 5–8)
- **Supervised Learning**: Linear/Logistic Regression, Decision Trees, Random Forests, XGBoost / LightGBM.
- **Unsupervised Learning**: K-Means Clustering, PCA (Dimensionality Reduction).
- **Model Evaluation**: Precision, Recall, F1-Score, ROC-AUC, K-Fold Cross-Validation, Bias-Variance Tradeoff.

---

#### 📌 Phase 3: Deep Learning & PyTorch (Weeks 9–13)
- **Neural Network Primitives**: Perceptrons, Multi-Layer Perceptrons (MLP), Activation Functions (ReLU, GELU, Softmax).
- **Autograd & Optimizers**: Forward passes, Loss functions (Cross-Entropy, MSE), Backpropagation, Adam/SGD.
- **Architectures**:
  - **CNNs**: Image classification, Convolution kernels, Pooling.
  - **RNNs / LSTMs**: Sequential data and time-series.
  - **Transformers**: Self-Attention, Multi-Head Attention, Positional Encoding.

---

#### 📌 Phase 4: Generative AI, RAG & LLMs (Weeks 14+)
- **LLM Fine-Tuning**: LoRA, QLoRA, Hugging Face Transformers.
- **RAG (Retrieval-Augmented Generation)**: Vector Embeddings, Cosine Similarity, Vector DBs (Chroma, Pinecone), LangChain / LlamaIndex.
- **Deployment**: ONNX, TensorRT, vLLM, Docker GPU containers.

---

### 💻 PyTorch Multi-Layer Perceptron Example:
\`\`\`python
import torch
import torch.nn as nn

class NeuralClassifier(nn.Module):
    def __init__(self, input_dim=10, hidden_dim=64, num_classes=2):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(hidden_dim, num_classes)
        )

    def forward(self, x):
        return self.net(x)

model = NeuralClassifier()
print("Initialized PyTorch Model:\\n", model)
\`\`\`

Would you like to explore **Neural Network Mathematics** or **Building a RAG Pipeline** next?`;
    }

    // 3. Java / Spring Boot
    if (query.includes('java') || query.includes('spring') || query.includes('jvm')) {
      return `### ☕ Complete Study Flow for Java & Enterprise Backend

Here is the roadmap for mastering **Java, JVM Architecture, and Spring Boot Microservices**:

---

#### 📌 Phase 1: Core Java & JVM Internals (Weeks 1–4)
- **Core OOP**: Classes, Polymorphism, Inheritance, Encapsulation, Abstract classes & Interfaces.
- **Memory Model**: Heap vs Stack memory, Garbage Collection (G1GC, ZGC), Bytecode compilation.
- **Collections Framework**: \`ArrayList\`, \`LinkedList\`, \`HashMap\` (Hashing mechanics & collisions), \`TreeSet\`.

---

#### 📌 Phase 2: Multithreading & Concurrency (Weeks 5–7)
- **Thread Safety**: \`synchronized\`, \`volatile\`, \`AtomicInteger\`, \`ReentrantLock\`.
- **Concurrency Utilities**: \`ExecutorService\`, \`ThreadPoolExecutor\`, \`CompletableFuture\` async pipelines.

---

#### 📌 Phase 3: Spring Boot & REST APIs (Weeks 8–11)
- **Core Spring**: Inversion of Control (IoC), Dependency Injection (\`@Autowired\`, \`@Component\`, \`@Bean\`).
- **RESTful APIs**: \`@RestController\`, \`@GetMapping\`, \`@PostMapping\`, Request Validation with Jakarta Validation.
- **Data Persistence**: **Spring Data JPA**, Hibernate ORM, Transactions (\`@Transactional\`).

---

### 💻 Spring Boot RestController Example:
\`\`\`java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.findUserById(id));
    }
}
\`\`\`

Would you like to practice **Java Multithreading** or dive into **Spring Data JPA relationships**?`;
    }

    // 4. JavaScript / TypeScript / React
    if (
      query.includes('javascript') ||
      query.includes('typescript') ||
      query.includes('react') ||
      query.includes('frontend') ||
      query.includes('node')
    ) {
      return `### ⚡ Complete Study Flow for Modern Full-Stack JavaScript & React

Here is the step-by-step roadmap to become a high-level **Frontend / Full-Stack Engineer**:

---

#### 📌 Phase 1: JavaScript Runtime & Asynchronous Core (Weeks 1–3)
- **Runtime Mechanics**: Execution Context, Call Stack (LIFO), Lexical Scope, Closures.
- **Event Loop**: Microtask Queue (Promises, \`queueMicrotask\`) vs Macrotask Queue (\`setTimeout\`).
- **Asynchronous Flow**: Promises, \`async/await\`, \`Promise.allSettled\`, Error bubbling with \`try/catch\`.

---

#### 📌 Phase 2: TypeScript & Type Systems (Weeks 4–5)
- **Type Safety**: Interfaces, Type Aliases, Generics, Discriminated Unions, Zod validation.

---

#### 📌 Phase 3: React 18 Architecture (Weeks 6–9)
- **Hooks Mastery**: \`useState\`, \`useEffect\` (with cleanup), \`useMemo\`, \`useCallback\`, \`useContext\`.
- **Component Patterns**: Compound Components, Slots, Responsive UI with Tailwind CSS.

---

### 💻 Resilient React Hook with AbortController Example:
\`\`\`tsx
import { useState, useEffect } from 'react';

export function useFetchData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP error: \${res.status}\`);
        return res.json();
      })
      .then(result => setData(result))
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, isLoading, error };
}
\`\`\`

What specific React architectural pattern would you like to explore next?`;
    }

    // 5. Data Structures & Algorithms
    if (
      query.includes('dsa') ||
      query.includes('data structure') ||
      query.includes('algorithm') ||
      query.includes('leetcode')
    ) {
      return `### 🏆 Step-by-Step Study Flow for Data Structures & Algorithms (DSA)

Here is a structured mastery path for coding interviews:

---

#### 📌 Level 1: Linear Structures (Weeks 1–3)
- **Arrays & Strings**: Two Pointers, Sliding Window, Prefix Sums.
- **Linked Lists**: Fast & Slow Pointers (Cycle Detection), Inversion.
- **Stacks & Queues**: Monotonic Stack, Queue using Stacks.

---

#### 📌 Level 2: Trees & Heaps (Weeks 4–7)
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

Would you like to practice a **Sliding Window** or **Dynamic Programming** challenge?`;
    }

    // 6. General Technical Mentor Response
    return `### 💡 Engineering Analysis & Guidance

Let's address your question systematically:

1. **Core Architecture**:
   - Break down the problem into modular, testable components.
   - Maintain clear separation between data storage, business logic, and presentation.

2. **Best Practices**:
   - Implement defensive error handling with proper try/catch boundaries.
   - Profile memory allocations, asynchronous lifecycles, and network latency.

3. **Recommended Next Steps**:
   - Start by outlining your data structures and interfaces.
   - Implement core logic with pure functions before connecting UI or network layers.

Feel free to ask for specific code snippets, study roadmaps (e.g. *C++, Python, Java, React, DSA*), or paste code for an interactive review!`;
  }
}
