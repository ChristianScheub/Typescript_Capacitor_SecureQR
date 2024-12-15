import { Card } from "react-bootstrap";
import { impressum_text } from "./app_texts";
import CodeToTextParser from "./codeToTextParser";
import React from "react";

const Impressum: React.FC = () => {

return (
  <div>
    <div

      style={{
        marginTop: "env(safe-area-inset-top)",
      }}
    >
        <Card>
          <h3>Impressum / Legal Notice</h3>
            <CodeToTextParser code={impressum_text} />
        </Card>
    </div>
  </div>
);
};


export default Impressum;
