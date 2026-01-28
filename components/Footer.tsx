
interface FooterProps {
    className?: string;
}

export function Footer({ className }: FooterProps) {
    return (
        <footer className="w-full py-6 mt-12 border-t bg-white/50 dark:bg-black/20 backdrop-blur-sm text-center text-sm text-muted-foreground">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-2">
                <p>Built for Google Gemini 3 Hackaton</p>
                <p className="flex items-center gap-1">
                    Powered by <span className="font-semibold text-foreground">Google Gemini</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">AI</span>
                </p>
            </div>
        </footer>
    );
}
