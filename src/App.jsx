import { useEffect, useState } from "react";
import { FaMicrophoneLines } from "react-icons/fa6";
import { LuSendHorizontal, LuTrash2 } from "react-icons/lu";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


function App() {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    const [micPermission, setMicPermission] = useState("prompt");

    // =========================
    // CHECK MICROPHONE PERMISSION
    // =========================
    const checkMicPermission = async () => {
        try {
            const result = await navigator.permissions.query({
                name: "microphone",
            });

            setMicPermission(result.state);

            // Permission state change listener
            result.onchange = () => {
                setMicPermission(result.state);
            };

            return result.state;
        } catch (error) {
            console.log(error);
            return "prompt";
        }
    };

    // =========================
    // REQUEST MICROPHONE PERMISSION
    // =========================
    const requestMicPermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            setMicPermission("granted");

            console.log("Microphone permission granted");

            return true;
        } catch (error) {
            setMicPermission("denied");

            console.log("Microphone permission denied", error);

            return false;
        }
    };

    // =========================
    // START LISTENING
    // =========================
    const handleMicButtonPressAndHold = async () => {
        let permission = micPermission;

        // First check latest permission state
        permission = await checkMicPermission();

        // If not granted then ask permission
        if (permission !== "granted") {
            const granted = await requestMicPermission();

            // If still not granted stop here
            if (!granted) return;
        }

        SpeechRecognition.startListening({
            continuous: true,
            language: "en-IN",
        });
    };

    const handleMicButtonLeave = () => {
        SpeechRecognition.stopListening();
    };

    const handleDeleteButtonClick = () => {
        resetTranscript();
    };

    const handleSendButtonClick = async () => {

    };

    if (!browserSupportsSpeechRecognition) {
        return (
            <div className="p-5">
                Browser doesn't support speech recognition
            </div>
        );
    }
    
    return (
        <section className="w-full p-4 grid gap-4 h-dvh" style={{gridTemplateRows: "1fr auto auto"}}>
            <textarea 
                value={transcript} 
                placeholder='Listening...'
                rows={5}
                className="w-full border-none outline-none resize-none hide-scrollbar bg-white rounded-lg p-3 text-sm leading-4.5 overflow-hidden" 
            />

            <div className="relative w-full flex items-center justify-around">
                <button 
                    onClick={handleDeleteButtonClick}
                    className="w-14 h-14 mt-6 rounded-full bg-[#8100d125] flex items-center justify-center shadow-xs cursor-pointer"
                >
                    <LuTrash2 className="text-2xl text-primary"/>
                </button>

                <button 
                    className={`w-18 h-18 rounded-full bg-purple-800 flex items-center justify-center shadow-xs cursor-pointer ${
                        listening ? "animate-[micPulse_1s_infinite]" : ""
                    }`}
                    onMouseDown={handleMicButtonPressAndHold}
                    onMouseUp={handleMicButtonLeave}
                    onMouseLeave={handleMicButtonLeave}
                    onTouchStart={handleMicButtonPressAndHold}
                    onTouchEnd={handleMicButtonLeave}
                >
                    <FaMicrophoneLines className="text-3xl text-white"/>
                </button>

                <button 
                    onClick={handleSendButtonClick}
                    className="w-14 h-14 mt-6 rounded-full bg-[#8100d125] flex items-center justify-center shadow-xs cursor-pointer"
                >
                    <LuSendHorizontal className="text-2xl text-primary"/>
                </button>
            </div>
        </section>
    )
};

export default App;