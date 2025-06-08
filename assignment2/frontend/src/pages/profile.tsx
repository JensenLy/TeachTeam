import React from "react";
import { LoginContext, LoginContextType } from "@/contexts/LoginContext";
import { useState, useEffect } from "react";
import { userApi, User, courseApi } from "../services/api";
import Header from "@/components/header";

export default function Profile() {
    const {emailLoggedIn, setEmailLoggedIn} = React.useContext(LoginContext) as LoginContextType;
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editUser, setEditUser] = useState<Partial<User>>({});
    const [user, setUser] = useState<Partial<User>>({}); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [courseTitles, setCourseTitles] = useState<string[]>([]);
    
    // get user details every time the email is changed in localstorage 
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // find user by email  
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

        const getCourses = async () => {
            try {
                //get the list of id of assigned course
                const data = await userApi.getUserByEmail(emailLoggedIn);
                const courseIdStr = data.lecturerProfile?.coursesAssigned;

                if (courseIdStr) {
                    const courseIdArr: string[] = courseIdStr.split(","); //break down it into an array of string 

                    // get courses with id in courseIdArr
                    const courseObjs = await Promise.all(
                        courseIdArr.map(id => courseApi.getCoursesByID(parseInt(id)))
                    );

                    // get course titles
                    const courseTitleArr: string[] = courseObjs.map(course => course.title + " - " + course.type);
                    setCourseTitles(courseTitleArr);
                }
            } catch (err) {
                console.error("Failed to fetch course titles:", err);
            }
        };

        fetchUser(); // get user details 
        getCourses();
    }, [emailLoggedIn]);

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingUserId) return; //return if the currently editing userId does not exist 

        try {
            await userApi.updateUser(editingUserId, editUser); //find user by id and then update base on editUser
            
            if(editUser.email && (editUser.email !== emailLoggedIn)){ //get the email from editUser or get it from localstorage if fails  
                setEmailLoggedIn(editUser.email); //set the email on localstorage 
            }
            
            const updateUser = await userApi.getUserByEmail(editUser.email || emailLoggedIn) //get user from database

            // set the current state to the newly updated data 
            setUser(updateUser)
            setEditingUserId(null);
            setEditUser({});
        } catch (err) {
            setError("Failed to update user");
            console.log(err)
        }
    };

    // save the new data to the state which will be used in handleUpdateUser
    const startEditing = (user: User) => {
        console.log(courseTitles)
        setEditingUserId(user.id);
        setEditUser({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    };

    //loading and error screen 
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
                                <h3 className="font-semibold text-[2rem]"><strong>{user.firstName} {user.lastName}</strong></h3>
                                <p className="text-gray-600">{user.email}</p>
                                <p className="text-gray-600"><strong>Role: </strong>{user.role}</p>
                                <p className="text-gray-600"><strong>Created At: </strong>{user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}</p>
                                <p className="text-gray-600"><strong>Last Updated: </strong>{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}</p>
                                {user.role === "lecturer" && (
                                    <div className="mt-4">
                                        <h4 className="font-semibold">Assigned Courses</h4>
                                        {courseTitles.length > 0 ? (
                                            <ul className="list-disc pl-5 text-gray-700">
                                                {courseTitles.map((title, idx) => (
                                                    <li key={idx}>{title}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-600 italic">No assigned courses</p>
                                        )}
                                    </div>
                                )}
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