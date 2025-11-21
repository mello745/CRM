import { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-retro-black bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className={`inline-block align-bottom bg-retro-white border-4 border-retro-black text-left overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full`}>
          <div className="bg-retro-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4 border-b-4 border-retro-black pb-3">
              <h3 className="text-xl font-bold text-retro-black uppercase tracking-wider" style={{ textShadow: '2px 2px 0px rgba(13,71,161,0.3)' }}>{title}</h3>
              <button
                onClick={onClose}
                className="text-retro-black hover:text-retro-white focus:outline-none border-2 border-retro-black px-2 py-1 hover:bg-retro-black transition-all font-bold"
                style={{ fontFamily: 'Courier New, Courier, monospace' }}
              >
                <IoClose size={20} />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

