import { RotatingLines } from "react-loader-spinner";

export function LoadingSpinner() {
  return (
    <div
      aria-live="polite"
      aria-label="ページを読み込み中"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 px-4"
    >
      <div className=" rounded-3xl border border-white/20 bg-white/90 px-8 py-6">
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    </div>
  );
}
