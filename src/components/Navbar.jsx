import { useAuth } from '../hooks/useAuth';
import { FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 right-0 left-64 h-16 bg-retro-white border-b-4 border-retro-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between px-6 z-40">
      <div className="flex-1"></div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 text-retro-black border-2 border-retro-black px-4 py-2 bg-retro-gray-100">
          <div className="w-8 h-8 bg-retro-darkBlue border-2 border-retro-black flex items-center justify-center">
            <FiUser className="text-retro-white" size={18} />
          </div>
          <span className="text-sm font-bold" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
            {user?.name || 'USUÁRIO'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

