import React,{useState,useRef,useContext} from 'react'
import Draggable from 'react-draggable'
import TextareaAutosize from 'react-textarea-autosize'
import TextNode from './nodes/TextNode.jsx'
import FileNode from './nodes/FileNode.js'
import PDFConverter from './nodes/PDFConverter.jsx'

function Node(props){
    if(props.type == "textnode"){
        return <TextNode id={props.params.id}/>
    }
    if(props.type == "filenode"){
        return <FileNode id={props.params.id} redrawLine = {props.redrawLine} refreshConnection = {props.refreshConnection} output = {props.params.output} data = {props.params.data} key = {props.params.id}/>
    }  
    if(props.type == "pdfconverter"){
        return <PDFConverter id={props.params.id} redrawLine = {props.redrawLine} output = {props.params.output} refreshConnection = {props.refreshConnection} files = {props.params.files} data = {props.params.data} key = {props.params.id}/>
    }
    return (<></>)
}

export default Node;