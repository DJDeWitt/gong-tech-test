import { useEffect, useState } from "react";
import { getUsers, buildUsersTree, type UserNode } from "../../api/firebase";
import "./UsersPage.css";

export default function UsersPage() {
  console.log("UsersPage rendered");
  const [tree, setTree] = useState<UserNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const users = await getUsers();
      const tree = buildUsersTree(users);
      setTree(tree);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading tree...</p>;

  return (
    <div className="tree-container">
    <h1>Hierarchy Tree</h1>
      <UserTree nodes={tree} />
    </div>
  );
}

function UserTree({ nodes }: { nodes: UserNode[] }) {
  return (
    <ul className="user-tree">
      {nodes.map((node) => (
        <UserNodeItem key={node.id} node={node} />
      ))}
    </ul>
  );
}

function UserNodeItem({ node }: { node: UserNode }) {
  const [expanded, setExpanded] = useState(true);
  const isManager = node.reports && node.reports.length > 0;

  const initials = `${node.firstName?.[0] || ""}${node.lastName?.[0] || ""}`.toUpperCase();

  return (
    <li>
      <div className="user-card">
        {isManager ? (
          <button
            className="toggle-btn"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "–" : "+"}
          </button>
        ) : (
          <span className="toggle-placeholder">•</span>
        )}
        <div className="user-avatar">
          {node.photo ? (
            <img src={node.photo} alt={`${node.firstName} ${node.lastName}`} />
          ) : (
            <div className="avatar-fallback">{initials}</div>
          )}
        </div>
        <div className="user-info">
          <strong>
            {node.firstName} {node.lastName} {node.email}
          </strong>
          <div className="title">{node.title}</div>
        </div>
      </div>

      {isManager && expanded && node.reports && (
        <UserTree nodes={node.reports} />
      )}
    </li>
  );
}
