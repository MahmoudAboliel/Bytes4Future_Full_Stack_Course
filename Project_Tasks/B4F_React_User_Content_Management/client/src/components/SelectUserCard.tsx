import { useUser } from "@/context/UserContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { useEffect, useState } from "react";
import { usersApi } from "@/services/api";
import type { User } from "@/lib/types";

const SelectUserCard = () => {

    const { setUser } = useUser();

    const [users, setUsers] = useState<User[]>([]);
    
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await usersApi.getAll();
            setUsers(response?.data || []);
        }
        fetchUsers();
    }, []);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Select User</CardTitle>
            <CardDescription>Choose a user from the list below</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="flex flex-col gap-2">
                {users.map((user) => (
                    <li key={user.id} className="p-2 border rounded cursor-pointer hover:bg-gray-100 duration-150" onClick={() => setUser(user)}>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
  )
}

export default SelectUserCard