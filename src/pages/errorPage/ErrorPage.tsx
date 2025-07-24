import React from "react";
import { useNavigate } from "react-router-dom";
import { icons } from '../../constants/icons';



export const ErrorPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <main className="flex justify-center items-center bg-white p-8 w-full min-h-screen">
            <div className="flex flex-col justify-center items-center bg-white p-8 rounded shadow-lg w-[90vw] min-h-[70vh] text-center mx-auto">
                <div className="text-[4rem] text-[#2D68FE] mb-4 flex justify-center">
                    {icons.ERROR}
                </div>
                <h2 className="mt-6 text-gray-900 text-2xl font-semibold">
                    Oops, something went wrong!
                </h2>
                <button
                    className="mt-8 px-6 py-3 bg-[#2D68FE] text-white font-semibold text-base rounded-md hover:bg-indigo-600 transition"
                    onClick={() => navigate("/")}
                >
                    Go Home
                </button>
            </div>
        </main>
    );
};