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
} from 'lucide-react';
import toast from "react-hot-toast";
import { whiteboardService } from "../services/index";
import { ShareScreen } from "../components";

function WhiteboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const excalidrawRef = useRef(null);
  const setExcalidrawApi = React.useCallback((api) => {
    excalidrawRef.current = api;
  }, []);

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
        />
      </div>
    </div>
  );
}

export default WhiteboardPage;
