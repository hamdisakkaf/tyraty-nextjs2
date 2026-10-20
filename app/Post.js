import React,{useEffect,useState} from 'react'
//import {useParams} from "react-router-dom"
import { useParams,useLocation,useNavigate    } from "react-router-dom";

//import Axios from 'axios'
import  Axios  from '../config';
import '../App.css'

export default function Post() {

let {postId} = useParams();
const [post,setPost] = useState({})

useEffect(()=>{
    //Axios.get(`localhost:3002/server/api/getFromId/${postId}`).then((data)=>{
    Axios.get(`https://tyraty-server.onrender.com/server/api/getFromId/${postId}`,{ mode: 'cors' }).then((data)=>{

    console.log(data)
setPost({
        title: data.data[0].title,
         postText: data.data[0].post_text,
         userName: data.data[0].user_name,
         id:data.data[0].id
        });
 });

},[postId]);

const deletePost = (id) => {
    //Axios.delete(`localhost:5000/server/api/delete/${postId}`).then((response)=>{
    Axios.delete(`https://server.tyraty.com/server/api/delete/${postId}`,{
        mode: 'cors',
        headers: {
         "Content-Type": "text/html",
     },
       }).then((response)=>{

        alert("you deleted a post")
    })
}


    return (
        <div className="Post individual">
        <h1 className="post-title">{post.title}</h1>
          <p>{post.postText}</p>
          <h4>{post.userName}</h4>
          <button onClick={(() => deletePost(post.id))}>X</button>
          
      </div>
    )
}