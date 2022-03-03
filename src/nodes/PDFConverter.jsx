import '../Node.css'
import React,{useState,useRef,useContext, useEffect, useCallback} from 'react'
import Draggable from 'react-draggable'
import {PipelineContext} from '../contexts/PipelineContext'
import jsPDF from 'jspdf'
import {ConnectionHandler} from '../ConnectionHandler.jsx'
import {NodeContext} from '../contexts/NodeContext.js'



//Class Definitions
class CustomImage extends Image {
  constructor(mimeType) {
    super();
  }

  // `imageType` is a required input for generating a PDF for an image.
  imageType(){
    return this.mimeType.split("/")[1];
  }
}


//Createsgtfds
const style = {"font-family":"Roboto-Mono-Light", "fontSize":"20px", "border":"none", "outline":"none","resize":"none","background":"transparent"}
const style2 = {"font-family":"Roboto-Mono-Light", "fontSize":"15px", "border":"none", "outline":"none","resize":"none","background":"transparent"}


const generatePdfFromImages = async (images,props,nodes,setNodes)=>{
    const doc = new jsPDF();

    doc.deletePage(1);

    images.forEach((image)=>{
      const imageDimensions = imageDimensionsOnA4({
        width: image.width,
        height: image.height,
      })

      doc.addPage();
      doc.addImage(
        image.src,
        image.imageType,
        (A4_PAPER_DIMENSIONS.width - imageDimensions.width) / 2,
        (A4_PAPER_DIMENSIONS.height - imageDimensions.height) / 2,
        imageDimensions.width,
        imageDimensions.height
      )
    });

    //Create a new node, from the consisting set of nodes
    const newNodes = nodes;
    const outputnode = newNodes.find(node => node.params.id == props.id);
    console.log(outputnode);
    doc.name = "Converted.pdf"
    outputnode.params.output = [doc];
    await setNodes([...newNodes]);
    props.refreshConnection();

    const pdfURL = doc.output("bloburl");
    window.open(pdfURL, "_blank");

    //Create a function to be able to edit node based on the node's paramter and the node's ID

  }

  const A4_PAPER_DIMENSIONS = {
  width: 210,
  height: 297,
};

const A4_PAPER_RATIO = A4_PAPER_DIMENSIONS.width / A4_PAPER_DIMENSIONS.height;

const imageDimensionsOnA4 = (dimensions) => {
  const isLandscapeImage = dimensions.width >= dimensions.height;

  // If the image is in landscape, the full width of A4 is used.
  if (isLandscapeImage) {
    return {
      width: A4_PAPER_DIMENSIONS.width,
      height:
        A4_PAPER_DIMENSIONS.width / (dimensions.width / dimensions.height),
    };
  }

  // If the image is in portrait and the full height of A4 would skew
  // the image ratio, we scale the image dimensions.
  const imageRatio = dimensions.width / dimensions.height;
  if (imageRatio > A4_PAPER_RATIO) {
    const imageScaleFactor =
      (A4_PAPER_RATIO * dimensions.height) / dimensions.width;

    const scaledImageHeight = A4_PAPER_DIMENSIONS.height * imageScaleFactor;

    return {
      height: scaledImageHeight,
      width: scaledImageHeight * imageRatio,
    };
  }

  // The full height of A4 can be used without skewing the image ratio.
  return {
    width: A4_PAPER_DIMENSIONS.height / (dimensions.height / dimensions.width),
    height: A4_PAPER_DIMENSIONS.height,
  };
};

const buttonOffsets = {
  files:{
      top: 75,
      left: -15
  },
  output:{
    top:75,
    left:90
  },
  option:{
    top:120,
    left:-15
  }
}

function PDFConverter(props){

    const {currentPipeline,setCurrentPipeline} = useContext(PipelineContext);
    const [uploadedImages, setUploadedImages] = useState([]);
    const {connection,dispatchconnection} = useContext(ConnectionHandler);
    const {nodes,setNodes} = useContext(NodeContext);

    const handleGeneratePdfFromImages = useCallback(()=>{
      generatePdfFromImages(uploadedImages,props,nodes,setNodes);
      cleanUpUploadedImages();

    },[setUploadedImages,uploadedImages,props.files])

    const handleImageUpload = useCallback(
      (event)=>{
        const fileArray = props.files;
        console.log(props.files);

        //Uploaded images read and app state update
        const fileToImagePromises = fileArray.map(fileToImageURL);
        console.log(fileArray);
        console.log(fileToImagePromises);

        Promise.all(fileToImagePromises).then((images)=>{setUploadedImages(images)}).then(console.log(uploadedImages));


      },[setUploadedImages,props.files]    
    )

    const cleanUpUploadedImages = useCallback(() => {
      setUploadedImages([]);
      uploadedImages.forEach((image) => {
        // The URL.revokeObjectURL() releases an existing object URL
        // which was previously created by URL.createObjectURL().
        // It lets the browser know not to keep the reference to the file any longer.
        URL.revokeObjectURL(image.src);
      });
    }, [setUploadedImages, uploadedImages]);

    const fileToImageURL = (file) => {
      return new Promise((resolve, reject) => {
        const image = new CustomImage(file.type);
        console.log("Gere");
        image.onload = () => {
          resolve(image);
        };
    
        image.onerror = () => {
          reject(new Error("Failed to convert File to Image"));
        };
    
        image.src = URL.createObjectURL(file);
      });
    };
    

    function handleClickFile(event){
      const offset = {
        left:event.clientX,
        top:event.clientY
    } 
      dispatchconnection( { type: "addinput" , inputconnection: {id: props.id, option:"files", offset:offset }} )
    }

    function handleOutputFile(event){
      const offset = {
        left:event.clientX,
        top:event.clientY
    } 
      dispatchconnection( { type: "addoutput" , outputconnection: {id: props.id, option:"output", offset:offset }} )

    }

    function handleOptionFile(event){
      const offset = {
        left:event.clientX,
        top:event.clientY
      } 
      dispatchconnection( { type: "addinput" , inputconnection: {id: props.id, option:"option",  }} )
    }

    
    return(
        <Draggable defaultPosition={{x:1200,y:200}} onDrag={(event,data)=>{props.redrawLine(props.id,data,buttonOffsets)}   } >
        <div id="Application_Node">
            <h3>PDF Converter</h3>
            <button class="File" onClick={(event)=> {handleClickFile(event)}}></button>
            <button class="Output" onClick={(event)=>{handleOutputFile(event)}} ></button>
            <button class="Option" onClick={(event)=>{handleOptionFile(event)}}> </button>
            <button style = {{position:'absolute', left:"30px" ,top:"100px"}} onClick = {()=>{ props.editNodeParamaters.editNodeParameters()}}> </button>
            <button onClick={()=>{handleGeneratePdfFromImages()}} style={{position:"absolute"}}> Convert</button>
            <button onClick={()=>{handleImageUpload()} } style={{position:"absolute",top:"calc(120px)"}}> Set</button>
            <span id="column_selection" > 
                <h5 class="column_selection_inputs">File</h5>
                <h5 class="column_selection_outputs" >Output</h5>
            </span>
            <span id="column_selection"> 
                <h5 class="column_selection_inputs">Option</h5>
            </span>
        </div>
        </Draggable>
    )
}

export default PDFConverter