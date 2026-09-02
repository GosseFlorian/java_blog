import UserList from "../components/UserList.tsx";
import LoadingMessage from "../components/LoadingMessage.tsx";
import { useAdminStore } from "../store/adminStore.ts";

function UsersPage() {
  const mode = useAdminStore((s) => s.mode);
  const users = useAdminStore((s) => s.users);
  const isLoading = useAdminStore((s) => s.isLoading);
  const error = useAdminStore((s) => s.error);
  const handleDeleteUser = useAdminStore((s) => s.handleDeleteUser);

  return (
    <>
      {mode === "list" && isLoading && <LoadingMessage />}

      {mode === "list" && error && <p className="error-message">{error}</p>}

      {mode === "list" && !isLoading && !error && (
        <UserList users={users} onDelete={handleDeleteUser} />
      )}
    </>
  );
}

export default UsersPage;
