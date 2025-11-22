import React, { useState, useEffect } from "react";
import {
    IconButton, Badge, Menu, Typography, Box, Button, Divider, Stack,
    Avatar, CircularProgress,
} from "@mui/material";
import {
    Mail as MailIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon,
    Dashboard as DashboardIcon, Refresh as RefreshIcon,
} from "@mui/icons-material";
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
        <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
                <Badge badgeContent={invites.length} color="error">
                    <MailIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        width: 400,
                        maxHeight: 500,
                    },
                }}
            >
                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Invitations
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={loadInvites}
                        disabled={loading}
                        sx={{ ml: 1 }}
                    >
                        {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                    </IconButton>
                </Box>
                <Divider />

                {loading && invites.length === 0 ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress size={32} />
                    </Box>
                ) : invites.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4, px: 2 }}>
                        <MailIcon
                            sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            No new invitations
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                        {invites.map((invite) => (
                            <Box key={invite.id}>
                                <Box sx={{ px: 2, py: 2 }}>
                                    <Stack spacing={1.5}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 1.5,
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    bgcolor: "primary.main",
                                                    fontSize: "1rem",
                                                }}
                                            >
                                                {invite.senderName?.charAt(0).toUpperCase() || "?"}
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {invite.senderName}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mb: 0.5 }}
                                                >
                                                    invited you to collaborate on
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    <DashboardIcon fontSize="small" color="action" />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontWeight: 600 }}
                                                        noWrap
                                                    >
                                                        {invite.boardTitle}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    as {invite.role.toLowerCase()} •{" "}
                                                    {formatDate(invite.createdAt)}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleAcceptInvite(invite)}
                                                disabled={processingInvite === invite.id}
                                                sx={{
                                                    flex: 1,
                                                    background:
                                                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                                }}
                                            >
                                                {processingInvite === invite.id ? "..." : "Accept"}
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                startIcon={<CancelIcon />}
                                                onClick={() => handleDeclineInvite(invite)}
                                                disabled={processingInvite === invite.id}
                                                sx={{ flex: 1 }}
                                            >
                                                Decline
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Box>
                                <Divider />
                            </Box>
                        ))}
                    </Box>
                )}
            </Menu>
        </>
    );
}

export default InviteBox;
