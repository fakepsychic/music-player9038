// Importing required modules, components, and hooks
import { FC, useEffect, useRef, useState } from "react" // React hooks and types
import { motion } from "framer-motion" // Motion library for animations and gestures
import {
    Volume1Icon,
    Volume2Icon,
    VolumeIcon,
    VolumeOffIcon,
} from "lucide-react" // Icons for volume control

// Type definition for the props expected by the VolumeBar component
type VolumeBarProps = {
    volume: number // Current volume level (0 to 1)
    setVolume: (volume: number) => void // Function to update volume level
    muted: boolean // Current mute state
    setMuted: (muted: boolean) => void // Function to update mute state
}

// Functional component for the volume bar
const VolumeBar: FC<VolumeBarProps> = ({
    volume,
    setVolume,
    muted,
    setMuted,
}) => {
    const [previousVolume, setPreviousVolume] = useState(volume) // Track the volume before muting
    const range = useRef<HTMLDivElement>(null) // Ref to access the volume bar container
    const [dragStartY, setDragStartY] = useState(0) // Y-coordinate at the start of a drag gesture
    const [volumeAtDragStart, setVolumeAtDragStart] = useState(0) // Volume at the start of a drag gesture

    // Effect to handle volume changes using keyboard arrow keys
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                // Increase volume on ArrowUp
                setVolume(Math.min(1, volume + 0.05)) // Clamp volume to a maximum of 1
            } else if (e.key === "ArrowDown") {
                // Decrease volume on ArrowDown
                setVolume(Math.max(0, volume - 0.05)) // Clamp volume to a minimum of 0
            }
        }
        // Add event listener for keydown events
        window.addEventListener("keydown", handleKeyDown, { passive: false })
        return () => window.removeEventListener("keydown", handleKeyDown) // Cleanup on unmount
    }, [volume, setVolume])

    // Effect to store the current volume when muted is toggled
    useEffect(() => {
        if (!muted) {
            setPreviousVolume(volume) // Save the current volume before muting
        }
    }, [volume, muted])

    // Handle volume icon click to toggle mute
    const handleVolumeClick = () => {
        if (muted) {
            setVolume(previousVolume) // Restore the previous volume when unmuting
        } else {
            setPreviousVolume(volume) // Save the current volume before muting
            setVolume(0) // Set volume to 0 when muting
        }
        setMuted(!muted) // Toggle mute state
    }

    return (
        <div className="flex flex-col items-center justify-center gap-2 overflow-hidden translate-x-36">
            {/* Volume bar container */}
            <div
                ref={range} // Reference to the volume bar for drag constraints
                className="flex h-40 w-5 items-end overflow-hidden rounded-full bg-zinc-300"
            >
                {/* Filled portion of the volume bar based on volume level */}
                <div
                    className="flex w-full items-start justify-center bg-zinc-500"
                    style={{ height: `${volume * 100}%` }} // Dynamic height based on volume
                >
                    <motion.div
                        className="absolute left-0 top-1/2 h-full w-full cursor-grab rounded-full -translate-y-1/2 active:cursor-grabbing"
                        drag="y" // Enable vertical dragging
                        dragConstraints={range} // Constrain drag within the volume bar
                        dragElastic={0} // Disable elastic effect
                        dragMomentum={false} // Disable momentum after drag
                        onDragStart={(_, info) => {
                            setDragStartY(info.point.y) // Set initial Y-coordinate of the drag
                            setVolumeAtDragStart(volume) // Save the volume at drag start
                        }}
                        onDrag={(_, info) => {
                            if (!range.current) return
                            setMuted(false) // Unmute on drag

                            const rect = range.current.getBoundingClientRect() // Get dimensions of the volume bar
                            const dragDelta = info.point.y - dragStartY // Calculate drag distance
                            const heightPercentage = dragDelta / rect.height // Convert drag distance to percentage
                            const newVolume =
                                volumeAtDragStart - heightPercentage // Calculate new volume

                            // Clamp the new volume between 0 and 1
                            const clampedVolume = Math.max(
                                0,
                                Math.min(1, newVolume),
                            )
                            setVolume(Number(clampedVolume.toFixed(2))) // Update the volume state
                        }}
                    ></motion.div>
                </div>
            </div>
            {/* Volume control button with dynamic icons */}
            <button
                className="z-10 flex items-center justify-center text-zinc-500"
                onClick={handleVolumeClick} // Toggle mute on click
            >
                {/* Display appropriate icon based on volume and mute state */}
                {!muted ? (
                    volume === 0 ? ( // No sound
                        <VolumeIcon className="translate-x-1" />
                    ) : volume < 0.5 ? ( // Low volume
                        <Volume1Icon />
                    ) : ( // High volume
                        <Volume2Icon />
                    )
                ) : (
                    <VolumeOffIcon /> // Muted state
                )}
            </button>
        </div>
    )
}

export default VolumeBar // Export the component for use elsewhere
