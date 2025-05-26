import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { InvestorSwipe } from "@/components/swipe/InvestorSwipe";

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
        title: "Opportunité d'investissement",
        brief_description: "Description de l'opportunité",
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

jest.mock("@/logic/investorSwipeLogic", () => ({
  fetchInvestmentOpportunities: jest.fn(() => Promise.resolve([])),
  filterInvestmentOpportunities: jest.fn(() => []),
  handleInvestmentSwipe: jest.fn(),
}));

const queryClient = new QueryClient();

test("affiche la liste des opportunités d'investissement", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <InvestorSwipe />
      </BrowserRouter>
    </QueryClientProvider>
  );
  
  expect(screen.getByText("Opportunités d'investissement")).toBeInTheDocument();
  expect(screen.getByTestId("swipe-interface")).toBeInTheDocument();
});

test("le rendu de InvestorSwipe est isolé", () => {
  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <InvestorSwipe />
      </BrowserRouter>
    </QueryClientProvider>
  );
  
  expect(container).toMatchSnapshot();
});