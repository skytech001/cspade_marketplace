import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {
  deleteReset,
  deleteUser,
  getAllUsers,
  resetUser,
} from "../features/signinSlice";

const ListUserScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    users,
    loading,
    error,
    deleteUserSuccess,
    deleteUserError,
    deleteUserMessage,
  } = useSelector((store) => store.signin);

  useEffect(() => {
    dispatch(getAllUsers());
    if (deleteUserSuccess || deleteUserError) {
      setTimeout(() => {
        dispatch(deleteReset());
      }, 4000);
    }
  }, [dispatch, deleteUserSuccess, deleteUserError]);

  const deletehandler = (user) => {
    if (
      window.confirm(
        "This can not be reversed. Are you sure you want to delete this user?"
      )
    ) {
      dispatch(deleteUser(user._id));
    }
  };

  const editHandler = (userId) => {
    navigate(`/user/${userId}/edit`);
  };

  return (
    <div>
      <h1>Users</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {deleteUserSuccess && (
            <MessageBox variant="success">{deleteUserMessage}</MessageBox>
          )}
          {deleteUserError && (
            <MessageBox variant="danger">{deleteUserError}</MessageBox>
          )}
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
                    <button
                      type="button"
                      className="small"
                      onClick={() => {
                        editHandler(user._id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="small"
                      onClick={() => {
                        deletehandler(user);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ListUserScreen;
