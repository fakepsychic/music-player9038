// Importing required modules, components, and hooks
import Waveform from "./Waveform" // Component to render audio waveforms
import RotatingText from "./RotatingText" // Component to display rotating text
import { FC, RefObject, useEffect, useRef, useState } from "react" // React hooks and types
import { Song } from "./songs" // Type definition for Song
import Image from "next/image" // Optimized image component from Next.js
import { motion, animate } from "framer-motion" // Motion library for animations
import { PanInfo } from "framer-motion" // Type definition for drag events
import { useMotionValue, useTransform } from "framer-motion" // Motion hooks
import { Lean } from "./index" // Type definition for leaning direction
import { cn } from "@/lib/utils" // Utility for conditional class names

// Type definition for the props expected by SongWidget
type SongWidgetProps = {
    song: Song // Song object containing metadata
    orderedSongs: string[] // Array representing the order of songs by ID
    previousOrderedSongs: string[] // Array for the previous song order (used for transitions)
    emitSwipe: (direction: Exclude<Lean, null>) => void // Function to handle swipe gestures
    leaning: Lean // Current leaning direction (left, right, or null)
    setLeaning: (leaning: Lean) => void // Function to update leaning state
    volume: number // Current volume level (0 to 1)
    muted: boolean // Boolean to control mute state
}

// Functional component for the song widget
const SongWidget: FC<SongWidgetProps> = ({
    song,
    orderedSongs,
    previousOrderedSongs,
    emitSwipe,
    leaning,
    setLeaning,
    volume,
    muted,
}) => {
    // Determine the rank of the current song in the order
    const rank = orderedSongs.indexOf(song.id)
    const previousRank = previousOrderedSongs.indexOf(song.id)

    // References and states
    const ref = useRef<HTMLDivElement>(null) // Ref to access the widget container
    const [isActive, setIsActive] = useState(false) // State for whether the song is active
    const [isLast, setIsLast] = useState(false) // State for whether the song is the last in the list
    const [isNext, setIsNext] = useState(false) // State for whether the song is the next to play
    const [isDragging, setIsDragging] = useState(false) // State for drag activity
    const [paused, setPaused] = useState(false) // State to track audio pause

    const dragOffset = useMotionValue(0) // Motion value for drag offset
    const dragRotation = useTransform(dragOffset, [-200, 200], [-5, 5]) // Maps drag offset to rotation
    const affectedRotation = useMotionValue(0) // Motion value for additional rotation effect

    const audioRef = useRef<HTMLAudioElement | null>(null) // Ref to access the audio element

    // Handles drag gestures
    const handleDrag = (_: unknown, info: PanInfo) => {
        setIsDragging(true) // Mark the widget as being dragged
        dragOffset.set(info.offset.x) // Update drag offset value
        if (info.offset.x > 100) {
            setLeaning("right") // Lean right if dragged far enough
        } else if (info.offset.x < -100) {
            setLeaning("left") // Lean left if dragged far enough
        } else {
            setLeaning(null) // Reset leaning state
        }
    }

    // Handles the end of a drag gesture
    const handleDragEnd = (_: unknown, info: PanInfo) => {
        setTimeout(() => {
            setIsDragging(false) // Reset dragging state after animation
        }, 500)
        animate(dragOffset, 0, { type: "spring", stiffness: 300, damping: 30 }) // Smoothly reset drag offset
        if (info.offset.x > 100) {
            emitSwipe("right") // Trigger right swipe if dragged far enough
        } else if (info.offset.x < -100) {
            emitSwipe("left") // Trigger left swipe if dragged far enough
        }
        setLeaning(null) // Reset leaning state
    }

    // Sync volume level with the audio element
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    // Sync mute state with the audio element
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = muted
        }
    }, [muted])

    // Handle audio playback when the widget is active
    useEffect(() => {
        if (!audioRef.current) return

        if (isActive) {
            // Play audio if the widget is active
            audioRef.current.play().catch((error) => {
                if (error.name === "NotAllowedError") {
                    setPaused(true) // Handle autoplay restrictions
                    console.log("Audio autoplay blocked - waiting for user interaction")
                } else {
                    console.error("Audio playback error:", error)
                }
            })
        } else {
            // Pause and reset audio if not active
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }

        // Cleanup on unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
        }
    }, [isActive, song])

    // Handle animations based on rank, leaning, and drag states
    useEffect(() => {
        if (isLast && leaning === "right") {
            animate(affectedRotation, -5) // Rotate slightly left for leaning right
            animate(ref.current!, { x: -50 }) // Shift position slightly left
        }
        if (isNext && leaning === "left") {
            animate(affectedRotation, 5) // Rotate slightly right for leaning left
            animate(ref.current!, { x: 50 }) // Shift position slightly right
        }
        if (!isDragging && leaning === null) {
            animate(affectedRotation, 0) // Reset rotation
            animate(ref.current!, { x: 0 }) // Reset position
        }
    }, [rank, leaning, isLast, isActive, isDragging, isNext])

    // Update widget state based on its rank in the list
    useEffect(() => {
        setIsActive(rank === orderedSongs.length - 1) // Active if it's the current song
        setIsNext(rank === orderedSongs.length - 2) // Next if it's second in the list
        setIsLast(rank === 0) // Last if it's at the start of the list
    }, [rank, orderedSongs.length])

    return (
        <motion.div
            ref={ref} // Reference for motion element
            className="absolute flex size-48 cursor-grab items-center justify-center overflow-hidden rounded-[42px] active:cursor-grabbing"
            drag="x" // Allow horizontal dragging
            dragMomentum // Enable momentum after drag
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }} // Constrain drag to horizontal axis
            onDragEnd={handleDragEnd} // Handle drag end events
            onDrag={handleDrag} // Handle drag events
            style={{
                rotate: isDragging ? dragRotation : affectedRotation, // Apply rotation based on drag or effect
                zIndex: rank, // Set stack order based on rank
            }}
        >
            {/* Background and song image */}
            <div className="absolute left-0 top-0 -z-10 h-full w-full bg-zinc-300"></div>
            <Image
                src={song.image}
                alt={`${song.title} by ${song.artist}`} // Alt text for accessibility
                className={cn(
                    "pointer-events-none h-full w-full object-cover transition-opacity duration-150",
                    !isActive && "opacity-50", // Dim image if not active
                )}
                width={300}
                height={300}
            />
            {/* Gradient overlay */}
            <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-black to-transparent"></div>
            {/* Song details and waveform */}
            <div className="absolute bottom-0 left-0 flex w-full items-center justify-start gap-2 p-4">
                <Waveform
                    active={isActive} // Activate waveform if song is active
                    audioRef={audioRef as RefObject<HTMLAudioElement>} // Reference to audio element
                    paused={paused} // Pass paused state
                    setPaused={setPaused} // Update paused state
                />
                <div className="relative flex w-full flex-col items-start justify-center pr-5 -translate-x-2">
                    <RotatingText text={song.title} /> {/* Rotating song title */}
                    <RotatingText
                        text={song.artist}
                        className="w-full truncate text-xs font-normal text-zinc-300" // Rotating artist name
                    />
                </div>
            </div>
            {/* Hidden audio element */}
            <audio
                ref={audioRef} // Reference to audio element
                className="hidden"
                src={`/api/audio?id=${song.id}`} // Audio source based on song ID
                muted={muted} // Sync mute state
                loop // Loop the audio
            />
        </motion.div>
    )
}

export default SongWidget // Export the component for use elsewhere
