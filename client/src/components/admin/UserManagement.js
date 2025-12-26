import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import { FaSearch, FaUserShield, FaUser } from 'react-icons/fa';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await authService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleToggle = async (user) => {
        const action = user.isAdmin ? 'revoke admin rights from' : 'grant admin rights to';
        if (window.confirm(`Are you sure you want to ${action} ${user.firstName}?`)) {
            try {
                await authService.updateUserRole(user._id, !user.isAdmin);
                fetchUsers();
            } catch (error) {
                console.error("Failed to update role", error);
                alert("Failed to update user role");
            }
        }
    };

    const filteredUsers = users.filter(user => 
        user.firstName.toLowerCase().includes(filter.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold text-slate-800">User Management</h2>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search Name or Email..." 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none w-64"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Uniq ID</th>
                                 <th className="p-4">Phone</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800 flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${user.isAdmin ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                                                {user.firstName[0]}
                                            </div>
                                            {user.firstName} {user.lastName}
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600">{user.email}</td>
                                    <td className="p-4 text-slate-600">
                                         {user.idType}: {user.idNumber ? user.idNumber : 'N/A'}
                                    </td>
                                      <td className="p-4 text-slate-600">{user.phone ? user.phone : 'N/A'}</td>
                                    <td className="p-4">
                                        {user.isAdmin ? (
                                            <span className="flex items-center gap-1 text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-full w-fit">
                                                <FaUserShield /> Admin
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full w-fit">
                                                <FaUser /> Guest
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-xs text-slate-400">
                                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleRoleToggle(user)}
                                            className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${user.isAdmin 
                                                ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                                : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                                        >
                                            {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
