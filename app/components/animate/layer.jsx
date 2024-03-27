import { useEffect, useRef, useState } from "react"

export default function Layer({
    layers,
    setLayers,
    layer,
    idx,
    currentLayerIdx,
    setCurrentLayerIdx,
    canvasSize,
}) {
    const canvasRef = useRef(null)
    const [context, setContext] = useState(null)
    const [currentLayer, setCurrentLayer] = useState(null)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            canvas.width = canvasSize.width
            canvas.height = canvasSize.height
            const ctx = canvas.getContext('2d')
            setContext(ctx)
        }
    }, [])

    useEffect(() => {
        if (layer.drawingHistory?.length) {
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
            drawImageFromURL(layer.drawingHistory[0])
        }
    }, [layer])

    const onDrag = (idx) => {
        if (!isDragging) {
            setIsDragging(true)
            if (layers.length > 1) {
                setCurrentLayer(layers[idx])
            }
        }
    }

    const onDragEnd = (e, idx) => {
        setIsDragging(false)
        layers.splice(idx, 1)
        let newIdx = Math.floor(e.clientY / 100) - 2
        if (newIdx > layers.length) newIdx = layers.length
        layers.splice(newIdx, 0, currentLayer)
        setLayers(prev => [...prev])
    }

    return (
        <div>
            <div key={idx} className="text-black">
                <canvas ref={canvasRef} width={500} height={500}
                    className={`bg-white w-16 h-16 rounded-lg ${idx > 0 ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}
                                ${currentLayerIdx === idx ? 'border-4 border-pink-300 scale-105' : ''}`}
                    draggable
                    onClick={() => {
                        if (idx > 0) {
                            setCurrentLayerIdx(idx)
                        }
                    }}
                    onDrag={() => onDrag(idx)}
                    onDragEnd={(e) => onDragEnd(e, idx)}>
                </canvas>
                <h1 className="text-white text-sm text-center p-2">
                    {idx === 0 ? 'BG' : idx < 10 ? '0' + idx : idx}
                </h1>
            </div>
        </div>
    )
}