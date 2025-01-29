// Importing necessary modules and hooks
import { useEffect, useRef, useState } from "react" // React hooks for state and lifecycle management
import Marquee from "react-fast-marquee" // Marquee component for scrolling text animation
import { cn } from "../../utils" // Utility function for conditional class names

// Type definition for the props expected by the RotatingText component
type RotatingTextProps = {
    text: string // The text to be displayed in the rotating marquee
    className?: string // Optional additional CSS class names
}

// Main RotatingText component
const RotatingText = ({ text, className }: RotatingTextProps) => {
    // State to control whether the marquee animation is playing
    const [isPlaying, setIsPlaying] = useState(false)

    // Ref to access the DOM element of the text span
    const textRef = useRef<HTMLSpanElement>(null)

    // Function to pause the marquee animation temporarily
    const pause = () => {
        setIsPlaying(false) // Pause the animation
        setTimeout(() => {
            setIsPlaying(true) // Resume the animation after 3 seconds
        }, 3000)
    }

    // Effect to determine whether the text length exceeds the limit and adjust animation state
    useEffect(() => {
        // Check if the text exceeds 16 characters
        if (textRef.current && textRef.current.textContent!.length > 16) {
            pause() // Pause the animation if text is long
        } else {
            setIsPlaying(false) // Stop the animation for short text
        }
    }, [textRef]) // Run the effect when the textRef changes

    return (
        <>
            {/* Marquee component for rotating text */}
            <Marquee
                className={cn(
                    // Combine default styles with optional className
                    "relative flex h-full w-full items-center justify-start overflow-hidden font-semibold text-zinc-50",
                    className,
                )}
                style={{
                    // Masking effect for smooth entry and exit of text
                    maskImage: `linear-gradient(to right, transparent, black 5%, black 95%, transparent)`,
                }}
                speed={20} // Speed of the marquee
                onCycleComplete={pause} // Pause animation when a cycle completes
                play={isPlaying} // Control whether the marquee is playing
            >
                {/* Display the text inside the marquee */}
                <span ref={textRef} className="px-2">
                    {text}
                </span>
                {/* Spacer div to maintain consistent marquee spacing */}
                <div className="h-full w-10"></div>
            </Marquee>

            {/* Hidden span for checking text length without affecting layout */}
            <span ref={textRef} className="absolute opacity-0">
                {text}
            </span>
        </>
    )
}

export default RotatingText // Export the RotatingText component as the default export
