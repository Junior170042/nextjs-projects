"use client";
import {
    Float,
    Text,
    OrbitControls,
    Sparkles,
    MeshDistortMaterial,
    Sphere,
    Box,
    Preload
} from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from 'next-themes'

function AnimatedSphere({ position }: { position: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const { theme } = useTheme();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1, 32, 32]} position={position}>
                <MeshDistortMaterial
                    color={theme === 'dark' ? '#6366f1' : '#4f46e5'}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    )
}

function FloatingBox({ position }: { position: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
        }
    })

    return (
        <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
            <Box ref={meshRef} args={[0.8, 0.8, 0.8]} position={position}>
                <meshStandardMaterial
                    color="#f42"
                    metalness={0.7}
                    roughness={0.3}
                />
            </Box>
        </Float>
    )
}

function FloatingText() {
    const textRef = useRef<THREE.Group>(null!)
    const { theme } = useTheme();

    useFrame((state) => {
        if (textRef.current) {
            textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
            <group ref={textRef}>
                <Text
                    fontSize={1.2}
                    anchorX="center"
                    anchorY="middle"
                    position={[0, 1, 0]}
                    color={theme === 'dark' ? '#ffffff' : '#1f2937'}
                >
                    postOne
                </Text>
            </group>
        </Float>
    )
}

export default function Scene3D() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <ambientLight intensity={theme === 'dark' ? 0.8 : 1.2} />
            <pointLight position={[10, 10, 10]} intensity={2.5} />
            <spotLight
                position={[-10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={theme === 'dark' ? 3 : 2}
            />

            <directionalLight position={[0, 5, 5]} intensity={1.5} />

            <FloatingText />

            <AnimatedSphere position={[3, 0, -2]} />
            <AnimatedSphere position={[-3, -1, -1]} />
            <FloatingBox position={[2, -2, 1]} />
            <FloatingBox position={[-2, 2, 0]} />

            <Sparkles
                count={70}
                scale={15}
                size={4}
                speed={0.4}
                opacity={theme === 'dark' ? 0.8 : 0.4}
                color={theme === 'dark' ? '#818cf8' : '#4f46e5'}
            />

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 2.2}
                autoRotate
                autoRotateSpeed={0.5}
            />

            <Preload all />
        </>
    )
}