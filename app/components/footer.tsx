"use client";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {

    return (
        <footer className="bg-white border-t py-8 mt-12 dark:bg-gray-800 dark:border-gray-700">
            {/*Redes sol*/}
            <div className="flex justify-center space-x-6 mb-4">
                <a href="https://github.com/Junior170042" target="_blank" className="text-gray-400 hover:text-gray-600">
                    <FaGithub size={24} />
                </a>
                <a href="https://www.linkedin.com/in/st-verty-vernard/" target="_blank" className="text-gray-400 hover:text-gray-600">
                    <FaLinkedin size={24} />
                </a>
                <a href="https://www.instagram.com/juniorhensvernard" target="_blank" className="text-gray-400 hover:text-gray-600">
                    <FaInstagram size={24} />
                </a>
            </div>
            <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
                <p>&copy; {new Date().getFullYear()} postOne. All rights reserved.</p>
            </div>
        </footer>
    )
}