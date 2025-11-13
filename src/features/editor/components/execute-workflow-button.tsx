import { FlaskConicalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    workflowId: string;
}

export const ExecuteWorkflowButton = ({ workflowId }: Props) => {
    // TODO: Add onClick
    return (
        <Button disabled={false} onClick={() => {}} size="lg">
            <FlaskConicalIcon className="size-4" />
            Execute workflow
        </Button>
    );
};
