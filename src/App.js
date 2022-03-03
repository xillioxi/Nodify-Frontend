import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect, useRef, useReducer , createContext} from "react";
import Canvas from './Canvas.jsx';
import TopBar from './TopBar.jsx'
import PipelineToolbar from './PipelineToolBar'
import {PipelineContext} from './contexts/PipelineContext'
import {ConnectionHandler} from './ConnectionHandler.jsx'


function reducer(state,action){
  switch(action.type){
    case 'addinput':
      console.log("addding input  -- ")
      console.log(action);
      console.log(action.inputconnection)
      return {inputconnection:action.inputconnection , outputconnection:state.outputconnection }
    case 'addoutput':
      console.log("adding output  -- ")
      console.log(action);
      console.log(action.inputconnection)
      const output = {inputconnection:state.inputconnection , outputconnection:action.outputconnection}
      console.log(output);
      return {inputconnection:state.inputconnection , outputconnection:action.outputconnection}
    case 'reset':
      return {inputconnection:null , outputconnection:null,}
    default:
      throw new Error();
  }
}

function App() {
  const [receiveddatas,changedata] = useState("");
  const [searchInfo, changesearchInfo] = useState("");
  const [url,changeurl] = useState("http://ec2-54-211-210-178.compute-1.amazonaws.com:8080/?")
  const newnoderef = useRef(); 
  const params = new URLSearchParams({header:"pipeline1",type:"Subject"}) 
  const [currentPipeline,setCurrentPipeline] = useState("");
  const [connection,dispatchconnection] = useReducer(reducer, {inputconnection:null , outputconnection:null});
  const [connections, setconnection] = useState([]);
  let fetchForm = function(header){
    console.log("fetching " + url + params)
    console.log(connection)
    /*
    fetch(url+params,  {
      // mode: 'no-cors',
      method: 'GET',
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    },)
    .catch("No response received")
    .then(response => {
      response.text().then((data)=>{
         data = JSON.parse(data);
         changedata(data);
         console.log(data)
        })
    })
    */
  }

  //create a new node
  function addnewnode(){
    newnoderef.current.generateNewNode();
  }

  return (
    <>
    <ConnectionHandler.Provider value = {{connection,dispatchconnection}}>
      <PipelineContext.Provider value={{currentPipeline,setCurrentPipeline}}>
        <PipelineToolbar/>
        <TopBar addnewnode = {addnewnode}/>
        {//<button id="ok" onClick = {fetchForm} id="Fetchform"> Search for information</button>
        }
        <Canvas data = {receiveddatas} ref = {newnoderef} />
      </PipelineContext.Provider>
    </ConnectionHandler.Provider>
    </>
  );
}

//On startup, request from localhost:8080 first;


export default App;
