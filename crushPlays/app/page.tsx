"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { AnimatePresence } from "framer-motion"
import useNavigate from "@/hooks/useNavigate"
import MusicWidget from "@/demos/MusicWidget"

const Home = () => {
    const { isNavigating, navigateTo } = useNavigate()

    return (
        <main className="container mx-auto flex min-h-svh max-w-md flex-col items-center justify-between gap-10 py-10">
            <AnimatePresence>
                {!isNavigating && (
                    <>
                        <Header key="header" />
                        <MusicWidget />
                        <Footer key="footer" />
                    </>
                )}
            </AnimatePresence>
        </main>
    )
}

export default Home
