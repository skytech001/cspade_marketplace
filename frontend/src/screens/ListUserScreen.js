import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { deleteUser, getAllUsers } from "../features/signinSlice";

const ListUserScreen = () => {
  const dispatch = useDispatch();
  const {
    users,
    loading,
    error,
    delelteUserSuccess,
    deleteUserPending,
    deleteUserError,
  } = useSelector((store) => store.signin);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch, delelteUserSuccess]);

  const deletehandler = (id) => {
    dispatch(deleteUser(id));
  };

  return (
    <div>
      <h1>Users</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IS SELLER</th>
              <th>IS ADMIN</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isSeller ? "Yes" : "No"}</td>
                <td>{user.isAdmin ? "Yes" : " No"}</td>
                <td>
                  <button type="button" className="small">
                    Edit
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => {
                      deletehandler(user._id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListUserScreen;
