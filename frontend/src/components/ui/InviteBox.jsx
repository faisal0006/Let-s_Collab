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
                className="relative p-2 hover:bg-primary/10 text-foreground/80 hover:text-primary rounded-full transition-all duration-300"
            >
                <Mail size={20} />
                {invites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm animate-pulse">
                        {invites.length}
                    </span>
                )}
            </button>

            {Boolean(anchorEl) && (
                <div className="fixed inset-0 z-50" onClick={handleMenuClose}>
                    <div
                        className="absolute right-4 top-16 bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl w-96 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        style={{ maxHeight: "500px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-4 py-3 flex justify-between items-center border-b border-border/50 bg-muted/30">
                            <h3 className="text-sm font-semibold text-foreground">Invitations</h3>
                            <button
                                onClick={loadInvites}
                                disabled={loading}
                                className="p-1.5 hover:bg-background rounded-full text-muted-foreground hover:text-primary transition-colors"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                            </button>
                        </div>

                        {loading && invites.length === 0 ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-primary" size={24} />
                            </div>
                        ) : invites.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                                    <Mail className="text-muted-foreground" size={24} />
                                </div>
                                <p className="text-sm font-medium text-foreground">No new invitations</p>
                                <p className="text-xs text-muted-foreground mt-1">Check back later for new requests</p>
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-auto custom-scrollbar">
                                {invites.map((invite) => (
                                    <div key={invite.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                                        <div className="p-4 space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                                                    {invite.senderName?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-foreground">{invite.senderName}</p>
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        invited you to collaborate on
                                                    </p>
                                                    <div className="flex items-center gap-1.5 mb-1.5 p-1.5 bg-background rounded border border-border/50">
                                                        <LayoutDashboard size={14} className="text-primary" />
                                                        <p className="font-medium text-xs truncate text-foreground">
                                                            {invite.boardTitle}
                                                        </p>
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <span className="capitalize bg-secondary/10 text-secondary px-1.5 py-0.5 rounded text-[10px] font-medium">
                                                            {invite.role.toLowerCase()}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{formatDate(invite.createdAt)}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-1">
                                                <button
                                                    onClick={() => handleAcceptInvite(invite)}
                                                    disabled={processingInvite === invite.id}
                                                    className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                                >
                                                    <CheckCircle size={14} />
                                                    {processingInvite === invite.id ? "Joining..." : "Accept"}
                                                </button>
                                                <button
                                                    onClick={() => handleDeclineInvite(invite)}
                                                    disabled={processingInvite === invite.id}
                                                    className="flex-1 px-3 py-2 border border-border bg-background hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-foreground rounded-lg disabled:opacity-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                                                >
                                                    <X size={14} />
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
