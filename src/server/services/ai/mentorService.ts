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

    if (client && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.startsWith('AIzaSy')) {
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

    // 1. PURE C PROGRAMMING LANGUAGE SYLLABUS
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
    Student* student1 = create_student(101, "Ayushi Sharma", 3.95f);
    if (!student1) return 1;

    printf("=== Student Record in C ===\\n");
    printf("ID: %d\\n", student1->id);
    printf("Name: %s\\n", student1->name);
    printf("GPA: %.2f\\n", student1->gpa);

    free(student1);
    student1 = NULL;
    return 0;
}
\`\`\`

👉 **Where would you like to start?**
1. **Unit 1 & 2**: Variables, Loops & Functions
2. **Unit 3**: Pointers & Array Arithmetic Deep-Dive
3. **Unit 4**: Dynamic Memory Allocation (\`malloc\`/\`free\`) & Structs`;
    }

    // 2. C++ / CPP
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
    return 0;
}
\`\`\``;
    }

    // 3. Python / AI / ML
    if (query.includes('python') || query.includes('ml') || query.includes('ai') || query.includes('pytorch')) {
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
- Fine-Tuning (LoRA), Vector DBs (Chroma, Pinecone), LangChain.`;
    }

    // 4. Default Syllabus Directory
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
}
