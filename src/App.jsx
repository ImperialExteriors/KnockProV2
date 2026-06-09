import { useState } from 'react';
import Header from './components/Header.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import RepPortal from './components/RepPortal.jsx';
import ManagerPortal from './components/ManagerPortal.jsx';
import { REPS } from './config.js';

// Simple view-state "router": home → rep portal OR manager portal.
// No react-router needed for a 3-screen app.
export default function App() {
  const [view, setView] = useState({ screen: 'home' });

  const goHome = () => setView({ screen: 'home' });

  return (
    <div className="mx-auto max-w-md min-h-screen flex flex-col px-4 pb-10">
      <Header
        showBack={view.screen !== 'home'}
        onBack={goHome}
      />

      {view.screen === 'home' && (
        <HomeScreen
          onSelectRep={(repId) => setView({ screen: 'rep', repId })}
          onManager={() => setView({ screen: 'manager' })}
        />
      )}

      {view.screen === 'rep' && (
        <RepPortal
          rep={REPS.find((r) => r.id === view.repId)}
          onExit={goHome}
        />
      )}

      {view.screen === 'manager' && <ManagerPortal onExit={goHome} />}
    </div>
  );
}
