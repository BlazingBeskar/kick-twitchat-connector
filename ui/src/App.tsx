import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function App() {
    const [kickChannel, setKickChannel] = useState("");
    const [obsIp, setObsIp] = useState("127.0.0.1");
    const [obsPort, setObsPort] = useState("4455");
    const [obsPassword, setObsPassword] = useState("");
    const [messageColor, setMessageColor] = useState("#00FF00");
    const [icon, setIcon] = useState("kick");
    const [column, setColumn] = useState(0);
    const [availableColumns, setAvailableColumns] = useState(5);
    useEffect(() => {
        window.electronAPI?.updateMessageStyle({
            color: messageColor,
            icon: icon,
            col: column,
        });
    }, [messageColor, icon, column]);

    const [messages, setMessages] = useState<{ user: string; content: string }[]>([]);

    useEffect(() => {
        window.electronAPI?.onStatusUpdate((msg: string) => {
            setStatus(msg);
        });

        window.electronAPI?.onChatMessage((data) => {
            setMessages((prev) => [...prev.slice(-100), data]);
        });

        window.electronAPI?.onColumnCount?.((count: number) => {
            setAvailableColumns(count);
        });
    }, []);

    useEffect(() => {
        async function loadConfig() {
            if (window.electronAPI?.loadConfig) {
                const config = await window.electronAPI.loadConfig();

                setKickChannel(config.KICK.CHANNEL ?? "");
                setObsIp(config.OBS.IP ?? "127.0.0.1");
                setObsPort(config.OBS.PORT?.toString() ?? "4455");
                setObsPassword(config.OBS.PASSWORD ?? "");
                setMessageColor(config.MESSAGE?.DEFAULT_COLOR ?? "#00FF00");
                setIcon(config.MESSAGE?.DEFAULT_ICON ?? "kick");
                setColumn(config.MESSAGE?.DEFAULT_COLUMN ?? 0);
            }
        }

        loadConfig();
    }, []);

    const [status, setStatus] = useState("Not connected");
    useEffect(() => {
        document.title = "Kick Chat Connector For Twitchat Made by BlazingBeskar";
    }, []);

    const saveAndStart = () => {
        const config = {
            OBS: {
                IP: obsIp,
                PORT: parseInt(obsPort),
                PASSWORD: obsPassword,
            },
            KICK: {
                CHANNEL: kickChannel,
                LOGGER: true,
                READ_ONLY: true,
            },
            MESSAGE: {
                DEFAULT_COLOR: messageColor,
                DEFAULT_ICON: icon,
                DEFAULT_STYLE: "message",
                DEFAULT_COLUMN: column,
                DEFAULT_AVATAR: "https://www.kick.com/user-avatar.png",
            },
        };

        if (window.electronAPI?.saveConfig && window.electronAPI?.startApp) {
            window.electronAPI.saveConfig(config);
            window.electronAPI.startApp();
            setStatus("Connecting...");
        } else {
            console.error("electronAPI is not available.");
            setStatus("Failed: electronAPI not available");
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-6">
            <Card className="w-full max-w-md shadow-2xl rounded-2xl p-6 bg-gray-800 border border-gray-700">
                <CardContent className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-center">Kick Chat to Twitchat Connector</h2>

                    <div>
                        <Label>Kick Channel</Label>
                        <Input
                            value={kickChannel}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKickChannel(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>OBS IP</Label>
                        <Input
                            value={obsIp}
                            placeholder="127.0.0.1"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setObsIp(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">Leave this as-is for local connections</p>
                    </div>

                    <div>
                        <Label>OBS Port</Label>
                        <Input
                            value={obsPort}
                            placeholder="4455"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setObsPort(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">Leave this as-is for local connections</p>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <Label>OBS Password</Label>
                            <div className="relative group">
                                <div className="w-4 h-4 text-xs text-gray-400 border border-gray-500 rounded-full flex items-center justify-center cursor-default">i</div>
                                <div className="absolute left-6 top-1 z-10 hidden group-hover:block bg-gray-800 text-gray-300 text-xs rounded px-3 py-2 border border-gray-700 w-64">
                                    You can find this in OBS under:<br />
                                    <strong>Tools &gt; WebSocket Server Settings &gt; Show Connect Info</strong>
                                </div>
                            </div>
                        </div>
                        <Input
                            type="password"
                            value={obsPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setObsPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label className="mb-2 block">Message Style</Label>
                        <div className="flex flex-col sm:flex-row gap-4 mt-1">

                            {/* Color Picker */}
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-300 mb-1">Color</span>
                                <input
                                    type="color"
                                    value={messageColor}
                                    onChange={(e) => setMessageColor(e.target.value)}
                                    className="w-10 h-10 rounded border-2 border-gray-600 cursor-pointer"
                                />
                            </div>

                            {/* Icon Picker */}
                            <div className="flex flex-col flex-1">
                                <span className="text-sm text-gray-300 mb-1">Icon</span>
                                <select
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    className="bg-gray-700 text-white p-2 rounded"
                                >
                                    <option value="kick">𝐊 Kick Logo</option>
                                    <option value="microphone">Mic</option>
                                    <option value="microphone_mute">Mute</option>
                                    <option value="mod">Mod</option>
                                    <option value="stars">Star</option>
                                    <option value="alert">Alert</option>
                                </select>
                            </div>

                            {/* Column Picker */}
                            <div className="flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm text-gray-300">Column</span>
                                    <div className="relative group">
                                        <div className="w-4 h-4 text-xs text-gray-400 border border-gray-500 rounded-full flex items-center justify-center cursor-default">i</div>
                                        <div className="absolute left-6 top-1 z-10 hidden group-hover:block bg-gray-800 text-gray-300 text-xs rounded px-3 py-2 border border-gray-700 w-64">
                                            This determines which column in Twitchat the message appears in.<br />
                                            Column 1 is the leftmost. Higher columns appear further to the right.
                                        </div>
                                    </div>
                                </div>

                                <select
                                    value={column}
                                    onChange={(e) => setColumn(parseInt(e.target.value))}
                                    className="bg-gray-700 text-white p-2 rounded"
                                >
                                    {[...Array(availableColumns)].map((_, i) => (
                                        <option key={i} value={i}>{`Column ${i + 1}`}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>


                    <div className="mt-6">
                        <Button onClick={saveAndStart}>Save & Connect</Button>
                    </div>

                    <div className="text-sm text-gray-400 text-center">Status: {status}</div>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Kick Chat Connector For Twitchat v1.0<br />
                        Made with ❤️ by <span className="text-white font-medium">BlazingBeskar</span><br />
                        View on <a href="https://github.com/BlazingBeskar" target="_blank" className="underline hover:text-white">GitHub</a>
                    </div>

                    <div className="h-64 overflow-y-auto p-2 bg-gray-900 rounded mt-4 border border-gray-700">
                        <h3 className="text-sm font-semibold mb-2">Live Kick Chat</h3>
                        {messages.map((m, i) => (
                            <div key={i} className="text-sm text-gray-300">
                                <span className="font-bold text-green-400">{m.user}:</span> {m.content}
                            </div>
                        ))}
                    </div>

                </CardContent>
            </Card>
        </main>
    );
}
