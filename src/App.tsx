import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/CartContext";
import Welcome from "./pages/Welcome";
import Configurator from "./pages/Configurator";
import Visualization from "./pages/Visualization";
import Cart from "./pages/Cart";
import Quotation from "./pages/Quotation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="kiosk-container min-h-screen">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/configurator" element={<Configurator />} />
                <Route path="/visualization" element={<Visualization />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/quotation" element={<Quotation />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
