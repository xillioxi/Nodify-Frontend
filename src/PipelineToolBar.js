import React, {useState,useRef,useContext} from 'react'
import './PipelineToolBar.css'
import {PipelineContext} from './contexts/PipelineContext'

//This is similar to fetchForm in App.js, except uses POST method and logs whether the output is successful or not+

// Find nearby nodes, given the name of a certain node, takes in one paramter as an object, returns a big array of nearby nodes and their introducitons


function PipelineToolBar(props){

    const [pipelinesarr,setpipelinearr] = useState([
        {id:"pipeline1",state:"stopped"},
        {id:"pipeline2",state:"running"},
        {id:"pipeline3",state:"default"}
    ]);

    const currentpipeline = useContext(PipelineContext);

   // const {currentpipeline,setcurrentpipeline} = useContext(PipelineContext);

    const [pipeline,setpipeline] = useState(true);

    const toolbarref = useRef(null);

    const[pipelineclass,setpipelineclass ] = useState("PipelineToolBar__open");


    async function togglePipelinePage(){
        await setpipeline(!pipeline);
        if(pipeline){
            setpipelineclass("PipelineToolBar__open")
        }else{
            setpipelineclass("PipelineToolBar__close")
        }
    }

    function setPipeline(event){
        console.log("setcurrentpipeline " + event.target.innerHTML);
        currentpipeline.setCurrentPipeline(event.target.innerHTML);
    }


    return(
        <>
            <div id="PipelineToolBar" class = {pipelineclass}ref={toolbarref}>
            <button id="Closebtn" onClick={()=>{togglePipelinePage()}}>X</button>
                <h1>Pipelines</h1>
                <button id="CreateNewPipeline" class="Pipeline">New Pipeline</button>
                {pipelinesarr.map((pipeline)=><button class={pipeline.state + " Pipeline"} onClick={(event)=>setPipeline(event)} >{pipeline.id}</button> )}
            </div>
        </>
    );
}

export default PipelineToolBar