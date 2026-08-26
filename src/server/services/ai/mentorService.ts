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
        const systemPrompt = `You are "LearnPath AI Mentor", an elite, supportive, and pedagogical AI programming coach.
The learner's current target role is ${context?.userRole || 'Frontend Engineer'}.
Current focus topic: ${context?.currentFocus || 'Async JavaScript'}.
Identified skill gaps: ${context?.skillGaps?.join(', ') || 'Async Programming, API Error Handling'}.

Format your responses with clean Markdown, clear conceptual explanations, concise code examples with syntax highlighting, and encouraging next-step questions.`;

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
    const lower = message.toLowerCase();

    if (lower.includes('flexbox') || lower.includes('justify-content') || lower.includes('align-items') || lower.includes('center')) {
      return `Flexbox is built on two primary axes: the **Main Axis** (defined by \`flex-direction\`) and the **Cross Axis** (perpendicular to the main axis).

### Key Properties:
- **\`justify-content\`**: Controls alignment along the **Main Axis** (defaults to horizontal row).
  - \`center\`: Groups items in the center.
  - \`space-between\`: Distributes items evenly with first/last at edges.
- **\`align-items\`**: Controls alignment along the **Cross Axis** (defaults to vertical column).
  - \`center\`: Vertically centers items.
  - \`stretch\`: Expands items to fill the cross axis height.

### Practical Centering Example:
\`\`\`css
.card-container {
  display: flex;
  justify-content: center; /* Horizontally centered */
  align-items: center;     /* Vertically centered */
  min-height: 250px;
  background: #f8fafc;
  border-radius: 12px;
}
\`\`\`

Would you like to try changing \`flex-direction: column\` to see how axis orientation changes?`;
    }

    if (lower.includes('promise') || lower.includes('async') || lower.includes('await') || lower.includes('event loop')) {
      return `Here is how **Async/Await** and **Promises** work under the hood in JavaScript:

### 1. Promises as State Machines
A Promise represents an asynchronous operation with three states:
- **Pending**: Initial state, operation in progress.
- **Fulfilled**: Operation resolved successfully with value (\`.then()\`).
- **Rejected**: Operation failed with error reason (\`.catch()\`).

### 2. Async / Await Pattern
\`\`\`javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load user:', error.message);
    throw error; // Re-throw or handle fallback
  }
}
\`\`\`

### 3. Concurrency Tip
When requests are independent, avoid sequential \`await\` calls. Use \`Promise.all()\`:
\`\`\`javascript
const [user, courses] = await Promise.all([
  fetchUser(id),
  fetchCourses(id)
]);
\`\`\`

Would you like to practice handling error boundaries for network timeouts?`;
    }

    if (lower.includes('hook') || lower.includes('useeffect') || lower.includes('usestate') || lower.includes('react')) {
      return `In React, hooks let you attach state and lifecycle behaviors to functional components.

### Core React Hooks:
1. **\`useState\`**: Preserves component-level reactive state.
2. **\`useEffect\`**: Synchronizes component with external systems (APIs, subscriptions, DOM mutations).
3. **\`useCallback\` & \`useMemo\`**: Caches function references and computed values to avoid costly re-renders.

### Clean \`useEffect\` with Abort Controller:
\`\`\`tsx
useEffect(() => {
  const controller = new AbortController();

  async function loadData() {
    try {
      const res = await fetch('/api/dashboard', { signal: controller.signal });
      const data = await res.json();
      setData(data);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    }
  }

  loadData();
  return () => controller.abort(); // Cleanup on unmount or dependency change
}, []);
\`\`\`

What specific React architectural pattern would you like to explore next?`;
    }

    if (lower.includes('sorting') || lower.includes('algorithm') || lower.includes('data structure') || lower.includes('tree') || lower.includes('graph')) {
      return `Let's break down the computational complexity and behavior of standard **Sorting Algorithms**:

| Algorithm | Best Time | Average Time | Worst Time | Space | Stable? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **QuickSort** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n^2)$ | $O(\\log n)$ | No |
| **MergeSort** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n \\log n)$ | $O(n)$ | Yes |
| **HeapSort** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n \\log n)$ | $O(1)$ | No |

### QuickSort In-Place Partitioning:
\`\`\`javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}
\`\`\`

Shall we write the complete partition function together or test it on custom inputs?`;
    }

    // Default supportive technical response
    return `That is a great technical question! As your AI Mentor for **${context?.userRole || 'Frontend Engineering'}**, let's analyze this step-by-step:

1. **Core Concept**: Break the problem down into small, testable units of logic.
2. **Best Practice**: Ensure clean separation of concerns, explicit error boundaries, and readable variable naming.
3. **Execution**: Verify edge cases like empty states, network latency, and type safety.

Tell me more about what you are trying to implement or paste your snippet, and we can debug or optimize it together!`;
  }
}
