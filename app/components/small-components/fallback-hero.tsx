"use client";
// Componente FallbackHero FUERA del componente principal
interface FallbackHeroProps {
    title: string;
    subtitle: string;
    ctaText: string;
    onCtaClick: () => void;
    onRetry: () => void;
    isHovered: boolean;
    setIsHovered: (hovered: boolean) => void;
}
export function FallbackHero({
    title,
    subtitle,
    ctaText,
    onCtaClick,
    onRetry,
    isHovered,
    setIsHovered
}: FallbackHeroProps) {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-linear-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center">
            {/* Efectos de fondo CSS */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-200"></div>
                <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-400"></div>
            </div>

            <div className="text-center px-6 max-w-4xl mx-auto relative z-10">
                <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 mb-6 animate-fade-in-up">
                    {title}
                </h1>

                <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-600 dark:from-indigo-300 dark:to-blue-300 mb-8 animate-fade-in-up animation-delay-200">
                    {subtitle}
                </p>

                <div className="space-y-4">
                    <button
                        onClick={onCtaClick}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`
             main-btn
              hover:scale-105 hover:shadow-2xl
              animate-fade-in-up animation-delay-400
              ${isHovered ? 'from-purple-400 to-indigo-500' : ''}
            `}
                    >
                        {ctaText}
                    </button>

                    <button
                        onClick={onRetry}
                        className="block mx-auto text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors underline"
                    >
                        🎮 Intentar cargar experiencia 3D
                    </button>
                </div>
            </div>

            {/* Indicador de scroll */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-gray-400 dark:border-white rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-gray-400 dark:bg-white rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    )
}