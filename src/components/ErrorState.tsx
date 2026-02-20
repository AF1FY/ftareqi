import React from 'react'

const ErrorState = ({error , refetch}:{error: any , refetch: any}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-red-50 p-4 rounded-full mb-3">
                <i className="fa-solid fa-triangle-exclamation text-red-500 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">Failed to load data</h3>
            <p className="text-pale-sky text-sm mb-5 max-w-sm">
                {error instanceof Error ? error.message : "Something went wrong while fetching the requests."}
            </p>
            <button
                onClick={refetch}
                className="px-4 py-2 bg-white border border-athens-gray text-pale-sky hover:text-dodger-blue hover:border-dodger-blue rounded-md transition-all text-sm font-medium"
            >
                <i className="fa-solid fa-rotate-right mr-2"></i>
                Try Again
            </button>
        </div>
    )
}

export default ErrorState