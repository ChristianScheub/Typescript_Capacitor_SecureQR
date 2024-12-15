import { useNavigate, NavigateFunction } from "react-router-dom";
import React from "react";
import UsedLibsListContainer from "../legal/usedLibs/container_usedLibList";
import { useTranslation } from "react-i18next";

interface ViewSettingsProps {
  onDatenschutzClick: (navigate: NavigateFunction) => void;
  onImpressumClick: (navigate: NavigateFunction) => void;
}

const ViewSettings: React.FC<ViewSettingsProps> = ({
  onDatenschutzClick,
  onImpressumClick,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="backgroundColor width100 fillScreen">
      <div>
        <br />

        <div>
          <div className="mb-3 margin2vw">
            <h1>{t("settings_Information")}</h1>
            <hr />
            <p
              data-testid="settings-edatenschutz"
              onClick={() => onDatenschutzClick(navigate)}
            >
              {t("settings_Datenschutz")}
            </p>
            <hr />
            <p
              data-testid="settings-impressum"
              onClick={() => onImpressumClick(navigate)}
            >
              {t("settings_Impressum")}
            </p>
            <hr />
            <UsedLibsListContainer />
            <hr />
            <a
              href="https://github.com/ChristianScheub/Typescript_Capacitor_SecureQR"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <p>{t("settings_GitHubRepo")}</p>
            </a>
            <hr />
            <br /> <br /> <br /> <br /> <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSettings;