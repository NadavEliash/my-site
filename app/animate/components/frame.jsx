import { useEffect, useRef, useState } from "react"

export default function Frame({
    frame,
    idx,
    currentFrameIdx,
    canvasSize,
    switchFrame
}) {
    const canvasRef = useRef(null)
    const [context, setContext] = useState(null)

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
        const newContext = canvasRef.current.getContext('2d')
        newContext.clearRect(0, 0, canvasSize.width, canvasSize.height)

        frame.drawingActions.forEach(({ path, lineWidth, strokeStyle }) => {
            newContext.beginPath()
            newContext.lineWidth = lineWidth
            newContext.strokeStyle = strokeStyle
            newContext.moveTo(path[0].x, path[0].y)
            path.forEach(point => {
                newContext.lineTo(point.x, point.y)
            })
            newContext.stroke()
        })
    }, [frame])

    return (
        <div>
            <div key={frame} className="text-black">
                <canvas ref={canvasRef} width={500} height={500}
                    className={`bg-white w-24 h-24 cursor-pointer rounded-lg hover:scale-105 
                                ${currentFrameIdx === idx ? 'border-4 border-pink-300 scale-105' : ''}`}
                    onClick={() => switchFrame(idx)}>
                </canvas>
                <h1 className="text-white text-sm text-center p-2">
                    {idx + 1}
                </h1>
            </div>
        </div>
    )
}