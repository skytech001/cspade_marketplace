import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { deleteReset, deleteUser, getAllUsers } from "../features/signinSlice";

const ListUserScreen = () => {
  const dispatch = useDispatch();
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
    if (deleteUserSuccess) {
      setTimeout(() => {
        dispatch(deleteReset());
      }, 4000);
    }
  }, [dispatch, deleteUserSuccess]);

  const deletehandler = (user) => {
    // if (!user.isAdmin) {
    if (
      window.confirm(
        "This can not be reversed. Are you sure you want to delete this user?"
      )
    ) {
      dispatch(deleteUser(user._id));
    }
    // } else {
    //   alert("You can not delete Admin user.");
    // }
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
          {deleteUserSuccess && (
            <MessageBox variant="error">{deleteUserError}</MessageBox>
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
                    <button type="button" className="small">
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
