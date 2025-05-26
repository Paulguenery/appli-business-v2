import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ProjectSeekerSwipe } from "@/components/swipe/ProjectSeekerSwipe";

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
        title: "Projet disponible",
        brief_description: "Description du projet",
        required_skills: ["React", "Node.js"],
        category: "Technologie",
        experience_level: "any",
        collaboration_type: "Temps plein",
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

jest.mock("@/logic/projectSeekerSwipeLogic", () => ({
  fetchProjects: jest.fn(() => Promise.resolve([])),
  filterProjects: jest.fn(() => []),
  handleProjectSwipe: jest.fn(),
}));

const queryClient = new QueryClient();

test("affiche la liste des projets", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ProjectSeekerSwipe />
      </BrowserRouter>
    </QueryClientProvider>
  );
  
  expect(screen.getByText("Découvrir des projets")).toBeInTheDocument();
  expect(screen.getByTestId("swipe-interface")).toBeInTheDocument();
});

test("le rendu de ProjectSeekerSwipe est isolé", () => {
  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ProjectSeekerSwipe />
      </BrowserRouter>
    </QueryClientProvider>
  );
  
  expect(container).toMatchSnapshot();
});