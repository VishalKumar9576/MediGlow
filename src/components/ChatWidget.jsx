import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents = {
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-full border-collapse text-left text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
  th: ({ children }) => (
    <th className="border border-gray-200 px-2 py-1 font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-gray-200 px-2 py-1">{children}</td>,
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  h3: ({ children }) => <h3 className="mt-2 mb-1 text-sm font-semibold">{children}</h3>,
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const send = async (e) => {
    e && e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      from: "user",
      text: input.trim(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg.text }),
      });

      if (!res.ok) throw new Error(`status ${res.status}`);

      const data = await res.json();

      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "bot",
          text: data.reply || "No reply from server",
        },
      ]);
    } catch (error) {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "bot",
          text: "Server error. Try again later.",
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-7 md:right-10 md:bottom-18 lg:right-34 lg:bottom-7 right-5 z-50">
      {open && (
        <div className="mb-3 w-[320px] max-w-[92vw] rounded-xl bg-white shadow-lg">
          <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-br from-[#00607a] to-[#0687ab] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold">Support</div>
                <div className="text-xs opacity-80">
                  Typically replies within a day
                </div>
              </div>
            </div>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded-md bg-white/20 px-2 py-1 text-sm cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex h-[535px] flex-col justify-between">
            <div className="overflow-y-auto p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`mb-3 flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`${m.from === "user" ? "bg-[#00607a] text-white" : "bg-gray-100 text-gray-900"} max-w-[80%] rounded-lg px-3 py-2 text-sm`}
                  >
                    {m.from === "bot" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {m.text}
                      </ReactMarkdown>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={send}
              className="flex items-center gap-2 border-t border-gray-200 p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#00607a] px-3 py-2 text-sm font-semibold text-white cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((s) => !s)}
        aria-label="Open chat"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#00607a] to-[#0687ab] text-white shadow-xl cursor-pointer"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  );
}
