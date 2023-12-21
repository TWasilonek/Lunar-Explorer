export function generateBookingNumber(length = 10) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let bookingNumber = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        bookingNumber += characters.charAt(randomIndex);
    }
    return bookingNumber;
}
