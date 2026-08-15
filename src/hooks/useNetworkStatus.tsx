import { useState } from "react";

function useNetworkStatus(): boolean {
    const [isOnline, setIsOnline] = useState(true);

    window.ononline = () => {
        setIsOnline(true);
    };
    window.onoffline = () => {
        setIsOnline(false);
    };

    return isOnline;
}

export { useNetworkStatus };