import React, {useState,useEffect} from 'react'


const node = {"name":"Kevin","introduction":"I am a dawg"};

//This is similar to fetchForm in App.js, except uses POST method and logs whether the output is successful or not+

// Find nearby nodes, given the name of a certain node, takes in one paramter as an object, returns a big array of nearby nodes and their introducitons


function TopBar(props){

    return(
        <>
            <div id="TopBar">
                {//<button onClick={()=>{props.togglePipelineBar()}} ></button>
                }
                <button onClick={()=>{props.addnewnode()}} id="addnode">New Node+</button>
            </div>
        </>
    );
}

export default TopBar