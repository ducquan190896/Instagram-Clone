// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { RootURL } from "../Store/Store";
// import SockJS from "sockjs-client";
// import {over} from "stompjs"

// export const connectToWebSocket = async (username: string ,socketUrl: string, messageReceiveHandler: (payload: any) => void, setStompClient: (value: any) => void) => {
//     const token = await AsyncStorage.getItem("token");
//         let sock = SockJS(RootURL + "/socket");
//         let stompClient = over(sock);
//         setStompClient(stompClient);
//         if(stompClient.status !== "CONNECTED") {
//           stompClient.connect({username: username, token: token}, (frame: any) => {
//             stompClient.subscribe(socketUrl, messageReceiveHandler)
//           }, notConnected)
//         }
// }

// const notConnected = () => {
//     console.log("not connected");
// }