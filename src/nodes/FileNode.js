import '../Node.css'
import React,{useState,useRef,useContext, useEffect, } from 'react'
import Draggable from 'react-draggable'
import TextareaAutosize from 'react-textarea-autosize'
import {PipelineContext} from '../contexts/PipelineContext'
import {ConnectionHandler} from '../ConnectionHandler.jsx'
import { NodeContext } from '../contexts/NodeContext.js'



const style = {"font-family":"Roboto-Mono-Light", "font-size":"20px", "border":"none", "outline":"none","resize":"none","background":"transparent"}
const style2 = {"font-family":"Roboto-Mono-Light", "font-size":"15px", "border":"none", "outline":"none","resize":"none","background":"transparent"}
const buttonOffsets = {
    output:{
        top: 75,
        left: 348
    }
}

function FileNode(props){

    const [name,setname] = useState("File Node"); 
    const [filenames,setfilenames] = useState();
    const {nodes,editNodes} = useContext(NodeContext);
    const inputbutton = useRef(null);
    const outputbutton = useRef(null);
    
    const nameref = useRef(null);
    const filenamelistref = useRef(null);

    const {connection,dispatchconnection} = useContext(ConnectionHandler);

    useEffect(()=>{
        console.log(props.output);
        if(props.output!=null){
            setfilenames(props.output.map((file)=><div class="file"> <p> {file.name} </p></div>));
        }
    }
    ,[props.output, nodes, editNodes])

    function handleOutputFile(event){
        const offset = {
            left:event.clientX,
            top:event.clientY
        } 
        dispatchconnection( {type:"addoutput" , outputconnection: {id:props.id, option:"output" , offset:offset} })
    }

    function handleInputFile(event){
        console.log(props.files);
        dispatchconnection( { type: "addinput" , inputconnection: {id: props.id, option:"input" }} )
    }

    //Edit so that the outputs is always the same as the input
    useEffect(()=>{

    },[props])

    return(
        <Draggable defaultPosition={{x:600,y:400}} onDrag={(event,data)=>{props.redrawLine(props.id,data,buttonOffsets)}}>
        <div id="Node_Container">
            <button class="Output-File" ref = {outputbutton} onClick={(event)=>{handleOutputFile(event); console.log("X = " + event.clientX +  "Y = "  + event.clientY)}}></button>
            {
                //<button style = {{position:'absolute', top:"100px"}} onClick = {(event)=>{console.log(inputbutton)}}> Testing Why it dosen't want to</button>
            }
            <TextareaAutosize minRows={3} style={style} ref={nameref} value={name} onChange={ev => setname(ev.target.value)}/>
            {filenames}
        </div>
        </Draggable>
    )
}

export default FileNode;