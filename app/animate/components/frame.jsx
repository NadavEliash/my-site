import { useEffect, useRef, useState } from "react"

export default function Frame({ frame, idx }) {
    const canvasRef = useRef(null)

    const [context, setContext] = useState(null)

    useEffect(() => {
        console.log('mounted!')

        if (canvasRef.current) {
            const canvas = canvasRef.current
            canvas.width = 100
            canvas.height = 100
            const ctx = canvas.getContext('2d')
            setContext(ctx)
            ctx.fillStyle = 'White'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
    }, [])

    useEffect(() => {
        console.log(frame)

        const newContext = canvasRef.current.getContext('2d')
        newContext.clearRect(0, 0, 500, 500)
        frame.forEach(({ path, lineWidth, strokeStyle }) => {
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
        <div className="w-[60vw] mx-auto flex gap-2">
            <div key={frame} className="text-black">
                <canvas ref={canvasRef} width={500} height={500} className="bg-white w-24 h-24"></canvas>
                <h1 className="text-white text-sm text-center p-2">
                    {idx + 1}
                </h1>
            </div>
        </div>
    )
}