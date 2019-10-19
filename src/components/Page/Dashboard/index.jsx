import { useContext, useEffect } from 'react';
import { get } from 'lodash';
import { AppStateContext } from 'context';
import { forwardTo } from 'utils/route';

function DashboardPage() {
  const [{ user }] = useContext(AppStateContext);

  useEffect(() => {
    if (!get(user, 'role')) return;

    if (user.role === 'patient') {
      forwardTo(`/pacijenti/${user.id}`);
    } else {
      forwardTo(`/osoblje/${user.id}`);
    }
  }, [user]);

  return null;
}

export default DashboardPage;
