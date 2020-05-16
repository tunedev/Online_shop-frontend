import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import Error from "./ErrorMessage";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";

const possiblePermissions = [
  "USER",
  "ADMIN",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE"
];

const UPDATE_PERMISSION_MUTATION = gql`
  mutation UPDATE_PERMISSION_MUTATION($permission: [Permission], $userId: ID!) {
    updatePermission(permission: $permission, userId: $userId) {
      name
      id
      email
      permission
    }
  }
`;

const GET_ALL_USERS_QUERY = gql`
  {
    users {
      id
      name
      email
      permission
    }
  }
`;

const Permissions = () => {
  const { error, loading, data } = useQuery(GET_ALL_USERS_QUERY);
  if (error) return <Error error={error} />;
  if (loading) return <p>Loading ...</p>;
  return (
    <div>
      <h2>Manage permissions</h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            {possiblePermissions.map(permission => (
              <th key={permission}>{permission}</th>
            ))}
            <th>👇🏿</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map(user => (
            <User key={user.id} user={user} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const User = ({ user }) => {
  const [permissions, setPermissions] = useState(user.permission);
  const [updatePermission, { loading, error }] = useMutation(
    UPDATE_PERMISSION_MUTATION,
    {
      variables: { permission: permissions, userId: user.id }
    }
  );
  const handlePermissionChange = (event, updatePermission) => {
    const checkbox = event.target;
    let updatedPermissions = [...permissions];
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value
      );
    }
    setPermissions(updatedPermissions);
    updatePermission();
  };
  return (
    <>
      {error && (
        <tr>
          <td colSpan="8">
            <Error error={error} />
          </td>
        </tr>
      )}
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                type="checkbox"
                id={`${user.id}-permission-${permission}`}
                checked={permissions.includes(permission)}
                value={permission}
                onChange={e => {
                  handlePermissionChange(e, updatePermission);
                }}
              />
            </label>
          </td>
        ))}
        <td>
          <SickButton
            type="button"
            disabled={loading}
            onClick={updatePermission}
          >
            Updat{loading ? "ing" : "e"}
          </SickButton>
        </td>
      </tr>
    </>
  );
};

User.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    email: PropTypes.string,
    permission: PropTypes.array
  }).isRequired
};

export default Permissions;
