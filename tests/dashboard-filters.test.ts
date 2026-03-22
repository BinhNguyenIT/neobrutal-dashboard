import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { FilterBar } from "@/components/dashboard/filter-bar";
import { defaultFilters, parseDashboardFilters, toDashboardSearchParams } from "@/lib/dashboard-filters";

const replaceMock = vi.fn();
let currentPathname = "/";
let currentSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => currentPathname,
  useSearchParams: () => currentSearchParams,
}));

describe("dashboard filter parsing", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    currentPathname = "/";
    currentSearchParams = new URLSearchParams();
  });

  it("falls back to defaults for invalid values", () => {
    expect(parseDashboardFilters({ scope: "bad", region: "mars", channel: "void" })).toEqual(defaultFilters);
  });

  it("serializes only non-default filters", () => {
    expect(
      toDashboardSearchParams({
        scope: "90d",
        region: "apac",
        channel: "all",
      }).toString(),
    ).toBe("scope=90d&region=apac");
  });

  it("updates URL state when filters change and resets back to the base route", () => {
    currentSearchParams = new URLSearchParams("scope=90d&region=apac");

    render(React.createElement(FilterBar));

    fireEvent.change(screen.getByLabelText("Channel"), { target: { value: "partner" } });

    expect(replaceMock).toHaveBeenCalledWith("/?scope=90d&region=apac&channel=partner", { scroll: false });

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(replaceMock).toHaveBeenLastCalledWith("/", { scroll: false });
  });
});
