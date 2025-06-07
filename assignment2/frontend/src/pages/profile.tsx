import React from "react";
import { LoginContext, LoginContextType } from "@/contexts/LoginContext";
import { useState, useEffect } from "react";
import { userApi, User } from "../services/api";
import Header from "@/components/header";

export default function Profile() {
    const {emailLoggedIn, setEmailLoggedIn} = React.useContext(LoginContext) as LoginContextType;
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editUser, setEditUser] = useState<Partial<User>>({});
    const [user, setUser] = useState<Partial<User>>({}); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await userApi.getUserByEmail(emailLoggedIn);
                setUser(data);
                console.log("Fetched user:", data);
            } catch (err) {
                setError("User not found");
                console.log(err)
            }
            finally {
                setLoading(false)
            }
        }
        fetchUser(); // get user details 
    }, [emailLoggedIn]);

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingUserId) return;

        try {
            await userApi.updateUser(editingUserId, editUser);
            
            if(editUser.email && (editUser.email !== emailLoggedIn)){
                setEmailLoggedIn(editUser.email);
            }
            
            const updateUser = await userApi.getUserByEmail(editUser.email || emailLoggedIn)

            setUser(updateUser)
            setEditingUserId(null);
            setEditUser({});
        } catch (err) {
            setError("Failed to update user");
            console.log(err)
        }
    };

    const startEditing = (user: User) => {
        setEditingUserId(user.id);
        setEditUser({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    };

    if (loading) return <div className="flex justify-center items-center">Loading...</div>
    if (error) return <div className="lex justify-center items-center text-red-500">{error}</div>

    return (
        <div>
            <Header/>
            <div className="grid gap-4  items-center pt-8 ">
                <div className="p-4 border rounded flex justify-center bg-blue-100">
                    {user.id !== undefined && editingUserId === user.id ? (
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={editUser.firstName}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, firstName: e.target.value })
                                    }
                                    className="p-2 border rounded"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={editUser.lastName}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, lastName: e.target.value })
                                    }
                                    className="p-2 border rounded"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={editUser.email}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, email: e.target.value })
                                    }
                                    className="p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingUserId(null);
                                        setEditUser({});
                                    }}
                                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">
                                    {user.firstName} {user.lastName}
                                </h3>
                                <p className="text-gray-600">{user.email}</p>
                                <p className="text-gray-600">Role: {user.role}</p>
                                <p className="text-gray-600">Created At: {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}</p>
                                <p className="text-gray-600">Last Updated: {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => startEditing(user as User)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}