import * as timer from "timer";

export class Timer {
    private startTime: Date;
    private stopTime: Date;
    private tickerRef: number;

    /**
     * Starts the timer after being reset.
     *
     * @param {Function} [tickCallback] an optional callback during an interval of time
     * @param {number} [interval] an optional interval the callback should happen in. defaults to 1000 ms
     * @returns {Date} returns the start time of the timer. if the timer was not reset, it will return the original start time
     */
    public start(tickCallback?: Function, interval?: number): Date {
        this.reset();
        this.startTime = new Date();

        if (tickCallback) {
            this.tickerRef = timer.setInterval(() => tickCallback(), interval || 1000);
        }

        return this.startTime;
    }

    /**
     * stops the timer
     *
     * @returns {Date} returns the time it was stopped
     */
    public stop(): Date {
        timer.clearInterval(this.tickerRef);
        this.stopTime = new Date();
        return this.stopTime;
    }

    /**
     * Resets the timer
     */
    public reset(): void {
        this.clear();
    }

    /**
     * disposes the timer
     */
    public dispose(): void {
        this.clear();
    }

    public isRunning(): boolean {
        return this.tickerRef !== null && this.tickerRef !== undefined;
    }

    /**
     * Gets the amount of time ellapsed in milliseconds. If the timer is not stopped
     * it will return the currently ellapsed amount of time. if it is stopped, it will
     * return the amount of time between when the timer was started and when it was stopped.
     *
     * @returns {number} the amount of time ellapsed in milliseconds
     */
    public getEllapsedMilliseconds(): number {
        let ellapsedMilliseconds: number = (this.stopTime ? this.stopTime.getTime() : new Date().getTime()) - this.startTime.getTime();
        return ellapsedMilliseconds;
    }

    /**
     * stops the timer and clears all timer members
     *
     * @private
     */
    private clear(): void {
        this.stop();
        this.startTime = null;
        this.stopTime = null;
    }
}