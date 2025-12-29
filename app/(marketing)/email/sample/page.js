import fs from "fs";
import path from "path";
import Link from "next/link";
import { CONFIG } from "@/constants/config";
import { RiMailLine, RiArrowRightLine, RiRefreshLine, RiEyeLine } from "react-icons/ri";

export default function EmailSampleGallery() {
    const sampleDir = path.join(process.cwd(), "public", "email", "sample");
    let files = [];

    if (fs.existsSync(sampleDir)) {
        files = fs.readdirSync(sampleDir).filter(file => file.endsWith(".html"));
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                            <RiMailLine className="w-8 h-8 text-violet-600" />
                            Email Template Gallery
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Preview all refined and optimized email samples for {CONFIG.SITE_NAME}
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <Link
                            href="/api/debug/export-emails"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all gap-2"
                        >
                            <RiRefreshLine className="w-4 h-4" />
                            Regenerate Samples
                        </Link>
                    </div>
                </div>

                {/* File List */}
                {files.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {files.map((file) => (
                            <div key={file} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-lg transition-shadow group">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                                                    <RiMailLine className="h-6 w-6 text-violet-600" />
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-900 truncate uppercase tracking-wider">
                                                    {file.replace(".html", "").replace("-", " ")}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {file}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <Link
                                            href={`/email/sample/${file}`}
                                            target="_blank"
                                            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 gap-2 transition-colors"
                                        >
                                            <RiEyeLine className="w-4 h-4 text-gray-400 group-hover:text-violet-600" />
                                            Preview Template
                                            <RiArrowRightLine className="w-4 h-4 text-gray-300 group-hover:text-violet-600 ml-auto transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
                        <RiMailLine className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No samples found</h3>
                        <p className="mt-1 text-sm text-gray-500">You need to run the export utility first.</p>
                        <div className="mt-6">
                            <Link
                                href="/api/debug/export-emails"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 gap-2"
                            >
                                <RiRefreshLine className="w-4 h-4" />
                                Generate Samples Now
                            </Link>
                        </div>
                    </div>
                )}

                {/* Information Box */}
                <div className="mt-12 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                All samples listed above are generated as static HTML files. For security, these files and this gallery page should be deleted before deploying to production.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
