import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    isLoading = signal<boolean>(false);
    private loadingStartTime: number = 0;
    private minDuration: number = 2000; // 3 seconds minimum display time

    show() {
        this.loadingStartTime = Date.now();
        this.isLoading.set(true);
    }

    hide() {
        const elapsed = Date.now() - this.loadingStartTime;
        const remaining = Math.max(0, this.minDuration - elapsed);

        this.isLoading.set(false);
        // setTimeout(() => {
        //     this.isLoading.set(false);
        // }, remaining);
    }
}
