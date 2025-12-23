// lib/utils.js
export const calculateTimeLeft = (expiryDate) => {
    const difference = new Date(expiryDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            hours: Math.floor((difference / (1000 * 60 * 60))),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            totalSeconds: Math.floor(difference / 1000)
        };
    } else {
        timeLeft = { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
    }

    return timeLeft;
};