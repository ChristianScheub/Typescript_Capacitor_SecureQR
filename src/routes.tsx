import { Routes, Route } from "react-router-dom";
import { QRGeneratorContainer } from "./Container/QRGeneratorContainer";
import { QRReaderContainer } from "./Container/QRReaderContainer";
import Impressum from "./legal/impressum";
import Datenschutz from "./legal/datenschutz";
import ContainerSettings from "./Container/SettingsContainer";

export const getRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={<QRGeneratorContainer />} />
      <Route path="/reader" element={<QRReaderContainer/>} />
      <Route path="/impressum" element={<Impressum />} />
      <Route path="/datenschutz" element={<Datenschutz />} />
      <Route path="/info" element={<ContainerSettings />} />

    </Routes>
  );
};