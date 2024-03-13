'use client'

import { Trash } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import Frames from "./components/frames.jsx"

export default function Animate() {
    const canvasRef = useRef(null)

    const [context, setContext] = useState(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [drawingActions, setDrawingActions] = useState([])

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            canvas.width = 500
            canvas.height = 500
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
        context.lineWidth = 3
        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        context.stroke()
    }

    const endDrawing = (e) => {
        const currentDrawing = context.getImageData(0, 0, 500, 500)
        setDrawingActions([...drawingActions, currentDrawing])
        setIsDrawing(false)
    }

    const clearCanvas = () => {
        context.fillStyle = 'white'
        context.fillRect(0, 0, 500, 500)
        context.beginPath()
    }

    return (
        <div>
            <h1 className="text-4xl font-bold text-center my-10">Let's Animate!</h1>
            <Frames frames={[1, 2, 3]} />
            <div className="flex justify-center gap-2 mt-8">
                <div className="bg-pink-300 text-black p-3 rounded-xl">
                    <button onClick={clearCanvas} className=""><Trash /></button>
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