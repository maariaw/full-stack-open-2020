const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  const mostLikedFinder = (mostLiked, blog) => {
    return mostLiked.likes > blog.likes
      ? mostLiked
      : blog
  }
  const result = blogs.length === 0
    ? null
    : blogs.reduce(mostLikedFinder, blogs[0])
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
