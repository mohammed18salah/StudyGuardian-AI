"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon, FileType } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploaderProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}

export function FileUploader({ onFileSelect, selectedFile }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                onFileSelect(e.dataTransfer.files[0]);
            }
        },
        [onFileSelect]
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            className={cn(
                "relative rounded-3xl border-2 border-dashed transition-all duration-300 ease-out p-10 text-center cursor-pointer group overflow-hidden",
                isDragging
                    ? "border-primary bg-primary/5 scale-[1.01] shadow-2xl shadow-primary/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50",
                selectedFile ? "bg-primary/5 border-primary/20" : "bg-white/50 dark:bg-black/20"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileInput}
                accept="image/*,application/pdf"
            />

            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <AnimatePresence mode="wait">
                {selectedFile ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center justify-center gap-4 relative z-10"
                    >
                        <div className="relative">
                            <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/5">
                                {selectedFile.type.includes("pdf") ? (
                                    <FileText className="w-12 h-12 text-red-500" />
                                ) : (
                                    <ImageIcon className="w-12 h-12 text-blue-500" />
                                )}
                            </div>
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFileSelect(null);
                                }}
                                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </motion.button>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-lg text-foreground">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground mt-1 px-3 py-1 bg-black/5 dark:bg-white/10 rounded-full inline-block">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center gap-5 relative z-10"
                    >
                        <div className="p-6 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary mb-2 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                            <Upload className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <p className="font-bold text-xl text-foreground">
                                Drop your lecture notes here
                            </p>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                Support for PDF Documents and Images up to 10MB
                            </p>
                        </div>

                        <div className="flex gap-2 text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md"><FileType className="w-3 h-3" /> PDF</span>
                            <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md"><ImageIcon className="w-3 h-3" /> JPG</span>
                            <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md"><ImageIcon className="w-3 h-3" /> PNG</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
