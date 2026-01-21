const Biodata = () => {
    return(
        <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* FOTO */}
        <div className="flex items-center justify-center ">
            <div className="w-[200px] rounded-lg overflow-hidden">
                <div className="w-full h-[190px] bg-[#D9D9D9]">
                    <img
                        src=""
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="w-full p-2 text-center bg-primary text-white">
                    <label className="cursor-pointer">
                        ubah Foto
                        <input type="file" accept="image/*" className="hidden" />
                    </label>
                </div>
            </div>
        </div>

        {/* DATA */}
        <div className="grid grid-cols-[110px_1fr] md:grid-cols-[150px_1fr]  gap-y-4 text-sm">
            <div className="text-gray-500">Nama</div>
            <div className="font-medium">Aisyah Rahmawati</div>

            <div className="text-gray-500">Email</div>
            <div className="font-medium">aisyahrahmawati@gmail.com</div>

            <div className="text-gray-500">Tanggal Lahir</div>
            <div className="font-medium">22 Juni 2070</div>

            <div className="text-gray-500">Jenis Kelamin</div>
            <div className="font-medium">Perempuan</div>

            <div className="text-gray-500">Nomor Telepon</div>
            <div className="font-medium">+62 0883 1921 7138</div>
        </div>

        {/* BUTTON */}
        <div className="flex flex-col gap-2 md:items-end">
            <button className="w-40 px-4 py-2 rounded bg-cyan-500 text-white">
            Ubah Biodata
            </button>
            <button className="w-40 px-4 py-2 rounded border border-cyan-500 text-cyan-500">
            Ubah Kata Sandi
            </button>
        </div>
        </div>
        </>
    )
}
export default Biodata;