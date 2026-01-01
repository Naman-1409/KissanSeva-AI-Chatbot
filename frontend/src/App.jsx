// import React, { useState, useRef, useEffect } from "react";
// import "./App.css";

// // ===================================================================================
// // CONFIGURATION
// // ===================================================================================
// const API_BASE = "http://localhost:8000";
// const HEALTH_CHECK_URL = "http://localhost:8000/health";

// // ===================================================================================
// // Landing Page Component (Farmer-Centric Update)
// // ===================================================================================
// const LandingPage = ({ onEnterChat }) => {
//   return (
//     <div className="min-h-screen farmer-gradient text-slate-800 flex flex-col items-center py-12 px-6 relative animate-fadeIn">
//       {/* Soft Background Elements */}
//       <div className="fixed inset-0 pointer-events-none opacity-50">
//         <div className="absolute top-0 left-0 w-64 h-64 bg-green-100 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-50 rounded-full blur-3xl"></div>
//       </div>

//       <div className="text-center max-w-4xl mx-auto z-10 flex flex-col items-center">
//         <div className="mb-6 animate-slideUp">
//           <div className="bg-white p-6 rounded-full shadow-lg inline-block border-4 border-green-500/10">
//             <span className="text-6xl md:text-7xl">🚜</span>
//           </div>
//         </div>

//         <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-green-900 animate-slideUp" style={{ animationDelay: "0.1s" }}>
//           KissanSeva AI
//         </h1>

//         <p className="text-xl md:text-2xl mb-10 text-slate-600 max-w-2xl font-medium animate-slideUp" style={{ animationDelay: "0.2s" }}>
//           Welcome! Your personal digital assistant to make <span className="text-green-700">farming better and easier</span>.
//         </p>

//         <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slideUp" style={{ animationDelay: "0.3s" }}>
//           {[
//             { icon: "🌾", title: "Crop Information", desc: "Select the right crops and increase your yield." },
//             { icon: "🔍", title: "Disease Identification", desc: "Send photos to identify and treat crop diseases." },
//             { icon: "🗣️", title: "Voice Interaction", desc: "Get information by speaking in your own language." }
//           ].map((feature, i) => (
//             <div key={i} className="organic-card p-6 text-center">
//               <div className="text-4xl mb-3">{feature.icon}</div>
//               <h3 className="text-lg font-bold text-green-800 mb-2">{feature.title}</h3>
//               <p className="text-slate-600 text-sm">{feature.desc}</p>
//             </div>
//           ))}
//         </div>

//         <button
//           onClick={onEnterChat}
//           className="btn-primary text-lg px-12 py-4 animate-slideUp"
//           style={{ animationDelay: "0.4s" }}
//         >
//           Start Assistant →
//         </button>
//       </div>

//       <footer className="mt-20 text-slate-500 text-sm font-medium animate-fadeIn">
//         © 2026 KissanSeva AI — Empowering Farmers, Shaping the Nation
//       </footer>
//     </div>
//   );
// };

// // ===================================================================================
// // Farmer Chatbot Component
// // ===================================================================================

// const FarmerChatbot = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       content:
//         "Hello! Welcome to KissanSeva AI. 🌱\n\nI can help you with:\n• Crop information and recommendations\n• Disease and pest identification\n• Fertilizer and soil health advice\n• Weather and seasonal farming tips\n\nYou can ask me questions by typing, uploading photos, or speaking.",
//       isUser: false,
//       type: "welcome",
//       timestamp: new Date(),
//     },
//   ]);
//   const [activeTab, setActiveTab] = useState("text");
//   const [textInput, setTextInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [imageType, setImageType] = useState("disease");
//   const [connectionStatus, setConnectionStatus] = useState("checking");
//   const messagesEndRef = useRef(null);
//   const chatContainerRef = useRef(null);
//   const imageInputRef = useRef(null);
//   const voiceInputRef = useRef(null);
//   const textInputRef = useRef(null);

//   const [context, setContext] = useState({
//     crop: "Rice",
//     location: "India",
//     season: "Kharif",
//   });

//   const [predictionFeatures, setPredictionFeatures] = useState({
//     N: 90, P: 42, K: 43,
//     temperature: 25.0, humidity: 80.0, ph: 6.5, rainfall: 200.0,
//   });

//   useEffect(() => {
//     checkConnection();
//   }, []);

//   const checkConnection = async () => {
//     try {
//       const response = await fetch(HEALTH_CHECK_URL);
//       setConnectionStatus(response.ok ? "connected" : "error");
//     } catch (error) {
//       setConnectionStatus("error");
//     }
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const addMessage = (content, isUser, type = "text") => {
//     setMessages((prev) => [
//       ...prev,
//       { id: Date.now() + Math.random(), content, isUser, type, timestamp: new Date() }
//     ]);
//   };

//   const sendTextMessage = async (messageText = null) => {
//   const message = messageText || textInput.trim();
//   if (!message) return;

//   addMessage(message, true, "text");
//   setTextInput("");
//   setIsLoading(true);

//   try {
//     const response = await fetch(`${API_BASE}/chat`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         question: message,
//       }),
//     });

//     const data = await response.json();
//     setIsLoading(false);

//     if (response.ok) {
//       addMessage(data.answer, false, "text");
//     } else {
//       addMessage("Server error. Please try again.", false, "error");
//     }
//   } catch (error) {
//     setIsLoading(false);
//     addMessage("Backend not reachable. Is server running?", false, "error");
//   }
// };


//   const uploadImage = async () => {
//   const file = imageInputRef.current?.files[0];
//   if (!file) return;

//   addMessage(`Analyzing image: ${file.name}`, true, "image");
//   setIsLoading(true);

//   const formData = new FormData();
//   formData.append("image", file);
//   formData.append("type", imageType); // disease | insect

//   try {
//     const response = await fetch(`${API_BASE}/image-query`, {
//       method: "POST",
//       body: formData,
//     });

//     const data = await response.json();
//     setIsLoading(false);

//     if (response.ok) {
//       const result = `
// Prediction: ${data.prediction}
// Confidence: ${(data.confidence * 100).toFixed(2)}%

// ${data.answer}
//       `;
//       addMessage(result, false, "image");
//     } else {
//       addMessage("Image analysis failed.", false, "error");
//     }
//   } catch (error) {
//     setIsLoading(false);
//     addMessage("Image service not reachable.", false, "error");
//   }

//   imageInputRef.current.value = "";
// };


//   const TabButton = ({ id, icon, label, isActive, onClick }) => (
//     <button
//       onClick={onClick}
//       className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${
//         isActive ? "tab-active shadow-sm" : "tab-inactive hover:bg-white/50"
//       }`}
//     >
//       <span className="text-2xl">{icon}</span>
//       <span className="text-sm">{label}</span>
//     </button>
//   );

//   return (
//     <div className="h-screen farmer-gradient flex flex-col overflow-hidden">
//       {/* Friendly Header */}
//       <header className="bg-white border-b border-slate-200 px-4 py-3 flex flex-col md:flex-row items-center justify-between shadow-sm gap-4">
//         {/* Logo and Tagline */}
//         <div className="flex items-center gap-3 min-w-fit">
//           <span className="text-3xl">🚜</span>
//           <div>
//             <h1 className="text-lg font-black text-green-900 leading-tight">KISSANSEVA AI</h1>
//             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Precision Agriculture</p>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <nav className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 flex-wrap justify-center">
//           {[
//             { id: "text", icon: "💬", label: "Advisor" },
//             { id: "image", icon: "📸", label: "Vision" },
//             { id: "voice", icon: "🎤", label: "Audio" },
//             { id: "predict", icon: "📊", label: "Yield" }
//           ].map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center gap-2 py-2 px-3 rounded-lg font-bold transition-all text-xs ${
//                 activeTab === tab.id ? "tab-active shadow-sm" : "tab-inactive hover:bg-white/50"
//               }`}
//             >
//               <span>{tab.icon}</span>
//               <span className="hidden sm:inline uppercase tracking-widest">{tab.label}</span>
//             </button>
//           ))}
//         </nav>

//         {/* Context Monitor - Compact */}
//         <div className="hidden lg:flex items-center gap-6 px-6 border-x border-slate-100">
//           {[
//             { label: "CROP", value: context.crop, color: "text-green-700" },
//             { label: "AREA", value: context.location, color: "text-blue-700" },
//             { label: "SEASON", value: context.season, color: "text-purple-700" },
//             { label: "N-P-K", value: `${predictionFeatures.N}-${predictionFeatures.P}-${predictionFeatures.K}`, color: "text-orange-700" },
//           ].map((item, i) => (
//             <div key={i} className="flex flex-col">
//               <span className="text-[7px] uppercase tracking-widest text-slate-400 font-bold">{item.label}</span>
//               <span className={`text-[10px] font-black uppercase tracking-widest ${item.color} truncate max-w-[80px]`}>
//                 {item.value || "---"}
//               </span>
//             </div>
//           ))}
//         </div>
        
//         {/* Status */}
//         <div className="flex items-center gap-3 min-w-fit">
//           <div className={`h-2 w-2 rounded-full ${connectionStatus === "connected" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
//           <div className="bg-green-50 px-3 py-1 rounded-lg border border-green-100">
//              <span className="text-[10px] font-bold text-green-800 uppercase tracking-widest">
//                {connectionStatus === "connected" ? "ACTIVE" : "OFFLINE"}
//              </span>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 flex flex-col lg:flex-row p-4 md:p-6 gap-6 min-h-0">
//         {/* Simple Sidebar */}
//         <aside className="lg:w-72 flex flex-col gap-4">
//           <div className="organic-card p-5 flex flex-col gap-4">
//             <h3 className="text-sm font-bold text-green-800 border-b border-slate-100 pb-2 flex items-center gap-2">
//               🌾 Farming Context
//             </h3>
//             <div className="space-y-3">
//               {[
//                 { label: "Crop", key: "crop", state: context, setter: setContext },
//                 { label: "Location", key: "location", state: context, setter: setContext },
//                 { label: "Season", key: "season", state: context, setter: setContext }
//               ].map(item => (
//                 <div key={item.key}>
//                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">{item.label}</label>
//                    <input
//                     type="text"
//                     value={item.state[item.key]}
//                     onChange={(e) => item.setter(p => ({ ...p, [item.key]: e.target.value }))}
//                     className="w-full input-field py-2 text-sm"
//                   />
//                 </div>
//               ))}
//             </div>

//             <h3 className="text-sm font-bold text-orange-800 border-b border-slate-100 pb-2 mt-4 flex items-center gap-2">
//               🧪 Soil & Environment
//             </h3>
//             <div className="grid grid-cols-3 gap-2">
//               {[
//                 { label: "N", key: "N" },
//                 { label: "P", key: "P" },
//                 { label: "K", key: "K" }
//               ].map(item => (
//                 <div key={item.key}>
//                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block text-center">{item.label}</label>
//                    <input
//                     type="number"
//                     value={predictionFeatures[item.key]}
//                     onChange={(e) => setPredictionFeatures(p => ({ ...p, [item.key]: parseFloat(e.target.value) || 0 }))}
//                     className="w-full input-field py-2 text-center text-sm"
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="grid grid-cols-2 gap-3 mt-2">
//               {[
//                 { label: "Temp (°C)", key: "temperature" },
//                 { label: "Humidity (%)", key: "humidity" },
//                 { label: "Soil pH", key: "ph" },
//                 { label: "Rain (mm)", key: "rainfall" }
//               ].map(item => (
//                 <div key={item.key}>
//                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">{item.label}</label>
//                    <input
//                     type="number"
//                     value={predictionFeatures[item.key]}
//                     onChange={(e) => setPredictionFeatures(p => ({ ...p, [item.key]: parseFloat(e.target.value) || 0 }))}
//                     className="w-full input-field py-2 text-sm"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="organic-card p-5 hidden lg:block">
//             <h3 className="text-sm font-bold text-green-800 mb-3">Frequently Asked Questions</h3>
//             <div className="flex flex-col gap-2">
//               {["Rice Diseases", "Soil Fertility", "Pest Control"].map(q => (
//                 <button 
//                   key={q} 
//                   onClick={() => sendTextMessage(q)}
//                   className="text-left text-sm p-3 rounded-lg hover:bg-green-50 text-slate-600 border border-slate-100 hover:border-green-200 transition-all font-medium"
//                 >
//                   {q}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </aside>

//         {/* Chat Area */}
//         <section className="flex-1 organic-card flex flex-col min-h-0 overflow-hidden relative">
//           <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 chat-container">
//             {messages.map(msg => (
//               <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"} animate-message`}>
//                 <div className={`message-bubble ${msg.isUser ? "user-bubble" : "ai-bubble"}`}>
//                   <div className="whitespace-pre-wrap">{msg.content}</div>
//                 </div>
//               </div>
//             ))}
//             {isLoading && (
//               <div className="flex justify-start animate-message">
//                 <div className="ai-bubble italic text-slate-400">Assistant is thinking...</div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="p-4 bg-white border-t border-slate-100">
//             <div className="flex gap-2">
//               {activeTab === "text" && (
//                 <>
//                   <input
//                     ref={textInputRef}
//                     type="text"
//                     value={textInput}
//                     onChange={(e) => setTextInput(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && sendTextMessage()}
//                     placeholder="Type your question here..."
//                     className="flex-1 input-field"
//                   />
//                   <button onClick={() => sendTextMessage()} className="btn-primary">Send</button>
//                 </>
//               )}
//               {activeTab === "image" && (
//                 <div className="flex-1 flex flex-col gap-4">
//                   <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit self-center">
//                     <button 
//                       onClick={() => setImageType("disease")}
//                       className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${imageType === "disease" ? "bg-white text-green-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
//                     >
//                       🦠 DISEASE
//                     </button>
//                     <button 
//                       onClick={() => setImageType("insect")}
//                       className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${imageType === "insect" ? "bg-white text-green-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
//                     >
//                       🐜 INSECT
//                     </button>
//                   </div>
//                   <div className="flex gap-2">
//                     <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
//                     <button onClick={() => imageInputRef.current.click()} className="flex-1 btn-primary bg-orange-600 hover:bg-orange-700">Select {imageType === "disease" ? "Disease" : "Insect"} Photo</button>
//                   </div>
//                 </div>
//               )}
//               {activeTab === "voice" && (
//                 <button className="flex-1 btn-primary bg-blue-600 hover:bg-blue-700 py-4">Tap to Speak</button>
//               )}
//               {activeTab === "predict" && (
//                 <button 
//                   onClick={() => sendTextMessage("Based on current data, what is the yield prediction?")} 
//                   className="flex-1 btn-primary bg-purple-600 hover:bg-purple-700 py-4"
//                 >
//                   Predict Yield
//                 </button>
//               )}
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default function App() {
//   const [inChat, setInChat] = useState(false);
//   return inChat ? <FarmerChatbot /> : <LandingPage onEnterChat={() => setInChat(true)} />;
// }




import React, { useState, useRef, useEffect } from "react";
import "./App.css";

// ===================================================================================
// CONFIGURATION
// ===================================================================================
const API_BASE = "http://localhost:8000";
const HEALTH_CHECK_URL = "http://localhost:8000/health";

// ===================================================================================
// Landing Page Component (Farmer-Centric Update)
// ===================================================================================
const LandingPage = ({ onEnterChat }) => {
  return (
    <div className="min-h-screen farmer-gradient text-slate-800 flex flex-col items-center py-12 px-6 relative animate-fadeIn">
      {/* Soft Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-50 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center max-w-4xl mx-auto z-10 flex flex-col items-center">
        <div className="mb-6 animate-slideUp">
          <div className="bg-white p-6 rounded-full shadow-lg inline-block border-4 border-green-500/10">
            <span className="text-6xl md:text-7xl">🚜</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-green-900 animate-slideUp" style={{ animationDelay: "0.1s" }}>
          KissanSeva AI
        </h1>

        <p className="text-xl md:text-2xl mb-10 text-slate-600 max-w-2xl font-medium animate-slideUp" style={{ animationDelay: "0.2s" }}>
          Welcome! Your personal digital assistant to make <span className="text-green-700">farming better and easier</span>.
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slideUp" style={{ animationDelay: "0.3s" }}>
          {[
            { icon: "🌾", title: "Crop Information", desc: "Select the right crops and increase your yield." },
            { icon: "🔍", title: "Disease Identification", desc: "Send photos to identify and treat crop diseases." },
            { icon: "🗣️", title: "Voice Interaction", desc: "Get information by speaking in your own language." }
          ].map((feature, i) => (
            <div key={i} className="organic-card p-6 text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-bold text-green-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onEnterChat}
          className="btn-primary text-lg px-12 py-4 animate-slideUp"
          style={{ animationDelay: "0.4s" }}
        >
          Start Assistant →
        </button>
      </div>

      <footer className="mt-20 text-slate-500 text-sm font-medium animate-fadeIn">
        © 2026 KissanSeva AI — Empowering Farmers, Shaping the Nation
      </footer>
    </div>
  );
};

// ===================================================================================
// Farmer Chatbot Component
// ===================================================================================

const FarmerChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content:
        "Hello! Welcome to KissanSeva AI. 🌱\n\nI can help you with:\n• Crop information and recommendations\n• Disease and pest identification\n• Fertilizer and soil health advice\n• Weather and seasonal farming tips\n\nYou can ask me questions by typing, uploading photos, or speaking.",
      isUser: false,
      type: "welcome",
      timestamp: new Date(),
    },
  ]);
  const [activeTab, setActiveTab] = useState("text");
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageType, setImageType] = useState("disease");
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const imageInputRef = useRef(null);
  const voiceInputRef = useRef(null);
  const textInputRef = useRef(null);

  const [context, setContext] = useState({
    crop: "Rice",
    location: "India",
    season: "Kharif",
  });

  const [predictionFeatures, setPredictionFeatures] = useState({
    N: 90, P: 42, K: 43,
    temperature: 25.0, humidity: 80.0, ph: 6.5, rainfall: 200.0,
  });

  useEffect(() => {
    checkConnection();
    window.scrollTo(0, 0); // Reset scroll position when entering chat
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(HEALTH_CHECK_URL);
      setConnectionStatus(response.ok ? "connected" : "error");
    } catch (error) {
      setConnectionStatus("error");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (content, isUser, type = "text") => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), content, isUser, type, timestamp: new Date() }
    ]);
  };

    const sendTextMessage = async (messageText = null) => {
  const message = messageText || textInput.trim();
  if (!message) return;

  addMessage(message, true, "text");
  setTextInput("");
  setIsLoading(true);

  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: message,
      }),
    });

    const data = await response.json();
    setIsLoading(false);

    if (response.ok) {
      addMessage(data.answer, false, "text");
    } else {
      addMessage("Server error. Please try again.", false, "error");
    }
  } catch (error) {
    setIsLoading(false);
    addMessage("Backend not reachable. Is server running?", false, "error");
  }
};


  const uploadImage = async () => {
  const file = imageInputRef.current?.files[0];
  if (!file) return;

  addMessage(`Analyzing image: ${file.name}`, true, "image");
  setIsLoading(true);

  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", imageType); // disease | insect

  try {
    const response = await fetch(`${API_BASE}/image-query`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setIsLoading(false);

    if (response.ok) {
      const result = `
Prediction: ${data.prediction}
Confidence: ${(data.confidence * 100).toFixed(2)}%

${data.answer}
      `;
      addMessage(result, false, "image");
    } else {
      addMessage("Image analysis failed.", false, "error");
    }
  } catch (error) {
    setIsLoading(false);
    addMessage("Image service not reachable.", false, "error");
  }

  imageInputRef.current.value = "";
};

  const TabButton = ({ id, icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${
        isActive ? "tab-active shadow-sm" : "tab-inactive hover:bg-white/50"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="h-screen farmer-gradient flex flex-col overflow-hidden">
      {/* Friendly Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex flex-col md:flex-row items-center justify-between shadow-sm gap-4 shrink-0">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3 min-w-fit">
          <span className="text-3xl">🚜</span>
          <div>
            <h1 className="text-lg font-black text-green-900 leading-tight">KISSANSEVA AI</h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Precision Agriculture</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 flex-wrap justify-center">
          {[
            { id: "text", icon: "💬", label: "Advisor" },
            { id: "image", icon: "📸", label: "Vision" },
            { id: "voice", icon: "🎤", label: "Audio" },
            { id: "predict", icon: "📊", label: "Yield" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg font-bold transition-all text-xs ${
                activeTab === tab.id ? "tab-active shadow-sm" : "tab-inactive hover:bg-white/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Context Monitor - Compact */}
        <div className="hidden lg:flex items-center gap-6 px-6 border-x border-slate-100">
          {[
            { label: "CROP", value: context.crop, color: "text-green-700" },
            { label: "AREA", value: context.location, color: "text-blue-700" },
            { label: "SEASON", value: context.season, color: "text-purple-700" },
            { label: "N-P-K", value: `${predictionFeatures.N}-${predictionFeatures.P}-${predictionFeatures.K}`, color: "text-orange-700" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[7px] uppercase tracking-widest text-slate-400 font-bold">{item.label}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${item.color} truncate max-w-[80px]`}>
                {item.value || "---"}
              </span>
            </div>
          ))}
        </div>
        
        {/* Status */}
        <div className="flex items-center gap-3 min-w-fit">
          <div className={`h-2 w-2 rounded-full ${connectionStatus === "connected" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
          <div className="bg-green-50 px-3 py-1 rounded-lg border border-green-100">
             <span className="text-[10px] font-bold text-green-800 uppercase tracking-widest">
               {connectionStatus === "connected" ? "ACTIVE" : "OFFLINE"}
             </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-4 md:p-6 gap-6 min-h-0">
        {/* Simple Sidebar */}
        <aside className="lg:w-80 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="organic-card p-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-green-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              🌾 Farming Context
            </h3>
            <div className="space-y-3">
              {[
                { label: "Crop", key: "crop", state: context, setter: setContext },
                { label: "Location", key: "location", state: context, setter: setContext },
                { label: "Season", key: "season", state: context, setter: setContext }
              ].map(item => (
                <div key={item.key}>
                   <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">{item.label}</label>
                   <input
                    type="text"
                    value={item.state[item.key]}
                    onChange={(e) => item.setter(p => ({ ...p, [item.key]: e.target.value }))}
                    className="w-full input-field py-2 text-sm"
                  />
                </div>
              ))}
            </div>

            <h3 className="text-sm font-bold text-orange-800 border-b border-slate-100 pb-2 mt-4 flex items-center gap-2">
              🧪 Soil & Environment
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "N", key: "N" },
                { label: "P", key: "P" },
                { label: "K", key: "K" }
              ].map(item => (
                <div key={item.key}>
                   <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block text-center">{item.label}</label>
                   <input
                    type="number"
                    value={predictionFeatures[item.key]}
                    onChange={(e) => setPredictionFeatures(p => ({ ...p, [item.key]: parseFloat(e.target.value) || 0 }))}
                    className="w-full input-field py-2 text-center text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { label: "Temp (°C)", key: "temperature" },
                { label: "Humidity (%)", key: "humidity" },
                { label: "Soil pH", key: "ph" },
                { label: "Rain (mm)", key: "rainfall" }
              ].map(item => (
                <div key={item.key}>
                   <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">{item.label}</label>
                   <input
                    type="number"
                    value={predictionFeatures[item.key]}
                    onChange={(e) => setPredictionFeatures(p => ({ ...p, [item.key]: parseFloat(e.target.value) || 0 }))}
                    className="w-full input-field py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="organic-card p-5 hidden lg:block">
            <h3 className="text-sm font-bold text-green-800 mb-3">Frequently Asked Questions</h3>
            <div className="flex flex-col gap-2">
              {["Rice Diseases", "Soil Fertility", "Pest Control"].map(q => (
                <button 
                  key={q} 
                  onClick={() => sendTextMessage(q)}
                  className="text-left text-sm p-3 rounded-lg hover:bg-green-50 text-slate-600 border border-slate-100 hover:border-green-200 transition-all font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <section className="flex-1 organic-card flex flex-col min-h-0 overflow-hidden relative">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 chat-container">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"} animate-message`}>
                <div className={`message-bubble ${msg.isUser ? "user-bubble" : "ai-bubble"}`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-message">
                <div className="ai-bubble italic text-slate-400">Assistant is thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              {activeTab === "text" && (
                <>
                  <input
                    ref={textInputRef}
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendTextMessage()}
                    placeholder="Type your question here..."
                    className="flex-1 input-field"
                  />
                  <button onClick={() => sendTextMessage()} className="btn-primary">Send</button>
                </>
              )}
              {activeTab === "image" && (
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit self-center">
                    <button 
                      onClick={() => setImageType("disease")}
                      className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${imageType === "disease" ? "bg-white text-green-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      🦠 DISEASE
                    </button>
                    <button 
                      onClick={() => setImageType("insect")}
                      className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${imageType === "insect" ? "bg-white text-green-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      🐜 INSECT
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
                    <button onClick={() => imageInputRef.current.click()} className="flex-1 btn-primary bg-orange-600 hover:bg-orange-700">Select {imageType === "disease" ? "Disease" : "Insect"} Photo</button>
                  </div>
                </div>
              )}
              {activeTab === "voice" && (
                <button className="flex-1 btn-primary bg-blue-600 hover:bg-blue-700 py-4">Tap to Speak</button>
              )}
              {activeTab === "predict" && (
                <button 
                  onClick={() => sendTextMessage("Based on current data, what is the yield prediction?")} 
                  className="flex-1 btn-primary bg-purple-600 hover:bg-purple-700 py-4"
                >
                  Predict Yield
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default function App() {
  const [inChat, setInChat] = useState(false);
  return inChat ? <FarmerChatbot /> : <LandingPage onEnterChat={() => setInChat(true)} />;
}