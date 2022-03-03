import '../Node.css'
import React,{useState,useRef,useContext} from 'react'
import Draggable from 'react-draggable'
import TextareaAutosize from 'react-textarea-autosize'
import {PipelineContext} from '../contexts/PipelineContext'

function TextNode(props){

    const [name,setname] = useState(props.data.name);
    const [introduction,setintroduction] = useState(props.data.introduction);

    const nameref = useRef(null)
    const introductionref = useRef(null)

    const {currentPipeline,setCurrentPipeline} = useContext(PipelineContext);


    const style = {"font-family":"Roboto-Mono-Light", "font-size":"20px", "border":"none", "outline":"none","resize":"none","background":"transparent"}
    const style2 = {"font-family":"Roboto-Mono-Light", "font-size":"15px", "border":"none", "outline":"none","resize":"none","background":"transparent"}

    function storeDatabase(){
        const sendobject = {
            "name":nameref.current.value,
            "introduction":introductionref.current.value,
            "subject":currentPipeline
        }
        console.log(introductionref.current.value);
        console.log(sendobject);
        props.storeNode(sendobject);
    }

    async function changeintroduction(){
        const url = "http://ec2-54-211-210-178.compute-1.amazonaws.com:8080/?"
        const params = new URLSearchParams({header:props.data.name,type:"Single"})                  
        fetch(url+params, {
            // mode: 'no-cors',
            method: 'POST',
          },)
          .catch("No response received")
          .then(response => {
            response.text().then((data)=>{
                console.log(data);
                setintroduction(JSON.parse(data).introduction);
            })
        })
    }
    
    return(
        <Draggable>
        <div id="Node_Container">
            <TextareaAutosize minRows={3} style={style} ref={nameref} value={name} onChange={ev => setname(ev.target.value) }/>
            <TextareaAutosize minRows={8} style={style2} value={introduction} ref={introductionref} onChange={ev => setintroduction(ev.target.value) }/>
            <button onClick={()=>{storeDatabase(); }}>Store</button>
            <button onClick={()=>{props.findnearbynodes();}}>Find near</button> 
            <button onClick={()=>{changeintroduction()}}>Expand</button> 
        </div>
        </Draggable>
    )
}

export default TextNode;