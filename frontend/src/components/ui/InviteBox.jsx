import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, X, LayoutDashboard, RefreshCw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { inviteService } from "../../services/inviteService";

function InviteBox() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processingInvite, setProcessingInvite] = useState(null);

    const loadInvites = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (!user) return;

            setLoading(true);
            const response = await inviteService.getPendingInvites(
                user.id,
                user.email
            );
            setInvites(response.invites || []);
        } catch (error) {
            console.error("Error loading invites:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInvites();
        const interval = setInterval(loadInvites, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAcceptInvite = async (invite) => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (!user) {
                toast.error("Please login again");
                return;
            }

            setProcessingInvite(invite.id);
            await inviteService.acceptInvite(invite.id, user.id);

            toast.success(`You're now a collaborator on "${invite.boardTitle}"!`);
            setInvites(invites.filter((i) => i.id !== invite.id));
        } catch (error) {
            console.error("Error accepting invite:", error);
            toast.error(error.message || "Failed to accept invite");
        } finally {
            setProcessingInvite(null);
        }
    };

    const handleDeclineInvite = async (invite) => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (!user) {
                toast.error("Please login again");
                return;
            }

            setProcessingInvite(invite.id);
            await inviteService.declineInvite(invite.id, user.id);

            toast.success("Invite declined");
            setInvites(invites.filter((i) => i.id !== invite.id));
        } catch (error) {
            console.error("Error declining invite:", error);
            toast.error(error.message || "Failed to decline invite");
        } finally {
            setProcessingInvite(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative">
            <button
                onClick={handleMenuOpen}
                className="relative p-2 hover:bg-accent rounded-lg transition-colors"
            >
                <Mail size={20} />
                {invites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {invites.length}
                    </span>
                )}
            </button>

            {Boolean(anchorEl) && (
                <div className="fixed inset-0 z-50" onClick={handleMenuClose}>
                    <div
                        className="absolute right-4 top-16 bg-card border border-border rounded-lg shadow-xl w-96"
                        style={{ maxHeight: "500px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-4 py-3 flex justify-between items-center border-b border-border">
                            <h3 className="text-lg font-semibold">Invitations</h3>
                            <button
                                onClick={loadInvites}
                                disabled={loading}
                                className="p-1 hover:bg-accent rounded"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                            </button>
                        </div>

                        {loading && invites.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-primary" size={32} />
                            </div>
                        ) : invites.length === 0 ? (
                            <div className="text-center py-8 px-4">
                                <Mail className="mx-auto text-muted-foreground mb-2" size={48} />
                                <p className="text-sm text-muted-foreground">No new invitations</p>
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-auto">
                                {invites.map((invite) => (
                                    <div key={invite.id} className="border-b border-border last:border-0">
                                        <div className="p-4 space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                                                    {invite.senderName?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm">{invite.senderName}</p>
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        invited you to collaborate on
                                                    </p>
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <LayoutDashboard size={14} className="text-muted-foreground" />
                                                        <p className="font-semibold text-sm truncate">
                                                            {invite.boardTitle}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        as {invite.role.toLowerCase()} • {formatDate(invite.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAcceptInvite(invite)}
                                                    disabled={processingInvite === invite.id}
                                                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-1"
                                                >
                                                    <CheckCircle size={16} />
                                                    {processingInvite === invite.id ? "..." : "Accept"}
                                                </button>
                                                <button
                                                    onClick={() => handleDeclineInvite(invite)}
                                                    disabled={processingInvite === invite.id}
                                                    className="flex-1 px-3 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-1"
                                                >
                                                    <X size={16} />
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default InviteBox;
