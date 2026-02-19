export const formatDuration = (seconds) => {
    // 1. Safety Check First
    if (!seconds || isNaN(seconds) || seconds < 0) return "0:00";

    // 2. Calculate units
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    // 3. Format seconds (always needs 2 digits)
    const paddedSecs = secs.toString().padStart(2, '0');

    // 4. Case: 1 hour or more (YouTube style: 1:05:02)
    if (hours > 0) {
        const paddedMins = minutes.toString().padStart(2, '0');
        return `${hours}:${paddedMins}:${paddedSecs}`;
    }

    // 5. Case: Less than an hour (YouTube style: 12:53 or 0:05)
    // We don't pad the first number (minutes)
    return `${minutes}:${paddedSecs}`;
};