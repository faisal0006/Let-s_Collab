import React, { useState, useEffect, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Share2,
  Edit3,
  Check,
  X,
  Save,
  Users,
} from 'lucide-react';
import toast from "react-hot-toast";
import { whiteboardService } from "../services/index";
import { ShareScreen } from "../components";
import { io } from "socket.io-client";

function WhiteboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const excalidrawRef = useRef(null);
  const setExcalidrawApi = React.useCallback((api) => {
    excalidrawRef.current = api;
  }, []);

  const socketRef = useRef(null);
  const applyingRemoteUpdate = useRef(false);
  const lastSerializedElementsRef = useRef("");
  const lastSavedSerializedRef = useRef("");
  const lastChangeTimeRef = useRef(Date.now());
  const [boardTitle, setBoardTitle] = useState("Untitled Board");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [boardData, setBoardData] = useState(null);
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [activeUsers, setActiveUsers] = useState([]);
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!savedUser) {
      navigate("/login");
      return;
    }

    const loadBoard = async () => {
      try {
        const response = await whiteboardService.getBoard(id, savedUser.id);
        const data = response.response || response;
        setBoardTitle(data.title);
        setTempTitle(data.title);
        setBoardData(data);
      } catch (error) {
        console.error("Error loading board:", error);
        toast.error("Failed to load whiteboard");
        navigate("/dashboard");
      }
    };

    loadBoard();

    // Initialize Socket.IO connection
    const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    socketRef.current = io(BACKEND_URL, {
      withCredentials: true,
      transports: ["polling", "websocket"], // Try polling first, then upgrade to websocket
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Connection status handlers
    socketRef.current.on("connect", () => {
      console.log("✅ Socket.IO connected:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("❌ Socket.IO connection error:", error.message);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("🔌 Socket.IO disconnected:", reason);
    });

    socketRef.current.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket.IO reconnected after", attemptNumber, "attempts");
    });

    // Join the board room
    socketRef.current.emit("join-board", {
      boardId: id,
      userId: savedUser.id,
      userName: savedUser.name,
    });

    // Listen for user joined events
    socketRef.current.on("user-joined", (data) => {
      setActiveUsers(data.activeUsers || []);
      if (data.userName && data.userId !== savedUser.id) {
        toast.success(`${data.userName} joined the board`, {
          duration: 2000,
          icon: "👋",
        });
      }
    });

    // Listen for user left events
    socketRef.current.on("user-left", (data) => {
      setActiveUsers(data.activeUsers || []);
      if (data.userName && data.userId !== savedUser.id) {
        toast(`${data.userName} left the board`, {
          duration: 2000,
          icon: "👋",
        });
      }
      // Remove cursor when user leaves
      setCursors((prev) => {
        const newCursors = { ...prev };
        delete newCursors[data.socketId];
        return newCursors;
      });
    });

    // Listen for element updates from other users
    socketRef.current.on("element-update", (data) => {
      if (data.userId !== savedUser.id && excalidrawRef.current) {
        applyingRemoteUpdate.current = true;
        excalidrawRef.current.updateScene({
          elements: data.elements,
        });
        requestAnimationFrame(() => {
          applyingRemoteUpdate.current = false;
        });
      }
    });

    // Listen for cursor movements
    socketRef.current.on("cursor-move", (data) => {
      if (data.userId !== savedUser.id) {
        setCursors((prev) => ({
          ...prev,
          [data.socketId]: {
            x: data.x,
            y: data.y,
            userName: data.userName,
            userId: data.userId,
          },
        }));
      }
    });

    // Listen for title updates
    socketRef.current.on("title-update", (data) => {
      if (data.userId !== savedUser.id) {
        setBoardTitle(data.title);
        setTempTitle(data.title);
      }
    });

    // Handle socket errors
    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
      toast.error(error.message || "Connection error");
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave-board");
        socketRef.current.disconnect();
      }
    };
  }, [id, navigate]);

  useEffect(() => {
    if (!excalidrawRef.current || !boardData) return;

    if (boardData.elements && Array.isArray(boardData.elements)) {
      applyingRemoteUpdate.current = true;
      excalidrawRef.current.updateScene({
        elements: boardData.elements,
      });
      requestAnimationFrame(() => {
        applyingRemoteUpdate.current = false;
      });
    }
  }, [boardData]);

  const handleChange = (elements) => {
    if (!excalidrawRef.current) return;

    if (applyingRemoteUpdate.current) {
      applyingRemoteUpdate.current = false;
      return;
    }

    // Throttle: Only trigger save state update if enough time has passed
    const now = Date.now();
    if (now - lastChangeTimeRef.current < 300) {
      return;
    }
    lastChangeTimeRef.current = now;

    let serialized;
    try {
      serialized = JSON.stringify(elements || []);
    } catch {
      serialized = null;
    }

    if (serialized && serialized === lastSerializedElementsRef.current) {
      return;
    }

    if (serialized) lastSerializedElementsRef.current = serialized;

    if (
      serialized &&
      boardData?.elements &&
      Array.isArray(boardData.elements)
    ) {
      try {
        if (JSON.stringify(boardData.elements) === serialized) {
          return;
        }
      } catch {
        // Ignore serialization errors
      }
    }

    // Emit real-time update to other users
    if (socketRef.current && elements) {
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      socketRef.current.emit("element-update", {
        boardId: id,
        elements: elements,
        userId: savedUser?.id,
      });
    }

    setLastSaved(Date.now());
  };

  const saveToBackend = React.useCallback(async () => {
    if (!excalidrawRef.current) return;

    try {
      setIsSaving(true);
      const elements = excalidrawRef.current.getSceneElements();
      let serialized;
      try {
        serialized = JSON.stringify(elements || []);
      } catch {
        serialized = null;
      }

      if (serialized && serialized === lastSavedSerializedRef.current) {
        setIsSaving(false);
        return;
      }

      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (!savedUser) {
        console.error("User not found");
        setIsSaving(false);
        return;
      }

      await whiteboardService.updateBoard(id, savedUser.id, {
        elements: elements,
      });

      if (serialized) lastSavedSerializedRef.current = serialized;

      setTimeout(() => setIsSaving(false), 500);
    } catch (error) {
      console.error("Error auto-saving:", error);
      setIsSaving(false);
    }
  }, [id]);

  useEffect(() => {
    if (!excalidrawRef.current || lastSaved === 0) return;

    const timeoutId = setTimeout(saveToBackend, 1500);

    return () => clearTimeout(timeoutId);
  }, [lastSaved, saveToBackend]);

  // Save before unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (excalidrawRef.current && lastSaved !== 0) {
        const elements = excalidrawRef.current.getSceneElements();
        const serialized = JSON.stringify(elements || []);

        if (serialized !== lastSavedSerializedRef.current) {
          e.preventDefault();
          e.returnValue = '';
          saveToBackend();
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [lastSaved, saveToBackend]);

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setTempTitle(boardTitle);
  };

  const handleTitleSave = async () => {
    if (tempTitle.trim() === "") {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (!savedUser) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      await whiteboardService.updateBoard(id, savedUser.id, {
        title: tempTitle,
      });

      setBoardTitle(tempTitle);
      toast.success("Title updated");
      setIsEditingTitle(false);

      // Emit title update to other users
      if (socketRef.current) {
        socketRef.current.emit("title-update", {
          boardId: id,
          title: tempTitle,
        });
      }
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error(error.message || "Failed to update title");
    }
  };

  const handleTitleCancel = () => {
    setTempTitle(boardTitle);
    setIsEditingTitle(false);
  };

  const handleExport = async (type) => {
    if (!excalidrawRef.current) return;

    const elements = excalidrawRef.current.getSceneElements();
    const appState = excalidrawRef.current.getAppState();

    try {
      if (type === "png") {
        const blob = await excalidrawRef.current.exportToBlob({
          elements,
          appState,
          mimeType: "image/png",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${boardTitle}.png`;
        a.click();
        toast.success("Exported as PNG");
      } else if (type === "svg") {
        const svg = await excalidrawRef.current.exportToSvg({
          elements,
          appState,
        });
        const svgString = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${boardTitle}.svg`;
        a.click();
        toast.success("Exported as SVG");
      }
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Export failed");
    }

    setExportMenuAnchor(null);
  };

  const handleBackToDashboard = async () => {
    // Save before navigating away
    if (excalidrawRef.current && lastSaved !== 0) {
      const elements = excalidrawRef.current.getSceneElements();
      const serialized = JSON.stringify(elements || []);

      if (serialized !== lastSavedSerializedRef.current) {
        await saveToBackend();
      }
    }
    navigate("/dashboard");
  };

  // Handle pointer move for cursor tracking
  const handlePointerUpdate = (payload) => {
    if (!socketRef.current) return;

    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!savedUser) return;

    const { pointer } = payload;
    
    if (pointer && pointer.x !== undefined && pointer.y !== undefined) {
      socketRef.current.emit("cursor-move", {
        boardId: id,
        x: pointer.x,
        y: pointer.y,
        userName: savedUser.name,
      });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={handleBackToDashboard}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>

            {isEditingTitle ? (
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleSave();
                    if (e.key === "Escape") handleTitleCancel();
                  }}
                  autoFocus
                  className="flex-1 px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleTitleSave}
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={handleTitleCancel}
                  className="p-2 hover:bg-accent rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div
                onClick={handleTitleEdit}
                className="flex items-center gap-2 cursor-pointer hover:bg-accent px-3 py-2 rounded-lg transition-colors"
              >
                <h1 className="text-xl font-semibold">{boardTitle}</h1>
                <Edit3 size={16} className="text-muted-foreground" />
              </div>
            )}
          </div>

          {isSaving && (
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-2 mr-4">
              <Save size={16} />
              Saving...
            </div>
          )}

          {activeUsers.length > 0 && (
            <div className="px-3 py-2 bg-accent rounded-lg text-sm font-medium flex items-center gap-2 mr-4">
              <Users size={16} />
              <span>{activeUsers.length} active</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={(e) => setExportMenuAnchor(e.currentTarget)}
                className="px-4 py-2 border border-input rounded-lg hover:bg-accent flex items-center gap-2"
              >
                <Download size={18} />
                Export
              </button>

              {Boolean(exportMenuAnchor) && (
                <div className="fixed inset-0 z-50" onClick={() => setExportMenuAnchor(null)}>
                  <div
                    className="absolute bg-card border border-border rounded-lg shadow-xl w-48"
                    style={{
                      top: exportMenuAnchor.getBoundingClientRect().bottom + 8,
                      left: exportMenuAnchor.getBoundingClientRect().left,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleExport("png")}
                      className="w-full px-4 py-2 text-left hover:bg-accent text-sm"
                    >
                      Export as PNG
                    </button>
                    <button
                      onClick={() => handleExport("svg")}
                      className="w-full px-4 py-2 text-left hover:bg-accent text-sm"
                    >
                      Export as SVG
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShareDialogOpen(true)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2"
            >
              <Share2 size={18} />
              Manage Access
            </button>
          </div>
        </div>
      </header>

      <ShareScreen
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        boardId={id}
        boardTitle={boardTitle}
      />

      <div className="flex-1 overflow-hidden">
        <Excalidraw
          excalidrawAPI={setExcalidrawApi}
          initialData={{
            elements: [],
            appState: { viewBackgroundColor: "#ffffff" },
          }}
          onChange={handleChange}
          onPointerUpdate={handlePointerUpdate}
        />
      </div>

      {/* Remote cursors overlay */}
      <div className="pointer-events-none fixed inset-0 z-50">
        {Object.entries(cursors).map(([socketId, cursor]) => (
          <div
            key={socketId}
            className="absolute transition-all duration-100"
            style={{
              left: `${cursor.x}px`,
              top: `${cursor.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                <path
                  d="M5.65376 12.3673L8.47492 15.1885L10.8162 18.9917L13.0234 13.7806L18.2346 11.5734L14.4314 9.23208L11.6102 6.41092L10.4489 10.5032L5.65376 12.3673Z"
                  fill="#FF6B6B"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="absolute top-5 left-5 px-2 py-1 bg-[#FF6B6B] text-white text-xs rounded-md whitespace-nowrap">
                {cursor.userName}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhiteboardPage;
