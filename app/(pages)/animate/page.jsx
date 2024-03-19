'use client'

import { useRef, useEffect, useState } from "react"
import Frame from "../../components/frame"
import { Sue_Ellen_Francisco } from 'next/font/google'
import { Eraser, Pencil, Expand, Move, RefreshCw, Trash, Undo, ChevronRight, ChevronLeft, Play, CopyPlus, SquareMinusIcon, SquarePlus, Download } from "lucide-react"

const sue_ellen = Sue_Ellen_Francisco({ subsets: ['latin'], weight: '400' })

export default function Animate() {
    const canvasRef = useRef(null)
    const canvasSize = { width: 500, height: 500 }

    const [context, setContext] = useState(null)
    const [action, setAction] = useState({ isDraw: true })
    const [isDrawing, setIsDrawing] = useState(false)
    const [isTransform, setIsTransform] = useState(false)
    const [translateGap, setTranslateGap] = useState({ x: 0, y: 0 })
    const [imageData, setImageData] = useState(null)
    const [currentPath, setCurrentPath] = useState([])
    const [drawingActions, setDrawingActions] = useState([])
    const [currentFrameIdx, setCurrentFrameIdx] = useState(0)
    const [frames, setFrames] = useState([])
    const [lineWidth, setLineWidth] = useState(6)
    const [dotSize, setDotSize] = useState(3)
    const [strokeStyle, setStrokeStyle] = useState("black")
    const [bgColor, setBgColor] = useState("white")

    const [showLineWidth, setShowLineWidth] = useState(false)

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            canvas.width = canvasSize.width
            canvas.height = canvasSize.height
            const ctx = canvas.getContext('2d')
            setContext(ctx)
            ctx.fillStyle = bgColor
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            setFrames([{ id: generateId(), drawingActions }])
        }
    }, [])

    useEffect(() => {
        if (context && frames[currentFrameIdx]) {
            const id = frames[currentFrameIdx].id
            const newFrame = { id, drawingActions }

            const newFrames = frames.filter(frame => frame.id !== id)
            newFrames.splice(currentFrameIdx, 0, newFrame)
            setFrames(newFrames)
        }
    }, [drawingActions])

    useEffect(() => {
        if (context && bgColor) {
            context.fillStyle = bgColor
            context.fillRect(0, 0, canvasSize.width, canvasSize.height)
            redraw()
        }
    }, [bgColor])

    useEffect(() => {
        const newDotSize = lineWidth > 22 ? 6
            : lineWidth > 14 ? 4
                : lineWidth > 8 ? 3
                    : lineWidth > 4 ? 2
                        : 1
        setDotSize(newDotSize)
    }, [lineWidth])

    // FRAMES SECTION

    const addFrame = () => {
        clearCanvas()
        const newFrame = { id: generateId(), drawingActions }
        frames.splice(currentFrameIdx, 0, newFrame)
        setFrames(prev => [...prev])
        setCurrentFrameIdx(currentFrameIdx + 1)
    }

    const switchFrame = (toFrame) => {
        let newCurrentFrameIdx

        if (toFrame === 'left') {
            if (currentFrameIdx === 0) return
            newCurrentFrameIdx = currentFrameIdx - 1
        } else if (toFrame === 'right') {
            if (currentFrameIdx === frames.length - 1) return
            newCurrentFrameIdx = currentFrameIdx + 1
        } else {
            newCurrentFrameIdx = toFrame
        }

        setCurrentFrameIdx(newCurrentFrameIdx)
        clearCanvas()

        if (frames[newCurrentFrameIdx].drawingActions.length) {
            setDrawingActions(frames[newCurrentFrameIdx].drawingActions)
            redraw(frames[newCurrentFrameIdx].drawingActions)
        }
    }

    const removeFrame = () => {
        if (frames.length === 1) {
            clearCanvas()
        } else {
            frames.splice(currentFrameIdx, 1)
            setFrames(prev => [...prev])
            if (currentFrameIdx >= 1) {
                redraw(frames[currentFrameIdx - 1].drawingActions)
                setCurrentFrameIdx(currentFrameIdx - 1)
            } else {
                redraw(frames[0].drawingActions)
                setCurrentFrameIdx(0)
            }
        }
    }

    const duplicateFrame = () => {
        const newFrame = { id: generateId(), drawingActions: frames[currentFrameIdx].drawingActions }
        frames.splice(currentFrameIdx, 0, newFrame)
        switchFrame('right')
    }

    const clearAll = () => {
        setDrawingActions([])
        setFrames([{ id: generateId(), drawingActions }])
        setCurrentFrameIdx(0)
        clearCanvas()
    }

    const generateId = () => {
        return Math.floor(Math.random() * 10000) + ''
    }

    // EVENT HANDLING

    const onDown = (e) => {
        if (action.isDraw || action.isErase) startDrawing(e)
        if (action.isTranslate || action.isRotate || action.isScale) startTranslate(e)
    }

    const onMove = (e) => {
        if (action.isDraw || action.isErase) draw(e)
        if (action.isTranslate) translate(e)
        if (action.isRotate) onRotate(e)
        if (action.isScale) onScale(e)
    }

    const onUp = (e) => {
        if (action.isDraw || action.isErase) endDrawing(e)
        if (action.isTranslate || action.isRotate || action.isScale) endTranslate(e)
    }

    const onOut = (e) => {
        if (action.isDraw || action.isErase) endDrawing(e)
        if (action.isTranslate || action.isRotate || action.isScale) endTranslate(e)
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
            context.strokeStyle = bgColor
        }

        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        context.stroke()
        setCurrentPath([...currentPath, { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }])
    }

    const endDrawing = (e) => {
        setIsDrawing(false)
        context && context.closePath()
        if (currentPath.length > 0) {
            setDrawingActions([...drawingActions, { path: currentPath, lineWidth: action.isErase ? 12 : lineWidth, strokeStyle: action.isErase ? bgColor : strokeStyle, erase: action.isErase }])
        }
        setCurrentPath([])
    }

    const onDraw = () => {
        setAction({ isDraw: true })
        setIsTransform(false)
    }

    const onErase = () => {
        setAction({ isErase: true })
        setIsTransform(false)
    }

    const startTranslate = (e) => {
        setIsTransform(true)
        setTranslateGap({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
        const image = context.getImageData(0, 0, canvasSize.width, canvasSize.height)
        setImageData(image)
    }

    const translate = (e) => {
        if (!isTransform || !imageData) return

        const newContext = canvasRef.current.getContext('2d')
        newContext.fillStyle = bgColor
        newContext.fillRect(0, 0, canvasSize.width, canvasSize.height)
        newContext.putImageData(imageData, e.nativeEvent.offsetX - translateGap.x, e.nativeEvent.offsetY - translateGap.y)
    }

    const endTranslate = (e) => {
        if (!isTransform || !imageData) return
        
        setIsTransform(false)
        const image = context.getImageData(0, 0, canvasSize.width, canvasSize.height)
        setImageData(image)
        setDrawingActions([...drawingActions, image])
    }

    const onRotate = (e) => {
        if (!isTransform) return
    }

    const onScale = (e) => {
        if (!isTransform) return
    }

    const clearCanvas = () => {
        setDrawingActions([])
        context.fillStyle = bgColor
        context.fillRect(0, 0, canvasSize.width, canvasSize.height)
        context.beginPath()
    }

    const undo = () => {
        if (drawingActions.length) {
            drawingActions.pop()
            setDrawingActions(prev => [...prev])
            redraw()
        }
    }

    const redraw = (actions = drawingActions) => {
        const newContext = canvasRef.current.getContext('2d')
        newContext.fillStyle = bgColor
        newContext.fillRect(0, 0, canvasSize.width, canvasSize.height)

        actions.forEach((action) => {
            if (action.data) {
                newContext.putImageData(action, 0, 0)
            } else {
                newContext.beginPath()
                newContext.lineWidth = action.lineWidth
                newContext.strokeStyle = action.erase ? bgColor : action.strokeStyle
                newContext.moveTo(action.path[0].x, action.path[0].y)
                action.path.forEach(point => {
                    newContext.lineTo(point.x, point.y)
                })
                newContext.stroke()
            }
        })
    }

    // ANIMATION SECTION

    let frameToPlay = 0
    const play = () => {
        const newContext = canvasRef.current.getContext('2d')
        newContext.clearRect(0, 0, canvasSize.width, canvasSize.height)
        redraw(frames[frameToPlay]?.drawingActions)
        frameToPlay++
        if (frameToPlay === frames.length) {
            redraw()
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




    const framesButtonClass = "w-6 h-6 cursor-pointer hover:scale-110"

    return (
        <main>
            <h1 className={`text-5xl text-slate-200 text-center my-10 ${sue_ellen.className}`}>Let's Animate!</h1>
            <div id="drawing-bar" className="w-[80vw] mx-auto flex gap-2 mt-8">
                <div id="drawing-options" className="p-2 bg-white/10 text-white/70 grid grid-rows-10 justify-items-center items-center gap-1 rounded-2xl">
                    <div id="pencil" onClick={onDraw} className={`p-3 rounded-xl ${action.isDraw ? 'bg-white/20' : ''}`}>
                        <Pencil className="cursor-pointer" />
                    </div>
                    <div id="erase" onClick={onErase} className={`p-3 rounded-xl ${action.isErase ? 'bg-white/20' : ''}`}>
                        <Eraser className="cursor-pointer" />
                    </div>
                    <div id="lineWidth">
                        <div className="relative cursor-pointer w-6 h-6"
                            onClick={() => setShowLineWidth(!showLineWidth)}>
                            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-300 text-transparent rounded-full h-${dotSize} w-${dotSize}`}></div>
                            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-300 text-transparent rounded-full h-1 w-1`}></div>
                            {showLineWidth && (
                                <input className="absolute -left-3 top-6 transition-opacity" type="range" min={1} max={30} step={1} value={lineWidth}
                                    onChange={(e) => setLineWidth(e.target.value)} />
                            )}
                        </div>
                    </div>
                    <div id="color" className={`relative`}>
                        <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden cursor-pointer">
                            <input type="color" onChange={(e) => setStrokeStyle(e.target.value)} className="-ml-3 -mt-2 h-10 bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div id="bgColor" className={`relative`}>
                        <div className="w-6 h-6 rounded-full border-2 border-black overflow-hidden cursor-pointer">
                            <input type="color" onChange={(e) => setBgColor(e.target.value)} defaultValue="#ffffff" className="-ml-3 -mt-2 h-10 bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div id="translate" className={`p-3 rounded-xl ${action.isTranslate ? 'bg-white/20' : ''}`}>
                        <Move className="cursor-pointer" onClick={() => setAction({ isTranslate: true })} />
                    </div>
                    <div id="rotate" className={`p-3 rounded-xl ${action.isRotate ? 'bg-white/20' : ''}`}>
                        <RefreshCw className="cursor-pointer" onClick={() => setAction({ isRotate: true })} />
                    </div>
                    <div id="scale" className={`p-3 rounded-xl ${action.isScale ? 'bg-white/20' : ''}`}>
                        <Expand className="cursor-pointer" onClick={() => setAction({ isScale: true })} />
                    </div>
                    <button id="undo" className="p-3 rounded-xl active:bg-white/20" onClick={undo}>
                        <Undo />
                    </button>
                    <button id="clear" className="p-3 rounded-xl active:bg-white/20" onClick={clearCanvas}>
                        <Trash />
                    </button>
                </div>
                <div id="canvas-container" className="w-[100%] bg-white/20 p-6 flex items-center justify-center rounded-2xl">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={onDown}
                        onMouseMove={onMove}
                        onMouseUp={onUp}
                        onMouseOut={onOut}
                        className="bg-white rounded-md">
                    </canvas>
                </div>
            </div>
            <div className="w-[80vw] bg-white/10 mx-auto rounded-2xl">
                <div className="w-full p-4 mt-4 text-white/70 border-b-4 border-white/10 flex gap-4 items-center justify-center">
                    <Trash className={`${framesButtonClass} bg-red-600 rounded-full w-[28px] h-[28px] p-1 text-black`} onClick={clearAll} />
                    <SquarePlus className={framesButtonClass} onClick={addFrame} />
                    <CopyPlus className={framesButtonClass} onClick={duplicateFrame} />
                    <SquareMinusIcon className={framesButtonClass} onClick={removeFrame} />
                    <Play className={framesButtonClass} onClick={play} />
                    <Download className={framesButtonClass} onClick={download} />
                </div>
                <div className="w-full h-40 p-4 flex gap-2 items-center justify-center mt-1">
                    <div className="w-8 py-4 mt-2 bg-slate-950 rounded-lg flex self-start" onClick={() => switchFrame('left')}><ChevronLeft className="w-10 h-10 text-white cursor-pointer" /></div>
                    <div id="frames" className="flex-1 gap-4 flex overflow-x-auto justify-start p-2">
                        {frames.length &&
                            frames.map((frame, idx) =>
                                <Frame key={idx} frame={frame} idx={idx} currentFrameIdx={currentFrameIdx} canvasSize={canvasSize} switchFrame={switchFrame} bgColor={bgColor} />)}
                    </div>
                    <div className="w-8 py-4 mt-2 bg-slate-950 rounded-lg self-start flex justify-center" onClick={() => switchFrame('right')}><ChevronRight className="w-10 h-10 text-white cursor-pointer" /></div>
                </div>
            </div>
        </main>
    )
}