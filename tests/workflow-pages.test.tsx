import { ReactNode } from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { DashboardPage } from "@/components/workflow/dashboard-page";
import { TasksPage } from "@/components/workflow/tasks-page";
import { useWorkflow, WorkflowProvider } from "@/components/workflow/workflow-provider";

vi.mock("next/navigation", () => ({
  usePathname: () => "/tasks",
}));

function Wrapper({ children }: { children: ReactNode }) {
  return <WorkflowProvider>{children}</WorkflowProvider>;
}

function LocaleHarness() {
  const { setLocale, setPriorityFilter } = useWorkflow();

  return (
    <>
      <button type="button" onClick={() => setPriorityFilter("urgent")}>
        Apply urgent filter
      </button>
      <button type="button" onClick={() => setLocale("vi")}>
        Switch locale
      </button>
    </>
  );
}

describe("workflow pages", () => {
  it("renders recurring tasks and the kanban workspace", async () => {
    render(<TasksPage />, { wrapper: Wrapper });

    await waitFor(() => expect(screen.getByText("Morning workflow sync digest")).toBeInTheDocument());

    expect(screen.getByText("Primary workflow surface")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "To Do" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Waiting" })).toBeInTheDocument();
  });

  it("switches rendered workflow labels when locale changes", async () => {
    render(
      <WorkflowProvider>
        <LocaleHarness />
        <DashboardPage />
        <TasksPage />
      </WorkflowProvider>,
    );

    await waitFor(() => expect(screen.getByText("Operator snapshot")).toBeInTheDocument());

    expect(screen.getByText("Open tasks")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "To Do" })).toBeInTheDocument();
    expect(screen.getAllByText(/^Next run:/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Apply urgent filter" }));

    const activeFiltersSection = screen.getByText("Active filters").closest("div");
    expect(activeFiltersSection).not.toBeNull();
    expect(within(activeFiltersSection as HTMLDivElement).getByText(/^Urgent$/)).toBeInTheDocument();
    expect(within(activeFiltersSection as HTMLDivElement).queryByText(/^urgent$/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Switch locale" }));

    await waitFor(() => expect(screen.getByText("Goc nhin van hanh")).toBeInTheDocument());

    expect(screen.getByText("Cong viec dang mo")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Can lam" })).toBeInTheDocument();
    expect(screen.getAllByText(/^Lan chay tiep:/).length).toBeGreaterThan(0);

    const activeFiltersSectionVi = screen.getByText("Bo loc dang dung").closest("div");
    expect(activeFiltersSectionVi).not.toBeNull();
    expect(within(activeFiltersSectionVi as HTMLDivElement).getByText(/^Khan$/)).toBeInTheDocument();
    expect(within(activeFiltersSectionVi as HTMLDivElement).queryByText(/^Urgent$/)).not.toBeInTheDocument();
  });

  it("renders summary metrics on dashboard route", async () => {
    render(<DashboardPage />, { wrapper: Wrapper });

    await waitFor(() => expect(screen.getByText("Operator snapshot")).toBeInTheDocument());

    expect(screen.getByText("Open tasks")).toBeInTheDocument();
    expect(screen.getByText("Recent tasks")).toBeInTheDocument();
    expect(screen.getByText("Upcoming recurring runs")).toBeInTheDocument();
  });

  it("updates visible task details after a status transition", async () => {
    render(<TasksPage />, { wrapper: Wrapper });

    await waitFor(() => expect(screen.getByText("Morning workflow sync digest")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /Draft workflow release notes/i }));

    expect(screen.getByText("Status: To Do")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "In Progress" }));

    await waitFor(() => expect(screen.getByText("Status: In Progress")).toBeInTheDocument());

    const updatedCard = screen.getByRole("button", { name: /Draft workflow release notes/i });
    expect(within(updatedCard).getByText("In Progress")).toBeInTheDocument();
  });
});
