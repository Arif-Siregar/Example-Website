'use client'

import React, { useState } from 'react';
import prisma from "../../utils/prisma";
import { User, UserRole } from "@prisma/client";
import { Council } from "@prisma/client";
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
import { getUserFromDb } from "../../utils/requireAuth";
import Layout from '../../components/admin/layout';

import {
    Card,
    Button,
    Grid,
    FormControl,
    TextField,
    Dialog,
    DialogTitle,
    Autocomplete,
    DialogActions,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableContainer,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";



export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const user = await getUserFromDb(ctx);

    if (
        "error" in user ||
        (user.role !== "SUPERADMIN") ||
        !user.councilId
    ) {
        return {
            redirect: {
                destination: "/admin",
                permanent: false,
            },
        };
    }

    const users = await prisma.user.findMany({});
    const council = await prisma.council.findMany({});

    return {
        props: {
            users,
            // WARNING: overwrite wrong type inference, this is not secure
            user: user as {
                email: string;
                role: UserRole;
                councilId: number;
            },
            council,
        },
    };
};

type Users = InferGetServerSidePropsType<typeof getServerSideProps>["users"][number];

type FormUser = Pick<Users, "email" | "role" | "councilId"> & { id?: number;};

type UserFormProps = {
    open: boolean;
    mode: "Create" | "Edit";
    onCancel: () => void;
    onConfirm: (user: FormUser, mode: "Create" | "Edit") => void;
    formData: FormUser;
    setFormData: React.Dispatch<FormUser>;
};

type UserColumn = keyof Users | 'councilName' | 'action';

interface HeadCell {
    id: UserColumn;
    label: string;
}

const headCells: readonly HeadCell[] = [
    { id: "email", label: "Email" },
    { id: "role", label: "Role" },
    { id: "councilName", label: "Council Name" },
    { id: "action", label: "Action" }
];

const getCouncilNameById = (councilId: number | null, councilList: Council[]) => {
    if (councilId !== null) {
      const council = councilList.find((c) => c.id === councilId);
      return council ? council.name : "Unknown";
    } else {
      return "Unknown";
    }
  };


// const UserForm: React.FC<UserFormProps> = ({
//     onCancel,
//     open,
//     mode,
//     onConfirm,
//     formData,
//     setFormData,
// }) => {
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onConfirm(formData, mode);
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     return (
//         <Dialog open={open} onClose={onCancel} fullWidth={true}>
//             <DialogTitle>{mode === "Create" ? "Create New User" : "Edit User"}</DialogTitle>
//             <form onSubmit={handleSubmit}>
//                 {/* Email Field */}
//                 <TextField
//                     label="Email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                 />
//                 {/* Other fields like Role, CouncilId etc. */}
//                 <DialogActions>
//                     <Button onClick={onCancel}>Cancel</Button>
//                     <Button type="submit">{mode === "Create" ? "Create" : "Save"}</Button>
//                 </DialogActions>
//             </form>
//         </Dialog>
//     );
// };


export default function UserMan({
    users,
    user,
    council,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    //table
    const [rows, setRows] = useState<Users[]>(users);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);

    

    const handleDelete = async (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/api/auth/delete`, {
                    method: "DELETE",
                    body: JSON.stringify({
                        id: userId,
                    }),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    setRows(rows.filter((user) => user.id !== userId));
                    alert('User deleted successfully.');
                } else {
                    console.error('Error deleting user:', data.error);
                    alert('Failed to delete user');
                }
            } catch (error) {
                console.error('Failed to delete user:', error);
                alert('Failed to delete user');
            }
        }
    };    

    const handleRoleChange = async (
        event: SelectChangeEvent<UserRole | null>,
        row: User
    ) => {
        const newRole = event.target.value as UserRole;
        if (newRole === null) {
            return;
        }
        const isConfirmed = window.confirm(`Are you sure you want to change the role of ${row.email} to ${newRole}?`);
    
        if (isConfirmed) {
            try {
                const response = await fetch('/api/auth/changeRole', {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: row.id,
                        newRole: newRole,
                    }),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    setRows(rows.map((user) => (user.id === row.id ? { ...user, role: newRole } : user)));
                    alert('Role updated successfully.');
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Failed to update role:', error);
                alert('Failed to update role.');
            }
        }
    };
    
    const handleCouncilChange = async (event: SelectChangeEvent<string>, row: User, councilList: Council[]) => {
        const selectedCouncilName = event.target.value;
        const selectedCouncil = councilList.find(c => c.name === selectedCouncilName);
        const isConfirmed = window.confirm(`Are you sure you want to change the council to ${selectedCouncilName}?`);
    
        if (selectedCouncil && isConfirmed) {
            try {
                const response = await fetch('/api/auth/changeCouncil', {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: row.id,
                        councilId: selectedCouncil.id,
                    }),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    setRows(rows.map(user => 
                        user.id === row.id ? { ...user, councilId: selectedCouncil.id } : user
                    ));
                    alert('Council updated successfully.');
                } else {
                    console.error('Error updating council:', data.error);
                    alert('Failed to update council.');
                }
            } catch (error) {
                console.error('Failed to update council:', error);
                alert('Failed to update council.');
            }
        }
    };    


    const handleEdit = (userId: number) => {
        setEditingUserId(userId);
    };

    const cancelEdit = () => {
        setEditingUserId(null);
    };    
    

    return (
        <Layout user={user}>
            <Card className="rounded-md p-5">
                <header className="flex flex-col items-center justify-between">
                    <h6 className="text-2xl">All Users</h6>
                </header>
                {/* <Button onClick={onCreate}>Create New User</Button> */}

                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size="medium"
                    >
                        <TableHead>
                            <TableRow>
                                {headCells.map((headCell) => (
                                    <TableCell key={headCell.id}>{headCell.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.email}
                                    </TableCell>
                                    <TableCell align="left">
                                        {editingUserId === row.id ? (
                                            <Select
                                                value={row.role}
                                                onChange={(event) => handleRoleChange(event, row)}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                {Object.values(UserRole).map((role) => (
                                                    <MenuItem key={role} value={role}>
                                                        {role}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        ) : (
                                            row.role
                                        )}
                                    </TableCell>
                                    <TableCell align="left">
                                        {editingUserId === row.id ? (
                                            <Select
                                                value={getCouncilNameById(row.councilId, council)}
                                                onChange={(event) => handleCouncilChange(event, row, council)}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                {council.map((councilItem) => (
                                                    <MenuItem key={councilItem.id} value={councilItem.name}>
                                                        {councilItem.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        ) : (
                                            getCouncilNameById(row.councilId, council)
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingUserId === row.id ? (
                                            <Button onClick={() => setEditingUserId(null)}>Cancel Edit</Button>
                                        ) : (
                                            <Button onClick={() => setEditingUserId(row.id)}>Edit</Button>
                                        )}
                                        <Button onClick={() => handleDelete(row.id)}>Delete</Button>
                                    </TableCell>
                                    
                                </TableRow>
                            ))}
                        </TableBody>


                    </Table>
                </TableContainer>

            </Card>
        </Layout>
    );
};

