import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./theme-provider";

type Props = {
  children: React.ReactNode;
};

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
      <Toaster />
    </ThemeProvider>
  );
};

export default Providers;
