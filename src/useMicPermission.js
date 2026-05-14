import { useState, useEffect } from 'react';


export function useMicPermission() {
    const [micPermission, setMicPermission] = useState("prompt");

    const requestMicPermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            setMicPermission("granted");
            window.location.reload();
            return true;
            
        } catch (error) {
            setMicPermission("denied");
            console.log("Microphone permission denied", error);
            return false;
        }
    };

    useEffect(() => {
        const checkMicPermission = async () => {
            try {
                const result = await navigator.permissions.query({
                    name: "microphone",
                });

                setMicPermission(result.state);

                result.onchange = () => {
                    setMicPermission(result.state);
                };

            } catch (error) {
                console.log("Microphone permission", error);
            }
        };

        checkMicPermission();
    }, [])

    return { micPermission, requestMicPermission }
}