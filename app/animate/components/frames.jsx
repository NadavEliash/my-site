export default function Frames({ frames }) {
    // console.log(frames)

    return (
        <div className="w-[60vw] mx-auto flex gap-2">
            {frames.map(frame =>
                <div key={frame} className="w-28 h-28 bg-white text-black rounded-lg">
                    <h1 className="p-2">
                        {frame}
                    </h1>
                </div>)}
        </div>
    )
}