import React, { useRef, useEffect, useContext, useState } from "react";
import { userDataContext } from "../context/userContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [enabled, setEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  const unlockSpeech = () => {
    if (!enabled) {
      const utter = new SpeechSynthesisUtterance(" ");
      utter.volume = 0;
      synth.speak(utter);
      setEnabled(true);
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const handleLogOut = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
    }

    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error(
        "Logout request failed:",
        error.response?.data || error.message
      );
    } finally {
      setUserData(null);
      navigate("/login");
    }
  };

  const speak = (text) => {
    if (!text || isSpeakingRef.current) return;
    isSpeakingRef.current = true;
    synth.cancel();

    const chunkSize = 200;
    const chunks = [];
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.startsWith("hi-")) || voices[0];

    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    let chunkIndex = 0;

    const speakNextChunk = () => {
      if (chunkIndex >= chunks.length) {
        isSpeakingRef.current = false;
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      utterance.lang = "hi-IN";
      utterance.rate = 1;
      utterance.voice = voice;
      utterance.pitch = 1;

      utterance.onend = () => {
        chunkIndex++;
        speakNextChunk();
      };

      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        isSpeakingRef.current = false;
      };

      synth.speak(utterance);
    };

    speakNextChunk();
  };

  const handleCommand = (data) => {
    const { type, userInput } = data;
    const openWindow = (url) => window.open(url, "_blank");
    switch (type) {
      case "google_search":
        openWindow(
          `https://www.google.com/search?q=${encodeURIComponent(userInput)}`
        );
        break;
      case "youtube_search":
      case "youtube_play":
        openWindow(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            userInput
          )}`
        );
        break;
      case "calculator_open":
        openWindow("https://www.google.com/search?q=calculator");
        break;
      case "instagram_open":
        openWindow("https://www.instagram.com");
        break;
      case "facebook_open":
        openWindow("https://www.facebook.com");
        break;
      case "whatsapp_open":
        openWindow("https://web.whatsapp.com");
        break;
      case "weather_show":
        openWindow(
          `https://www.google.com/search?q=weather+${encodeURIComponent(
            userInput || "current location"
          )}`
        );
        break;
      default:
        console.log("Command not recognized:", type);
        break;
    }
  };

  useEffect(() => {
    if (!enabled) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    const isRecognizingRef = { current: false };

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
        } catch (error) {
          if (error.name !== "InvalidStateError") console.log(error);
        }
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };
    recognition.onend = () => {
      setListening(false);
      isRecognizingRef.current = false;
      safeRecognition();
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setUserText(transcript);
        setResponseText("");
        const data = await getGeminiResponse(transcript);
        speak(data.response);
        handleCommand(data);
        setResponseText(data.response);
        setUserText("");
      }
    };

    safeRecognition();
    return () => recognition.stop();
  }, [enabled]);

  return (
    <div
      onClick={unlockSpeech}
      className="w-full min-h-screen bg-gradient-to-t from-black to-[#050550] flex flex-col lg:flex-row items-center lg:items-start gap-6 pt-16 text-white relative"
    >
      {/* Hamburger */}
      <GiHamburgerMenu
        className="lg:hidden text-white w-7 h-7 absolute top-6 right-6 cursor-pointer"
        onClick={() => setMenuOpen(true)}
      />

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#000000d9] backdrop-blur-lg z-50 flex flex-col p-6 gap-4">
          <RxCross2
            className="text-white w-7 h-7 absolute top-6 right-6 cursor-pointer"
            onClick={() => setMenuOpen(false)}
          />
          <button
            className="bg-white text-black font-bold text-lg px-4 py-3 w-full rounded-lg hover:bg-gray-200 cursor-pointer"
            onClick={handleLogOut}
          >
            Logout
          </button>
          <button
            className="bg-white text-black font-bold text-lg px-4 py-3 w-full rounded-lg hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              stopRecognition();
              navigate("/customize");
            }}
          >
            Customize Assistant
          </button>
          <div className="flex-1 overflow-y-auto mt-4">
            <HistoryBox userData={userData} setUserData={setUserData} />
          </div>
        </div>
      )}

      {/* Assistant / Center */}
      <div className="flex-1 flex flex-col items-center gap-6 relative">
        {/* Top buttons large screen */}
        <button
          className="bg-red-700 font-semibold text-lg px-4 py-2 rounded-xl absolute right-6 top-6 hidden lg:block cursor-pointer"
          onClick={handleLogOut}
        >
          Logout
        </button>
        <button
          className="bg-blue-700 font-semibold text-lg px-4 py-2 rounded-xl absolute right-6 top-20 hidden lg:block cursor-pointer"
          onClick={() => {
            stopRecognition();
            navigate("/customize");
          }}
        >
          Customize Assistant
        </button>

        <div className="mt-10 w-[70%] max-w-[600px] flex items-center justify-center overflow-hidden rounded-xl shadow-lg">
          <img
            src={userData?.assistantImage}
            alt="assistant"
            className="w-full max-h-[400px] object-fill"
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-center">
          I am {userData.assistantName}
        </h1>

        {!responseText && (
          <img src={userImg} alt="user" className="w-[150px] md:w-[180px]" />
        )}
        {responseText && (
          <img src={aiImg} alt="ai" className="w-[150px] md:w-[180px]" />
        )}

        <div className="max-w-[600px] w-[90%] bg-black/50 p-3 rounded-md text-center min-h-[60px]">
          {userText && <h1 className="text-sm md:text-lg">{userText}</h1>}
          {responseText && (
            <h1 className="text-sm md:text-lg">{responseText}</h1>
          )}
        </div>

        {!enabled && (
          <p className="mt-2 text-sm md:text-lg text-yellow-400 text-center">
            Click anywhere to enable assistant voice
          </p>
        )}
      </div>

      {/* History fixed size right panel */}
      <div className="hidden lg:flex flex-col w-[300px] h-[500px] p-4">
        <HistoryBox userData={userData} setUserData={setUserData} />
      </div>
    </div>
  );
};

const HistoryBox = ({ userData, setUserData }) => {
  return (
    <div className="w-full h-full flex flex-col border-2 border-white rounded-lg p-3 bg-black/70">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-white">History</h2>
        <button
          className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 rounded-lg shadow-md text-white cursor-pointer"
          onClick={() => setUserData((prev) => ({ ...prev, history: [] }))}
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          {userData.history?.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-white/10 p-2 rounded-md"
            >
              <span>{item}</span>
              <button
                className="ml-3 px-2 py-1 text-xs bg-gray-600 hover:bg-gray-700 rounded-md text-white cursor-pointer"
                onClick={() =>
                  setUserData((prev) => ({
                    ...prev,
                    history: prev.history.filter((_, i) => i !== idx),
                  }))
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Home;
