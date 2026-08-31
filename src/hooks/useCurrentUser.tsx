import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useAuth, useUser } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import type { ResponseEntity } from "../interfaces/ResponseEntity";
import type { User } from "../interfaces/User";
import type { AxiosError } from "axios";
import { fetchUser } from "../functions/user/fetchUser";

function useCurrentUser() {
    const userContext = useContext(UserContext);
    if (!userContext) throw new Error("useCurrentUser must be inside UserContext");
    const { user, setUser } = userContext;
    
    const { isLoaded, isSignedIn } = useUser();

    const { getToken } = useAuth();

    const readUserQuery = useQuery<User | null, AxiosError<ResponseEntity<null>>>({
        queryKey: ["current-user"],
        queryFn: () => getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => fetchUser(token as string).then(({ data }) => {
                setUser(data);
                return data;
            })
        ),
        enabled: isLoaded && isSignedIn && !user,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const isLoading = !isLoaded || (isSignedIn && !user && readUserQuery.isLoading);

    const caughtError = readUserQuery.isError;

    return { user, isSignedIn, isLoading, caughtError };
}

export { useCurrentUser };