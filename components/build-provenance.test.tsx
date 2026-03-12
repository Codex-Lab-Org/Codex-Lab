import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { BuildProvenancePanel } from "@/components/build-provenance";

describe("BuildProvenancePanel", () => {
  test("stays hidden for local workspace builds without provenance data", () => {
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

  test("stays hidden when git deployment metadata is available", () => {
    const { container } = render(
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

    expect(
      screen.queryByRole("region", {
        name: /build provenance/i,
      }),
    ).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  test("stays hidden for Vercel deployments without git metadata", () => {
    const { container } = render(
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

    expect(
      screen.queryByRole("region", {
        name: /build provenance/i,
      }),
    ).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});
