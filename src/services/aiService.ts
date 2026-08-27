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
  {
    id: 'conv-2',
    title: 'Understanding Promises',
    category: 'JavaScript',
    timeGroup: 'TODAY',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 'm-4',
        role: 'assistant',
        content:
          'A Promise in JavaScript represents an operation that has not completed yet, but is expected to in the future. It can be in one of 3 states: Pending, Fulfilled, or Rejected.',
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'React Hooks Deep Dive',
    category: 'React',
    timeGroup: 'YESTERDAY',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      {
        id: 'm-5',
        role: 'assistant',
        content:
          'React Hooks let you use state and other React features without writing a class. The fundamental hooks are `useState`, `useEffect`, and `useContext`.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  },
];

function createNewUserConversations(user: User): Conversation[] {
  return [
    {
      id: `conv-welcome-${user.id}`,
      title: 'Welcome & Roadmap Planning',
      category: 'General',
      timeGroup: 'TODAY',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-welcome-1`,
          role: 'assistant',
          content: `Hi **${user.name}**! 👋 Welcome to LearnPath AI.\n\nI am your 24/7 technical engineering mentor. I will guide you through your **${user.targetRole || 'Frontend Engineering'}** curriculum, review your code, and help you master tricky concepts.\n\nTo get started, what programming concept or challenge would you like to explore today?`,
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ];
}

function generateClientAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('flexbox') || lower.includes('justify') || lower.includes('align') || lower.includes('center')) {
    return `Flexbox is built on two primary axes: the **Main Axis** (defined by \`flex-direction\`) and the **Cross Axis** (perpendicular to the main axis).

### Key Properties:
- **\`justify-content\`**: Controls alignment along the **Main Axis** (defaults to horizontal row).
  - \`center\`: Groups items in the center.
  - \`space-between\`: Distributes items evenly with first/last at edges.
- **\`align-items\`**: Controls alignment along the **Cross Axis** (defaults to vertical column).
  - \`center\`: Vertically centers items.

\`\`\`css
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 250px;
}
\`\`\``;
  }

  if (lower.includes('promise') || lower.includes('async') || lower.includes('await') || lower.includes('all')) {
    return `Here is how **Promise.all** and **Promise.allSettled** work:

1. **\`Promise.all([p1, p2])\`**:
   - Runs promises concurrently.
   - Rejects immediately if **any** promise rejects.
2. **\`Promise.allSettled([p1, p2])\`**:
   - Waits for all promises to finish regardless of success or failure.

\`\`\`javascript
const results = await Promise.allSettled([
  fetchUser(id),
  fetchRepoStats(id)
]);
\`\`\``;
  }

  return `That is a great question! Here is how we approach this in modern engineering:

1. **Break down requirements**: Ensure modular component boundaries and testable pure functions.
2. **Handle edge cases**: Implement defensive error boundaries with try/catch and fallback states.
3. **Execute**: Write clean, readable code and verify performance.

Feel free to ask me to write a code example or explain any specific line!`;
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
              'Hello! I am your AI Mentor. What concept, coding challenge, or architecture problem would you like to explore today?',
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
  }): Promise<{
    success: boolean;
    conversationId: string;
    userMessage: ChatMessage;
    aiMessage: ChatMessage;
  }> {
    try {
      const res = await api.post('/ai/chat', data);
      if (res.data && res.data.success) {
        return res.data;
      }
      throw new Error('Fallback required');
    } catch (error) {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: data.message,
        createdAt: new Date().toISOString(),
      };
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: generateClientAIResponse(data.message),
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
