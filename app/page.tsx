"use client";

import { useState, useEffect } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnalysisResult } from "@/lib/types";
import { Loader2, Sparkles, AlertCircle, FileText, Bot, BrainCircuit, GraduationCap, Languages } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputType, setInputType] = useState<"file" | "text">("file");
  const [language, setLanguage] = useState<"english" | "arabic">("english");

  // Speed Optimization: Load cached results instantly on mount
  useEffect(() => {
    const cachedResults = localStorage.getItem("studyguardian_results");
    const cachedLanguage = localStorage.getItem("studyguardian_language");

    if (cachedResults) {
      try {
        setResults(JSON.parse(cachedResults));
      } catch (e) { console.error("Cache parse error", e); }
    }

    if (cachedLanguage === "arabic" || cachedLanguage === "english") {
      setLanguage(cachedLanguage);
    }
  }, []);

  // Speed Optimization: Save state to cache whenever it changes
  useEffect(() => {
    if (results) {
      localStorage.setItem("studyguardian_results", JSON.stringify(results));
    }
  }, [results]);

  useEffect(() => {
    localStorage.setItem("studyguardian_language", language);
  }, [language]);

  const handleAnalysis = async () => {
    if (!selectedFile && !textInput.trim()) {
      setError("Please provide a file or some text to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append("language", language);

    if (inputType === "file" && selectedFile) {
      formData.append("file", selectedFile);
    } else if (inputType === "text") {
      formData.append("text", textInput);
    } else {
      setError("Please define valid input");
      setIsAnalyzing(false);
      return;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      let data;
      const responseText = await response.text();

      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Failed to parse response JSON:", responseText);
        throw new Error(`Server returned invalid response.`);
      }

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResults(data);

      // Trigger celebration confetti!
      import("canvas-confetti").then((confetti) => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti.default({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti.default({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      });

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (err: any) {
      console.error("Analysis Error:", err);
      let msg = err.message || "An unexpected error occurred";
      if (msg.includes("429")) msg = "Usage limit exceeded. Please wait a moment and try again.";
      if (msg.includes("pdf")) msg = "Could not read the PDF. Ensure it's not encrypted or corrupted.";
      setError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen text-foreground transition-colors duration-300 flex flex-col relative overflow-hidden bg-[#f0f4f8] dark:bg-[#0a0a0a]">
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[100px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px] animate-pulse delay-1000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-400/20 blur-[120px] animate-pulse delay-2000" />
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-16 flex-grow relative z-10">

        {/* Navbar-like Header */}
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-primary text-white p-2 rounded-xl">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span>StudyGuardian<span className="text-primary">.AI</span></span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">How it works</a>
            <a href="#" className="hover:text-primary transition-colors">Features</a>
            <a href="https://deepmind.google/technologies/gemini/" target="_blank" className="hover:text-primary transition-colors">Gemini Models</a>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-2 bg-white/50 dark:bg-black/50 p-1 rounded-lg border border-white/20">
            <button
              onClick={() => setLanguage("english")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${language === 'english' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("arabic")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${language === 'arabic' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Languages className="w-3 h-3" /> Arabic
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-white/20 shadow-sm backdrop-blur-md text-primary font-semibold text-sm mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Powered by Google Gemini</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary to-purple-600 dark:from-white dark:via-primary dark:to-purple-300 pb-2 leading-tight"
          >
            Master Your Studies in Seconds.
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Transform overwhelming lecture notes into <span className="text-foreground font-semibold">clear summaries</span>,
            <span className="text-foreground font-semibold"> practice exams</span>, and a
            <span className="text-foreground font-semibold"> personalized study plan</span> instantly.
          </motion.p>
        </div>

        {/* Main Input Card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className="glass p-1 rounded-3xl shadow-2xl mb-24"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-[22px] p-6 md:p-10">

            {/* Input Type Toggles */}
            <div className="flex justify-center mb-8">
              <div className="bg-secondary/50 p-1.5 rounded-xl inline-flex gap-1">
                <button
                  onClick={() => setInputType("file")}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${inputType === "file"
                    ? "bg-white dark:bg-gray-800 text-primary shadow-sm ring-1 ring-black/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                    }`}
                >
                  <FileText className="w-4 h-4" /> Upload Document
                </button>
                <button
                  onClick={() => setInputType("text")}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${inputType === "text"
                    ? "bg-white dark:bg-gray-800 text-primary shadow-sm ring-1 ring-black/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                    }`}
                >
                  <Bot className="w-4 h-4" /> Paste Content
                </button>
              </div>
            </div>

            <div className="min-h-[250px]">
              <AnimatePresence mode="wait">
                {inputType === "file" ? (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FileUploader
                      onFileSelect={setSelectedFile}
                      selectedFile={selectedFile}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Textarea
                      placeholder="Paste your lecture notes, article text, or any study material here..."
                      className="min-h-[250px] text-lg p-6 rounded-2xl border-2 border-dashed border-gray-200 focus:border-primary/50 resize-none bg-secondary/20"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              <Button
                onClick={handleAnalysis}
                disabled={isAnalyzing || (inputType === 'file' ? !selectedFile : !textInput)}
                size="lg"
                className="w-full md:w-auto px-10 py-6 text-lg rounded-2xl shadow-lg hover:shadow-primary/25 shadow-primary/10 transition-all hover:-translate-y-1 bg-gradient-to-r from-primary to-purple-600 border-0"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Analyzing with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-2 text-yellow-300 fill-yellow-300" />
                    Generate Study Guide
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Feature Highlights (Only show if no results yet) */}
        {!results && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-3 gap-8 mb-24"
          >
            <div className="p-6 rounded-2xl bg-white/50 border border-white/50 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">AI Summarization</h3>
              <p className="text-sm text-muted-foreground">Instantly condenses hundreds of pages into key bullet points and concepts.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/50 border border-white/50 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">Smart Quiz Gen</h3>
              <p className="text-sm text-muted-foreground">Creates realistic exam questions to test your knowledge gaps immediately.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/50 border border-white/50 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">Structured Plans</h3>
              <p className="text-sm text-muted-foreground">Get a day-by-day revision schedule tailored to the content difficulty.</p>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        {results && (
          <div id="results-section" className="scroll-mt-6">
            <ResultsDisplay data={results} />
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
