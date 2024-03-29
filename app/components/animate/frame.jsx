import { useEffect, useRef, useState } from "react"

export default function Frame({
    frame,
    idx,
    currentFrameIdx,
    canvasSize,
    background,
    frames,
    setFrames,
    switchFrame,
}) {
    const canvasRef = useRef(null)
    const [context, setContext] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [currentFrame, setCurrentFrame] = useState(null)

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            canvas.width = canvasSize.width
            canvas.height = canvasSize.height
            const ctx = canvas.getContext('2d')
            setContext(ctx)
            ctx.fillStyle = background
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
    }, [])

    useEffect(() => {
        if (frame.layers) {
            const drawImageFromURL = async (url) => {
                try {
                    const image = new Image();
                    image.src = url
                    image.onload = () => {
                        newContext.drawImage(image, 0, 0)
                    }
                    image.onerror = (error) => {
                        console.error('Error loading image:', error)
                    }
                } catch (error) {
                    console.error('Error creating image object:', error)
                }
            }

            const newContext = canvasRef.current.getContext('2d')
            newContext.clearRect(0, 0, canvasSize.width, canvasSize.height)

            if (frame.layers.length) {
                frame.layers.forEach(layer => {
                    drawImageFromURL(layer.drawingHistory[0])
                })
            }
        }
    }, [frame])

    const onDrag = (idx) => {
        if (!isDragging) {
            setIsDragging(true)
            if (frames.length > 1) {
                setCurrentFrame(frames[idx])
            }
        }
    }

    const onDragEnd = (e, idx) => {
        setIsDragging(false)
        frames.splice(idx, 1)
        let newIdx = Math.floor(e.clientX / 100) - 2
        if (newIdx > frames.length) newIdx = frames.length
        frames.splice(newIdx, 0, currentFrame)
        setFrames(prev => [...prev])
    }

    return (
        <div>
            <div key={frame} className="text-black">
                <canvas ref={canvasRef} width={500} height={500}
                    className={`bg-white w-24 h-24 cursor-pointer rounded-lg hover:scale-105
                                ${currentFrameIdx === idx ? 'border-4 border-pink-300 scale-105' : ''}`}
                    onClick={() => switchFrame(idx)}
                    draggable
                    onDrag={() => onDrag(idx)}
                    onDragEnd={(e) => onDragEnd(e, idx)}>
                </canvas>
                <h1 className="text-white text-sm text-center p-2">
                    {idx + 1}
                </h1>
            </div>
        </div>
    )
}