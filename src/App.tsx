import Footer from "./components/Footer";
import typia from "typia";

 
export default function App() {
  typia.assert<string>("aa");
  return (
    <main>
      <p>App</p>
      <Footer />
    </main>
  );
}
