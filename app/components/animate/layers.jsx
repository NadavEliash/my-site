import Layer from './layer'
import { CopyPlus, Minus, Plus, Trash2 } from 'lucide-react'

export default function Layers({
    layers,
    setLayers,
    currentLayerIdx,
    setCurrentLayerIdx,
    canvasSyze,
    generateId
}) {

    const addLayer = () => {
        layers.splice(currentLayerIdx + 1, 0, { id: generateId(), drawingHistory: [] })
        setLayers(prev => [...prev])
        setCurrentLayerIdx(currentLayerIdx + 1)
    }

    const copyLayer = () => {
        layers.splice(currentLayerIdx, 0, layers[currentLayerIdx])
        setLayers(prev => [...prev])
    }

    const removeLayer = () => {
        layers.splice(currentLayerIdx, 1)
        setLayers(prev => [...prev])
    }

    const buttonsClass = "bg-white/50 p-1 rounded-md cursor-pointer hover:scale-105 transition-transform"

    return (
        <div className="p-4 bg-white/20 rounded-2xl flex flex-col justify-between">
            <div className="flex gap-1">
                <Plus className={buttonsClass} onClick={addLayer} />
                <CopyPlus className={buttonsClass} onClick={copyLayer} />
                <Trash2 className={buttonsClass} onClick={removeLayer} />
            </div>
            <div className="flex flex-col-reverse items-center">
                {layers && layers.map((layer, idx) =>
                    <Layer
                        key={idx}
                        layer={layer}
                        idx={idx}
                        layers={layers}
                        setLayers={setLayers}
                        currentLayerIdx={currentLayerIdx}
                        setCurrentLayerIdx={setCurrentLayerIdx}
                        canvasSize={canvasSyze}
                    />
                )}
            </div>
        </div>
    )
}