import { Dispatch } from "react";
import { ACTION } from "../Reducers/UserReducer";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage"

export interface LoginForm {
    username: string,
    password: string
}

export const login = (LoginForm: LoginForm) => async (dispatch: Dispatch<ACTION>, getState: any) => {
   try {
    const res = await fetch("http://10.0.2.2:8080/login", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(LoginForm)
    })
    const data = await res.json()
    console.log(data)
    console.log(res.headers.get("authorization") ?? "no token")
    await AsyncStorage.setItem("token", res.headers.get("authorization") ?? "")
    dispatch({
        type: "LOG_IN",
        payload: data
    })
   } catch (err) {
    dispatch({
        type: "USER_ERROR",
        payload: err
    })
   }

}

export const ResetUser = () => (dispatch : Dispatch<ACTION>, getState: any) => {
    dispatch({
        type: "USER_RESET"
    })
}