// Importing necessary modules and hooks
import { motion, TargetAndTransition } from "framer-motion" // For animations and motion handling
import { generateWaveformAnimations } from "./animations" // Utility function to generate waveform animations
import { FC, RefObject, useEffect, useState } from "react" // React hooks and types

// Animation configurations for different states of the waveform
const hoveringAnimation = {
    height: 2, // Height when hovering or paused
    opacity: 0, // Fade out effect when hovering
}

const toPauseAnimation = {
    height: 11, // Height when transitioning to the pause state
}

const staticAnimation = {
    height: 2, // Height when inactive
}

// Props type definition for the Waveform component
type WaveformProps = {
    active: boolean // Indicates if the waveform is active
    audioRef: RefObject<HTMLAudioElement> | null // Reference to the audio element
    paused: boolean // Indicates if the audio is paused
    setPaused: (paused: boolean) => void // Function to update the paused state
}

// Functional component for the animated waveform
const Waveform: FC<WaveformProps> = ({
    active,
    audioRef,
    paused,
    setPaused,
}) => {
    // State to track whether the button is being hovered
    const [isHovering, setIsHovering] = useState(false)

    // State to hold the animations for the waveform bars
    const [animations, setAnimations] = useState<TargetAndTransition[]>([])

    // Effect to generate new animations when the component is active and not paused
    useEffect(() => {
        if (active && !paused && !isHovering) {
            setAnimations(generateWaveformAnimations(6)) // Generate animations for 6 bars
        }
    }, [active, paused, isHovering]) // Dependencies ensure the effect runs when these values change

    // Effect to handle playback when the waveform is active
    useEffect(() => {
        if (active) {
            setPaused(false) // Unpause the audio when active
            audioRef?.current?.play() // Start playback
        }
    }, [active]) // Runs whenever the active state changes

    return (
        // Main button container for the waveform, styled with motion
        <motion.button
            className="flex h-8 min-w-8 flex-1 items-center justify-center gap-[1.5px] overflow-hidden rounded-full bg-white"
            animate={isHovering || paused ? { gap: "3px" } : { gap: "1.5px" }} // Adjust spacing when hovering or paused
            onMouseEnter={() => setIsHovering(true)} // Set hovering state on mouse enter
            onMouseLeave={() => setIsHovering(false)} // Reset hovering state on mouse leave
            onClick={() => {
                setPaused(!paused) // Toggle pause state on click
                if (paused) {
                    setIsHovering(false) // Disable hovering state when resuming playback
                    audioRef?.current?.play() // Resume playback
                } else {
                    audioRef?.current?.pause() // Pause playback
                }
            }}
        >
            {/* First two bars of the waveform */}
            {animations.slice(0, 2).map((animation, index) => (
                <motion.div
                    key={index}
                    className="h-3 w-[2px] rounded-full bg-black" // Style for the waveform bar
                    animate={
                        !active // If inactive, use static animation
                            ? staticAnimation
                            : isHovering || paused // When hovering or paused, use hovering animation
                            ? hoveringAnimation
                            : animation // Default animation
                    }
                ></motion.div>
            ))}
            {/* Middle two bars that transition to the pause state */}
            <motion.div
                key={3}
                className="h-3 w-[2px] rounded-full bg-black"
                animate={
                    !active // If inactive, use static animation
                        ? staticAnimation
                        : isHovering || paused // When hovering or paused, use pause animation
                        ? toPauseAnimation
                        : animations[2] // Default animation
                }
            ></motion.div>
            <motion.div
                key={4}
                className="h-3 w-[2px] rounded-full bg-black"
                animate={
                    !active // If inactive, use static animation
                        ? staticAnimation
                        : isHovering || paused // When hovering or paused, use pause animation
                        ? toPauseAnimation
                        : animations[3] // Default animation
                }
            ></motion.div>
            {/* Last two bars of the waveform */}
            {animations.slice(4, 6).map((animation, index) => (
                <motion.div
                    key={index}
                    className="h-3 w-[2px] rounded-full bg-black"
                    animate={
                        !active // If inactive, use static animation
                            ? staticAnimation
                            : isHovering || paused // When hovering or paused, use hovering animation
                            ? hoveringAnimation
                            : animation // Default animation
                    }
                ></motion.div>
            ))}
        </motion.button>
    )
}

export default Waveform // Export the component for use in other parts of the application
