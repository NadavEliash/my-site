import { useEffect, useState } from 'react';
import Frame from '../../components/animate/frame'
import { ChevronLeft, ChevronRight, CopyPlus, Download, Play, SquareMinusIcon, SquarePlus, Trash } from "lucide-react";

export default function Frames({
    frames,
    setFrames,
    currentFrameIdx,
    setCurrentFrameIdx,
    canvasSize,
    background,
    clearCanvas,
    generateId
}) {

    const addFrame = () => {
        const newFrame = { id: generateId(), drawingHistory: [] }
        frames.splice(currentFrameIdx + 1, 0, newFrame)
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
    }

    const removeFrame = () => {
        if (!frames.length) {
            return
        } else if (frames.length === 1) {
            clearAll()
        } else {
            frames.splice(currentFrameIdx, 1)
            setFrames(prev => [...prev])
            setCurrentFrameIdx(currentFrameIdx - 1)
        }
    }

    const duplicateFrame = () => {
        const newFrame = { id: generateId(), drawingHistory: frames[currentFrameIdx].drawingHistory }
        frames.splice(currentFrameIdx, 0, newFrame)
        setFrames(prev => [...prev])
        switchFrame('right')
    }

    const clearAll = () => {
        setFrames([{ id: generateId(), drawingHistory: [] }])
        setCurrentFrameIdx(0)
        clearCanvas()
    }

    const framesButtonClass = "w-6 h-6 cursor-pointer hover:scale-110"

    return (
        <div id="frames-bar" className="w-[80vw] bg-white/10 mx-auto rounded-2xl">
            <div id="frames-buttons" className="w-full p-4 mt-4 text-white/70 border-b-4 border-white/10 flex gap-4 items-center justify-center">
                <div title="Clear scene" className={`${framesButtonClass} bg-red-500 rounded-full w-8 h-8 p-1 text-black`} onClick={clearAll}>
                    <Trash />
                </div>
                <div title="Add a blank frame" className={framesButtonClass} onClick={addFrame}>
                    <SquarePlus />
                </div>
                <div title="Duplicate frame" className={framesButtonClass} onClick={duplicateFrame} >
                    <CopyPlus />
                </div>
                <div title="Remove frame" className={framesButtonClass} onClick={removeFrame}>
                    <SquareMinusIcon />
                </div>
                {/* <div title="Play animation" className={framesButtonClass} onClick={play}>
                    <Play />
                </div>
                <div title="Download as .mp4" className={framesButtonClass} onClick={download}>
                    <Download />
                </div> */}
            </div>
            <div id="frames-container" className="w-full h-40 p-4 flex gap-2 items-center justify-center mt-1">
                <div className="w-8 py-4 mt-2 bg-slate-950 rounded-lg flex self-start" onClick={() => switchFrame('left')}><ChevronLeft className="w-10 h-10 text-white cursor-pointer" /></div>
                <div id="frames" className="flex-1 gap-4 flex overflow-x-auto justify-start p-2">
                    {frames.length &&
                        frames.map((frame, idx) =>
                            <Frame key={idx}
                                frames={frames}
                                setFrames={setFrames}
                                frame={frame}
                                idx={idx}
                                currentFrameIdx={currentFrameIdx}
                                canvasSize={canvasSize}
                                switchFrame={switchFrame}
                                background={background}
                            />)}
                </div>
                <div className="w-8 py-4 mt-2 bg-slate-950 rounded-lg self-start flex justify-center" onClick={() => switchFrame('right')}><ChevronRight className="w-10 h-10 text-white cursor-pointer" /></div>
            </div>
        </div>
    )
}