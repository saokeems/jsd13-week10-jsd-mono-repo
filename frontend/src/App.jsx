import { useEffect, useState } from "react";

const App = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const API_URL = "http://localhost:3001/api/v2/users";

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_URL);

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({ username: "", email: "", password: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email, password: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingUser);
      const url = isEdit
        ? `${API_URL}/${editingUser._id}`
        : `${API_URL}/register`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save user");

      setIsModalOpen(false);
      fetchUsers(); // รีโหลดข้อมูลตารางใหม่
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");

      fetchUsers(); // รีโหลดข้อมูลตารางใหม่
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center px-5 py-6">
      <h1 className="text-3xl font-bold mb-5">Test api</h1>
      <div className="text-center">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">รายการผู้ใช้งาน</h2>
          <button
            onClick={handleOpenAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            + เพิ่มผู้ใช้งาน
          </button>
        </div>

        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user._id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(user)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs transition"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    ไม่พบข้อมูลผู้ใช้งานในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">
                {editingUser ? "แก้ไขข้อมูลผู้ใช้งาน" : "เพิ่มผู้ใช้งานใหม่"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm transition"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default App;
