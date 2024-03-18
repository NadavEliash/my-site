'use client'

import { Dot, Eraser, Pencil, Expand, Move, RefreshCw, Trash, Undo, Download, Plus, ChevronRight, ChevronLeft, Play, Pause } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import Frame from "./components/frame.jsx"

export default function Animate() {
    const canvasRef = useRef(null)
    const canvasSize = { width: 500, height: 500 }

    const [context, setContext] = useState(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isErasing, setIsErasing] = useState(false)
    const [currentPath, setCurrentPath] = useState([])
    const [drawingActions, setDrawingActions] = useState([])
    const [currentFrameIdx, setCurrentFrameIdx] = useState(0)
    const [frames, setFrames] = useState([])
    const [lineWidth, setLineWidth] = useState(6)
    const [dotSize, setDotSize] = useState(3)
    const [strokeStyle, setStrokeStyle] = useState("black")

    const [showLineWidth, setShowLineWidth] = useState(false)

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            canvas.width = canvasSize.width
            canvas.height = canvasSize.height
            const ctx = canvas.getContext('2d')
            setContext(ctx)
            ctx.fillStyle = 'White'
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

    const addFrame = () => {
        clearCanvas()
        const newFrame = { id: generateId(), drawingActions }
        setFrames(prev => [...prev, newFrame])
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
            reDrawing(frames[newCurrentFrameIdx].drawingActions)
        }
    }


    const startDrawing = (e) => {
        if (context) {
            context.beginPath()
            context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
            setIsDrawing(true)
        }
    }

    const draw = (e) => {
        if (!context || !isDrawing) return
        if (!isErasing) {
            context.lineCap = 'round'
            context.lineJoin = 'bevel'
            context.lineWidth = lineWidth
            context.strokeStyle = strokeStyle
            context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
            context.stroke()
            setCurrentPath([...currentPath, { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }])
        } else {
            context.strokeStyle = 'white'
            context.lineCap = 'round'
            context.lineJoin = 'bevel'
            context.lineWidth = 12
            context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
            context.stroke()
            setCurrentPath([...currentPath, { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }])
        }

    }

    const endDrawing = (e) => {
        setIsDrawing(false)
        context && context.closePath()
        if (currentPath.length > 0) {
            setDrawingActions([...drawingActions, { path: currentPath, lineWidth, strokeStyle: isErasing ? 'white' : strokeStyle }])
        }
        setCurrentPath([])
    }

    const onChangeLineWidth = (size) => {
        setLineWidth(size)
        const newDotSize = size > 22 ? 6
            : size > 14 ? 4
                : size > 8 ? 3
                    : size > 4 ? 2
                        : 1
        setDotSize(newDotSize)
    }

    const clearCanvas = () => {
        setDrawingActions([])
        context.fillStyle = 'white'
        context.clearRect(0, 0, canvasSize.width, canvasSize.height)
        context.beginPath()
    }

    const undo = () => {
        if (drawingActions.length) {
            drawingActions.pop()
            setDrawingActions(prev => [...prev])

            reDrawing()
        }
    }

    const reDrawing = (actions = drawingActions) => {
        const newContext = canvasRef.current.getContext('2d')
        newContext.clearRect(0, 0, canvasSize.width, canvasSize.height)

        actions.forEach(({ path, lineWidth, strokeStyle }) => {
            newContext.beginPath()
            newContext.lineWidth = lineWidth
            newContext.strokeStyle = strokeStyle
            newContext.moveTo(path[0].x, path[0].y)
            path.forEach(point => {
                newContext.lineTo(point.x, point.y)
            })
            newContext.stroke()
        })
    }

    const playAnimation = () => {
        const newContext = canvasRef.current.getContext('2d')
        newContext.clearRect(0, 0, canvasSize.width, canvasSize.height)

        for (let i = 0; i < frames.length; i++) {
            setTimeout(() => {
                const frame = frames[i]
                reDrawing(frame.drawingActions)
            }, i * 83.33)
        }
    }

    const pauseAnimation = ()=> {
        
    }

    const download = () => {
        const a = document.createElement("a")
        document.body.appendChild(a)
        a.className = "hidden"
        a.href = canvasRef.current.toDataURL('image/png')
        a.download = "canvas"
        a.click()
    }

    const generateId = () => {
        return Math.floor(Math.random() * 1000)
    }

    const buttonClass = "p-2 col-span-1 border-2 border-black/50 rounded-xl flex justify-center"

    return (
        <div>
            <h1 className="text-4xl text-teal-300 font-bold text-center my-10">Let's Animate!</h1>
            <div className="w-[60vw] h-40 p-4 mx-auto flex justify-center gap-4 overflow-x-auto overflow-y-clip">
                <div className="w-24 h-24 rounded-lg flex items-center justify-center" onClick={() => switchFrame('left')}><ChevronLeft className="w-10 h-10 text-white cursor-pointer" /></div>
                {frames.length &&
                    frames.map((frame, idx) =>
                        <Frame key={idx} frame={frame} idx={idx} currentFrameIdx={currentFrameIdx} canvasSize={canvasSize} switchFrame={switchFrame} />)}
                <div className="w-24 h-24 rounded-lg flex items-center justify-center" onClick={addFrame}><Plus className="w-10 h-10 text-white cursor-pointer" /></div>
                <div className="w-24 h-24 rounded-lg flex items-center justify-center" onClick={() => switchFrame('right')}><ChevronRight className="w-10 h-10 text-white cursor-pointer" /></div>
            </div>
            <div className="flex justify-center gap-1 mt-8">
                <div className="py-2 bg-pink-300 grid grid-rows-10 justify-items-center items-center w-16 gap-1 text-black rounded-l-xl">
                    <div className={buttonClass}>
                        <div className="relative cursor-pointer w-6 h-6"
                            onClick={() => setShowLineWidth(!showLineWidth)}>
                            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-transparent rounded-full h-${dotSize} w-${dotSize}`}></div>
                            {showLineWidth && (
                                <input className="absolute -left-3 top-6 transition-opacity" type="range" min={1} max={30} step={1} value={lineWidth}
                                    onChange={(e) => onChangeLineWidth(e.target.value)} />
                            )}
                        </div>
                    </div>
                    <div className={buttonClass} onClick={() => setIsErasing(!isErasing)}>
                        {isErasing ? <Pencil className="cursor-pointer" />
                            : <Eraser className="cursor-pointer" />}
                    </div>
                    <div className={`relative ${buttonClass}`}>
                        <div className="w-6 h-6 rounded-full border-4 border-blue-500 overflow-hidden cursor-pointer">
                            <input type="color" onChange={(e) => setStrokeStyle(e.target.value)} className="-ml-3 -mt-2 h-10 bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div className={`${buttonClass} border-transparent`}></div>
                    <div className={buttonClass}>
                        <Move className="cursor-pointer" />
                    </div>
                    <div className={buttonClass}>
                        <Expand className="cursor-pointer" />
                    </div>
                    <div className={buttonClass}>
                        <RefreshCw className="cursor-pointer" />
                    </div>
                    <div className={`${buttonClass} border-transparent`}></div>
                    <button className={buttonClass} onClick={undo}>
                        <Undo />
                    </button>
                    <button className={buttonClass} onClick={clearCanvas}>
                        <Trash />
                    </button>
                </div>
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseOut={endDrawing}
                    className="bg-white rounded-r-xl">
                </canvas>
            </div>
            <div className="mx-auto text-white flex items-center justify-center mt-8">
                <Play className="cursor-pointer hover:scale-110" onClick={playAnimation} />
                <Pause className="cursor-pointer hover:scale-110" onClick={pauseAnimation} />
            </div>
        </div>
    )
}