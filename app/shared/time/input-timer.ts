import * as timer from "timer";

export class InputTimer {
    private timerRef: number;
    private timeoutCallback: Function
    private interval: number;

    constructor(timeoutCallback: Function, interval?: number) {
        this.timeoutCallback = timeoutCallback;
        this.interval = interval || 700;
    }

    public startOrRestart(): void {
        // If a timer is running clear it out so it starts over
        if(this.timerRef) {
            timer.clearTimeout(this.timerRef);
        }

        // give the user some time to finish typing then invoke callback
        this.timerRef = timer.setTimeout(() => this.timeoutCallback(), this.interval);
    }
}