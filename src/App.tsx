import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

interface Post {
  id: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getPosts = async () => await fetch("http://localhost:3000/");
    getPosts()
      .then((res) => res.json())
      .then((p) => setPosts(p));
  }, []);
  return (
    <>
      {posts.map((post) => (
        <Markdown key={post.id} remarkPlugins={[remarkGfm]}>
          {post.content}
        </Markdown>
      ))}
    </>
  );
}

export default App;
