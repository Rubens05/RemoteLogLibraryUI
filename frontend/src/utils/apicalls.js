import API from "./api";

export { getLogs, getLogByLevel, getLogBySender, getLogByTopic, getLogByTimestamp };

async function getLogs() {
    try {
        const response = await API.get("/log");
        return response.data;
    } catch (error) {
        console.error("Error retrieving logs:", error);
        return { error: "Internal Server Error" };
    }
}
async function getLogByLevel() {
    try {
        const response = await API.get("/log/level");
        return response.data;
    } catch (error) {
        console.error("Error retrieving logs:", error);
        return { error: "Internal Server Error" };
    }
}

async function getLogBySender() {
    try {
        const response = await API.get("/log/sender");
        return response.data;
    } catch (error) {
        console.error("Error retrieving logs:", error);
        return { error: "Internal Server Error" };
    }
}

async function getLogByTopic() {
    try {
        const response = await API.get("/log/topic");
        return response.data;
    } catch (error) {
        console.error("Error retrieving logs:", error);
        return { error: "Internal Server Error" };
    }
}

async function getLogByTimestamp() {
    try {
        const response = await API.get("/log/timestamp");
        return response.data;
    } catch (error) {
        console.error("Error retrieving logs:", error);
        return { error: "Internal Server Error" };
    }
}