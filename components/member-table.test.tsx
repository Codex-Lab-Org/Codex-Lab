import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { MemberTable } from "@/components/member-table";
import type { Member } from "@/lib/members";

const sampleMembers: Member[] = [
  {
    id: "jason-yi",
    name: "Jason Yi",
    university: "UC Berkeley",
    links: {
      instagram: "https://www.instagram.com/jasonyi33/",
      linkedin: "https://www.linkedin.com/in/jasonyi33/",
      x: "https://x.com/jasonyi361",
    },
  },
  {
    id: "james-masson",
    name: "James Masson",
    links: {
      linkedin: "https://www.linkedin.com/in/james-masson-94a390257/",
    },
  },
];

describe("MemberTable", () => {
  test("renders the student directory columns and blank cells", () => {
    render(<MemberTable members={sampleMembers} />);

    expect(screen.getAllByText("name").length).toBeGreaterThan(0);
    expect(screen.getAllByText("university").length).toBeGreaterThan(0);
    expect(screen.queryByText("site")).not.toBeInTheDocument();
    expect(screen.getAllByText("links").length).toBeGreaterThan(0);
    expect(screen.getByText("2 students")).toBeInTheDocument();
    expect(screen.getAllByText("Jason Yi").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Jason Yi on Instagram")).toHaveLength(2);
    expect(screen.queryByText("—")).not.toBeInTheDocument();
  });

  test("renders working social links", () => {
    render(<MemberTable members={sampleMembers} />);

    fireEvent.click(screen.getAllByLabelText("James Masson on LinkedIn")[0]);

    expect(screen.getAllByLabelText("James Masson on LinkedIn")[0]).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/james-masson-94a390257/",
    );
  });
});
