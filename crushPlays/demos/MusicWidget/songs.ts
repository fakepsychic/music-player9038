// Type definition for a Song object
export type Song = {
    id: string // Unique identifier for the song
    title: string // Title of the song
    artist: string // Name of the artist(s)
    image: string // URL to the album or song's cover image
}

// Exporting a constant array of songs
export const songs: Song[] = [
    {
        id: "nothing's gonna hurt you baby", // Unique identifier for this song
        title: "nothing's gonna hurt you baby)", // Song title with context
        artist: "cigarettes after sex", // Artists who performed the song
        image: "https://i.pinimg.com/736x/ef/6e/11/ef6e1129809c85d710d4e533134e9092.jpg", // Album or song image URL
    },
    {
        id: "the blonde-TV girl",
        title: "the blonde-TV girl", // Title of the song
        artist: "TV girl", // Artist name
        image: "https://i.pinimg.com/564x/de/02/9f/de029f7c52606699dadc87950f4ecf0c.jpg", // Cover image URL
    },
    {
        id: "Baby came home2",
        title: "Baby came home2",
        artist: "the neighbour hood",
        image: "https://images.genius.com/858fc19cb2091093364895e43ccb1264.1000x1000x1.jpg",
    },
    {
        id: "hona-tha-pyar",
        title: "hona-tha-pyar",
        artist: "atif aslam",
        image:"https://i.ytimg.com/vi/dFjEyPoXFuw/maxresdefault.jpg",
    },
    {
        id: "TU-hoti-toh",
        title: "TU-hoti-toh",
        artist: "mohit chauhan",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqFbp7KfXStIMQoLMFDkiqLsQUyoEWZNNSXg&s",
    },
    {
        id: "gulabo",
        title: "gulabo",
        artist: "dang bala",
        image:"https://i.pinimg.com/736x/10/d7/ac/10d7ac5531653720794a71d35bd40a13.jpg",
    },
].reverse() // Reverses the order of the songs in the array

