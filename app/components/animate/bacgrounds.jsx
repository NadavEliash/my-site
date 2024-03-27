export default function Backgrounds({
    bgBox,
    setBgBox,
    background,
    setBackground
}) {

    return (
        <>
            <div className="absolute left-16 -top-8 bg-slate-900/60 rounded-2xl z-30 p-4">
                <div title="Background color" className={`relative`}>
                    <div className="w-6 h-6 rounded-sm border-2 border-black overflow-hidden cursor-pointer">
                        <input type="color" onChange={(e) => setBackground(e.target.value)} defaultValue="#ffffff" className="-ml-3 -mt-2 h-10 bg-transparent cursor-pointer" />
                    </div>
                </div>
            </div>
        </>
    )
}