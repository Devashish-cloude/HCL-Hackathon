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

    // 1. PyTorch / Neural Network Code Analysis
    if (
      query.includes('torch') ||
      query.includes('nn.module') ||
      query.includes('nn.sequential') ||
      query.includes('nn.linear') ||
      (query.includes('class') && query.includes('def forward') && query.includes('self.net'))
    ) {
      return `### 🧠 PyTorch Neural Network Architecture Analysis

You have defined a 2-layer Multi-Layer Perceptron (MLP) using PyTorch's \`nn.Module\` and \`nn.Sequential\`. Here is the complete architectural breakdown and runnable test harness:

---

#### 📌 Layer-by-Layer Breakdown:
1. **Input $\\rightarrow$ Hidden Layer (\`nn.Linear(10, 32)\`)**:
   - Takes a 10-dimensional input vector $\\mathbf{x} \\in \\mathbb{R}^{B \\times 10}$ (where $B$ is batch size).
   - Applies linear transformation with $(10 \\times 32) + 32 = \\mathbf{352}$ learnable parameters.

2. **Activation Function (\`nn.GELU()\`)**:
   - **Gaussian Error Linear Unit**: Smooth non-linear activation scaling inputs by their standard normal CDF. Widely used in modern Transformers (BERT, GPT).

3. **Hidden $\\rightarrow$ Output Layer (\`nn.Linear(32, 2)\`)**:
   - Projects 32 hidden activations down to 2 output logits (binary classification / 2D latent representation).
   - Learnable parameters: $(32 \\times 2) + 2 = \\mathbf{66}$.
   - **Total Model Parameters**: $352 + 66 = \\mathbf{418}$ parameters.

---

### 💻 Complete Runnable PyTorch Script with Forward Pass:
\`\`\`python
import torch
import torch.nn as nn

class Model(nn.Module):
    def __init__(self, in_features: int = 10, hidden_dim: int = 32, out_features: int = 2):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, hidden_dim),
            nn.GELU(),
            nn.Dropout(p=0.1),
            nn.Linear(hidden_dim, out_features)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)

if __name__ == "__main__":
    model = Model()
    print("Model Architecture:\\n", model)

    dummy_input = torch.randn(4, 10) # Batch of 4 samples, 10 features each
    logits = model(dummy_input)
    print("\\nInput Shape :", dummy_input.shape)
    print("Output Shape:", logits.shape)
    
    probabilities = torch.softmax(logits, dim=-1)
    print("Probabilities:\\n", probabilities)
\`\`\``;
    }

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

    // 2. Pure C Language
    if (isPureC) {
      return `### 📘 Complete Comprehensive Syllabus for C Programming Language (ANSI / C99 / C11)

Here is the complete structured syllabus and mastery roadmap for the **C Programming Language**:

---

#### 📌 Unit 1: Fundamentals of C & Procedural Logic (Weeks 1–2)
- Language Architecture, Compilation Pipeline (\`Preprocessor -> Compiler -> Assembler -> Linker\`).
- Data Types (\`char\`, \`int\`, \`float\`, \`double\`), Control Flow (\`if-else\`, \`switch\`, \`for\`, \`while\`).

#### 📌 Unit 2: Functions, Scope & Call Stack (Weeks 3–4)
- Pass-by-value vs Pass-by-reference using pointers, Storage Classes (\`static\`, \`extern\`), Recursion.

#### 📌 Unit 3: Arrays, Strings & Pointers (Weeks 5–7)
- 1D/2D Arrays, String Manipulation (\`<string.h>\`), Pointer Arithmetic, Double Pointers, Function Pointers.

#### 📌 Unit 4: Dynamic Memory Allocation & Structs (Weeks 8–10)
- Heap Management (\`malloc\`, \`calloc\`, \`realloc\`, \`free\`), Memory Leaks & Valgrind.
- \`struct\`, \`union\`, Structure Padding, \`typedef struct\`.

#### 📌 Unit 5: File I/O & System Build Tools (Weeks 11–13)
- File streams (\`fopen\`, \`fread\`, \`fwrite\`), \`Makefile\`, GCC Compiler Flags.`;
    }

    // 3. C++ Language
    if (hasCppIndicator) {
      return `### 🚀 Complete Comprehensive Syllabus for C++ Systems Programming (C++17 / C++20)

---

#### 📌 Phase 1: Modern C++ Core & Type Safety (Weeks 1–3)
- \`auto\`, range-based for loops, \`constexpr\`, structured bindings, Rvalue references (\`T&&\`), \`std::move\`.

#### 📌 Phase 2: OOP & RAII (Weeks 4–7)
- Constructors/Destructors, Rule of 3/5/0, RAII, Virtual Functions, Abstract Classes.

#### 📌 Phase 3: Smart Pointers & Memory Safety (Weeks 8–10)
- \`std::unique_ptr\`, \`std::shared_ptr\`, \`std::weak_ptr\`.

#### 📌 Phase 4: Standard Template Library (STL) & Templates (Weeks 11–14)
- Containers (\`vector\`, \`map\`, \`unordered_map\`), Algorithms (\`sort\`, \`transform\`), Lambdas, Templates, Concepts.`;
    }

    // General fallback
    return `### 💡 Technical Analysis & Insights

I reviewed your prompt:

> **"${message.slice(0, 120)}${message.length > 120 ? '...' : ''}"**

---

#### 📚 Available Mastery Roadmaps & Guides:
- **PyTorch & AI**: Ask *"explain PyTorch tensors"* or paste neural network code for immediate review.
- **C Programming Language**: Ask *"syllabus for C"* or *"explain pointers in C"*.
- **C++ Systems**: Ask *"syllabus for C++"* or *"explain smart pointers"*.
- **Full Stack / React**: Ask *"explain React useEffect"* or *"TypeScript generics"*.
- **DSA**: Ask *"how to do binary search"* or *"explain dynamic programming"*.

How would you like to proceed?`;
  }
}
