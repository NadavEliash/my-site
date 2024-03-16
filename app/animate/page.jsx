'use client'

import { Dot, Eraser, Pencil, Expand, Move, RefreshCw, Trash, Undo, Download } from "lucide-react"
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
        }
    }, [])

    useEffect(() => {
        console.log(drawingActions)

        if (drawingActions.length > 0) {
            setFrames([drawingActions])
        }
    }, [drawingActions])

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
            const newContext = canvasRef.current.getContext('2d')
            newContext.clearRect(0, 0, canvasSize.width, canvasSize.height)
            drawingActions.forEach(({ path, lineWidth, strokeStyle }) => {
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
    }

    const download = () => {
        const a = document.createElement("a")
        document.body.appendChild(a)
        a.className = "hidden"
        a.href = canvasRef.current.toDataURL('image/png')
        a.download = "canvas"
        a.click()
    }

    const buttonClass = "p-2 col-span-1 border-2 border-black/50 rounded-xl flex justify-center"

    return (
        <div>
            <h1 className="text-4xl text-teal-300 font-bold text-center my-10">Let's Animate!</h1>
            {frames.length && frames.map((frame,idx)=> <Frame key={idx} frame={frame} idx={idx} />)}
            <div className="flex justify-center gap-1 mt-8">
                <div className="py-2 bg-pink-300 grid grid-rows-10 justify-items-center items-center w-16 gap-1 text-black rounded-l-xl">
                    <div className={buttonClass}>
                        <div className="relative cursor-pointer w-6 h-6"
                            onClick={() => setShowLineWidth(!showLineWidth)}>
                            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-transparent rounded-full h-${dotSize} w-${dotSize}`}>{dotSize}</div>
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
                        <div className="w-6 h-6 rounded-full border-2 border-black overflow-hidden cursor-pointer">
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
        </div>
    )
}