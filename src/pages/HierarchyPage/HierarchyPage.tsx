// src/pages/HierarchyPage.tsx
import { useEffect, useState } from "react";
import { getUsers, buildUserHierarchy, type UserNode } from "../../api/firebase";
import "./HierarchyPage.css";
import { useNavigate } from "react-router-dom";

export default function HierarchyPage() {
  const [hierarchy, setHierarchy] = useState<UserNode[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    async function fetchData() {
      const users = await getUsers();
      const tree = buildUserHierarchy(users);
      setHierarchy(tree);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading hierarchy...</p>;

  return (
    <div className="hierarchy-container">
    <h1>User Hierarchy</h1>
      <UserTree nodes={hierarchy} />
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
