import { Action, ActionPanel, List, showToast, Toast } from "@raycast/api";
import { getWorkspaces, moveWindowToWorkspace } from "./utils/appSwitcher";
import { useEffect, useState } from "react";

export default function Command() {
  const [workspaces, setWorkspaces] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const allWorkspaces = getWorkspaces();
      setWorkspaces(allWorkspaces);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to get workspaces",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <List isLoading={isLoading} navigationTitle="Move Focused Window to Workspace">
      {workspaces.map((workspace) => (
        <List.Item
          key={workspace}
          icon="list-icon.png"
          title={workspace}
          accessories={[{ text: "Workspace" }]}
          actions={
            <ActionPanel>
              <Action
                title="Move Window"
                onAction={async () => {
                  try {
                    moveWindowToWorkspace(workspace);
                    await showToast({
                      style: Toast.Style.Success,
                      title: "Window moved",
                      message: `Moved to workspace: ${workspace}`,
                    });
                  } catch (error) {
                    await showToast({
                      style: Toast.Style.Failure,
                      title: "Failed to move window",
                      message: error instanceof Error ? error.message : "Unknown error",
                    });
                  }
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
