import { ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Choice, Post } from '../Store/Reducers/PostsReducer'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import { addVoteToPoll, getVotesOfPoll } from '../Store/Actions/VoteAction'
import { RootState, RootURL } from '../Store/Store'
import { Button } from '@rneui/base'
import { getPostByPostIdAfterUpdate, getPostsOfFollowingsAndAuthUser } from '../Store/Actions/PostsAction'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USER } from '../Store/Reducers/UserReducer'
import { VOTE } from '../Store/Reducers/VoteReducer'

const AdminPolling = ({postParams}: {postParams: Post}) => {
    const [totalVote, setTotalVote] = useState<number>(0)
    const [isActivePoll, setIsActivePoll] = useState<boolean>(false)
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
    const [isVoted, setIsVoted] = useState<boolean>(false)
    const [votes, setVotes] = useState<VOTE[] | []>([])
    const tw = useTailwind()
    const dispatch = useDispatch()
    const {poll, dateCreated, dateUpdated, userResponse} = postParams
    const {post, postSuccess, postError} = useSelector((state: RootState) => state.POSTS)
    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)

    let totalVoteFunction  = useCallback(() => {
        const total = poll?.choices?.reduce((total, a) => total + a.voteCount, 0) ?? 0
        setTotalVote(total)
        console.log(totalVote)
    }, [votes, post, poll, postParams, dispatch, getVotesOfPoll])
    
    const isActivePollFunction = () => {
        const dateOfPoll = new Date(postParams?.dateCreated.replace("--", "-"))     
        dateOfPoll.setDate(dateOfPoll.getDate() + (poll?.expireDays ?? 0))
        setIsActivePoll((dateOfPoll.getTime() - (new Date().getTime())) > 0)
    }

      // get the user from useSelector, then comparing the authuser with list of votes loaded whether the user already voted or not
    const checkVotedStatusOfUser = useCallback(() => {     
       if(user && votes && votes.length > 0) {
        const isCheck = votes?.some((vo : VOTE) => vo?.owner?.id == user?.id)
        console.log(isCheck)
        setIsVoted(isCheck)
       }
    }, [votes, setVotes, post, poll, user, userSuccess, dispatch])

    const loadVotesByPoll = useCallback( async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        const res = await fetch(RootURL + `/api/votes/poll/${poll?.id}`, {
            method: "GET",
            headers: {
                "Authorization": token ?? "",
            }
        })
        const data = await res.json()
        console.log(data)
       
        setVotes(data)

      } catch (err) {
        dispatch({
            type: "error_vote",
            payload: err
        })
      }
      totalVoteFunction()
        
    }, [poll, postParams, votes, user,  post, dispatch])

    const AddVoteFunction = async () => {
        if(selectedChoice) {
            // add vote by choiceId and pollId
            try {
              const token = await AsyncStorage.getItem("token")
              const res = await fetch(RootURL + `/api/votes/addVote/poll/${poll?.id}/choice/${selectedChoice}`, {
                  method: "POST",
                  headers: {
                      "Authorization": token ?? "",
                  }
              })
              const data = await res.json()
              console.log(data)   
              await dispatch(getPostByPostIdAfterUpdate(postParams.id) as any)
              await loadVotesByPoll()
              setSelectedChoice(null)
              setIsVoted(true)
              setTotalVote(prev => prev + 1) 
              setVotes(prev => [...prev, data])   
          } catch (err) {
              dispatch({
                  type: "error_vote",
                  payload: err
              })
          }
        }
      }

    useEffect(() => {
        totalVoteFunction()
        isActivePollFunction()
        checkVotedStatusOfUser()
    }, [postParams, poll, post, dispatch, votes, setVotes, user])

    useEffect(() => {
        loadVotesByPoll()
    }, [poll, postParams, user,  post, dispatch])

    const handleRenderItem: ListRenderItem<any> = ({item}) => (
        <View  style={tw('mx-2 mb-2 rounded-lg  bg-gray-200 relative')}>
            <View style={[tw(' rounded-lg px-2 py-2  flex-row items-center justify-between')]}>
                <Text style={tw('text-base text-black ml-4')}>{item.answer}</Text>
                <Text style={tw('text-base text-black mr-4')}>{(item.voteCount * 100 / (totalVote > 1 ? totalVote : 1)).toFixed(0)} %</Text>
            </View>
            <View style={[tw('absolute top-0  left-0 -z-10  bg-gray-400 rounded-lg'), {width: (item.voteCount * 100 / (totalVote > 1 ? totalVote : 1)).toFixed(0) + "%", height: "100%"}]}></View>
        </View>
    )
 
  return (
    <View style={tw('w-full my-2 px-2')}>
      <Text style={tw('text-lg font-bold mb-4 text-black text-center')}>{poll?.question}</Text>
      <FlatList
        data={poll?.choices}
        keyExtractor={(item: any) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={handleRenderItem}
      ></FlatList>
      <View style={tw(' flex flex-row items-center justify-between px-2 mt-2')}>
        <Text  style={tw('text-lg font-bold text-black')}>{totalVote} Votes</Text>
      </View>
    </View>
  )
}

export default AdminPolling

const styles = StyleSheet.create({})