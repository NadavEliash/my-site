'use client'

import { useRef, useEffect, useState } from "react"
import Styles from "../../components/animate/styles"
import Backgrounds from "../../components/animate/bacgrounds"
import Layers from "../../components/animate/layers"
import Frames from "../../components/animate/frames"
import { Sue_Ellen_Francisco } from 'next/font/google'
import { Eraser, Pencil, Expand, Move, RefreshCw, Trash, Undo, ChevronRight, ChevronLeft, Play, CopyPlus, SquareMinusIcon, SquarePlus, Download, Palette } from "lucide-react"

const sue_ellen = Sue_Ellen_Francisco({ subsets: ['latin'], weight: '400' })

export default function Animate() {
    const canvasRef = useRef(null)
    const canvasSize = { width: 500, height: 500 }

    const [context, setContext] = useState(null)
    const [action, setAction] = useState({ isDraw: true })
    const [isDrawing, setIsDrawing] = useState(false)
    const [currentPath, setCurrentPath] = useState([])
    const [isTransform, setIsTransform] = useState(false)
    const [transformGap, setTransformGap] = useState({ x: 0, y: 0 })
    const [tempDataUrl, setTempDataUrl] = useState(null)
    const [drawingHistory, setDrawingHistory] = useState([])
    const [layers, setLayers] = useState([])
    const [currentLayerIdx, setCurrentLayerIdx] = useState(1)
    const [frames, setFrames] = useState([])
    const [currentFrameIdx, setCurrentFrameIdx] = useState(0)

    const [styleBox, setStyleBox] = useState(false)
    const [bgBox, setBgBox] = useState(false)

    const [lineWidth, setLineWidth] = useState(6)
    const [dotSize, setDotSize] = useState(3)
    const [showLineWidth, setShowLineWidth] = useState(false)
    const [strokeStyle, setStrokeStyle] = useState("black")
    const [background, setBackground] = useState("white")

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            canvas.width = canvasSize.width
            canvas.height = canvasSize.height
            const ctx = canvas.getContext('2d')
            setContext(ctx)
            ctx.fillStyle = background
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            setLayers([{ id: generateId(), drawingHistory: canvasRef.current.toDataURL() }, { id: generateId(), drawingHistory: [] }])
            setFrames([{ id: generateId(), layers }])
        }
    }, [])

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (e.key === 'z' && e.ctrlKey) {
                console.log('undo')
                undo()
            }
            if (e.key === 'space') play()
        })
    }, [])

    useEffect(() => {
        if (context && layers[currentLayerIdx]) {
            const id = layers[currentLayerIdx].id
            const newLayer = { id, drawingHistory }

            const newLayers = layers.filter(frame => frame.id !== id)
            newLayers.splice(currentLayerIdx, 0, newLayer)
            setLayers(newLayers)
        }
    }, [drawingHistory])

    useEffect(() => {
        if (context && frames[currentFrameIdx]) {
            const id = frames[currentFrameIdx].id
            const newFrame = { id, layers }

            const newFrames = frames.filter(frame => frame.id !== id)
            newFrames.splice(currentFrameIdx, 0, newFrame)
            setFrames(newFrames)
        }
    }, [layers])

    useEffect(() => {
        if (context && frames[currentFrameIdx]) {
            context.fillStyle = background
            context.fillRect(0, 0, canvasSize.width, canvasSize.height)
            redraw(frames[currentFrameIdx].drawingHistory)
        }
    }, [currentFrameIdx])

    useEffect(() => {
        if (context && background) {
            context.fillStyle = background
            context.fillRect(0, 0, canvasSize.width, canvasSize.height)
            redraw()
        }
    }, [background])

    // FRAMES SECTION

    const drawOnionSkin = () => {
        const prevFrame = frames[currentFrameIdx - 1]

        const newContext = canvasRef.current.getContext('2d')
        newContext.globalAlpha = 0.5

    }

    const generateId = () => {
        return Math.floor(Math.random() * 10000) + ''
    }

    // EVENT HANDLING

    const onDown = (e) => {
        if (action.isDraw || action.isErase) startDrawing(e)
        if (action.isTranslate || action.isRotate || action.isScale) startTransform(e)
    }

    const onMove = (e) => {
        if (action.isDraw || action.isErase) {
            draw(e)
        } else if (action.isTranslate) {
            translate(e)
        } else if (action.isRotate) {
            rotate(e)
        } else if (action.isScale) {
            scale(e)
        }
    }

    const onUp = (e) => {
        if (action.isDraw || action.isErase) endDrawing(e)
        if (action.isTranslate || action.isRotate || action.isScale) endTransform(e)
    }

    // ACTIONS

    const startDrawing = (e) => {
        if (context && action.isDraw || action.isErase) {
            context.beginPath()
            context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
            setIsDrawing(true)
        }
    }

    const draw = (e) => {
        if (!context || !isDrawing) return

        context.lineCap = 'round'
        context.lineJoin = 'bevel'

        if (action.isDraw) {
            context.lineWidth = lineWidth
            context.strokeStyle = strokeStyle
        } else if (action.isErase) {
            context.lineWidth = 12
            context.strokeStyle = background
        }

        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        context.stroke()
        setCurrentPath([...currentPath, { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }])
    }

    const endDrawing = (e) => {
        setIsDrawing(false)
        context && context.closePath()
        if (currentPath.length > 0) {
            const url = canvasRef.current.toDataURL()
            setDrawingHistory([url, ...drawingHistory])
            // const imageData = context.getImageData(0, 0, canvasSize.width, canvasSize.height)
            // setDrawingHistory([imageData, ...drawingHistory])
            // setDrawingActions([...drawingActions, { path: currentPath, lineWidth: action.isErase ? 12 : lineWidth, strokeStyle: action.isErase ? background : strokeStyle, erase: action.isErase }])
        }
        setCurrentPath([])
    }

    const startTransform = (e) => {
        setIsTransform(true)
        setTransformGap({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })

        setTempDataUrl(canvasRef.current.toDataURL())
    }

    const translate = (e) => {
        if (!isTransform || !drawingHistory.length) return

        const gapX = e.nativeEvent.offsetX - transformGap.x
        const gapY = e.nativeEvent.offsetY - transformGap.y

        const newContext = canvasRef.current.getContext('2d')
        const image = new Image
        image.onload = () => {
            newContext.clearRect(0, 0, canvasSize.width, canvasSize.height)
            newContext.save()
            newContext.translate(gapX, gapY)
            newContext.drawImage(image, 0, 0)
            newContext.restore()
        }
        image.src = tempDataUrl
    }

    const rotate = (e) => {
        if (!isTransform || !drawingHistory.length) return

        const gapX = e.nativeEvent.offsetX - transformGap.x
        const gapY = e.nativeEvent.offsetY - transformGap.y

        const newContext = canvasRef.current.getContext('2d')
        const image = new Image
        image.onload = () => {
            newContext.clearRect(0, 0, canvasSize.width, canvasSize.height)
            newContext.save()
            newContext.translate(canvasSize.width / 2, canvasSize.height / 2)
            newContext.rotate((gapX) * Math.PI / 180)
            newContext.drawImage(image, -canvasSize.width / 2, -canvasSize.height / 2)
            newContext.restore()
        }
        image.src = tempDataUrl
    }

    const scale = (e) => {
        if (!isTransform || !drawingHistory.length) return
        const gapX = e.nativeEvent.offsetX - transformGap.x
        const gapY = e.nativeEvent.offsetY - transformGap.y

        const newContext = canvasRef.current.getContext('2d')
        const image = new Image
        image.onload = () => {
            newContext.clearRect(0, 0, canvasSize.width, canvasSize.height)
            newContext.save()
            newContext.translate(canvasSize.width / 2, canvasSize.height / 2)
            newContext.scale(1 + (gapX / 100), 1 + (gapY / 100))
            newContext.drawImage(image, -canvasSize.width / 2, -canvasSize.height / 2)
            newContext.restore()
        }
        image.src = tempDataUrl
    }

    const endTransform = (e) => {
        if (!isTransform) return

        setIsTransform(false)
        setTransformGap({ x: 0, y: 0 })

        const url = canvasRef.current.toDataURL()
        setDrawingHistory([url, ...drawingHistory])

        // const imageData = context.getImageData(0, 0, canvasSize.width, canvasSize.height)
        // setDrawingHistory([imageData, ...drawingHistory])
    }

    const onDraw = () => {
        setAction({ isDraw: true })
        setIsTransform(false)
    }

    const onErase = () => {
        setAction({ isErase: true })
        setIsTransform(false)
    }

    const clearCanvas = () => {
        setDrawingHistory([])
        context.fillStyle = background
        context.fillRect(0, 0, canvasSize.width, canvasSize.height)
        context.beginPath()
    }

    const undo = () => {
        if (drawingHistory.length) {
            drawingHistory.shift()
            setDrawingHistory(prev => [...prev])
            redraw()
        }
    }

    const redraw = (history = drawingHistory) => {
        const newContext = canvasRef.current.getContext('2d')
        if (history.length) {
            const image = new Image
            image.onload = () => {
                newContext.drawImage(image, 0, 0)
            }
            image.src = history[0]
            // newContext.putImageData(history[0], 0, 0)
        } else {
            newContext.fillStyle = background
            newContext.fillRect(0, 0, canvasSize.width, canvasSize.height)
        }
    }

    // ANIMATION SECTION

    let frameToPlay = 0

    const play = () => {
        const newContext = canvasRef.current.getContext('2d')
        newContext.clearRect(0, 0, canvasSize.width, canvasSize.height)
        redraw(frames[frameToPlay]?.drawingHistory)
        frameToPlay++
        if (frameToPlay === frames.length) {
            frameToPlay = 0
            return
        }

        setTimeout(() => {
            play()
        }, 83.33)
    }

    const download = () => {
        const a = document.createElement("a")
        document.body.appendChild(a)
        a.className = "hidden"
        a.href = canvasRef.current.toDataURL('image/png')
        a.download = "canvas"
        a.click()
    }

    // STYLE CLASSES

    const framesButtonClass = "w-6 h-6 cursor-pointer hover:scale-110"
    const actionButtonClass = "p-3 rounded-xl cursor-pointer"

    return (
        <main>
            <h1 className={`text-5xl text-slate-200 text-center my-10 ${sue_ellen.className}`}>Let's Animate!</h1>
            <div id="drawing-bar" className="md:w-[80vw] mx-auto flex flex-col md:flex-row gap-2 mt-8">
                <div id="drawing-options" className="p-2 bg-white/10 text-white/70 grid grid-cols-10 md:grid-cols-1 md:grid-rows-10 justify-items-center items-center gap-1 rounded-2xl">
                    <div id="pencil" onClick={onDraw} className={`${actionButtonClass} ${action.isDraw ? 'bg-white/20' : ''}`}>
                        <Pencil />
                    </div>
                    <div id="erase" onClick={onErase} className={`${actionButtonClass} ${action.isErase ? 'bg-white/20' : ''}`}>
                        <Eraser />
                    </div>
                    {styleBox && <div className="absolute left-0 top-0 w-[100vw] h-[100vh] bg-slate-300/10 z-20" onClick={() => setStyleBox(false)}></div>}
                    <div id="styleBox" className={`${actionButtonClass} relative`} onClick={() => setStyleBox(true)}>
                        <Palette />
                        {styleBox && <Styles
                            styleBox={styleBox}
                            setStyleBox={setStyleBox}
                            lineWidth={lineWidth}
                            setLineWidth={setLineWidth}
                            strokeStyle={strokeStyle}
                            setStrokeStyle={setStrokeStyle}
                        />}
                    </div>
                    {bgBox && <div className="absolute left-0 top-0 w-[100vw] h-[100vh] bg-slate-300/10 z-20" onClick={() => setBgBox(false)}></div>}
                    <div id="bgBox" className="rounded-sm w-6 h-6 bg-white relative cursor-pointer text-black text-sm text-center pt-[2px]" onClick={() => setBgBox(true)}>BG
                        {bgBox && <Backgrounds
                            bgBox={bgBox}
                            setBgBox={setBgBox}
                            background={background}
                            setBackground={setBackground}
                        />}
                    </div>
                    <div title="Translate" className={`${actionButtonClass} ${action.isTranslate ? 'bg-white/20' : ''}`} onClick={() => setAction({ isTranslate: true })}>
                        <Move />
                    </div>
                    <div title="Rotate" className={`${actionButtonClass}  ${action.isRotate ? 'bg-white/20' : ''}`} onClick={() => setAction({ isRotate: true })}>
                        <RefreshCw />
                    </div>
                    <div title="Scale" className={`${actionButtonClass} ${action.isScale ? 'bg-white/20' : ''}`} onClick={() => setAction({ isScale: true })}>
                        <Expand />
                    </div>
                    <button title="Undo" className={`${actionButtonClass} active:bg-white/20`} onClick={undo}>
                        <Undo />
                    </button>
                    <button title="Clear canvas" className={`${actionButtonClass} active:bg-white/20`} onClick={clearCanvas}>
                        <Trash />
                    </button>
                </div>
                <div id="canvas-container" className="w-[100%] bg-white/20 p-6 flex items-center justify-center rounded-2xl">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={onDown}
                        onMouseMove={onMove}
                        onMouseUp={onUp}
                        onMouseOut={onUp}
                        className={`bg-white w-[100%] md:w-fit rounded-md ${isTransform ? 'cursor-grab' : isDrawing ? 'cursor-none' : ''}`}>
                    </canvas>
                </div>
                <Layers
                    layers={layers}
                    setLayers={setLayers}
                    canvasSyze={canvasSize}
                    currentLayerIdx={currentLayerIdx}
                    setCurrentLayerIdx={setCurrentLayerIdx}
                    generateId={generateId}
                />
            </div>
            <Frames
                frames={frames}
                setFrames={setFrames}
                currentFrameIdx={currentFrameIdx}
                setCurrentFrameIdx={setCurrentFrameIdx}
                canvasSize={canvasSize}
                background={background}
                clearCanvas={clearCanvas}
                generateId={generateId}
            />
        </main>
    )
}