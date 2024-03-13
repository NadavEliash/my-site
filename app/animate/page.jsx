'use client'

import { Dot, Palette, Trash, Undo } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import Frames from "./components/frames.jsx"

export default function Animate() {
    const canvasRef = useRef(null)
    const canvasSize = { width: 500, height: 500 }

    const [context, setContext] = useState(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [currentPath, setCurrentPath] = useState([])
    const [drawingActions, setDrawingActions] = useState([])
    const [lineWidth, setLineWidth] = useState(4)
    const [strokeStyle, setStrokeStyle] = useState("black")

    const [showLineSizes, setShowLineSizes] = useState(false)
    const [showPalette, setShowPalette] = useState(false)

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            canvas.width = canvasSize.width
            canvas.height = canvasSize.height
            const ctx = canvas.getContext('2d')
            setContext(ctx)
        }
    }, [])

    const startDrawing = (e) => {
        if (context) {
            context.beginPath()
            context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
            setIsDrawing(true)
        }
    }

    const draw = (e) => {
        if (!isDrawing || !context) return
        context.strokeStyle = 'black'
        context.lineCap = 'round'
        context.lineJoin = 'bevel'
        context.lineWidth = lineWidth
        context.strokeStyle = strokeStyle
        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        context.stroke()
        setCurrentPath([...currentPath, { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }])
    }

    const endDrawing = (e) => {
        setIsDrawing(false)
        context && context.closePath()
        if (currentPath.length > 0) {
            setDrawingActions([...drawingActions, { path: currentPath, lineWidth, strokeStyle }])
        }
        setCurrentPath([])
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

    return (
        <div>
            <h1 className="text-4xl font-bold text-center my-10">Let's Animate!</h1>
            <Frames frames={[1, 2, 3]} />
            <div className="flex justify-center gap-2 mt-8">
                <div className="bg-pink-300 flex flex-col items-center w-16 gap-2 text-black p-3 rounded-xl">
                    <div onClick={() => setShowLineSizes(!showLineSizes)}><Dot />
                        {showLineSizes && (
                            <div className="flex flex-col items-center w-6">
                                <Dot onClick={() => setLineWidth(2)} className="w-4 h-4" />
                                <Dot onClick={() => setLineWidth(4)} className="w-6 h-6" />
                                <Dot onClick={() => setLineWidth(10)} className="w-8 h-8" />
                                <Dot onClick={() => setLineWidth(20)} className="w-10 h-10" />
                            </div>
                        )}
                    </div>
                    <div onClick={() => setShowPalette(!showPalette)}><Palette />
                        {showPalette && (
                            <div className="flex flex-col items-center gap-1 mt-2">
                                <div onClick={() => setStrokeStyle('black')} className="bg-black w-4 h-4 rounded-md"></div>
                                <div onClick={() => setStrokeStyle('blue')} className="bg-blue-700 w-4 h-4 rounded-md"></div>
                                <div onClick={() => setStrokeStyle('red')} className="bg-red-700 w-4 h-4 rounded-md"></div>
                            </div>
                        )}
                    </div>
                    <button onClick={undo}><Undo /></button>
                    <button onClick={clearCanvas}><Trash /></button>
                </div>
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseOut={endDrawing}
                    className="bg-white rounded-xl">
                </canvas>
            </div>
        </div>
    )
}