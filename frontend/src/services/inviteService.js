import fetchWithAuth from "./api";

export const inviteService = {
    sendInvite: async (boardId, userId, receiverIdentifier, role = "EDITOR") => {
        return await fetchWithAuth(`/invites/board/${boardId}`, {
            method: "POST",
            body: JSON.stringify({ userId, receiverIdentifier, role }),
        });
    },

    getPendingInvites: async (userId, userEmail) => {
        return await fetchWithAuth(
            `/invites/pending?userId=${userId}&userEmail=${userEmail}`
        );
    },

    getBoardInvites: async (boardId, userId) => {
        return await fetchWithAuth(`/invites/board/${boardId}?userId=${userId}`);
    },

    acceptInvite: async (inviteId, userId) => {
        return await fetchWithAuth(`/invites/${inviteId}/accept`, {
            method: "PATCH",
            body: JSON.stringify({ userId }),
        });
    },

    declineInvite: async (inviteId, userId) => {
        return await fetchWithAuth(`/invites/${inviteId}/decline`, {
            method: "PATCH",
            body: JSON.stringify({ userId }),
        });
    },

    cancelInvite: async (inviteId, userId) => {
        return await fetchWithAuth(`/invites/${inviteId}?userId=${userId}`, {
            method: "DELETE",
        });
    },
};

export default inviteService;
