import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ProjectOwnerSwipe } from "@/components/swipe/ProjectOwnerSwipe";

// Mock des hooks et fonctions utilisés dans le composant
jest.mock("@/hooks/use-subscription", () => ({
  useSubscription: () => ({
    limits: { dailySwipes: 10 },
  }),
}));

jest.mock("@/stores/location", () => ({
  useLocationStore: () => ({
    selectedCity: { id: "1", name: "Paris", latitude: 48.8566, longitude: 2.3522 },
    radius: 10,
  }),
}));

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQuery: () => ({
    data: [
      {
        id: "1",
        full_name: "Talent disponible",
        bio: "Description du talent",
        skills: ["React", "Node.js"],
        experience_level: "senior",
        availability: "Temps plein",
        is_verified: true,
      },
    ],
    isLoading: false,
  }),
}));

// Mock des composants utilisés
jest.mock("@/components/swipe/SwipeInterface", () => ({
  SwipeInterface: () => <div data-testid="swipe-interface">Swipe Interface</div>,
}));

jest.mock("@/components/search/LocationFilter", () => ({
  LocationFilter: () => <div>Location Filter</div>,
}));

jest.mock("@/components/search/FilterBar", () => ({
  FilterBar: () => <div>Filter Bar</div>,
}));

jest.mock("@/logic/projectOwnerSwipeLogic", () => ({
  fetchTalents: jest.fn(() => Promise.resolve([])),
  filterTalents: jest.fn(() => []),
  handleTalentSwipe: jest.fn(),
}));

const queryClient = new QueryClient();

test("affiche la liste des talents", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ProjectOwnerSwipe />
      </BrowserRouter>
    </QueryClientProvider>
  );
  
  expect(screen.getByText("Rechercher des talents")).toBeInTheDocument();
  expect(screen.getByTestId("swipe-interface")).toBeInTheDocument();
});

test("le rendu de ProjectOwnerSwipe est isolé", () => {
  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ProjectOwnerSwipe />
      </BrowserRouter>
    </QueryClientProvider>
  );
  
  expect(container).toMatchSnapshot();
});