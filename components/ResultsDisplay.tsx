"use client";

import { AnalysisResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, HelpCircle, Lightbulb, ListChecks, Download, Copy, Check, Sparkles } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResultsDisplayProps {
    data: AnalysisResult;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100 }
    },
};

export function ResultsDisplay({ data }: ResultsDisplayProps) {
    const [copiedSection, setCopiedSection] = useState<string | null>(null);

    const questions = Array.isArray(data.examQuestions)
        ? data.examQuestions
        : typeof data.examQuestions === 'string'
            ? [data.examQuestions]
            : [];

    const handleCopy = (text: string, section: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between no-print">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Analysis Results</h2>
                <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download PDF Report
                </Button>
            </div>

            {/* Screen View */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 no-print"
            >
                {/* Summary Section - Full Width, prominent */}
                <motion.div variants={item} className="col-span-1 md:col-span-2">
                    <Card className="glass-card border-l-4 border-l-blue-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <BookOpen className="w-32 h-32 text-blue-500" />
                        </div>
                        <CardHeader className="flex flex-row items-start justify-between pb-2 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Executive Summary</CardTitle>
                                    <CardDescription>Key takeaways & Core concepts condensed</CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(data.summary, "summary")}
                                className="hover:bg-blue-50 text-blue-500"
                            >
                                {copiedSection === "summary" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </CardHeader>
                        <CardContent className="relative z-10 pt-4">
                            <div className="prose prose-blue dark:prose-invert max-w-none text-foreground/90 leading-relaxed text-lg">
                                <ReactMarkdown>{data.summary || "No summary available."}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Exam Questions Section - Interactive cards */}
                <motion.div variants={item} className="row-span-2">
                    <Card className="glass-card border-l-4 border-l-orange-500 h-full flex flex-col">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                    <HelpCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">Practice Exam</CardTitle>
                                    <CardDescription>Test your retention</CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(questions.join('\n'), "questions")}
                                className="hover:bg-orange-50 text-orange-500"
                            >
                                {copiedSection === "questions" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-grow pt-4">
                            <ul className="space-y-4">
                                {questions.length > 0 ? questions.map((q, i) => (
                                    <motion.li
                                        whileHover={{ x: 5 }}
                                        key={i}
                                        className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-900/10 border border-orange-100 dark:border-orange-900/20 shadow-sm"
                                    >
                                        <span className="flex items-center justify-center w-8 h-8 font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 rounded-lg shrink-0 text-sm shadow-inner">
                                            Q{i + 1}
                                        </span>
                                        <span className="text-sm font-medium pt-1.5">{q}</span>
                                    </motion.li>
                                )) : (
                                    <li className="text-muted-foreground italic">No questions generated.</li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Simplified Explanation */}
                <motion.div variants={item}>
                    <Card className="glass-card border-l-4 border-l-green-500 h-full">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400">
                                    <Lightbulb className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">Simplified Concept</CardTitle>
                                    <CardDescription>Explained Like I'm 5</CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(data.explanation, "explanation")}
                                className="hover:bg-green-50 text-green-500"
                            >
                                {copiedSection === "explanation" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="bg-green-50/50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/20 text-foreground/90">
                                <div className="prose prose-sm prose-green dark:prose-invert max-w-none">
                                    <ReactMarkdown>{data.explanation || "No explanation available."}</ReactMarkdown>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Study Plan */}
                <motion.div variants={item}>
                    <Card className="glass-card border-l-4 border-l-purple-500 h-full">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                    <ListChecks className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">Action Plan</CardTitle>
                                    <CardDescription>3-Day Study Roadmap</CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(data.studyPlan, "studyPlan")}
                                className="hover:bg-purple-50 text-purple-500"
                            >
                                {copiedSection === "studyPlan" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="prose prose-sm prose-purple dark:prose-invert max-w-none bg-white/50 dark:bg-black/20 p-4 rounded-xl">
                                <ReactMarkdown>{data.studyPlan || "No plan available."}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Hidden Print View - Visible ONLY when printing */}
            {/* Hidden Print View - Visible ONLY when printing */}
            <div id="printable-content" className="hidden">
                {/* Cover Page */}
                <div className="print-cover-page">
                    <div className="cover-content">
                        <Sparkles className="w-16 h-16 text-black mb-6 mx-auto" />
                        <h1 className="print-title-large">Study Guide</h1>
                        <p className="print-subtitle">Comprehensive Analysis & Study Plan</p>

                        <div className="print-meta-large">
                            <p>Generated by <strong>StudyGuardian AI</strong></p>
                            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                <div className="page-break"></div>

                {/* Content Pages */}
                <div className="print-body">
                    <div className="section two-col">
                        <h2>Executive Summary</h2>
                        <ReactMarkdown>{data.summary || ""}</ReactMarkdown>
                    </div>

                    <div className="section">
                        <h2>Simplified Explanation</h2>
                        <div style={{ padding: '15px', background: '#f8f9fa', borderLeft: '4px solid #333', borderRadius: '4px' }}>
                            <ReactMarkdown>{data.explanation || ""}</ReactMarkdown>
                        </div>
                    </div>

                    <div className="page-break"></div>

                    <div className="section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid black', marginBottom: '20px', paddingBottom: '10px' }}>
                            <h2 style={{ border: 'none', margin: 0 }}>Practice Exam</h2>
                            <span style={{ fontSize: '10pt', color: '#666', fontStyle: 'italic' }}>Testing Retention & Understanding</span>
                        </div>

                        <div className="two-col">
                            {questions.map((q, i) => (
                                <div key={i} className="question-item">
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Question {i + 1}</div>
                                    <div>{q}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        <h2>3-Day Study Action Plan</h2>
                        <div style={{ fontSize: '11pt' }}>
                            <ReactMarkdown>{data.studyPlan || ""}</ReactMarkdown>
                        </div>
                    </div>
                </div>

                <div className="print-footer">
                    <span>StudyGuardian AI • Powered by Google Gemini</span>
                    <span>Page <span className="page-number"></span></span>
                </div>
            </div>
        </div>
    );
}
