import React, { useState, useEffect } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,TextField,Select,MenuItem,
    FormControl,InputLabel,Stack,Typography,Box,CircularProgress,Alert,Divider,
    Avatar,Chip,List,ListItem,ListItemAvatar,ListItemText,IconButton,Tabs,Tab,
} from "@mui/material";
import {Person as PersonIcon,Send as SendIcon,People as PeopleIcon,
    Pending as PendingIcon,Cancel as CancelIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { inviteService } from "../services/inviteService";
import { whiteboardService } from "../services/index";

function ShareDialog({ open, onClose, boardId, boardTitle }) {
    const [tabValue, setTabValue] = useState(0);
    const [inviteIdentifier, setInviteIdentifier] = useState("");
    const [inviteRole, setInviteRole] = useState("EDITOR");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [collaborators, setCollaborators] = useState([]);
    const [pendingInvites, setPendingInvites] = useState([]);
    const [boardData, setBoardData] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (open) {
            loadBoardData();
        }
    }, [open, boardId]);

    const loadBoardData = async () => {
        try {
            setDataLoading(true);
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (!user) return;

            const boardResponse = await whiteboardService.getBoard(boardId, user.id);
            const board = boardResponse.response || boardResponse;
            setBoardData(board);
            setCollaborators(board.collaborators || []);

            try {
                const invitesResponse = await inviteService.getBoardInvites(
                    boardId,
                    user.id
                );
                setPendingInvites(invitesResponse.invites || []);
            } catch (err) {
                setPendingInvites([]);
            }
        } catch (error) {
            console.error("Error loading board data:", error);
        } finally {
            setDataLoading(false);
        }
    };

    const handleSendInvite = async () => {
        if (!inviteIdentifier.trim()) {
            setError("Please enter an email address or username");
            return;
        }

        const isEmail = inviteIdentifier.includes("@");

        if (isEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(inviteIdentifier)) {
                setError("Please enter a valid email address");
                return;
            }
        } else {
            const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
            if (!usernameRegex.test(inviteIdentifier)) {
                setError("Username must be 3-30 characters (letters, numbers, _, -)");
                return;
            }
        }

        setLoading(true);
        setError("");

        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (!user) {
                toast.error("Please login again");
                return;
            }

            await inviteService.sendInvite(
                boardId,
                user.id,
                inviteIdentifier.trim(),
                inviteRole
            );

            toast.success(`Invite sent to ${inviteIdentifier}`);
            setInviteIdentifier("");
            setInviteRole("EDITOR");

            await loadBoardData();
        } catch (err) {
            console.error("Error sending invite:", err);
            setError(err.message || "Failed to send invite");
            toast.error(err.message || "Failed to send invite");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelInvite = async (inviteId) => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (!user) return;

            await inviteService.cancelInvite(inviteId, user.id);
            toast.success("Invite cancelled");

            await loadBoardData();
        } catch (error) {
            console.error("Error cancelling invite:", error);
            toast.error("Failed to cancel invite");
        }
    };

    const handleClose = () => {
        setInviteIdentifier("");
        setInviteRole("EDITOR");
        setError("");
        setTabValue(0);
        onClose();
    };

    const totalPeople = (boardData ? 1 : 0) + collaborators.length;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PeopleIcon color="primary" />
                        <Typography variant="h6" component="span">
                            Manage Access - "{boardTitle}"
                        </Typography>
                    </Box>
                    <Chip
                        label={`${totalPeople} ${totalPeople === 1 ? "person" : "people"}`}
                        color="primary"
                        size="small"
                    />
                </Box>
            </DialogTitle>

            <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{ px: 3, borderBottom: 1, borderColor: "divider" }}
            >
                <Tab label="Invite" />
                <Tab label={`Collaborators (${totalPeople})`} />
                <Tab label={`Pending Invites (${pendingInvites.length})`} />
            </Tabs>

            <DialogContent sx={{ minHeight: 300 }}>
                {tabValue === 0 && (
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Invite collaborators to work on this whiteboard together in
                            real-time.
                        </Typography>

                        {error && (
                            <Alert severity="error" onClose={() => setError("")}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            label="Email or Username"
                            placeholder="colleague@example.com or username"
                            value={inviteIdentifier}
                            onChange={(e) => setInviteIdentifier(e.target.value)}
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                                ),
                            }}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSendInvite();
                                }
                            }}
                        />

                        <FormControl fullWidth disabled={loading}>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={inviteRole}
                                label="Role"
                                onChange={(e) => setInviteRole(e.target.value)}
                            >
                                <MenuItem value="VIEWER">
                                    <Box>
                                        <Typography variant="body1">Viewer</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Can view the whiteboard (read-only)
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="EDITOR">
                                    <Box>
                                        <Typography variant="body1">Editor</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Can view, edit, and invite others
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            onClick={handleSendInvite}
                            variant="contained"
                            disabled={loading || !inviteIdentifier.trim()}
                            startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
                            sx={{
                                background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                            }}
                        >
                            {loading ? "Sending..." : "Send Invite"}
                        </Button>
                    </Stack>
                )}

                {tabValue === 1 && (
                    <Box sx={{ mt: 2 }}>
                        {dataLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <List>
                                {boardData?.owner && (
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: "primary.main" }}>
                                                {boardData.owner.name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={boardData.owner.name}
                                            secondary={boardData.owner.email}
                                        />
                                        <Chip label="Owner" color="primary" size="small" />
                                    </ListItem>
                                )}

                                {collaborators.map((collab) => (
                                    <ListItem key={collab.userId}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: "secondary.main" }}>
                                                {collab.name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={collab.name}
                                            secondary={collab.email}
                                        />
                                        <Chip
                                            label={collab.role}
                                            color={collab.role === "EDITOR" ? "success" : "default"}
                                            size="small"
                                        />
                                    </ListItem>
                                ))}

                                {collaborators.length === 0 && (
                                    <Box sx={{ textAlign: "center", py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No collaborators yet. Invite someone to get started!
                                        </Typography>
                                    </Box>
                                )}
                            </List>
                        )}
                    </Box>
                )}

                {tabValue === 2 && (
                    <Box sx={{ mt: 2 }}>
                        {dataLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : pendingInvites.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 4 }}>
                                <PendingIcon
                                    sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    No pending invites
                                </Typography>
                            </Box>
                        ) : (
                            <List>
                                {pendingInvites.map((invite) => (
                                    <ListItem
                                        key={invite.id}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleCancelInvite(invite.id)}
                                                color="error"
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: "warning.main" }}>
                                                <PendingIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={invite.receiverEmail}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2">
                                                        Role: {invite.role}
                                                    </Typography>
                                                    {" • "}
                                                    <Typography component="span" variant="body2">
                                                        Sent{" "}
                                                        {new Date(invite.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                        <Chip
                                            label="Pending"
                                            color="warning"
                                            size="small"
                                            sx={{ mr: 1 }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ShareDialog;
