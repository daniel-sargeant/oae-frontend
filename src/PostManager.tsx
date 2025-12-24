import { useEffect, useState } from "react";
import "./App.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./postManager.css";

interface Post {
  id: string;
  created_at: string;
  updated_at?: string;
  content?: string;
  published: boolean;
  preoccupations?: string[];
}

function PostManager() {
  const [markdownState, setMarkDownState] = useState("");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [preoccupations, setPreoccupations] = useState<string[]>([]);

  useEffect(() => {
    if (!posts) {
      const getPosts = () => fetch("/api");
      getPosts()
        .then((res) => res.json())
        .then((p) => {
          setPosts(p);
        });
    }
  }, [posts]);

  const submitPost = async (body: string) =>
    await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    }).then(() => setPosts(null));

  return (
    <>
      <h1>Only Exhausting Art</h1>
      <div className="card">
        <p>Existing Posts</p>
        <div
          style={{ display: "flex", flexDirection: "column", width: "500px" }}
        >
          {posts?.map((p) => (
            <div>
              <button
                onClick={() => {
                  setCurrentPost(p);
                  setMarkDownState(p.content!);
                  setPreoccupations(p.preoccupations || []);
                }}
              >
                {p.id} – {p.created_at}
              </button>
              <input
                type="checkbox"
                onChange={() =>
                  fetch("/api/publish", {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: p.id,
                      published: !p.published,
                    }),
                  }).then(() => setPosts(null))
                }
                checked={p.published}
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setCurrentPost(null);
            setMarkDownState("");
          }}
        >
          New Post
        </button>
        <button
          form={currentPost ? currentPost.id : "new"}
          type="submit"
          disabled={!markdownState.length}
          onClick={() =>
            submitPost(
              JSON.stringify({
                id: currentPost ? currentPost.id : null,
                content: markdownState,
                preoccupations,
                published: currentPost ? currentPost.published : false,
              })
            )
          }
        >
          Submit Post
        </button>
      </div>
      <div className="content">
        <form name={currentPost ? currentPost.id : "new"}>
          {preoccupations?.map((p, i) => {
            const newPreoccupations = [...preoccupations];

            return (
              <input
                key={`${i}-${p}`}
                type="text"
                value={p}
                onChange={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  newPreoccupations[i] = e.target.value;
                  setPreoccupations(newPreoccupations);
                }}
              />
            );
          })}
          <button
            type="button"
            onClick={() => setPreoccupations([...preoccupations, ""])}
          >
            Add Preoccupation
          </button>
          <textarea
            onInput={(e) =>
              setMarkDownState((e.target as HTMLTextAreaElement).value)
            }
            value={markdownState}
          ></textarea>
        </form>
        <div className="preview">
          <Markdown remarkPlugins={[remarkGfm]}>{markdownState}</Markdown>
        </div>
      </div>
    </>
  );
}

export default PostManager;
