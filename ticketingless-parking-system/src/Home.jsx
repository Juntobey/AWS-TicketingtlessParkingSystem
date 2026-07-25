import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ImageUploader from "./components/ImageUploader";
import ReceiptCard from "./components/ReceiptCard";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function Home() {

  const [receipt, setReceipt] = useState(null);

  return (
    <>
      <Navbar />

      <Hero />

      <ImageUploader
        setReceipt={setReceipt}
      />

      <ReceiptCard
        receipt={receipt}
      />

      <Contact />

      <Footer />
    </>
  );
}

export default Home;