import type { ImgHTMLAttributes } from 'react';

function DriftPhoto({ className = '', imgClassName = '', ...img }: ImgHTMLAttributes<HTMLImageElement> & { imgClassName?: string }) {
  return (
    <div className={`drift-photo overflow-hidden ${className}`}>
      <img {...img} className={imgClassName} />
    </div>
  );
}

export default DriftPhoto;
