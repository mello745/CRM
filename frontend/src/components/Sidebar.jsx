import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiBell, 
  FiLogOut 
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/clients', icon: FiUsers, label: 'Clientes' },
    { path: '/reminders', icon: FiBell, label: 'Lembretes' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-retro-darkBlue text-retro-white border-r-4 border-retro-black shadow-[4px_0px_0px_0px_rgba(0,0,0,1)]">
      <div className="p-6 border-b-4 border-retro-black">
        <h1 className="text-2xl font-bold text-retro-white font-retro tracking-wider" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.5)' }}>
          CRM AGCELL
        </h1>
      </div>
      
      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-4 text-retro-white hover:bg-retro-blue transition-all duration-150 border-l-4 ${
                isActive(item.path) 
                  ? 'bg-retro-blue border-retro-white shadow-[inset_4px_0px_0px_0px_rgba(255,255,255,1)]' 
                  : 'border-transparent hover:border-retro-white'
              }`}
              style={{ fontFamily: 'Courier New, Courier, monospace' }}
            >
              <Icon className="mr-3" size={20} />
              <span className="font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-6 border-t-4 border-retro-black">
        <button
          onClick={logout}
          className="flex items-center w-full px-6 py-3 text-retro-white hover:bg-retro-blue transition-all duration-150 border-2 border-retro-white hover:border-retro-white font-bold"
          style={{ fontFamily: 'Courier New, Courier, monospace' }}
        >
          <FiLogOut className="mr-3" size={20} />
          <span>SAIR</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

