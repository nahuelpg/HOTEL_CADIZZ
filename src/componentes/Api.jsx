import AdminRoute from "./router/AdminRoute";
import OperatorPanel from "./componentes/operator/Panel";

// ...
<Route
  path="/operador"
  element={
    <AdminRoute>
      <OperatorPanel />
    </AdminRoute>
  }
/>
