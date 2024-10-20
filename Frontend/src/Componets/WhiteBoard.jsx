import React, { useState, useRef, useEffect } from "react";
import { Excalidraw, WelcomeScreen, MainMenu, excalidrawAPI } from "@excalidraw/excalidraw";
import { BsGrid } from "react-icons/bs";
import { FaTh, FaExpand, FaCompress, FaUndo, FaRedo, FaSquareFull, FaSearchMinus, FaSearchPlus, FaMinus, FaPlus } from "react-icons/fa";
import { MdOutlineScreenShare, MdStopScreenShare } from "react-icons/md";
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';


const ColorToolBar = ({onChangeBackground}) => {
    return <>
        <div style={{backgroundColor: '#27292C', padding: '12px', height: 'min-content', display: 'flex', flexDirection: 'column', marginTop: '16px'}}>
        <FaSquareFull 
                onClick={() => onChangeBackground("#ffffff")} 
                style={{ color: "#ffffff", background: '#ffffff', border: "1px solid #fff", cursor: "pointer", fontSize: "42px", padding: '15px', borderRadius: '5px' }} 
                title="White Background"
            />
            
            {/* Black Color Icon */}
            <FaSquareFull 
                onClick={() => onChangeBackground("#000000")} 
                style={{ color: "#000000", background: '#000000', border: "1px solid #fff", cursor: "pointer", fontSize: "42px", marginTop: "10px", padding: '15px', borderRadius: '5px' }} 
                title="Black Background"
            />

            {/* Red Color Icon */}
            <FaSquareFull 
                onClick={() => onChangeBackground("#ff0000")} 
                style={{ color: "#ff0000", background: '#ff0000', border: "1px solid #fff", cursor: "pointer", fontSize: "42px", marginTop: "10px", padding: '15px', borderRadius: '5px' }} 
                title="Black Background"
            />

            {/* Yellow Color Icon */}
            <FaSquareFull 
                onClick={() => onChangeBackground("#FFFF00")} 
                style={{ color: "#FFFF00", background: '#FFFF00', border: "1px solid #fff", cursor: "pointer", fontSize: "42px", marginTop: "10px", padding: '15px', borderRadius: '5px' }} 
                title="Black Background"
            />

            {/* Grid Icon */}
            <FaSquareFull 
                onClick={() => onChangeBackground("grid")}
                style={{ 
                    color: "#555",  // Set the color to gray or any other indicator for the grid mode
                    background: "repeating-linear-gradient(45deg, #ccc, #ccc 10px, #eee 10px, #eee 20px)", // Represents a grid pattern
                    border: "1px solid #fff", 
                    cursor: "pointer", 
                    fontSize: "42px", 
                    marginTop: "10px", 
                    padding: '15px',
                    borderRadius: '5px'
                }} 
                title="Grid Background"
            />
        </div>
    </>
}

const styles = {
    toolbar: {
      display: "flex",
      justifyContent: "space-around",
      padding: "10px",
      backgroundColor: "#eaeaea",
      borderRadius: "8px",
      marginBottom: "10px",
    },
    button: {
      padding: "8px 12px",
      border: "none",
      cursor: "pointer",
      borderRadius: "4px",
      fontWeight: "bold",
    },
  };

  
  const ZoomToolBar = ({ onZoomIn, onZoomOut, zoomLevel }) => {
    return <div className="zoom-toolbar" style={{backgroundColor: '#27292C', color: '#fff', padding: '12px', height: 'min-content', display: 'flex', flexDirection: 'column', marginTop: '16px', alignItems: 'center', justifyContent: 'space-between'}}>
                <FaMinus 
                    onClick={onZoomOut} 
                    style={zoomToolStyles.icon} 
                    title="Zoom Out" 
                />
                <span style={zoomToolStyles.zoomLevel}>{zoomLevel}%</span>
                <FaPlus 
                    onClick={onZoomIn} 
                    style={zoomToolStyles.icon} 
                    title="Zoom In" 
                />
        </div>;
}

const zoomToolStyles = {
    icon: {
        cursor: 'pointer',
        fontSize: '24px',
        margin: '4px 10px',
    },
    zoomLevel: {
        fontSize: '16px',
        fontWeight: 'bold',
    },
};

const WhiteBoard = () => {
    const containerRef = useRef(null);
    const [gridMode, setGridMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [peer, setPeer] = useState(null);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(100);

    const [backgroundColor, setBackgroundColor] = useState("#ffffff");

    useEffect(() => {
        if (!excalidrawAPI) {
          return;
        }
        // to open the library sidebar
        excalidrawAPI.updateScene({ appState: { openSidebar: "library" } });
      }, [excalidrawAPI]);

    const handleUndo = () => {
        console.log(excalidrawAPI)
        if (excalidrawAPI.history) {
            excalidrawAPI.history.clear();
        }
    };

    const handleRedo = () => {
        if (excalidrawAPI.history) {
            excalidrawAPI.history.clear();
        }
    };

    const startScreenShare = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const newPeer = new Peer({ initiator: true, stream });

            newPeer.on('signal', (data) => {
                // Send signal data to the other peer via signaling server
                console.log('Signal data', data);
            });

            newPeer.on('connect', () => {
                console.log('Peer connected');
            });

            newPeer.on('stream', (remoteStream) => {
                // Handle receiving the remote stream
                const video = document.createElement('video');
                video.srcObject = remoteStream;
                video.play();
                document.body.appendChild(video); // Display remote video
            });

            setPeer(newPeer);
            setIsSharingScreen(true);
        } catch (err) {
            console.error("Error sharing screen:", err);
        }
    };

    const stopScreenShare = () => {
        if (peer) {
            peer.destroy();
            setPeer(null);
            setIsSharingScreen(false);
        }
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            } else if (containerRef.current.mozRequestFullScreen) { // Firefox
                containerRef.current.mozRequestFullScreen();
            } else if (containerRef.current.webkitRequestFullscreen) { // Chrome, Safari, Opera
                containerRef.current.webkitRequestFullscreen();
            } else if (containerRef.current.msRequestFullscreen) { // IE/Edge
                containerRef.current.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    };

    const handleBackgroundColor = (color) => {
        if (color === 'grid') {
            setGridMode((prevMode) => !prevMode);
            return;
        }
        
        setBackgroundColor(color);
        
        if (excalidrawAPI) {
            excalidrawAPI.updateScene({
                appState: {
                    ...excalidrawAPI.getAppState(),
                    viewBackgroundColor: color,
                }
            });
        }
    
    }

    const handleZoomIn = () => {
        setZoomLevel((prevZoom) => Math.min(prevZoom + 10, 200)); // Maximum 200%
        excalidrawAPI.updateScene({
            appState: {
                zoom: zoomLevel,
            },
        });
    };

    const handleZoomOut = () => {
        setZoomLevel((prevZoom) => Math.max(prevZoom - 10, 10)); // Minimum 10%
        excalidrawAPI.updateScene({
            appState: {
                zoom: zoomLevel,
            },
        });
    };

    return <>
        <div ref={containerRef} style={{ height: "80vh", width: "100%", display: 'flex', flexDirection: 'row' }}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <ColorToolBar onChangeBackground={handleBackgroundColor}/>
            <ZoomToolBar 
                onZoomIn={handleZoomIn} 
                onZoomOut={handleZoomOut} 
                zoomLevel={zoomLevel}
            />
        </div>
        <Excalidraw excalidrawAPI={(api)=> setExcalidrawAPI(api)} gridModeEnabled={gridMode} renderTopRightUI={() => (
                <div>
                    {/* <button onClick={handleUndo} style={{ padding: "8px", margin: "0 4px" }}>
                        <FaUndo />
                    </button>
                    <button onClick={handleRedo} style={{ padding: "8px", margin: "0 4px" }}>
                        <FaRedo />
                    </button> */}
                    <button onClick={toggleFullscreen} style={{ padding: '10px', backgroundColor: '#D2D0D0', borderRadius: '3px', marginLeft: '20px' }}>
                        Video & Chat
                    </button>
                    <button onClick={toggleFullscreen} style={{ padding: '10px', backgroundColor: '#D2D0D0', borderRadius: '3px', marginLeft: '20px' }}>
                        Full Board
                    </button>
                    <button onClick={toggleFullscreen} style={{ padding: '10px', backgroundColor: '#D2D0D0', borderRadius: '3px', marginLeft: '20px' }}>
                        Full Video
                    </button>
                    <button onClick={isSharingScreen ? stopScreenShare : startScreenShare} style={{ padding: '8px', backgroundColor: '#ff8000', color: "white", fontWeight: "bolder", position: "absolute", left: "0px", padding: "15px 25px", top: "0px", bottom: "0px" }}>
                        Share Screen
                    </button>
                </div>
                )} isCollaborating={false}>
        </Excalidraw>
        </div>
    </>
};

export default WhiteBoard;