import { useEffect } from "react";
import { FaMicrophoneLines } from "react-icons/fa6";
import { LuSendHorizontal, LuTrash2 } from "react-icons/lu";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


function App() {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    const handleMicButtonPressAndHold = () => { 
        SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    };

    const handleMicButtonLeave = () => {
        SpeechRecognition.stopListening();
    };

    const handleDeleteButtonClick = () => {
        resetTranscript();
    };

    const handleSendButtonClick = async () => {

    };

    const requestMicPermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });

            console.log("Microphone permission granted");
        } catch (error) {
            console.log("Microphone permission denied", error);
        }
    };

    useEffect(() => {
        requestMicPermission();
    }, []);
    
    return (
        <section className="w-full p-4 grid gap-4 h-dvh" style={{gridTemplateRows: "1fr auto auto"}}>
            <textarea 
                value={transcript} 
                placeholder='Listening...'
                rows={5}
                className="w-full border-none outline-none resize-none hide-scrollbar bg-white rounded-lg p-3 text-sm leading-4.5 overflow-hidden" 
            />

            <button onClick={requestMicPermission}>
                Allow Microphone
            </button>

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