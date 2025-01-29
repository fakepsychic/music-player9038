"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { container, children } from "./animations";

// Array of compliments to display
const compliments = [
    "ummm!yeh here it is hope you like it🎁,swipe left/right to change ur songs!",
    "✨..so happy birthday seerat🎂 Wishing you a day filled with love, laughter, and all your favorite things. May this year bring you endless joy and wonderful adventures. Enjoy your special day to the fullest! 🌟",
    "idk what else to say,ohh yeah hope ur dream to become a doctor comes true🩺..my best wishes,lesss gooo ",
    "you are amazing ,even tho i never saw ur face but my intution tells u got the best smile in the world so keep smiling!✨ ",
    "shortyyyy ahhhh 5'4 girl👧🏻",
    "shine bright ,yesh ✨always remember you're worth a lot so hope to use u in gambling 🂪🂫🂭🂮🂡....thts it",
];

const Footer = () => {
    const [currentCompliment, setCurrentCompliment] = useState<string>(compliments[0]);

    // Update compliment every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentCompliment((prev) => {
                const currentIndex = compliments.indexOf(prev);
                const nextIndex = (currentIndex + 1) % compliments.length;
                return compliments[nextIndex];
            });
        }, 10000);
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <div className="relative flex flex-col items-center">
            {/* Compliments displayed above the footer */}
            <div className="mb-20 text-center text-lg font-medium text-gray-700">
                {currentCompliment}
            </div>

            {/* Footer content */}
            <motion.div
                variants={container}
                initial="initial"
                animate="animate"
                exit="exit"
                className="footer flex items-center justify-center gap-1 text-sm text-zinc-500 *:opacity-0 *:translate-x-3"
            >
                <motion.span variants={children}>Made</motion.span>
                <motion.span variants={children}>with laziness!!</motion.span>
                <motion.span variants={children}>by fake</motion.span>
                <motion.span variants={children}>psychic</motion.span>
            </motion.div>
        </div>
    );
};

export default Footer;
