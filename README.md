# 🎓 StudyGuardian AI
### *Your Intelligent Academic Companion | Powered by Google Gemini*

![StudyGuardian Banner](https://img.shields.io/badge/Status-Operational-success?style=for-the-badge) ![AI Model](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-blue?style=for-the-badge) ![Language](https://img.shields.io/badge/Support-Arabic%20%26%20English-green?style=for-the-badge)

---

## 📖 Introduction
**StudyGuardian AI** is a next-generation education tool designed to revolutionize how students interact with their study materials. By leveraging the advanced capabilities of the **Google Gemini 1.5 & 2.5 Flash** models, we transform complex, lengthy lectures into actionable, bite-sized knowledge in seconds.

**Built for speed, accuracy, and accessibility**, this platform helps students overcome information overload and focus on "Start Smart" rather than just studying hard.

## 🚀 The Challenge
Students today face an overwhelming amount of content: lengthy PDF lectures, complex textbooks, and unstructured notes.
*   **Problem:** 80% of study time is often wasted just organizing and trying to understand complex material before actual learning begins.
*   **Gap:** Existing tools are either too slow, lack Arabic support, or provide generic, unhelpful summaries.

## 💡 The Solution
StudyGuardian acts as a personal **Elite Professor**. It doesn't just summarize; it *teaches*.
Using a custom-tuned AI prompt engineering strategy (the **Feynman Technique**), it breaks down concepts, quizzes the student, and generates a personalized study roadmap.

### ✨ Key Features (Judge's Highlights)
*   **⚡ Blazing Fast Analysis:** Optimized with `gemini-1.5-flash` and `2.5-flash` models for sub-second response times.
*   **🔄 Smart Caching & Zero-Lag:** Uses intelligent LocalStorage caching. Reload the page, and your study session is instantly restored. No waiting.
*   **🌍 Bilingual Excellence:** Fully optimized for **Arabic & English**. It understands academic Arabic dialects and terms perfectly.
*   **📄 Professional PDF Export:** Generates print-ready, clean academic study guides (Magazine Style) for offline study.
*   **🛡️ Robust API Failover:** Features an enterprise-grade multi-key rotation system. If one API key fails, it instantly switches to a backup without interrupting the user.

## 🛠️ Tech Stack
*   **Frontend:** [Next.js 14 (App Router)](https://nextjs.org/) - For a modern, server-optimized React framework.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) - For a premium, fluid, and responsive UI.
*   **AI Engine:** [Google Generative AI SDK](https://ai.google.dev/) - Integrated with deeply custom-engineered prompts.
*   **State Management:** React Hooks + Persistent LocalStorage Strategy.
*   **Deployment:** Vercel / Netlify ready.

## 🧠 How It Works (The AI "Brain")
1.  **Input:** User uploads a PDF or pastes text.
2.  **Processing:** The system identifies the language and context.
3.  **Prompt Engineering:** We inject a specialized "Elite Professor" persona into the AI, instructing it to use specific teaching methodologies (e.g., analogies, concrete examples).
4.  **Output Generation:** A structured JSON response is returned containing:
    *   *Executive Summary*
    *   *Simplification (Feynman Style)*
    *   *Critical Thinking Exam Questions*
    *   *3-Day Action Plan*
5.  **Rendering:** The UI renders this markdown beautifully, ready for interactive study or PDF export.

## 🏃‍♂️ Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/mohammed18salah/StudyGuardian-AI.git
    cd studyguardian-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file and add your Google Gemini Keys:
    ```env
    GEMINI_API_KEY=your_primary_key
    GEMINI_API_KEY_BACKUP=your_backup_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) and start learning!

---
*Built with ❤️ for the Hackathon Community by **Mohammed Salahuldeen**.*
