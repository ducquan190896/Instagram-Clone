import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "redux"
import { ACTION } from "../Reducers/UserReducer"


// export const getPostLikesOfPost = (postId: number) => async (dispatch : Dispatch<ACTION>, getState: any) => {
//     try {
//         const res = await fetch(`http://10.0.2.2:8080/api/postlikes/getAllByPost/${postId}`)
//         const data = await res.json()
//         console.log(data)

//         dispatch({
//             type: "get_post_likes_of_post",
//             payload: data
//         })

//     } catch (err) {
//         dispatch({
//             type: "error_post_like",
//             payload: err
//         })
//     }
// }

// export const addPostLike = (postId: number) => async (dispatch : Dispatch<ACTION>, getState: any) => {
//     try {

//         const token = await AsyncStorage.getItem("token")
//         console.log(token)
//         const res = await fetch(`http://10.0.2.2:8080/api/postlikes/likePost/${postId}`, {
//             method: "POST",
//             headers: {
//                 "Authorization": token ?? ""
//             }
//         })
//         const data = await res.json()
//         console.log(data)

//         dispatch({
//             type: "add_post_like",
//             payload: data
//         })

//     } catch (err) {
//         dispatch({
//             type: "error_post_like",
//             payload: err
//         })
//     }
// }

// export const removePostLike = (postId: number, userId: number) => async (dispatch : Dispatch<ACTION>, getState: any) => {
//     try {

//         const token = await AsyncStorage.getItem("token")
//         console.log(token)
//          await fetch(`http://10.0.2.2:8080/api/postlikes/removeLikeFromPost/${postId}`, {
//             method: "DELETE",
//             headers: {
//                 "Authorization": token ?? ""
//             }
//         })
       

//         dispatch({
//             type: "remove_post_like",
//             payload: userId
//         })

//     } catch (err) {
//         dispatch({
//             type: "error_post_like",
//             payload: err
//         })
//     }
// }

// export const ResetPostLikes = () => (dispatch : Dispatch<ACTION>, getState: any) => {
//     dispatch({
//         type: "reset_postLike"
//     })
// }