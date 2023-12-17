import { Tree, TreeNode } from "react-organizational-chart";
import OrgNode from "./org-node";
// ----------------------------------------------------------------------

export default function OrganizationalChart({ data }) {
  return (
    <Tree
      lineWidth="1px"
      nodePadding="4px"
      lineBorderRadius="16px"
      lineColor="#D4D4D8"
      label={<OrgNode data={data} />}
    >
      {data.children.map((list) => (
        <List key={list.name} depth={1} data={list} />
      ))}
    </Tree>
  );
}

// ----------------------------------------------------------------------

export function List({ data, depth }) {
  const hasChild = data.children && !!data.children;

  return (
    <TreeNode label={<OrgNode data={data} />}>
      {hasChild && <SubList data={data.children} depth={depth} />}
    </TreeNode>
  );
}

// ----------------------------------------------------------------------

function SubList({ data, depth }) {
  return (
    <>
      {data.map((list) => (
        <List key={list.name} data={list} depth={depth + 1} />
      ))}
    </>
  );
}
