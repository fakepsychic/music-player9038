// Importing types from the framer-motion library for defining animations and transitions
import { TargetAndTransition } from "framer-motion"

// Utility function to generate a random integer between a given minimum and maximum value (inclusive)
const randomBetween = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min

// Utility function to generate an array of unique random numbers
// The array will have the specified length, with each number within the provided min and max range
const generateUniqueArray = (length: number, min: number, max: number) => {
    const array = [] // Initialize an empty array to store the values
    let lastValue = null // Keep track of the last value to ensure uniqueness

    for (let i = 0; i < length; i++) {
        let newValue
        do {
            // Generate a new random value until it's different from the last value
            newValue = randomBetween(min, max)
        } while (newValue === lastValue)
        array.push(newValue) // Add the new value to the array
        lastValue = newValue // Update the last value
    }

    return array // Return the generated array
}

// Constants defining animation settings
const DURATION_UPPER = 2.3 // Upper bound for animation duration
const DURATION_LOWER = 1.8 // Lower bound for animation duration
const MAX_HEIGHT = 12 // Maximum height value for animations
const MIN_HEIGHT = 3 // Minimum height value for animations

// Transition settings for animations, specifying repetition, ease type, and other properties
const transition: TargetAndTransition["transition"] = {
    repeat: Infinity, // Animation repeats infinitely
    repeatType: "reverse", // Animation reverses after each cycle
    ease: "easeInOut", // Smooth easing for transitions
}

// Main function to generate animations for a waveform effect
export const generateWaveformAnimations = (
    count: number, // Number of animations to generate
): TargetAndTransition[] => {
    // Generate unique durations for each animation based on the provided range
    const durations = generateUniqueArray(count, DURATION_LOWER, DURATION_UPPER)

    // Generate an array of animation objects
    return Array.from({ length: count }, (_, index) => ({
        height: generateUniqueArray(6, MIN_HEIGHT, MAX_HEIGHT), // Generate height values for the animation
        transition: {
            ...transition, // Spread transition settings
            duration: durations[index], // Assign a unique duration to each animation
        },
    }))
}
