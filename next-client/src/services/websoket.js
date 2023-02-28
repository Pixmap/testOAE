const waitForOpenSocket = async (socket) => {
    return new Promise((resolve) => {
        if (socket.readyState !== socket.OPEN) {
            socket.addEventListener("open", (_) => {
                resolve();
            })
        } else {
            resolve();
        }
    });
}

const sendToWebsocket = async (ws, data) => {
    await waitForOpenSocket(ws);
    ws.send(data);
};

export default sendToWebsocket;