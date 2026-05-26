import { Route } from 'react-router-dom'
import PostIndex from './postIndex'
import PostShow from './postShow'

export const postRoutes = (
    <>
      <Route path="post" element={<PostIndex />} />
      <Route path="post/:postId" element={<PostShow />} />
    </>
)