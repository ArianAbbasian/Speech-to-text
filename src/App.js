import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

const SpeechToTextApp = () => {
  const [liveTranscript, setLiveTranscript] = useState("");
  const [fileTranscript, setFileTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const liveTextRef = useRef(null);
  const fileTextRef = useRef(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsSpeechSupported(true);
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "fa-IR";

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setLiveTranscript((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setError(`خطا در تشخیص گفتار: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error("Error restarting recognition:", error);
            setIsListening(false);
          }
        }
      };
    } else {
      setError("مرورگر شما از Web Speech API پشتیبانی نمی‌کند");
      setIsSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        setSuccess("تشخیص گفتار متوقف شد");
      } catch (error) {
        console.error("Error stopping recognition:", error);
        setIsListening(false);
      }
    } else {
      setError("");
      setSuccess("");
      // DON'T clear the transcript - keep existing text
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setSuccess("در حال گوش دادن... متن فارسی صحبت کنید");
      } catch (error) {
        console.error("Error starting recognition:", error);
        setError("خطا در شروع تشخیص گفتار");
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (
      !file.type.includes("audio/") &&
      !file.name.match(/\.(mp3|wav|m4a)$/i)
    ) {
      setError("لطفاً یک فایل صوتی معتبر انتخاب کنید (MP3, WAV)");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("حجم فایل نباید بیشتر از ۱۰ مگابایت باشد");
      return;
    }

    setIsProcessing(true);
    setError("");
    setSuccess("در حال پردازش فایل صوتی...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Use the local proxy server
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/transcribe`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Proxy response received:", response.data);

      // Extract transcript text
      let transcriptText = "";

      // Try different possible response structures
      if (response.data.text) {
        transcriptText = response.data.text;
      } else if (response.data.transcript) {
        transcriptText = response.data.transcript;
      } else if (response.data.data?.text) {
        transcriptText = response.data.data.text;
      } else if (typeof response.data === "string") {
        transcriptText = response.data;
      } else {
        // If we can't find text, show the raw response for debugging
        transcriptText = JSON.stringify(response.data, null, 2);
      }

      setFileTranscript(transcriptText);
      setSuccess("تبدیل فایل صوتی با موفقیت انجام شد");
    } catch (err) {
      console.error("❌ Transcription error:", err);

      if (err.response?.data?.error) {
        setError(`خطا: ${err.response.data.error}`);
      } else if (err.code === "ECONNREFUSED") {
        setError(
          "سرور پروکسی در دسترس نیست. لطفاً مطمئن شوید سرور پروکسی اجرا شده است."
        );
      } else if (err.response?.status === 401) {
        setError("API Key نامعتبر است");
      } else {
        setError("خطا در تبدیل فایل صوتی. لطفاً دوباره تلاش کنید");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
    setCopySuccess("");
  };

  const copyToClipboard = (text, type) => {
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess(`متن ${type} با موفقیت کپی شد`);
        setTimeout(() => setCopySuccess(""), 3000);
      })
      .catch(() => {
        setError("خطا در کپی کردن متن");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            تبدیل گفتار به متن فارسی
          </h1>
          <p className="text-lg text-gray-600">
            گفتار زنده را تشخیص دهید یا فایل صوتی را آپلود کنید
          </p>
        </div>

        {/* Messages */}
        {(error || success || copySuccess) && (
          <div className="mb-6 p-4 rounded-lg border-l-4 bg-white shadow-sm">
            {error && (
              <div className="flex items-center text-red-600">
                <span className="text-lg">⚠️</span>
                <span className="mr-2">{error}</span>
                <button
                  onClick={clearMessages}
                  className="mr-auto text-red-400 hover:text-red-600 text-xl"
                >
                  ×
                </button>
              </div>
            )}
            {success && (
              <div className="flex items-center text-green-600">
                <span className="text-lg">✅</span>
                <span className="mr-2">{success}</span>
                <button
                  onClick={clearMessages}
                  className="mr-auto text-green-400 hover:text-green-600 text-xl"
                >
                  ×
                </button>
              </div>
            )}
            {copySuccess && (
              <div className="flex items-center text-blue-600">
                <span className="mr-2">{copySuccess}</span>
                <button
                  onClick={clearMessages}
                  className="mr-auto text-blue-400 hover:text-blue-600 text-xl"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Live Speech to Text */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">گفتار زنده</h2>
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            </div>

            <div className="space-y-4">
              <button
                onClick={toggleListening}
                disabled={!isSpeechSupported}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-200 shadow-lg ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 shadow-red-200"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-200"
                } ${
                  !isSpeechSupported ? "bg-gray-400 cursor-not-allowed" : ""
                }`}
              >
                {isListening ? (
                  <div className="flex items-center justify-center">
                    <span className="ml-2">⏹️</span>
                    توقف گوش دادن
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="ml-2">🎤</span>
                    شروع گوش دادن
                  </div>
                )}
              </button>

              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 min-h-[300px] border-2 border-dashed border-blue-200 relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">
                    متن تشخیص داده شده:
                  </h3>
                </div>
                <div
                  ref={liveTextRef}
                  className="text-right leading-8 text-gray-800 text-lg min-h-[200px] max-h-[200px] overflow-y-auto p-4 bg-white rounded-lg border border-gray-300"
                >
                  {liveTranscript || (
                    <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                      <span>متن تشخیص داده شده اینجا نمایش داده می‌شود...</span>
                    </div>
                  )}
                </div>
              </div>

              {liveTranscript && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setLiveTranscript("")}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg font-medium"
                  >
                    🗑️ پاک کردن متن
                  </button>
                  <button
                    onClick={() => copyToClipboard(liveTranscript, "زنده")}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg font-medium"
                  >
                    📋 کپی متن
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* File Upload Transcription */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                آپلود فایل صوتی
              </h2>
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            </div>

            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="audio/*,.mp3,.wav,.m4a"
                className="hidden"
              />

              <button
                onClick={triggerFileInput}
                disabled={isProcessing}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 disabled:from-indigo-300 disabled:to-purple-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-200"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <span className="ml-2">⏳</span>
                    در حال پردازش...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="ml-2">📁</span>
                    انتخاب فایل صوتی
                  </div>
                )}
              </button>

              <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
                فرمت‌های پشتیبانی شده: MP3, WAV, M4A (حداکثر ۱۰ مگابایت)
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-6 min-h-[300px] border-2 border-dashed border-purple-200 relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">
                    متن تبدیل شده:
                  </h3>
                  {fileTranscript && (
                    <button
                      onClick={() => copyToClipboard(fileTranscript, "فایل")}
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      <span>📋</span>
                      کپی متن
                    </button>
                  )}
                </div>
                <div
                  ref={fileTextRef}
                  className="text-right leading-8 text-gray-800 text-lg min-h-[200px] max-h-[200px] overflow-y-auto p-4 bg-white rounded-lg border border-gray-300"
                >
                  {fileTranscript || (
                    <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                      <span>متن تبدیل شده اینجا نمایش داده می‌شود...</span>
                    </div>
                  )}
                </div>
              </div>

              {fileTranscript && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setFileTranscript("")}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg font-medium"
                  >
                    🗑️ پاک کردن متن
                  </button>
                  <button
                    onClick={() => copyToClipboard(fileTranscript, "فایل")}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg font-medium"
                  >
                    📋 کپی متن
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            راهنمای استفاده
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
              <h4 className="font-bold text-lg text-gray-700 mb-4 text-right flex items-center">
                <span className="ml-2">🎤</span>
                برای گفتار زنده:
              </h4>
              <ul className="text-gray-600 space-y-3 text-right">
                <li className="flex items-center justify-end">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg ml-3">
                    🎯
                  </span>
                  از میکروفون با کیفیت استفاده کنید
                </li>
                <li className="flex items-center justify-end">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg ml-3">
                    🔇
                  </span>
                  در محیط بی‌سر و صدا صحبت کنید
                </li>
                <li className="flex items-center justify-end">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg ml-3">
                    🇮🇷
                  </span>
                  به زبان فارسی و شمرده صحبت کنید
                </li>
                <li className="flex items-center justify-end">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg ml-3">
                    🔒
                  </span>
                  به مرورگر اجازه دسترسی به میکروفون را بدهید
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <h4 className="font-bold text-lg text-gray-700 mb-4 text-right flex items-center">
                <span className="ml-2">📁</span>
                برای فایل صوتی:
              </h4>
              <ul className="text-gray-600 space-y-3 text-right">
                <li className="flex items-center justify-end">
                  <span className="bg-purple-100 text-purple-600 p-2 rounded-lg ml-3">
                    ⭐
                  </span>
                  فایل‌های با کیفیت بالا نتیجه بهتری دارند
                </li>
                <li className="flex items-center justify-end">
                  <span className="bg-purple-100 text-purple-600 p-2 rounded-lg ml-3">
                    🇮🇷
                  </span>
                  گفتار باید به زبان فارسی باشد
                </li>
                <li className="flex items-center justify-end">
                  <span className="bg-purple-100 text-purple-600 p-2 rounded-lg ml-3">
                    🔓
                  </span>
                  فایل نباید رمزگذاری شده باشد
                </li>
                <li className="flex items-center justify-end">
                  <span className="bg-purple-100 text-purple-600 p-2 rounded-lg ml-3">
                    💾
                  </span>
                  حداکثر حجم فایل: ۱۰ مگابایت
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechToTextApp;
