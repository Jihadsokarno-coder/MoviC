import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import OpenAI from "openai";
import "../App.css";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, 
});

function MoviCBot() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userQuery = inputText;

    const userMessage = { sender: "user", text: userQuery, time: currentTime };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are MoviC, a smart assistant dedicated EXCLUSIVELY to movies, TV shows, actors, and cinema recommendations 🎬.
        Rules:
        1. Detect the user's language and ALWAYS reply in the EXACT SAME language.
        2. Answer ONLY questions related to movies, TV series, actors, directors, and cinema recommendations.
        3. If the user asks about ANY topic outside of movies and TV shows, politely decline in the user's language.`,
          },
          { role: "user", content: userQuery },
        ],
      });

      const responseText = completion.choices[0].message.content;

      const botMessage = {
        sender: "bot",
        text: responseText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong. Please check your connection or try again.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <nav className="nav-bar">
        <h1 className="logo">MoviC</h1>
        <div className="nav-actions">
          <Link to="/" className="home">
            <span id="logo">🏠︎</span>
          </Link>
        </div>
      </nav>

      <div className="chatBox">
        {messages.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">🤖</div>
            <h3 className="emptyTitle">Welcome to MoviC Bot</h3>
            <p className="emptySubtitle">
              I can help you pick a Movie or a TV show to watch today! 🎬
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className="messageWrapper"
              style={{
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.sender === "bot" && <div className="botAvatar">🤖</div>}
              <div
                className="bubble"
                style={{
                  backgroundColor:
                    msg.sender === "user" ? "#5a5a5a" : "#3a3a3a",
                  borderBottomRightRadius:
                    msg.sender === "user" ? "2px" : "14px",
                  borderBottomLeftRadius: msg.sender === "bot" ? "2px" : "14px",
                }}
              >
                <p className="messageText">{msg.text}</p>
                <span className="time">{msg.time}</span>
              </div>
              {msg.sender === "user" && <div className="userAvatar">👤</div>}
            </div>
          ))
        )}

        {loading && (
          <div
            className="messageWrapper"
            style={{ justifyContent: "flex-start" }}
          >
            <div className="botAvatar">🤖</div>
            <div className="bubble" style={{ backgroundColor: "#3a3a3a" }}>
              <p
                style={{
                  margin: 0,
                  color: "#e0e0e0",
                  fontStyle: "italic",
                  fontSize: "13px",
                }}
              >
                MoviC is thinking...
              </p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="footer">
        <div className="inputContainer">
          <input
            type="text"
            placeholder="Ask MoviC bot ........."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="input"
          />
          <button onClick={handleSend} className="sendBtn" disabled={loading}>
            <span>⬆</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoviCBot;
