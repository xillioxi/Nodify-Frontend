import React,{useState} from 'react'


function Connection(props){
    return(
        <svg height="100%" width="100%" style={{position:"absolute",zIndex:-2, top:0, left:0 }} >
            {
                props.connections.map(connection => <line x1={connection.inputconnection.offset.left} y1 = {connection.inputconnection.offset.top} x2={connection.outputconnection.offset.left} y2 = {connection.outputconnection.offset.top} style={{stroke:"rgb(255,0,0)",strokewidth:2, position:'absolute'}}></line>)
            }
        </svg> 
    )
}   

export default Connection;