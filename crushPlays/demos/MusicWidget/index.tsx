"use client" // Ensures the component is rendered on the client side (not during server-side rendering) in frameworks like Next.js

// Importing necessary modules and components
import { useState } from "react" // useState hook for managing state in a functional component
import { songs } from "./songs" // Importing the list of songs (data)
import SongWidget from "./SongWidget" // Component for displaying individual song widgets
import VolumeBar from "./VolumeBar" // Component for controlling volume settings

// Type definition for the leaning state
export type Lean = "left" | "right" | null // Represents the direction of a swipe or lean

// Main MusicWidget component
const MusicWidget = () => {
    // State to manage the current order of songs by their IDs
    const [orderedSongs, setOrderedSongs] = useState<string[]>(
        Array.from({ length: songs.length }, (_, index) => songs[index].id), // Initialize as an array of song IDs
    )

    // State to track the previous order of songs (used for animation or comparison purposes)
    const [previousOrderedSongs, setPreviousOrderedSongs] =
        useState<string[]>(orderedSongs)

    // State to manage the "leaning" direction (left, right, or null)
    const [leaning, setLeaning] = useState<Lean>(null)

    // State to manage the current volume level (range: 0 to 1)
    const [volume, setVolume] = useState(0.5)

    // State to manage whether the audio is muted
    const [muted, setMuted] = useState(true)

    // Function to handle swiping gestures (change song order)
    const emitSwipe = (direction: Exclude<Lean, null>) => {
        setPreviousOrderedSongs(orderedSongs) // Save the current order before updating
        if (direction === "right") {
            // Swipe to the right: move the first song to the end of the list
            setOrderedSongs((prev) => [...prev.slice(1), prev[0]])
        } else {
            // Swipe to the left: move the last song to the beginning of the list
            setOrderedSongs((prev) => [
                prev[prev.length - 1],
                ...prev.slice(0, -1),
            ])
        }
    }

    return (
        // Main container for the widget
        <div className="relative flex items-center justify-center -translate-x-8">
            {/* Map through the songs array and render a SongWidget for each song */}
            {songs.map((song) => (
                <SongWidget
                    key={song.id} // Unique key for each widget
                    song={song} // Pass the current song data to the widget
                    previousOrderedSongs={previousOrderedSongs} // Pass the previous song order
                    orderedSongs={orderedSongs} // Pass the current song order
                    emitSwipe={emitSwipe} // Function to handle swipe gestures
                    leaning={leaning} // Current leaning direction
                    setLeaning={setLeaning} // Function to update the leaning state
                    volume={volume} // Current volume level
                    muted={muted} // Current mute status
                />
            ))}

            {/* VolumeBar component to control the volume and mute status */}
            <VolumeBar
                volume={volume} // Current volume level
                setVolume={setVolume} // Function to update the volume
                muted={muted} // Current mute status
                setMuted={setMuted} // Function to update the mute status
            />

            
        </div>
    )
}

export default MusicWidget // Export the MusicWidget component as the default export
