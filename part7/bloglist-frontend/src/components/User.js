const User = ({ userByID }) => {
  if (!userByID) {
    return null
  }

  return (
    <div>
      <h3>{userByID.name}</h3>
      <h4>Added blogs</h4>
      <ul>
        {userByID.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
