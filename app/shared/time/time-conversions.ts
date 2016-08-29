/**
 * Converts milliseconds into hours rounded to 2 decimal places
 *
 * @private
 * @param {number} ms the milliseconds to convert
 * @returns {number} the rounded hours (e.g. 1.02)
 */
export function convertMsToRoundedHours(milliseconds: number): number {
    let hours: number = parseFloat((milliseconds / 1000 / 60 / 60).toFixed(2));
    return hours;
}

export function convertMsToReadableTime(milliseconds: number): string {
    let hours: number = parseFloat((milliseconds / 1000 / 60 / 60).toFixed(0));
    let minutes: number = parseFloat((milliseconds / 1000 / 60).toFixed(0));

    let readableHours: string = (hours < 10 ? "0" : "") + `${hours}`;
    let readableMinutes: string = (minutes < 10 ? "0" : "") + `${minutes}`;

    return `${readableHours}:${readableMinutes}`;
}