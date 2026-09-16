import { render } from "@/test/render";
import { WelcomeState } from "./WelcomeState";

describe("WelcomeState", () => {
  it("uses a centered prompt-first layout with starter prompts", async () => {
    const view = await render(<WelcomeState onPrompt={() => undefined} />);

    const content = view.container.querySelector(
      '[data-testid="welcome-content"]',
    );
    expect(content?.className).toContain("w-full");
    expect(content?.className).toContain("max-w-[760px]");
    expect(view.container.textContent).toContain(
      "What are you looking to make happen?",
    );
    expect(
      view.container.querySelector(
        'textarea[placeholder^="Describe your goal"]',
      ),
    ).toBeTruthy();
    expect(view.container.textContent).toContain("Project management");
    expect(view.container.textContent).toContain("Customer support");
    await view.unmount();
  });
});
