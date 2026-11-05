function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-[#ffedea] px-3 py-2.5 text-[#831c1e]">
      <span>{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="link">
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorNote;
