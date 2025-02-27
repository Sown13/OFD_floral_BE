require("dotenv").config();
const { Server } = require("socket.io");
const axios = require("axios");
const { Floral } = require("../database/db-config");
let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`🟢 New client connected: ${socket.id}`);

        socket.on("sendMessage", async (data) => {
            console.log("📩 Received message:", data);

            if (!data.sender || !data.text) {
                console.error("❌ Missing sender or text!");
                return;
            }

            io.emit("receiveMessage", { sender: data.sender, text: data.text });
            const flowers = await Floral.find();
            // ✅ Use Hugging Face API (Meta Llama 3.3 70B Instruct Turbo)
            try {
                const response = await axios.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    {
                        model: "mistralai/mistral-7b-instruct",
                        messages: [
                            {
                                role: "system",
                                content:
                                    "You are a florist assisting customers in a flower shop. Help them choose the perfect flowers for their occasion.",
                            },
                            {
                                role: "system",
                                content: `Available flowers: ${JSON.stringify(
                                    flowers
                                )}`,
                            },
                            { role: "user", content: data.text },
                        ],
                        max_tokens: 100,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.data.choices && response.data.choices.length > 0) {
                    const aiReply = response.data.choices[0].message.content;
                    socket.emit("receiveMessage", {
                        sender: "AI Bot",
                        text: aiReply,
                    });
                } else {
                    console.error("❌ Invalid API response:", response.data);
                    socket.emit("receiveMessage", {
                        sender: "AI Bot",
                        text: "AI response not available.",
                    });
                }
            } catch (error) {
                console.error(
                    "❌ Hugging Face API error:",
                    error.response ? error.response.data : error.message
                );
                socket.emit("receiveMessage", {
                    sender: "AI Bot",
                    text: "AI is unavailable. Try again later!",
                });
            }
        });

        socket.on("disconnect", () => {
            console.log(`🔴 Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

module.exports = { initSocket, getIO: () => io };
