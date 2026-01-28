"use client";

import { AnalysisResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, HelpCircle, Lightbulb, ListChecks } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface ResultsDisplayProps {
    data: AnalysisResult;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export function ResultsDisplay({ data }: ResultsDisplayProps) {
    // Helper to ensure examQuestions is always an array
    const questions = Array.isArray(data.examQuestions)
        ? data.examQuestions
        : typeof data.examQuestions === 'string'
            ? [data.examQuestions] // Fallback if API returns string
            : [];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
        >
            {/* Summary Section */}
            <motion.div variants={item} className="col-span-1 md:col-span-2">
                <Card className="h-full border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        <CardTitle className="text-xl">Concise Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                            <ReactMarkdown>{data.summary || "No summary available."}</ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Exam Questions Section */}
            <motion.div variants={item} className="row-span-2">
                <Card className="h-full border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <HelpCircle className="w-5 h-5 text-orange-500" />
                        <CardTitle className="text-xl">Exam Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {questions.length > 0 ? questions.map((q, i) => (
                                <li key={i} className="flex gap-3 bg-secondary/30 p-3 rounded-lg">
                                    <span className="font-bold text-orange-500 shrink-0">Q{i + 1}.</span>
                                    <span className="text-sm text-foreground/90">{q}</span>
                                </li>
                            )) : (
                                <li className="text-muted-foreground">No questions generated.</li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Simplified Explanation */}
            <motion.div variants={item}>
                <Card className="h-full border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <Lightbulb className="w-5 h-5 text-green-500" />
                        <CardTitle className="text-xl">Simply Explained</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                            <ReactMarkdown>{data.explanation || "No explanation available."}</ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Study Plan */}
            <motion.div variants={item}>
                <Card className="h-full border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <ListChecks className="w-5 h-5 text-purple-500" />
                        <CardTitle className="text-xl">3-Day Study Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                            <ReactMarkdown>{data.studyPlan || "No plan available."}</ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
