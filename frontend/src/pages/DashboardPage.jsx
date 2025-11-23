import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  UserCircle,
  LogOut,
  LayoutDashboard,
  FolderOpen,
  Sun,
  Moon,
} from 'lucide-react';
import toast from "react-hot-toast";
import { whiteboardService } from "../services/index";
import { useThemeMode } from '../hooks/useThemeMode';
import { InviteBox } from '../components';

function DashboardPage() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const [whiteboards, setWhiteboards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    setUser(savedUser);

    const loadBoards = async () => {
      try {
        const data = await whiteboardService.getAllBoards(savedUser.id);

        if (data?.response) {
          setWhiteboards(data.response);
          setFilteredBoards(data.response);
        }
      } catch (error) {
        console.error("Error loading boards:", error);
        toast.error("Failed to load whiteboards");
        setWhiteboards([]);
        setFilteredBoards([]);
      }
    };

    loadBoards();
  }, [navigate]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBoards(whiteboards);
    } else {
      const filtered = whiteboards.filter((board) =>
        board.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBoards(filtered);
    }
  }, [searchQuery, whiteboards]);

  const createNewWhiteboard = async () => {
    try {
      if (!user?.id) {
        toast.error("User not found. Please login again.");
        return;
      }

      const title = `Untitled Board ${whiteboards.length + 1}`;

      const response = await whiteboardService.createWhiteboard(title, user.id);

      if (response?.newBoard) {
        const updatedBoards = [...whiteboards, response.newBoard];
        setWhiteboards(updatedBoards);

        toast.success("New whiteboard created!");
        navigate(`/whiteboard/${response.newBoard.id}`);
      }
    } catch (error) {
      console.error("Error creating whiteboard:", error);
      toast.error(error.message || "Failed to create whiteboard");
    }
  };

  const deleteWhiteboard = async () => {
    if (!selectedBoard) return;

    try {
      await whiteboardService.deleteBoard(selectedBoard.id, user.id);

      const updatedBoards = whiteboards.filter(
        (board) => board.id !== selectedBoard.id
      );
      setWhiteboards(updatedBoards);

      toast.success("Whiteboard deleted");
      setDeleteDialogOpen(false);
      setSelectedBoard(null);
    } catch (error) {
      console.error("Error deleting whiteboard:", error);
      toast.error(error.message || "Failed to delete whiteboard");
      setDeleteDialogOpen(false);
    }
  };

  const openWhiteboard = (id) => {
    navigate(`/whiteboard/${id}`);
  };

  const handleMenuOpen = (event, board) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedBoard(board);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={24} />
              <h1 className="text-xl font-semibold">Let's Collab - Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              >
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <InviteBox />

              <div className="relative">
                <button
                  onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                  className="flex items-center justify-center w-8 h-8 bg-secondary text-secondary-foreground rounded-full font-semibold"
                >
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </button>

                {Boolean(userMenuAnchor) && (
                  <div className="fixed inset-0 z-50" onClick={() => setUserMenuAnchor(null)}>
                    <div
                      className="absolute right-4 top-16 bg-card border border-border rounded-lg shadow-xl w-48"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2 border-b border-border flex items-center gap-2 text-muted-foreground">
                        <UserCircle size={20} />
                        <span className="text-sm">{user?.name || "User"}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2 text-sm"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">My Whiteboards</h2>
              <p className="text-muted-foreground">
                {whiteboards.length}{" "}
                {whiteboards.length === 1 ? "whiteboard" : "whiteboards"}
              </p>
            </div>

            <button
              onClick={createNewWhiteboard}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={20} />
              New Whiteboard
            </button>
          </div>

          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search whiteboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {filteredBoards.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen size={80} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">
              {searchQuery ? "No whiteboards found" : "No whiteboards yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search"
                : "Create your first whiteboard to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={createNewWhiteboard}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Create Your First Whiteboard
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBoards.map((board) => (
              <div
                key={board.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
              >
                <div
                  onClick={() => openWhiteboard(board.id)}
                  className="cursor-pointer"
                >
                  <div className="h-44 bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-b border-border">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-3/5 h-3/5"
                    >
                      <rect
                        x="10"
                        y="10"
                        width="80"
                        height="60"
                        fill="#e0e0e0"
                        rx="4"
                      />
                      <line
                        x1="20"
                        y1="25"
                        x2="60"
                        y2="25"
                        stroke="#999"
                        strokeWidth="2"
                      />
                      <line
                        x1="20"
                        y1="35"
                        x2="75"
                        y2="35"
                        stroke="#999"
                        strokeWidth="2"
                      />
                      <circle cx="25" cy="55" r="8" fill="#999" />
                      <rect
                        x="40"
                        y="48"
                        width="25"
                        height="15"
                        fill="#999"
                        rx="2"
                      />
                    </svg>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-2 truncate">
                          {board.title}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs">
                          Edited {formatDate(board.updatedAt)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleMenuOpen(e, board)}
                        className="p-1 hover:bg-accent rounded ml-2"
                      >
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Board Options Menu */}
      {Boolean(anchorEl) && (
        <div className="fixed inset-0 z-50" onClick={handleMenuClose}>
          <div
            className="absolute bg-card border border-border rounded-lg shadow-xl w-40"
            style={{
              top: anchorEl.getBoundingClientRect().bottom + 8,
              left: anchorEl.getBoundingClientRect().left - 120,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleDeleteClick}
              className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2 text-sm text-destructive"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-semibold mb-4">Delete Whiteboard?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete "{selectedBoard?.title}"? This
              action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 border border-input rounded-lg hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={deleteWhiteboard}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
