import { datenschutz_text } from "./app_texts";
import CodeToTextParser from "./codeToTextParser";
import React from "react";
import Card from "../UIComponets/Card/Card";

const Datenschutz: React.FC = () => {

  return (
    <div>
      <div

        style={{
          marginTop: "env(safe-area-inset-top)",
        }}
      >
          <Card>
              <CodeToTextParser code={datenschutz_text} />
          </Card>
      </div>
    </div>
  );
};

export default Datenschutz;
