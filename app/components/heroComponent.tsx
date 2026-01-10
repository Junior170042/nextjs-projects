"use client";
import { useState, Suspense, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { FallbackHero } from './small-components/fallback-hero'
import Scene3D from './small-components/3d-scene';
import { useRouter } from 'next/navigation';

// Componente Hero principal
interface Hero3DProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
}

const Hero3DComponent: React.FC<Hero3DProps> = ({
    title = "Share your thoughts",
    subtitle = "With the world",
    ctaText = "Start Sharing",
}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [is3DEnabled, setIs3DEnabled] = useState(true)
    const router = useRouter()

    // Función para reintentar cargar 3D
    const handleRetry = () => {
        setIs3DEnabled(true)
    }

    const onCtaClick = useCallback(() => {
        router.push('/create-post')
    }, [])

    // Si 3D está deshabilitado, mostrar fallback
    if (!is3DEnabled) {
        return (
            <FallbackHero
                title={title}
                subtitle={subtitle}
                ctaText={ctaText}
                onCtaClick={onCtaClick}
                onRetry={handleRetry}
                isHovered={isHovered}
                setIsHovered={setIsHovered}
            />
        )
    }

    return (
        <section className="relative h-screen w-full overflow-hidden bg-linear-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
            {/* Canvas 3D con Suspense */}
            <div className="absolute inset-0 z-1">
                <Canvas
                    camera={{ position: [0, 0, 8], fov: 75 }}
                    style={{ background: 'transparent' }}
                    gl={{ alpha: true, antialias: true }}
                    onCreated={(state) => {
                        state.gl.setClearColor('#000000', 0)
                    }}
                    onError={() => {
                        setIs3DEnabled(false)
                    }}
                >
                    <Suspense fallback={null}>
                        <Scene3D />
                    </Suspense>
                </Canvas>
            </div>

            {/* Overlay de contenido */}
            <div className="relative z-10 flex h-full items-center justify-center pointer-events-none">
                <div className="text-center px-6 max-w-4xl mx-auto pointer-events-auto">
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-pink-500 mb-6 animate-fade-in-up">
                        {title}
                    </h1>

                    <p className="text-xl md:text-3xl text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-purple-900 dark:from-purple-300 dark:to-purple-200 mb-8 animate-fade-in-up animation-delay-200">
                        {subtitle}
                    </p>

                    <button
                        onClick={onCtaClick}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`main-btn hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-400 ${isHovered ? 'from-purple-400 to-indigo-500' : ''}`}
                    >
                        {ctaText}
                    </button>
                </div>
            </div>

            {/* Indicador de scroll */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none">
                <div className="w-6 h-10 border-2 border-gray-400 dark:border-white rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-gray-400 dark:bg-white rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    )
}

export default Hero3DComponent