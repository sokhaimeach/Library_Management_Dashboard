import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    isLoading = signal<boolean>(false);
    private loadingStartTime: number = 0;

    private getDynamicDuration(): number {
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

        if (!connection) return 1500; // Default fallback

        switch (connection.effectiveType) {
            case '4g':
                return 800;  // Fast connection, short spinner
            case '3g':
                return 1500; // Sub-optimal, standard spinner
            case '2g':
            case 'slow-2g':
                return 3000; // Slow connection, longer spinner to avoid flickering
            default:
                return 1500;
        }
    }

    show() {
        this.loadingStartTime = Date.now();
        this.isLoading.set(true);
    }

    hide() {
        const elapsed = Date.now() - this.loadingStartTime;
        const minDuration = this.getDynamicDuration();
        const remaining = Math.max(0, minDuration - elapsed);

        setTimeout(() => {
            this.isLoading.set(false);
        }, remaining);
    }
}
