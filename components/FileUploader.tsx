"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
                "relative rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out p-8 text-center",
                isDragging
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-muted-foreground/25 hover:border-primary/50",
                selectedFile ? "bg-secondary/50" : "bg-background"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileInput}
                accept="image/*,application/pdf"
            />

            {selectedFile ? (
                <div className="flex items-center justify-center gap-4 animate-in fade-in zoom-in-95">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        {selectedFile.type.includes("pdf") ? (
                            <FileText className="w-8 h-8" />
                        ) : (
                            <ImageIcon className="w-8 h-8" />
                        )}
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-foreground">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onFileSelect(null);
                        }}
                        className="p-1 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors ml-4"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer gap-4"
                >
                    <div className="p-4 rounded-full bg-primary/5 text-primary">
                        <Upload className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium text-lg">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground">
                            PDF or Images (Max 10MB)
                        </p>
                    </div>
                </label>
            )}
        </div>
    );
}
