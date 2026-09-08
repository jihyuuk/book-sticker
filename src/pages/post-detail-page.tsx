import { useParams } from "react-router";

export default function PostDetailPage() {
  const { postId } = useParams();
  return <div>해당 PostId: {postId}</div>;
}
