import Node from  './Node.jsx'
import React, {useState,useEffect, useImperativeHandle, forwardRef, useContext,createContext} from 'react'
import './Canvas.css';
import DragandDrop from './DragAndDrop.js';
import {PipelineContext} from './contexts/PipelineContext'
import PDFConverter from './nodes/PDFConverter.jsx';
import FileNode from './nodes/FileNode.js'
import {ConnectionHandler} from './ConnectionHandler.jsx'
import { nanoid } from 'nanoid';
import {NodeContext} from './contexts/NodeContext.js'
import Connection from './Connection.jsx'

const node = {"name":"Kevin","introduction":"I am a dawg"};


//This is similar to fetchForm in App.js, except uses POST method and logs whether the output is successful or not+
function storeNode(node){
    const url = "http://ec2-54-211-210-178.compute-1.amazonaws.com:8081/?"

    const params = new URLSearchParams({header:JSON.stringify(node)}) 
    
    fetch(url+params, {
        // mode: 'no-cors',
        method: 'POST',
      },)
      .catch("No response received")
      .then(response => {
        response.text().then((data)=>{
            console.log(data);
          })
      })
      
}


// Find nearby nodes, given the name of a certain node, takes in one paramter as an object, returns a big array of nearby nodes and their introducitons

const Canvas = forwardRef((props,ref)=>{
    //List of Nodes, will be rendered later
    const [nodes, setNodes] = useState([{params:{files:null, id:nanoid(), output:null}, type:"pdfconverter"}]) 
    const [receiveddatas, setrecevieddatas] = useState();
    const {currentPipeline,setCurrentPipeline} = useContext(PipelineContext);
    const {connection,dispatchconnection} = useContext(ConnectionHandler);
    const [connections,setconnections] = useState([]);

    
//Creates a new node by taking data from App.js


    useImperativeHandle(ref, ()=> ({
        generateNewNode(data){
            if(typeof data=="undefined"){
                appendNewNode({data:props.data, id:nanoid(), get receivenode(){return <Node data = {this.data} key={this.id}  id = {this.id} storeNode = {storeNode} findnearbynodes = {findnearbynodes}/>}})
                console.log("here2")
            }else{
                appendNewNode(data)
                console.log("here3");
                console.log(data);
            }
        }
    }
    ));
    
    //Appends a new node to the list of nodes
    function generateNewNode(data){
        if(typeof data=="undefined"){
            appendNewNode({data:props.data, id:nanoid(), get receivenode(){return <Node data = {this.data} key={this.id}  id = {this.id} storeNode = {storeNode} findnearbynodes = {findnearbynodes}/>}})
            console.log("here2")
        }else if(typeof data.params != "undefined"){
            console.log("Appending defined data")
            appendNewNode(data);
        }
        else{
            if(data.type == "filenode"){
                console.log("ehere");

                const node = {params:{files:null, id:nanoid()}, type:"filenode"};
                appendNewNode(node);
            }else{
                appendNewNode(data);
                const node = {params:{files:null, id:nanoid(), type:"textnode"}}
                console.log("here4");
            }
        }
    }
    
    // Appends it to a list of nodes that currently exists

    function appendNewNode(node){
        setNodes((nodes)=>[...nodes, node])
    } 
    // Find nearby nodes, given the name of a certain node, takes in one paramter as an object, returns a big array of nearby nodes and their introducitons
    async function findnearbynodes(node){
        const url = "http://ec2-54-211-210-178.compute-1.amazonaws.com:8080/?"
        const params = new URLSearchParams({header:"Shaw Lefevre - Wikipedia",type:"Multiple"}) 
        console.log("Fetching   " + url + params);
            
        fetch(url+params, {
            // mode: 'no-cors',
            method: 'POST',
            },)
            .catch("No response received")
            .then(response => {
            response.text().then((data)=>{
                setrecevieddatas(JSON.parse(data));
                })
            })
    }
    //Find By Subject, fetches a response from the query backend API, 
    function findBySubject(){
        const url = "http://ec2-54-211-210-178.compute-1.amazonaws.com:8080/?"
        const params = new URLSearchParams({header:currentPipeline,type:"Subject"}) 
        console.log("Fetching   " + url + params);

        fetch(url+params, {
            // mode: 'no-cors',
            method: 'POST',
          },)
          .catch("No response received")
          .then(response => {
            response.text().then((data)=>{
                setrecevieddatas(JSON.parse(data));
              })
          })
    }


    function editNodeParameters(id,param,files){
        const newnodes = nodes;
        console.log(nodes);
        console.log(connection);
        //const outputnode = newnodes.find(node => node.id == id);
        //outputnode[param] = files;
        //console.log(newnodes);
        //setNodes(newnodes);
    }



    //Function is called by findbynearnodes function, for each received information, create a new Node
    useEffect(()=>{
        console.log(receiveddatas);
        if(typeof receiveddatas!= "undefined"){
            if(typeof receiveddatas.links != "undefined"){
            receiveddatas.links.forEach((data)=>{generateNewNode(data)});
            }else{
            receiveddatas.forEach((data)=>{generateNewNode(data)});
            }
        }
    },[receiveddatas])

    //When currentPipeline get changed, removes all nodes on the interface and find new nodes by the subject
    useEffect(()=>{
        //editNodes([]);
        console.log("changing pipelines");
        findBySubject();
    },[currentPipeline])

    //initiates when 2 connections are established, it then creates a connection and adds to a list of connection arrays

    useEffect(()=>{
        if(connection.inputconnection != null && connection.outputconnection != null){
            //(nodes)=>[...nodes, node]
            const tempconnection = connection;
            tempconnection.id = nanoid();
            setconnections((connections) => [...connections, tempconnection]);

            const newnodes = nodes;
            const outputnode = newnodes.find(node => node.params.id == connection.outputconnection.id);
            const inputnode = newnodes.find(node => node.params.id == connection.inputconnection.id);
            //console.log(outputnode);
            //console.log(inputnode);
            inputnode.params[connection.inputconnection.option] = outputnode.params[connection.outputconnection.option];
            //console.log(connection.inputconnection);
            //console.log(inputnode);

            //Need to find the most latest position how to find the most latest position? 
            console.log(newnodes);
            setNodes(newnodes);
            console.log(tempconnection);
            dispatchconnection({type:"reset"});
        }
    },[connection])
     
    //When node changes reset the connections=
    function refreshConnection(){
        const newnodes = nodes;
        connections.forEach((connection)=>{
            console.log(connection);
            const outputnode = newnodes.find(node => node.params.id == connection.outputconnection.id);
            const inputnode = newnodes.find(node => node.params.id == connection.inputconnection.id);
            inputnode.params[connection.inputconnection.option] = outputnode.params[connection.outputconnection.option];
        });
        setNodes(newnodes);
    }

    //Changes the input connections location for rendering the line when the nodes gets dragged 
    function redrawLine(id,data,buttonOffsets){
        const clientOffset = {};
        const newconnections = [];

        //console.log(connections);


        //Create a new object with the relative positions
        Object.keys(buttonOffsets).forEach(buttonoffset => {
            clientOffset[buttonoffset] = {top:null, left:null};
            //console.log(clientOffset[clientOffset]);
            clientOffset[buttonoffset].top = buttonOffsets[buttonoffset]["top"] + data.y + 10;
            clientOffset[buttonoffset].left = buttonOffsets[buttonoffset]["left"] + data.x + 10; 
        });




        connections.forEach( connection => { 
            if(id == connection.inputconnection.id){
                connection.inputconnection.offset = clientOffset[connection.inputconnection.option]
                //newconnections.push(buttonOffsets)
            }
            if(id == connection.outputconnection.id){
                //connection.outputconnection.offset = clientOffset[connection.outputconnection.option]
                //connection.outputconnection.offsetY = clientOffset[connection.outputconnection.option]
                connection.outputconnection.offset = clientOffset[connection.outputconnection.option]

                //newconnections.push (buttonOffsets)
            }
            newconnections.push(connection);
         })

         setconnections(newconnections);
    }


    //Console logs the current folder that the user is in

    return(
        <>
            <NodeContext.Provider value={{nodes,setNodes}}>
            <DragandDrop generateNewNode = {generateNewNode} />
            {nodes.map( node=> <Node type={node.type} refreshConnection = {refreshConnection} redrawLine = {redrawLine} params={node.params}/> )}
            {/*<button onClick={()=>{generateNewNode({type: 'filenode'})}}>Generate New File Node</button>
            <button onClick={()=>{
            console.log(nodes); 
            console.log(connection);
            console.log(connections)
            }}>Debugger</button>
            */}
            </NodeContext.Provider>
            
            <Connection connections = {connections} />
        </>
    );
});

export default Canvas;
