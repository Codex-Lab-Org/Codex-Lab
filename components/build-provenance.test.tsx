import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { BuildProvenancePanel } from "@/components/build-provenance";

describe("BuildProvenancePanel", () => {
  test("hides the panel for local workspace builds without provenance data", () => {
    const { container } = render(
      <BuildProvenancePanel
        buildProvenance={{
          isGitDeployment: false,
          isProduction: false,
          isVercel: false,
        }}
      />,
    );

    expect(
      screen.queryByRole("region", {
        name: /build provenance/i,
      }),
    ).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  test("shows git deployment details when metadata is available", () => {
    render(
      <BuildProvenancePanel
        buildProvenance={{
          branch: "main",
          commitSha: "f1699c91e5885b144534c28c7a64aacd06bd6c66",
          isGitDeployment: true,
          isProduction: true,
          isVercel: true,
          repo: "danielapassos/Codex-Lab",
          shortCommitSha: "f1699c9",
          vercelEnv: "production",
        }}
      />,
    );

    expect(screen.getByRole("region", { name: /build provenance/i })).toBeInTheDocument();
    expect(screen.getByText(/This build is traced to/i)).toBeInTheDocument();
    expect(screen.getByText("Environment: production")).toBeInTheDocument();
  });

  test("shows the warning for Vercel deployments without git metadata", () => {
    render(
      <BuildProvenancePanel
        buildProvenance={{
          isGitDeployment: false,
          isProduction: true,
          isVercel: true,
          vercelEnv: "production",
          warning: "Source metadata is unavailable for this deployment.",
        }}
      />,
    );

    expect(screen.getByRole("region", { name: /build provenance/i })).toBeInTheDocument();
    expect(screen.getByText(/This build does not expose Git source metadata\./i)).toBeInTheDocument();
    expect(
      screen.getByText(/Production deploys are blocked unless Vercel can prove which Git commit they came from\./i),
    ).toBeInTheDocument();
  });
});
