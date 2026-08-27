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
          content: `Hi **${user.name}**! 👋 Welcome to LearnPath AI.\n\nI am your 24/7 technical engineering mentor. I can help you with:\n- 🗺️ **Step-by-step syllabi & study roadmaps** (C Language, C++, Python, Java, JavaScript, React, AI/ML, Backend, DevOps, DSA)\n- 💻 **Code reviews & debugging** across any language\n- 🏗️ **Low-level memory management, systems architecture, and interview prep**\n\nWhat technology or syllabus would you like to explore today?`,
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

  // Explicit check for C++ vs C Language
  const hasCppIndicator =
    query.includes('c++') ||
    query.includes('cpp') ||
    query.includes('c plus plus') ||
    query.includes('c+ ') ||
    query.endsWith('c+');

  const hasCSharpIndicator =
    query.includes('c#') || query.includes('csharp') || query.includes('.net');

  const isPureC =
    !hasCppIndicator &&
    !hasCSharpIndicator &&
    (query.includes('for c') ||
      query.includes('c syllabus') ||
      query.includes('syllabus for c') ||
      query.includes('c language') ||
      query.includes('c programming') ||
      query.includes('learn c') ||
      query.includes('study c') ||
      query.includes('in c') ||
      query.includes('ansi c') ||
      query.includes('c99') ||
      query.includes('c11') ||
      query.startsWith('c ') ||
      query.endsWith(' c') ||
      query.includes(' c '));

  const isCpp = hasCppIndicator;

  const isPythonAI =
    query.includes('python') ||
    query.includes('pytorch') ||
    query.includes('machine learning') ||
    query.includes('ai') ||
    query.includes('deep learning') ||
    query.includes('rag') ||
    query.includes('llm') ||
    query.includes('tensor');

  const isJava =
    query.includes('java') ||
    query.includes('spring') ||
    query.includes('jvm') ||
    query.includes('hibernate');

  const isReactFrontend =
    query.includes('react') ||
    query.includes('javascript') ||
    query.includes('typescript') ||
    query.includes('frontend') ||
    query.includes('flexbox') ||
    query.includes('css') ||
    query.includes('node') ||
    query.includes('html');

  const isDSA =
    query.includes('dsa') ||
    query.includes('algorithm') ||
    query.includes('leetcode') ||
    query.includes('sorting') ||
    query.includes('binary tree') ||
    query.includes('graph') ||
    query.includes('dynamic programming');

  // ----------------------------------------------------
  // 1. PURE C PROGRAMMING LANGUAGE SYLLABUS & ROADMAP
  // ----------------------------------------------------
  if (isPureC) {
    return `### 📘 Complete Comprehensive Syllabus for C Programming Language (ANSI / C99 / C11)

Here is the complete structured syllabus and mastery roadmap for the **C Programming Language**, covering foundational procedural mechanics to low-level systems programming:

---

#### 📌 Unit 1: Fundamentals of C & Procedural Logic (Weeks 1–2)
- **Language Architecture**: History, Structure of a C program, \`main()\` function, Compilation Pipeline (\`Preprocessor -> Compiler -> Assembler -> Linker\`).
- **Data Types & Sizes**: \`char\` (1B), \`int\` (4B), \`float\` (4B), \`double\` (8B), \`void\`. Type modifiers: \`signed\`, \`unsigned\`, \`short\`, \`long\`.
- **Operators & Precedence**: Arithmetic, Relational, Logical (\`&&\`, \`||\`, \`!\`), Bitwise Operators (\`&\`, \`|\`, \`^\`, \`~\`, \`<<\`, \`>>\`), Ternary operator (\`? :\`).
- **Control Flow Structures**:
  - Decision making: \`if\`, \`if-else\`, nested \`if\`, \`switch-case\`.
  - Loops: \`for\`, \`while\`, \`do-while\`.
  - Jump statements: \`break\`, \`continue\`, \`return\`.

---

#### 📌 Unit 2: Functions, Scope & Call Stack (Weeks 3–4)
- **Function Mechanics**: Declaration (Prototypes), Definition, Parameter Passing (Pass-by-value vs Pass-by-reference using pointers).
- **Storage Classes**: \`auto\`, \`register\`, \`static\` (lifetime & file scope), \`extern\`.
- **Recursion**: Base conditions, Call Stack execution, Stack frame anatomy, Stack Overflow prevention.

---

#### 📌 Unit 3: Arrays, Strings & Pointers (Weeks 5–7)
- **Arrays**: 1D and 2D Multi-dimensional Arrays, Memory Layout (Row-major contiguous allocation), Array Decay.
- **String Manipulation**: \`char\` arrays, Null-terminator (\`'\\0'\`), String functions in \`<string.h>\` (\`strlen\`, \`strcpy\`, \`strcat\`, \`strcmp\`, \`sprintf\`).
- **Pointers Mastery**:
  - Address-of operator (\`&\`) and Dereference operator (\`*\`).
  - Pointer arithmetic (incrementing, decrementing, scaling by \`sizeof(T)\`).
  - \`NULL\` pointer, Void pointers (\`void*\`), Dangling pointers, Wild pointers.
  - Double Pointers (\`int**\`) and Function Pointers (\`void (*fp)(int)\`).

---

#### 📌 Unit 4: Dynamic Memory Allocation & User-Defined Types (Weeks 8–10)
- **Heap Memory Management (\`<stdlib.h>\`)**:
  - \`malloc(size_t size)\`: Allocates uninitialized memory.
  - \`calloc(size_t n, size_t size)\`: Allocates zero-initialized memory.
  - \`realloc(void* ptr, size_t new_size)\`: Resizes memory block.
  - \`free(void* ptr)\`: Deallocates heap memory.
  - Memory Leaks, Segmentation Faults, Valgrind debugging.
- **Structures & Unions**:
  - \`struct\` definition, Member access (\`.\` and \`->\` operator), \`typedef struct\`.
  - Structure Padding, Alignment, and Packing (\`#pragma pack(1)\`).
  - \`union\` (Shared memory for members) vs \`struct\`.
  - Enumerated types (\`enum\`).

---

#### 📌 Unit 5: File I/O, Preprocessor & System Build Tools (Weeks 11–13)
- **File Handling (\`<stdio.h>\`)**:
  - \`FILE*\` pointer, Opening modes (\`"r"\`, \`"w"\`, \`"a"\`, \`"rb"\`, \`"wb"\`).
  - Text I/O: \`fgetc()\`, \`fputc()\`, \`fgets()\`, \`fputs()\`, \`fprintf()\`, \`fscanf()\`.
  - Binary I/O: \`fread()\`, \`fwrite()\`, \`fseek()\`, \`ftell()\`, \`rewind()\`.
- **C Preprocessor**: \`#include\`, \`#define\` macros, Macro vs Inline functions, Conditional compilation (\`#ifdef\`, \`#ifndef\`, \`#endif\`), Header guards.
- **Multi-File Project Architecture**: Header files (\`.h\`), Implementation files (\`.c\`), \`Makefile\`, GCC compiler flags (\`gcc -Wall -Wextra -O2\`).

---

### 💻 Production C Code Example (Structs, Dynamic Memory & Pointers):
\`\`\`c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Define User Structure
typedef struct {
    int id;
    char name[50];
    float gpa;
} Student;

// Function to create student on Heap
Student* create_student(int id, const char* name, float gpa) {
    Student* s = (Student*)malloc(sizeof(Student));
    if (s == NULL) {
        fprintf(stderr, "Error: Memory allocation failed!\\n");
        return NULL;
    }
    s->id = id;
    strncpy(s->name, name, sizeof(s->name) - 1);
    s->name[sizeof(s->name) - 1] = '\\0';
    s->gpa = gpa;
    return s;
}

int main(void) {
    // Allocate student dynamically
    Student* student1 = create_student(101, "Ayushi Sharma", 3.95f);
    if (!student1) return 1;

    printf("=== Student Record in C ===\\n");
    printf("ID: %d\\n", student1->id);
    printf("Name: %s\\n", student1->name);
    printf("GPA: %.2f\\n", student1->gpa);

    // Free allocated heap memory
    free(student1);
    student1 = NULL; // Prevent dangling pointer

    return 0;
}
\`\`\`

---

👉 **Where would you like to start?**
1. **Unit 1 & 2**: Variables, Loops & Functions
2. **Unit 3**: Pointers & Array Arithmetic Deep-Dive
3. **Unit 4**: Dynamic Memory Allocation (\`malloc\`/\`free\`) & Structs`;
  }

  // ----------------------------------------------------
  // 2. C++ PROGRAMMING LANGUAGE ROADMAP
  // ----------------------------------------------------
  if (isCpp) {
    return `### 🚀 Comprehensive Syllabus for C++ (OOP to Modern C++20)

Here is the master syllabus for **C++ Systems & Modern C++ Programming**:

---

#### 📌 Phase 1: Core Syntax & Memory Foundations (Weeks 1–3)
- Basic Primitives, Control Flow, Functions, Pass-by-reference (\`int&\`).
- Stack allocation vs Heap allocation, Pointer arithmetic, \`nullptr\`.
- \`malloc\` / \`free\` vs \`new\` / \`delete\`.

#### 📌 Phase 2: Object-Oriented Programming & RAII (Weeks 4–6)
- Classes, Constructors, Destructors, Copy/Move constructors.
- **RAII**: Automatic resource management without memory leaks.
- Virtual Functions, Abstract Classes, Virtual Table (\`vtable\` / \`vptr\`).

#### 📌 Phase 3: Modern C++ (C++11 to C++20) (Weeks 7–9)
- **Smart Pointers**: \`std::unique_ptr\`, \`std::shared_ptr\`, \`std::weak_ptr\`.
- Move Semantics & Rvalue References (\`T&&\`), \`std::move\`.
- \`auto\`, \`constexpr\`, Lambda expressions, \`std::optional\`.

#### 📌 Phase 4: Standard Template Library (STL) (Weeks 10–12)
- Containers: \`std::vector\`, \`std::unordered_map\`, \`std::priority_queue\`.
- Algorithms: \`<algorithm>\` (\`std::sort\`, \`std::transform\`, \`std::binary_search\`).

#### 📌 Phase 5: Concurrency & Performance (Weeks 13+)
- Multithreading: \`std::thread\`, \`std::mutex\`, \`std::atomic\`.
- Profiling: Valgrind memory leak checking, GDB debugging.

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
    ~Engine() { std::cout << "Deallocated: " << name << "\\n"; }
};

int main() {
    auto enginePtr = std::make_unique<Engine>("C++ Core");
    std::vector<int> nums = {5, 2, 8, 1};
    std::sort(nums.begin(), nums.end());
    for (int n : nums) std::cout << n << " ";
    std::cout << "\\n";
    return 0; // enginePtr automatically freed
}
\`\`\``;
  }

  // ----------------------------------------------------
  // 3. PYTHON & AI / ML
  // ----------------------------------------------------
  if (isPythonAI) {
    return `### 🧠 AI, Machine Learning & PyTorch Syllabus

---

#### 📌 Unit 1: Python, Math & Vectorization (Weeks 1–4)
- Comprehensions, Generators, Decorators, OOP.
- Linear Algebra, Multivariable Calculus, NumPy, Pandas.

#### 📌 Unit 2: Classical Machine Learning (Weeks 5–8)
- Regression, Classification, Decision Trees, XGBoost, Scikit-Learn.

#### 📌 Unit 3: Deep Learning & PyTorch (Weeks 9–13)
- Neural Networks, Autograd, Loss Functions, CNNs, Transformers.

#### 📌 Unit 4: Generative AI, RAG & LLMs (Weeks 14+)
- Fine-Tuning (LoRA), Vector DBs (Chroma, Pinecone), LangChain.

---

### 💻 PyTorch Classifier Example:
\`\`\`python
import torch
import torch.nn as nn

class Model(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(10, 32), nn.GELU(), nn.Linear(32, 2))
    def forward(self, x):
        return self.net(x)

print(Model())
\`\`\``;
  }

  // ----------------------------------------------------
  // 4. JAVA & SPRING BOOT
  // ----------------------------------------------------
  if (isJava) {
    return `### ☕ Java & Enterprise Spring Boot Syllabus

---

#### 📌 Unit 1: Core Java & JVM Architecture (Weeks 1–4)
- OOP, Heap/Stack, Garbage Collection, Collections (\`HashMap\`, \`ArrayList\`).

#### 📌 Unit 2: Concurrency & Multithreading (Weeks 5–7)
- \`Thread\`, \`synchronized\`, \`CompletableFuture\`, Virtual Threads (Java 21).

#### 📌 Unit 3: Spring Boot REST APIs (Weeks 8–12)
- Spring MVC, Spring Data JPA, Hibernate, PostgreSQL, Docker.

---

### 💻 Spring Boot RestController Example:
\`\`\`java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @GetMapping("/{id}")
    public ResponseEntity<String> getUser(@PathVariable String id) {
        return ResponseEntity.ok("User " + id);
    }
}
\`\`\``;
  }

  // ----------------------------------------------------
  // 5. JAVASCRIPT & REACT
  // ----------------------------------------------------
  if (isReactFrontend) {
    return `### ⚡ Full-Stack JavaScript & React Syllabus

---

#### 📌 Unit 1: JS Runtime & Async Core (Weeks 1–3)
- Event Loop, Promises, \`async/await\`, Closures, ES6+.

#### 📌 Unit 2: TypeScript & React 18 (Weeks 4–8)
- Interfaces, Generics, Hooks (\`useState\`, \`useEffect\`, \`useMemo\`, \`useCallback\`).

#### 📌 Unit 3: Next.js & Full-Stack (Weeks 9–12)
- Server Components, Express REST APIs, Prisma ORM.

---

### 💻 React Custom Hook Example:
\`\`\`tsx
import { useState, useEffect } from 'react';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData);
  }, [url]);
  return { data };
}
\`\`\``;
  }

  // ----------------------------------------------------
  // 6. DSA
  // ----------------------------------------------------
  if (isDSA) {
    return `### 🏆 Data Structures & Algorithms Syllabus

---

#### 📌 Level 1: Linear Structures (Weeks 1–3)
- Arrays, Two Pointers, Sliding Window, Linked Lists, Stacks, Queues.

#### 📌 Level 2: Trees & Heaps (Weeks 4–7)
- Binary Trees, BFS/DFS, Heaps, Priority Queues.

#### 📌 Level 3: Graphs & Dynamic Programming (Weeks 8–12)
- Graphs (Dijkstra, Topological Sort), 1D/2D Dynamic Programming.

---

### 💻 Linked List Cycle Detection (Two Pointers):
\`\`\`typescript
function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
\`\`\``;
  }

  // ----------------------------------------------------
  // 7. GENERAL SYLLABUS & ROADMAP SELECTOR
  // ----------------------------------------------------
  return `### 🗺️ Master Curriculum & Syllabus Directory

Which programming syllabus would you like to explore?

1. 📘 **C Programming Language** (\`stdio.h\`, Pointers, Structs, \`malloc\`/\`free\`, File I/O)
2. 🚀 **C++ Programming Language** (OOP, RAII, Smart Pointers, Templates, STL)
3. 🧠 **Python & Machine Learning / AI** (NumPy, PyTorch, Transformers, RAG)
4. ☕ **Java & Spring Boot** (JVM Internals, Concurrency, Spring Data JPA, Microservices)
5. ⚡ **JavaScript / TypeScript & React** (Event Loop, React 18, Next.js, Full Stack)
6. 🏆 **Data Structures & Algorithms (DSA)** (Arrays, Trees, Graphs, Dynamic Programming)

Type **"syllabus for C"**, **"syllabus for C++"**, or any technology name to get the complete curriculum!`;
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
              'Hello! I am your AI Mentor. What programming syllabus, study roadmap, or concept would you like to explore today?',
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
              contents: [{ parts: [{ text: `You are LearnPath AI Mentor, an expert programming coach. Help the student with: ${data.message}` }] }],
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
