import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LoginProvider } from "../contexts/LoginContext"
import { ChakraProvider } from "@chakra-ui/react";
export default function App({ Component, pageProps }: AppProps) {
  return( 
  <ChakraProvider resetCSS={false}>
  <LoginProvider>
   <Component {...pageProps} />;
  </LoginProvider>
  </ChakraProvider>
  );
}

