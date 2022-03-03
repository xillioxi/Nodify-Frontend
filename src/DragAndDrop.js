import './App.css';
import React, {useEffect, useState} from "react";
import './DragandDrop.css';
import Draggable from 'react-draggable';
import FileNode from './nodes/FileNode.js'
import { nanoid } from 'nanoid';

//Prevent from opening another tab when dragging file in
window.addEventListener("dragover",function
(e){
  e.preventDefault();    
},false);

window.addEventListener("drop",function(e){
  e.preventDefault();   
},false);


function DragAndDrop(props) {

  const [dropzoneclass,setdropzoneclass] = useState("drop-zone drop-zone__hidden");
  const [files,setFiles] = useState();

  //When hovering over the class,change the appearance the visible
  const addClass = (event)=>{
    event.preventDefault();
    setdropzoneclass("drop-zone");
    //console.log("here");
  };
  // Change the appearance of the drop-zone to hidden etc.
  const removeClass = ()=>{
    setdropzoneclass("drop-zone drop-zone__hidden")
  };

  //Get drag and dropped files from the DOM 
  const retrieveFiles = (event)=>{
    if(event.dataTransfer.files.length > 0){
        const fileArray = event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
        console.log(fileArray);
        const node = {params:{output:fileArray, id:nanoid()},type:"filenode"};
        console.log(node);
        props.generateNewNode(node);
    }
  }


//When the files are received, Store the files on S3, if cannot store the file on S3 or gives an error, then give a feedback to show that it cannot be seen, console.log an error for now.
useEffect(async ()=>{
  const { url } = await fetch("http://ec2-54-211-210-178.compute-1.amazonaws.com:8082/s3Url").then(res => res.json()).catch((error)=>{console.log("Hello World")})
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    body: files
  })
  console.log(files.name)
  const Node = {name:files.name, introduction:url.split('?')[0]};
  console.log(Node)
  const imageUrl = url.split('?')[0]
  },[files]
)



  return (
    <>
      <div class={dropzoneclass} 
            onDragLeave={removeClass}
            onDragEnd={removeClass} 
            onDragOver={addClass} 
            onDrop={(event)=>{removeClass(); retrieveFiles(event)}}>
          <span class="drop-zone__prompt">Drop file here or click to upload</span>
          <input type="file" name="myFile" class="drop-zone__input" />
      </div>
    </>
  );
}

//On startup, request from localhost:8080 first;


export default DragAndDrop;