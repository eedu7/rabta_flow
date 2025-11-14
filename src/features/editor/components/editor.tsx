"use client";

import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    type Connection,
    Controls,
    type Edge,
    type EdgeChange,
    MiniMap,
    type Node,
    type NodeChange,
    Panel,
    ReactFlow,
} from "@xyflow/react";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "@/features/editor/components/add-node-button";
import { ExecuteWorkflowButton } from "@/features/editor/components/execute-workflow-button";
import { editorAtom } from "@/features/editor/store/atoms";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { NodeType } from "@/generated/prisma";
import "@xyflow/react/dist/style.css";
import { useSetAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";

export function EditorLoading() {
    return <LoadingView message="Loading editor..." />;
}

export function EditorError() {
    return <ErrorView message="Error loading editor..." />;
}

export function Editor({ workflowId }: { workflowId: string }) {
    const { data: workflow } = useSuspenseWorkflow(workflowId);

    const setEditor = useSetAtom(editorAtom);

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);
    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    const hasManualTrigger = useMemo(() => {
        return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER) && nodes.length > 1;
    }, [nodes]);

    return (
        <div className="size-full">
            <ReactFlow
                edges={edges}
                fitView
                nodes={nodes}
                nodeTypes={nodeComponents}
                onConnect={onConnect}
                onEdgesChange={onEdgesChange}
                onInit={setEditor}
                onNodesChange={onNodesChange}
                panOnDrag={[1]}
                panOnScroll
                selectionOnDrag
                snapGrid={[10, 10]}
                snapToGrid
            >
                <Background />
                <Controls />
                <MiniMap />
                <Panel position="top-right">
                    <AddNodeButton />
                </Panel>
                {hasManualTrigger && (
                    <Panel position="bottom-center">
                        <ExecuteWorkflowButton workflowId={workflowId} />
                    </Panel>
                )}
            </ReactFlow>
        </div>
    );
}
