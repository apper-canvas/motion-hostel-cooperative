import React from "react";

const Loading = () => {
  return (
    <div className="p-6">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded-lg animate-[shimmer_1.5s_infinite]"></div>
        <div className="h-4 w-64 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded mt-2 animate-[shimmer_1.5s_infinite]" style={{animationDelay: '0.1s'}}></div>
      </div>

      {/* Metrics cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded-lg animate-[shimmer_1.5s_infinite]" style={{animationDelay: `${i * 0.1}s`}}></div>
              <div className="h-6 w-16 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded animate-[shimmer_1.5s_infinite]" style={{animationDelay: `${i * 0.1}s`}}></div>
            </div>
            <div className="h-8 w-20 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded mb-2 animate-[shimmer_1.5s_infinite]" style={{animationDelay: `${i * 0.1}s`}}></div>
            <div className="h-4 w-24 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded animate-[shimmer_1.5s_infinite]" style={{animationDelay: `${i * 0.1}s`}}></div>
          </div>
        ))}
      </div>

      {/* Room grid skeleton */}
      <div>
        <div className="h-6 w-36 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded mb-4 animate-[shimmer_1.5s_infinite]"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="h-6 w-16 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded animate-[shimmer_1.5s_infinite]" style={{animationDelay: `${i * 0.05}s`}}></div>
                <div className="h-5 w-5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded-full animate-[shimmer_1.5s_infinite]" style={{animationDelay: `${i * 0.05}s`}}></div>
              </div>
              <div className="h-4 w-20 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded mb-2 animate-[shimmer_1.5s_infinite]" style={{animationDelay: `${i * 0.05}s`}}></div>
              <div className="h-4 w-16 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded mb-3 animate-[shimmer_1.5s_infinite]" style={{animationDelay: `${i * 0.05}s`}}></div>
              <div className="flex items-center justify-between">
                <div className="h-4 w-12 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded animate-[shimmer_1.5s_infinite]" style={{animationDelay: `${i * 0.05}s`}}></div>
                <div className="h-6 w-20 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded-full animate-[shimmer_1.5s_infinite]" style={{animationDelay: `${i * 0.05}s`}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Loading;