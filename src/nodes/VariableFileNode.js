import '../Node.css'
import React,{useState,useRef,useContext, useEffect, } from 'react'
import Draggable from 'react-draggable'
import TextareaAutosize from 'react-textarea-autosize'
import {PipelineContext} from '../contexts/PipelineContext'
import {ConnectionHandler} from '../ConnectionHandler.jsx'
import { NodeContext } from '../contexts/NodeContext.js'



const style = {"font-family":"Roboto-Mono-Light", "font-size":"20px", "border":"none", "outline":"none","resize":"none","background":"transparent"}
const style2 = {"font-family":"Roboto-Monoax-Light", "font-size":"15px", "border":"none", "outline":"none","resize":"none","background":"transparent"}
const buttonOffsets = {
    input:{
        top: -10,
        left: 75
    },
    output:{
        top: 348,
        left: 75
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
        console.log(props.files);
        if(props.output!=null){
            setfilenames(props.files.map((file)=><div class="file"> <p> {file.name} </p></div>));
        }
    }
    ,[props.output, nodes, editNodes])

    function handleOutputFile(){
        dispatchconnection( {type:"addoutput" , outputconnection: {id:props.id, option:"output"} })
    }

    function handleInputFile(){
        console.log(props.files);
        dispatchconnection( { type: "addinput" , inputconnection: {id: props.id, option:"input" }} )
    }

    //Edit so that the outputs is always the same as the input
)

    return(
        <Draggable onDrag={(event)=>{props.redrawLine(props.id,event,buttonOffsets)}}>
        <div id="Node_Container">
            <button class="Input-File"  onClick={(event)=>{handleInputFile()}}></button>
            <button class="Output-File" ref = {outputbutton} onClick={(event)=>{handleOutputFile()}} ></button>
            {<button style = {{position:'absolute', top:"100px"}} onClick = {()=>{console.log(inputbutton)}}> Testing Why it dosen't want to</button>}
            <TextareaAutosize minRows={3} style={style} ref={nameref} value={name} onChange={ev => setname(ev.target.value)}/>
            {filenames}
        </div>
        </Draggable>
    )
}

export default FileNode;