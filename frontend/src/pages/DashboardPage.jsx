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
  Menu,
} from 'lucide-react';
import toast from "react-hot-toast";
import { whiteboardService } from "../services/index";
import { useThemeMode } from '../hooks/useThemeMode';
import { InviteBox } from '../components';
import Logo from '../components/Logo';
import { ProfileDropdown } from '../components/ui/ProfileDropdown';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    setUser(savedUser);

    const loadBoards = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
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
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <Logo className="w-10 h-10" />
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Let's Collab
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {user && (
                <div className="relative">
                  <button
                    onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                    className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    title="Profile"
                  >
                    <UserCircle size={20} />
                  </button>
                  <ProfileDropdown
                    user={user}
                    onLogout={handleLogout}
                    onUserUpdate={handleUserUpdate}
                    anchor={userMenuAnchor}
                    onClose={() => setUserMenuAnchor(null)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Top Bar: Search & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-1">My Whiteboards</h2>
            <p className="text-muted-foreground text-sm">
              Manage your projects and collaborate with your team.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-input bg-card rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm text-sm"
              />
            </div>
            <button
              onClick={createNewWhiteboard}
              className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 inline-flex items-center gap-2 font-medium whitespace-nowrap"
              title="Create new whiteboard"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">New Board</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Loading Whiteboards</h3>
            <p className="text-sm text-muted-foreground">Please wait...</p>
          </div>
        ) : filteredBoards.length === 0 ? (
          <div className="text-center py-24 bg-card border border-border/50 rounded-3xl border-dashed">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderOpen size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {searchQuery ? "No whiteboards found" : "No whiteboards yet"}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search terms to find what you're looking for."
                : "Create your first whiteboard to start collaborating with your team."}
            </p>
            {!searchQuery && (
              <button
                onClick={createNewWhiteboard}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 inline-flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
                Create Your First Whiteboard
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBoards.map((board) => (
                  <div
                    key={board.id}
                    className="group bg-card border border-border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                  >
                    <div
                      onClick={() => openWhiteboard(board.id)}
                      className="cursor-pointer"
                    >
                      <div className="h-40 bg-muted/30 flex items-center justify-center border-b border-border/50 relative overflow-hidden group-hover:bg-muted/50 transition-colors">
                        {board.thumbnail ? (
                          <>
                            {/* Actual Board Thumbnail */}
                            <img
                              src={board.thumbnail}
                              alt={board.title}
                              className="w-full h-full object-cover"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
                          </>
                        ) : (
                          <>
                            {/* Placeholder Preview */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-70 transition-opacity">
                              <svg
                                viewBox="0 0 100 100"
                                className="w-1/2 h-1/2 text-muted-foreground/30"
                                fill="currentColor"
                              >
                                <rect x="20" y="20" width="60" height="40" rx="4" />
                                <circle cx="70" cy="30" r="5" />
                                <rect x="30" y="35" width="30" height="4" rx="2" />
                                <rect x="30" y="45" width="40" height="4" rx="2" />
                              </svg>
                            </div>
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
                          </>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                              {board.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDate(board.updatedAt)}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleMenuOpen(e, board)}
                            className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </main>

      {/* Board Options Menu */}
      {Boolean(anchorEl) && (
        <div className="fixed inset-0 z-50" onClick={handleMenuClose}>
          <div
            className="absolute bg-card border border-border rounded-xl shadow-xl w-48 py-1 animate-in fade-in zoom-in-95 duration-100"
            style={{
              top: anchorEl.getBoundingClientRect().bottom + 8,
              left: anchorEl.getBoundingClientRect().left - 140,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleDeleteClick}
              className="w-full px-4 py-2.5 text-left hover:bg-destructive/10 flex items-center gap-2 text-sm text-destructive font-medium transition-colors"
            >
              <Trash2 size={16} />
              Delete Board
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in zoom-in-95 duration-200 border border-border/50">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4 text-destructive">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Delete Whiteboard?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete "<span className="font-medium text-foreground">{selectedBoard?.title}</span>"? This
              action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-5 py-2.5 border border-input rounded-xl hover:bg-accent font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteWhiteboard}
                className="px-5 py-2.5 bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 font-medium transition-colors shadow-lg shadow-destructive/20"
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
