import { Dispatch } from "react";
import { ACTION } from "../Reducers/UserReducer";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native";

export interface LoginForm {
    username: string,
    password: string
}

export interface RegisterForm {
    username: string,
    email: string,
    introduction: string,
    password: string,
    confirmPassword: string,
    avatarUrl: string
}

export interface CHANGEPASSWORD {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
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
    if(data.message) {
        dispatch({
            type: "USER_ERROR",
            payload: data.message
        })
        return;
     }
    // console.log(data)
    // console.log(res.headers.get("authorization") ?? "no token")
    const token : string =  res.headers.get("authorization") ?? ""
   
     console.log(data.active)
    if(!data.active) {
       
        const res1 = await fetch("http://10.0.2.2:8080/api/users/reactivateUser", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token 
            }
        })
        const data1 = await res1.json()
        console.log(data1)
        console.log(res1.headers.get("authorization") ?? "no token")
        await AsyncStorage.setItem("token", res1.headers.get("authorization") ?? "")
        Alert.alert(" re-actived your account successfully")
       dispatch({
        type: "ReActive_User",
        payload: data1
       })

    } else {
        Alert.alert("Signed In successfully")
        console.log(token)
        await AsyncStorage.setItem("token", token)
        dispatch({
            type: "LOG_IN",
            payload: data
        })
    }

   
   } catch (err) {
    dispatch({
        type: "USER_ERROR",
        payload: err
    })
   }

}


export const Register = (registerForm: RegisterForm) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
     const res = await fetch("http://10.0.2.2:8080/api/users/register", {
         method: "POST",
         headers: {
             "Content-Type": "application/json",
         },
         body: JSON.stringify(registerForm)
     })
     const data = await res.json()
     if(data.message) {
        dispatch({
            type: "USER_ERROR",
            payload: data.message
        })
        return;
     }
     console.log(data)
     console.log(res.headers.get("authorization") ?? "no token")
     await AsyncStorage.setItem("token", res.headers.get("authorization") ?? "")
     dispatch({
         type: "REGISTER",
         payload: data
     })
    } catch (err) {
     dispatch({
         type: "USER_ERROR",
         payload: err
     })
    }
 
 }

 export const ChangePassword = (form: CHANGEPASSWORD) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
    // const token : string | null = await AsyncStorage.getItem("token");
    const token = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJxdWFuIiwiY2xhaW1zIjpbIlJPTEVfVVNFUiJdLCJleHAiOjE2NzU5NzgwMjV9.mxq2cRx83CB5txVX5C-DpjHREGDbo-ixJ5UhnQ7UvVOg24rnB8zcTxSn6emj3wMdOMCYkW-ZMHd6dv5M1TfmKw"
     const res = await fetch("http://10.0.2.2:8080/api/users/changePassword", {
         method: "PUT",
         headers: {
             "Authorization": token ?? "",
             "Content-Type": "application/json"
         },
         body: JSON.stringify(form)
     })
     const data = await res.json()

     if(data.message) {
        dispatch({
            type: "USER_ERROR",
            payload: data.message
        })
        return;
     }

     console.log(data)
     console.log(res.headers.get("authorization") ?? "no token")
     await AsyncStorage.setItem("token", res.headers.get("authorization") ?? "")
     dispatch({
         type: "Change_Password",
         payload: data
     })
    } catch (err) {
     dispatch({
         type: "USER_ERROR",
         payload: err
     })
    }
 
 }

 export const DeactivateUser = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
    const token : string | null = await AsyncStorage.getItem("token");
     const res = await fetch("http://10.0.2.2:8080/api/users/deactivateUser", {
         method: "PUT",
         headers: {
             "Content-Type": "application/json",
             "Authorization": token ?? ""
         }
     })
     const data = await res.json()
     if(data.message) {
        dispatch({
            type: "USER_ERROR",
            payload: data.message
        })
        return;
     }
     
     await AsyncStorage.setItem("token", "")

     dispatch({
         type: "DeActive_User"
     })
    } catch (err) {
     dispatch({
         type: "USER_ERROR",
         payload: err
     })
    }
 
 }

 export const LogOut = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
    const token : string | null = await AsyncStorage.getItem("token");
      await fetch("http://10.0.2.2:8080/logout", {
         method: "GET",
         headers: {
             "Authorization": token ?? ""
         }
     })
     
     await AsyncStorage.setItem("token", "")
     
     dispatch({
         type: "LOG_OUT"
     })
    } catch (err) {
     dispatch({
         type: "USER_ERROR",
         payload: err
     })
    }
 
 }


 export const getActiveUserAction = (userId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
    
     const res = await fetch(`http://10.0.2.2:8080/api/users/id/${userId}`)
     const data = await res.json()
     console.log(data)

     dispatch({
         type: "get_active_user_by_id",
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